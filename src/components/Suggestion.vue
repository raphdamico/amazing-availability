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
  duration: Number,
  score: Number,
  events: Array,
  partialFitStrategy: Boolean,
  sbmStrategy: Boolean,
  partialSbmStrategy: Boolean,  
  endsOfFocusTimeStrategy: Boolean
})

const CONFIG = inject('CONFIG')

// a computed ref
const eventStyle = computed(() => {
  return { 
    left: props.conflictWithCursor && !props.conflictAfterReschedule ? `${props.rescheduleOffset.x}px` : `0px`, 
    top: props.conflictWithCursor && !props.conflictAfterReschedule ? `${props.rescheduleOffset.y}px` : `0px`, 
    height: `${props.height}px`, 
    width: `${props.width}px`,
    lineHeight: `${props.height}px`,
  }
})

const movable = computed(() => {
  return containsCategory(props.events, 'meeting_flexible')
})

function formatTime(hoursFromMidnight, showSuffix = true) {
    // Extract hours and minutes from the input
    var hours = Math.floor(hoursFromMidnight);
    var minutes = Math.round((hoursFromMidnight - hours) * 60);

    // Format minutes to always be two digits
    minutes = minutes < 10 ? '0' + minutes : minutes;

    // Determine AM or PM suffix
    var suffix = hours >= 12 ? 'pm' : 'am';

    // Convert 24-hour time to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    if (showSuffix) {
      return hours + ':' + minutes + suffix;
    }

    return hours + ':' + minutes + suffix[0];
}

function prettyPrintEvents(events) {
  let out = `Choosing suggestion ${formatTime(props.time)} \n Score: ${props.score} \n`
  if (props.partialFitStrategy) {
    out += `You can make this time work by shortening ${events[0].title}. \n`
    out += `We can also book a 15 minute meeting starting at ${formatTime(events[0].time)} \n\n`
  }
  if (props.sbmStrategy) {
    out += `Can make it work by moving ${props.events.map(ev => ev.title).join(', ')} \n\n`
  }
  if (props.endsOfFocusTimeStrategy) {
    out += `Favoring the start or end of Focus Time block \n`
  }
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
    class="suggestion-container" 
    @click="eventClick(props.title)"
  >
    <div 
      class="suggestion-style" 
      :class="{
        'suggestion-style-suboptimal': props.score > 10, 
        'suggestion-style-best': props.score <= 1
      }"
      :style="eventStyle" 
    >
      <!-- Book{{ movable ? '*' : '' }} -->
      {{formatTime(props.time, false)}}{{ movable ? '*' : '' }}
    </div>
  </div>
</template>

<style scoped>

  .suggestion-container {
    cursor: pointer !important;
    z-index: 2999 !important;
  }
  .suggestion-style {    
    pointer-events: none;
    display: absolute;
    overflow: hidden;
    
    border-radius: 10px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    background: #F0FBFF;
    
    font-size: 0.8em;
    /* line-height: calc(0.875*2)em; */
    font-weight: 500;
    text-align: center;

    box-shadow: 0px 1px 2px 0px rgb(0 0 0 / 10%);

    --pulseColor: blue;
    animation: pulseGlow 2s infinite;
  }

  .suggestion-style-suboptimal {    
      background: #fff5da;
    --pulseColor: rgb(255, 145, 0) !important;
  }

  .suggestion-style-best {    
      /* background: #f2ffda; */
    /* --pulseColor: rgb(153, 255, 0) !important; */
  }


@keyframes pulseGlow {
  0% {
    box-shadow: 0 0 3px var(--pulseColor);
  }
  50% {
    box-shadow: 0 1px 6px var(--pulseColor);
  }
  100% {
    box-shadow: 0 0 3px var(--pulseColor);
  }
}
  .suggestion-container:hover .suggestion-style {
    background: #dbe7ec !important;
    border-color: rgba(0, 0, 0, 0.16) !important;
    box-shadow: 0px 1px 12px 0px rgb(0 0 0 / 30%) !important;
  }
  
</style>
