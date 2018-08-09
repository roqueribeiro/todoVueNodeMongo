<template>
  <div class="home">
    <TaskForm />
    <TaskList />
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
