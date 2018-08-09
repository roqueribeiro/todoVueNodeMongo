<template>
  <v-container
    fluid
    grid-list-lg
  >
    <v-layout v-if="tasks" row wrap>
      <v-flex v-for="item in tasks" :key="item._id" xs12>
        <v-card color="blue lighten-1" class="white--text">
          <v-card-title primary-title>
            <div class="headline">{{ item.name }}</div>
            <v-spacer></v-spacer>
            <v-btn class="white--text" icon v-on:click="removeTask(item._id)">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-actions class="pa-3">
            <form>
              <v-select
                v-validate="'required'"
                :items="items"
                v-model="status"
                :error-messages="errors.collect('status')"
                label="Status"
                data-vv-name="status"
                required
              ></v-select>
            </form>
            {{ item.status[0] }}
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-else>No todos left!</v-layout>
  </v-container>
</template>

<script>
import Vue from "vue";
import VeeValidate from "vee-validate";
import bus from './../bus.js'
Vue.use(VeeValidate);

export default {
  name: "TaskList",
  data: () => ({
    tasks: null,
    status: null,
    items: ["pending", "ongoing", "completed"],
    dictionary: {
      custom: {
        status: {
          required: "Status is required"
        }
      }
    }
  }),
  mounted() {
    this.loadTasks();
    this.listenToEvents();
  },
  methods: {
    loadTasks() {
      axios
        .get("http://localhost:3000/tasks", { responseType: "json" })
        .then(
          response =>
            (this.tasks = response.data.sort((a, b) => {
              return new Date(b.created) - new Date(a.created);
            }))
        )
        .catch(e => {
          console.log(e);
        });
    },
    changeStatus() {
      this.$validator.validateAll();
    },
    removeTask(id) {
      axios
        .delete("http://localhost:3000/tasks/" + id)
        .then(response => (this.tasks = response.data))
        .catch(e => {
          console.log(e);
        });
    },
    listenToEvents() {
      bus.$on("refreshTodo", $event => {
        this.loadTasks();
      });
    }
  }
};
</script>