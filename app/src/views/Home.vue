<template>
  <div class="home">
    <v-container xs12>
      <TaskForm />
      <TaskList />
    </v-container>
  </div>
</template>

<script lang="ts">
import TaskForm from "@/components/TaskForm.vue";
import TaskList from "@/components/TaskList.vue";

export default {
  name: "Home",
  components: {
    TaskForm,
    TaskList
  }
};
</script>
