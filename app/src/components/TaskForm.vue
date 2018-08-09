<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-media
            :src="require('../assets/bg-card-add-task.jpeg')"
            height="200px"
          ></v-card-media>
          <form class="pa-4">
            <v-text-field
              v-validate="'required|max:150'"
              v-model="name"
              :counter="150"
              :error-messages="errors.collect('name')"
              :disabled="loading"
              label="Task"
              data-vv-name="name"
              required
            ></v-text-field>
            <v-select
              prepend-icon="info"
              v-validate="'required'"
              :items="items"
              v-model="status"
              label="Status"
              item-text="label"
              item-value="value"
              data-vv-name="status"
              :error-messages="errors.collect('status')"
              :disabled="loading"
              required
            ></v-select>
            <v-btn color="info" @click="submit" :disabled="loading">submit</v-btn>
            <v-btn @click="clear" :disabled="loading">clear</v-btn>
          </form>
          <v-progress-linear v-if="loading" color="info" :indeterminate="true"></v-progress-linear>
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
    loading: false,
    name: "",
    status: null,
    items: [
      { label: "Pending", value: "pending" },
      { label: "Ongoing", value: "ongoing" },
      { label: "Completed", value: "completed" }
    ],
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
      this.$validator.validateAll().then(result => {
        if (result) {
          this.loading = true;
          const params = new URLSearchParams();
          params.append("name", this.name);
          params.append("status", this.status);
          axios
            .post("http://localhost:3000/tasks", params)
            .then(response => {
              this.loading = false;
              this.refreshTodo();
            })
            .catch(e => {
              this.loading = false;
              console.error(e);
            });
          return;
        }
      });
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
