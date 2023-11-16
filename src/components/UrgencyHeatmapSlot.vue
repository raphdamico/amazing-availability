<script setup>

import chroma from "chroma-js"
import { inject, ref, reactive, computed } from 'vue'

const props = defineProps({
  visible: Boolean,
  label: String,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  day: Number,
  time: Number,
  duration: Number,
  score: Number,
  urgencyScore: Number,
  showUrgency: Boolean
})

const CONFIG = inject('CONFIG')

// a computed ref
const eventStyle = computed(() => {
  
  let color;
  let score = (props.showUrgency) ? -props.urgencyScore : props.score

  if (props.showUrgency === true) {
    let scale2 = chroma.scale(['rgba(255,0,0,0.0)', 'rgba(255,255,255,0.0)', 'rgba(0,255,0,0.9)'])
                  .domain([-10, 0, 15]);
    color = scale2(score).alpha(0.6).hex();
  }
  else {
    let scale = chroma.scale(['rgba(150,150,255,0.0)', 'rgba(255,255,0,0.5)', 'rgba(255,0,0,0.5)'])
                    .domain([0, 25, 1000]);
    color = scale(score).alpha(0.6).hex();
  }
    
  return { 
    backgroundColor: color
  }
})
</script>

<template>
  <div 
    class="slot-style" :style="eventStyle"
  >
  {{ (props.showUrgency) ? props.urgencyScore : props.score }}
  </div>
</template>

<style scoped>
  .slot-style {
    /* pointer-events: none; */
    position: absolute;
    overflow: hidden;
    height: 100%;
    width: 100%;
    z-index: 10000;
    text-align: center;
  }
</style>
