<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card class="pa-4">
          <form>
            <v-text-field
              v-validate="'required|max:150'"
              v-model="name"
              :counter="150"
              :error-messages="errors.collect('name')"
              label="Task"
              data-vv-name="name"
              required
            ></v-text-field>
            <v-select
              v-validate="'required'"
              :items="items"
              v-model="status"
              :error-messages="errors.collect('status')"
              label="Status"
              data-vv-name="status"
              required
            ></v-select>
            <v-btn @click="submit">submit</v-btn>
            <v-btn @click="clear">clear</v-btn>
          </form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from "vue";
import VeeValidate from "vee-validate";
import bus from "./../bus.js";
Vue.use(VeeValidate);

export default {
  name: "TaskForm",
  data: () => ({
    name: "",
    status: null,
    items: ["pending", "ongoing", "completed"],
    dictionary: {
      custom: {
        name: {
          required: () => "Task can not be empty",
          max: "The task field may not be greater than 150 characters"
        },
        status: {
          required: "Status is required"
        }
      }
    }
  }),
  methods: {
    submit() {
      if (this.$validator.validateAll()) {
        const params = new URLSearchParams();
        params.append("name", this.name);
        params.append("value", this.status);
        axios
          .post("http://localhost:3000/tasks", params)
          .then(response => {
            this.refreshTodo();
            this.tasks = response.data;
          })
          .catch(e => {
            console.log(e);
          });
      }
    },
    clear() {
      this.name = "";
      this.status = null;
      this.$validator.reset();
    },
    refreshTodo() {
      bus.$emit("refreshTodo");
    }
  }
};
</script>