<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Calendar from './components/Calendar.vue'
</script>

<template>
  <!-- <header> -->

    <div class="wrapper">
      <Calendar msg="You did it!" height="600" width="800"/>
    </div>
  <!-- </header> -->

  <!-- <RouterView /> -->
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}


</style>
