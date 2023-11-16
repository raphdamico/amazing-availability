<script setup>

import { containsCategory } from '../helpers/eventCategorizer.js'
import { inject, ref, reactive, computed } from 'vue'

const props = defineProps({
  label: String,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  day: Number,
  time: Number,
  duration: Number
})

const CONFIG = inject('CONFIG')

// a computed ref
const eventStyle = computed(() => {
  return { 
    left: `0px`, 
    top:  `0px`, 
    height: `${props.height}px`, 
    width: `${props.width}px`,
  }
})

</script>

<template>
  <div class="time-range-highlight" :style="eventStyle"></div>
</template>

<style scoped>

  .time-range-highlight {
    z-index: 100000 !important;
    pointer-events: none;
    position: absolute;
    overflow: hidden;
    border-radius: 8px;
    border: 2.5px solid rgba(0,0,0,0.5);
  }


</style>
