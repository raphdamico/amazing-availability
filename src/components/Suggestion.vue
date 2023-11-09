<script setup>

import { inject, ref, reactive, computed } from 'vue'

const props = defineProps({
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  day: Number,
  time: Number,
  duration: Number,
  rescheduleSuggestions: Object
})

const hover = ref(false)
const highlightStyle = computed(() => {
  return {
    // height: `${props.height + 2}px`, 
    // width: `${props.width + 2}px`,
  }
})

function suggestionClick(msg) {
  // alert(msg)
}

</script>

<template>
  <div 
    class="event-container"     
    @mouseover="hover = true"
    @mouseout="hover = false"
    @click="suggestionClick('test')"
  >
  <div class="event-style" :style="eventStyle" >
    {{props.title}}
  </div>
  <div class="highlight" :style="highlightStyle"></div>
  <div class="hoverTarget"></div>
  <div class="hoverCard">
    <div style="font-size: 0.75em; font-weight: 700; color: var(--fg-neutra); padding: 8px;"><span style="color: var(--suggestion-1)">●</span> FIX A CONFLICT</div>
    <div style="padding: 8px; font-weight: bold;" @click="$emit('clickedSuggestion', rescheduleSuggestions[0])">{{rescheduleSuggestions[0].text}}</div>
    <div style="padding: 8px; font-weight: bold;" @click="$emit('clickedSuggestion', rescheduleSuggestions[1])">{{rescheduleSuggestions[1].text}}</div>
    <div style="padding: 4px 8px;">More options</div>
    <div style="padding: 4px 8px;">Dismiss</div>
  </div>
  </div>
</template>

<style scoped>
  .event-container {
    cursor: pointer;
    display: absolute;    
  }
  .hoverTarget {
    background-color: red;
    position: absolute;
    width: 20px;
    height: 20px;
    top: -10px;
    right: -10px;
    z-index: 10000;
    opacity: 0;
  }
  .hoverCard {
    position: absolute;
    background-color: white;
    border-radius: 6px;
    width: 240px;
    left: -240px;
    z-index: 10000;
    box-shadow: 0px 1px 0px 0px rgba(255, 255, 255, 0.5) inset;
    box-shadow: 0px 4px 21px 0px rgba(0, 0, 0, 0.15);
  }
  .highlight {
    pointer-events: none;
    border: 3px solid var(--suggestion-1);
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    position: absolute;
    border-radius: 4px;
    transition: 0.4s opacity;
    z-index: 999;
    margin: -1px
  }
  .highlight::after {
    content: "";
    background-color: var(--suggestion-1);
    width: 10px;
    height: 10px;
    position: absolute;
    top: -5px;
    right: -5px;
    border-radius: 10px;
  }
</style>
