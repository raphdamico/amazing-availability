<script setup>

import { isSmartHold, isOutsideWorkingHours } from '../helpers/eventCategorizer.js'
import { inject, ref, reactive, computed } from 'vue'

const props = defineProps({
  title: String,
  displayTitle: String,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  day: Number,
  time: Number,
  duration: Number,
  rescheduleOffset: Object,
  conflictWithCursor: Boolean,
  conflictAfterReschedule: Boolean,
  conflictCanBeResolved: Boolean,
  highlightedForSuggestion: Boolean,
  scheduling: Boolean,
  calendarId: String
})

const CONFIG = inject('CONFIG')
const hover = ref(false)

const smartHold = isSmartHold(props) //props.title === "Focus Time" || props.title === "Lunch";
const outsideWorkingHours = isOutsideWorkingHours(props);
const baseColor = smartHold ? 'white' : 'var(--ev-bg)';

const conflicted = computed(() => {
  return props.conflictWithCursor && !props.conflictCanBeResolved || props.conflictWithCursor && props.conflictCanBeResolved && props.conflictAfterReschedule
})

const highlighted = computed(() => {
  return props.highlightedForSuggestion === true && props.scheduling === false
})

function getTheme(calendarId) {
  const lookup = {
    "raph": "user",
    "linda": "0",
    "jeff": "1",
    "dan":"2",
    "vicky":"3",
    "matt":"4",
    "dario":"5",
  }
  const cal = lookup[calendarId];
  const bordersNotRail = "white";
  return {
    color: `var(--cal-${cal}-base:)`,
    backgroundColor: `var(--cal-${cal}-bg)`,
    borderColor: `${bordersNotRail} ${bordersNotRail} ${bordersNotRail} var(--cal-${cal}-base)`
  }
}

// a computed ref
const eventStyle = computed(() => {
  return { 
    left: `0px`, 
    top:  `0px`, 
    height: `${props.height}px`, 
    width: `${props.width}px`,
    backgroundColor: smartHold ? baseColor : getTheme(props.calendarId).backgroundColor,
    color: getTheme(props.calendarId).color,
    borderColor: getTheme(props.calendarId).borderColor,
    borderStyle: smartHold ? 'dashed' : 'solid',
    borderWidth: smartHold ? '1px' : '1px 1px 1px 4px',
    zIndex: props.conflictWithCursor ? 900 : 1,
    boxShadow: props.conflictWithCursor && props.conflictCanBeResolved ? `0px 4px 14px rgba(0,0,0,0.4)` : `0px 4px 14px rgba(0,0,0,0)`
  }
})

const highlightStyle = computed(() => {
  return {
    // left: props.conflictWithCursor ? `${props.rescheduleOffset.x}px` : `0px`, 
    // top: props.conflictWithCursor ? `${props.rescheduleOffset.y}px` : `0px`, 
    left: `${props.rescheduleOffset.x}px`,
    top: `${props.rescheduleOffset.y}px`,
    height: `${props.height + 2}px`, 
    width: `${props.width + 2}px`,
    zIndex: props.conflictWithCursor ? 999 : 1,
    opacity: props.conflictWithCursor && props.conflictCanBeResolved && !props.conflictAfterReschedule ? 1 : 0
  }
})

function eventClick(msg) {
  alert(msg)
}

</script>

<template>
  <div 
    class="event-container"     
    :class="{'outsideWorkingHours': outsideWorkingHours}"
    @mouseover="hover = true"
    @mouseout="hover = false"
    @click="eventClick(props.title)"
  >
  <div class="event-style" :style="eventStyle" >
    {{props.displayTitle}}
  </div>
  <div class="highlight" :style="highlightStyle"></div>
  </div>
</template>

<style scoped>
  .event-container {
    cursor: pointer;
    display: absolute;    
  }
  .event-style {
    /* pointer-events: none; */
    display: absolute;
    overflow: hidden;
    border-radius: 4px;
    border-style: solid;
    border-color: var(--ev-border) var(--ev-border) var(--ev-border) var(--ev-fg);
    border-width: 1px 1px 1px 3px;
    transition-duration: 0.7s;
    transition-property: top, left;
    padding: 6px 4px;
    font-size: 0.875em;
    line-height: 0.95em;
  }

  .outsideWorkingHours {
    opacity: 0;
  }
  
</style>
