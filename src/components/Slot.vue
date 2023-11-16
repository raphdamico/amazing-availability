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
  events: Array,
  aggressiveness: Number,
  justOutsideWorkingHours: Boolean,
  outsideWorkingHours: Boolean,
  partialFitStrategy: Boolean,
  sbmStrategy: Boolean,
  partialSbmStrategy: Boolean,
  endsOfFocusTimeStrategy: Boolean
})

const CONFIG = inject('CONFIG')

// a computed ref
const eventStyle = computed(() => {
  let scale = chroma.scale(['#ccc', '#aaa'])
                    .domain([0, 10]);
    
  return { 
    height: `${props.height}px`, 
    width: `${props.width}px`,
    backgroundSize: `${props.height*0.5}px ${props.height*0.5}px`,
    backgroundColor: 'grey', 
    // backgroundColor: scale(props.score).alpha(props.score <= props.aggressiveness ? 0.1 : 0.9).hex(), 
    opacity: props.score < props.aggressiveness ? 0 : 0.6
  }
})

const diagonalStyle = computed(() => {
  let opacity = 0;
  if (props.justOutsideWorkingHours) { opacity = 0.5 }
  if (props.outsideWorkingHours) { opacity = 0.8 }
  return { 
    height: `${props.height}px`, 
    width: `${props.width}px`,
    backgroundSize: `${props.height*0.5}px ${props.height*0.5}px`,
    opacity
  }
})

const underlayStyle = computed(() => {
  // const display = diagonalStyle.value.opacity === 0 && eventStyle.value.opacity === 0;
  const display = props.score < props.aggressiveness;
  return { 
    height: `${props.height}px`, 
    width: `${props.width}px`,
    display: display ? 'none' : 'block'
  }
})

function prettyPrintEvents(events) {
  let out = `SCORE: ${props.score} \n` 
  out += `STRATEGY LAYERS\n` 
  out += `- Partial fit: ${props.partialFitStrategy} \n`
  out += `- SBM strategy: ${props.sbmStrategy} \n`
  out += `- Partial SBM strategy: ${props.partialSbmStrategy} \n`
  out += `- Start or end of Focus Time: ${props.endsOfFocusTimeStrategy} \n\n`

  out += `EVENTS\n` 
  events.forEach(e => {
    out += `- ${e.title} (${e.calendarId})\n`
  })
  return out;
}

function eventClick(msg) {
  alert(prettyPrintEvents(props.events));
}

</script>

<template>
  <div 
    class="slot-container" 
    @click="eventClick(props.title)"
  >
    <div  class="slot-style unavailable-slot" :style="eventStyle">
      <!-- {{props.justOutsideWorkingHours}} -->
    </div>
    <div class="slot-style unavailable-slot" :style="diagonalStyle"></div>
    <div class="slot-style unavailable-underlay" :style="underlayStyle"></div>
  </div>
</template>

<style scoped>
  .slot-container {
  }
  .slot-style {
    /* pointer-events: none; */
    position: absolute;
    overflow: hidden;
    transition-duration: 0.7s;
    transition-property: top, left;
    padding: 6px 4px;
    font-size: 0.75em;
    line-height: 0.95em;
    text-align: right;
    z-index: 1000;
  }
  
  .unavailable-slot {
    --dg1: #e0e0e0;
    --dg2: #cfcfcf;
    background-image: linear-gradient(135deg, 
      var(--dg1) 27.78%, 
      var(--dg2) 27.78%, 
      var(--dg2) 50%, 
      var(--dg1) 50%, 
      var(--dg1) 77.78%, 
      var(--dg2) 77.78%, 
      var(--dg2) 100%
    );
    opacity: 0.8;
  }
  .unavailable-underlay {
    background-color: black;
    mix-blend-mode: saturation;
  }
</style>
