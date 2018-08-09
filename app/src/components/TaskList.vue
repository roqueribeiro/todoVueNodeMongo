<template>
  <v-container fluid grid-list-lg>
    <v-progress-linear v-if="loading" color="info" :indeterminate="true"></v-progress-linear>
    <v-layout v-if="tasks" row wrap>
      <v-flex v-for="item in tasks" :key="item._id" xs12>
        <v-card v-bind:color="item.status[0] == 'completed' ? 'green lighten-4' : item.status[0] == 'pending' ? 'red lighten-4' : item.status[0] == 'ongoing' ? 'blue lighten-4' : '' ">
          <v-card-title>
            <div class="headline mr-5">{{ item.name }}</div>
            <v-btn icon :disabled="loading" @click="removeTask(item._id)">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider class="mb-4"></v-divider>
          <v-card-actions class="pl-3 pr-3 ma-0">
            <v-select
              prepend-icon="info"
              v-validate="'required'"
              :items="items"
              :error-messages="errors.collect('status')"
              label="Status"
              item-text="label"
              item-value="value"
              data-vv-name="status"
              :value="item.status[0]"
              @change="selected => changeStatus(item._id, selected)"
              :disabled="loading"
              solo
              required
               class="ma-0"
            ></v-select>
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
import bus from "./../bus.js";
Vue.use(VeeValidate);

export default {
  name: "TaskList",
  data: () => ({
    loading: false,
    tasks: null,
    items: [
      { label: "Pending", value: "pending" },
      { label: "Ongoing", value: "ongoing" },
      { label: "Completed", value: "completed" }
    ],
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
      this.loading = true;
      axios
        .get("http://localhost:3000/tasks", { responseType: "json" })
        .then(response => {
          this.loading = false;
          this.tasks = response.data.sort((a, b) => {
            return new Date(b.created) - new Date(a.created);
          });
        })
        .catch(e => {
          this.loading = false;
          console.error(e);
        });
    },
    changeStatus(id, selected) {
      this.loading = true;
      this.$validator.validateAll().then(result => {
        if (result) {
          const params = new URLSearchParams();
          params.append("status", selected);
          axios
            .put(`http://localhost:3000/tasks/${id}`, params)
            .then(response => {
              this.loading = false;
              this.loadTasks();
            })
            .catch(e => {
              this.loading = false;
              console.error(e);
            });
          return;
        } else {
          this.loading = false;
          console.warn(result);
        }
      });
    },
    removeTask(id) {
      this.loading = true;
      axios
        .delete("http://localhost:3000/tasks/" + id)
        .then(response => {
          this.loading = false;
          this.loadTasks();
        })
        .catch(e => {
          this.loading = false;
          console.error(e);
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

<style scoped>
.v-btn {
  position: absolute;
  top: 0;
  right: 0;
  margin: 15px;
}
</style>

