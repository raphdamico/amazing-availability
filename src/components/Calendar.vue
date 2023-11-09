<script setup>

import { calcEventPositions } from './eventPositioner.js'
import { calendars } from '../data/calendarData.js'
import { propsToAttrMap } from '@vue/shared';
import Event from './Event.vue'
import Suggestion from './Suggestion.vue'
import {onMounted, onUnmounted, ref, reactive, computed, provide } from 'vue'
import { useMouse } from './mouse.js'

////////////////////////////////////////////////////////////////////////
// Calendar position
////////////////////////////////////////////////////////////////////////
const props = defineProps({
  msg: {
    type: String,
    required: true
  },
  width: Number,
  height: Number
})
const calendarStyle = computed(() => {
  return { height: `${props.height}px`, width: `${props.width}px`, backgroundSize: `${CONFIG.dayPixels}px ${CONFIG.hourPixels}px`}
})

////////////////////////////////////////////////////////////////////////
// Constants
////////////////////////////////////////////////////////////////////////
const CONFIG = reactive({
  days: 5,
  startHour: 9,
  hoursPerDay: 8,
  hourPixels: 24,
  dayPixels: 140,
  hPadding: 18,
  vPadding: 2
})
CONFIG.hourPixels = props.height / CONFIG.hoursPerDay;
CONFIG.dayPixels = props.width / CONFIG.days;
provide('CONFIG', CONFIG)

const state = reactive({
  scheduling: true,
  durationToSchedule: 0.5
})


////////////////////////////////////////////////////////////////////////
// Event data
// const events = reactive([...calendars[0], ...calendars[1]] )
const events = reactive(calendars)
console.log(events)

// Positioning
function getX(day, offset = 0) {
  return day * CONFIG.dayPixels + getWidth(1-offset)
}
function getY(time) {
  return (time - CONFIG.startHour) * CONFIG.hourPixels
}
function getWidth(offset = 0) {
  return (CONFIG.dayPixels - CONFIG.hPadding) * (1-offset)
}
function getHeight(duration) {
  return CONFIG.hourPixels * duration - CONFIG.vPadding;
}
// Reverse
function getDay(left) {
  return Math.floor(left / CONFIG.dayPixels);
}
function getTime(top) {
  return top/CONFIG.hourPixels + CONFIG.startHour;
}
function snapToDay(left) {
  return Math.floor(left/CONFIG.dayPixels) * CONFIG.dayPixels;
}
function snapToHour(top) {
  const snapToHours = 0.25
  return Math.floor(top/CONFIG.hourPixels/snapToHours) * CONFIG.hourPixels*snapToHours;
}

const eventPositions = computed(() => {

  function conflicting(cursor, target) {
    // Check day first
    if (cursor.day !== target.day) { return false; }

    const targetEnd = target.time + target.duration;  
    if (cursor.time >= targetEnd) { return false; }
    if (cursor.timeEnd <= target.time) { return false; }

    if (target.title === 'Focus Time' || target.title === 'Lunch') { return false; }

    // Overlap!
    return true;
  }

  function evAfterReschedule(ev) {
    let evPost = JSON.parse(JSON.stringify(ev));
    if ('rescheduleTime' in ev) {
      evPost.day = ev.rescheduleTime.day;
      evPost.time = ev.rescheduleTime.time;
    }
    return evPost;
  }

  function convertToPosition(ev) {    
    return {
      ...ev, 
      timeEnd: ev.time + ev.duration,
      // x: getX(ev.day, 'offset' in ev ? ev.offset : 0), 
      x: getX(ev.day, ev.depth / ev.maxDepth), 
      y: getY(ev.time),
      width: getWidth('offset' in ev ? ev.offset : 0)  / (ev.maxDepth),
      height: getHeight(ev.duration),
      rescheduleOffset: {
        x: 'rescheduleTime' in ev ? getX(ev.rescheduleTime.day - ev.day) : 0,
        y: 'rescheduleTime' in ev ? getY(ev.rescheduleTime.time) - getY(ev.time) : 0,
      },
      conflictWithCursor: state.scheduling ? conflicting(cursor.value, ev) : false,
      conflictAfterReschedule: state.scheduling ? conflicting(cursor.value, evAfterReschedule(ev)) : false,
      conflictCanBeResolved: 'rescheduleTime' in ev,
      highlightedForSuggestion: eventsInvolvedInSuggestions.value.includes(ev.eventId),
      scheduling: state.scheduling,
      calendarId: ev.calendarId
    }
  }

  const positionedEvents = calcEventPositions(events)  
  return positionedEvents.map(ev => convertToPosition(ev))
})

const conflictWithCursor = computed(() => {
  return eventPositions.value.find( ev => ev.conflictWithCursor === true && ev.conflictCanBeResolved == false || ev.conflictWithCursor === true && ev.conflictCanBeResolved == true && ev.conflictAfterReschedule == true)
})

////////////////////////////////////////////////////////////////////////
// Suggestions
////////////////////////////////////////////////////////////////////////

const suggestions = reactive([
  { eventIds: [110, 120], locked: false },
  // { eventIds: [350, 360], locked: false } 
])

const eventsInvolvedInSuggestions = computed(() => {
  return suggestions.flatMap(sugg => sugg.eventIds)
})

// const suggestionPositions = computed(() => {
//   function getSuggestionFormat(suggestion) {
//     let suggestionEvents = eventPositions.value.filter((ev) => suggestion.eventIds.includes(ev.eventId))
//     let day = suggestionEvents[0].day;
//     let time = suggestionEvents.reduce((prev, curr) => curr.time < prev ? curr.time : prev, 10000);
//     let timeEnd = suggestionEvents.reduce((prev, curr) => curr.timeEnd > prev ? curr.timeEnd : prev, 0);
//     let duration = timeEnd - time;
    
//     function getEventsAfterApplyingSuggestion(eventId) {
//       let eventIndex = events.findIndex((ev) => ev.eventId === eventId)
//       let newEventsState = JSON.parse(JSON.stringify(events))
//       if ('rescheduleTime' in events[eventIndex] === false) {
//         return newEventsState;  
//       }
//       newEventsState[eventIndex].time = newEventsState[eventIndex].rescheduleTime.time
//       newEventsState[eventIndex].day = newEventsState[eventIndex].rescheduleTime.day
//       return newEventsState;
//     }

//     function getChangedEvents(eventId) {
//       let eventIndex = events.findIndex((ev) => ev.eventId === eventId)
//       let newEventsState = JSON.parse(JSON.stringify(events))
//       if ('rescheduleTime' in events[eventIndex] === false) {
//         return newEventsState;  
//       }
//       newEventsState[eventIndex].time = newEventsState[eventIndex].rescheduleTime.time
//       newEventsState[eventIndex].day = newEventsState[eventIndex].rescheduleTime.day
//       return [{indexToChange: eventIndex, newEventDetails: newEventsState[eventIndex]}]
//     }

//     return {
//       ...suggestion,
//       day: day,
//       time:  time,
//       timeEnd: timeEnd,
//       duration: duration,
//       x: getX(day), 
//       y: getY(time),
//       width: getWidth(),
//       height: getHeight(duration),
//       rescheduleSuggestions: [
//         {text: `Reschedule ${suggestionEvents[0].title}`, changedEvents: getChangedEvents(suggestion.eventIds[0]) },
//         {text: `Reschedule ${suggestionEvents[1].title}`, changedEvents: getChangedEvents(suggestion.eventIds[1]) }
//       ]
//     }
//   }
//   return suggestions.map(suggestion => getSuggestionFormat(suggestion))
// })

////////////////////////////////////////////////////////////////////////
// New event "Cursor"
////////////////////////////////////////////////////////////////////////

// Get top left position of calendar container so we 
// can make cursor track mouse correctly
const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
const { x, y } = useMouse()
const $calContainer = ref(null)
const calX = ref(0)
const calY = ref(0)
function setContainerPos() {
  if ($calContainer.value !== null) {
    calX.value = $calContainer.value.getBoundingClientRect().left,
    calY.value = $calContainer.value.getBoundingClientRect().top
  }
}
onMounted(() => window.addEventListener('mousemove', setContainerPos))
onUnmounted(() => window.removeEventListener('mousemove', setContainerPos))


const newEventPos = computed(()=> {
  return {
    left: snapToDay(clamp(x.value - calX.value, 0, props.width-1)),
    top: snapToHour(clamp(y.value - calY.value - getHeight(state.durationToSchedule)/2, 0, props.height - getHeight(state.durationToSchedule)))
  }
})

const newEventStyleFilled = computed(() => {
  return {
    left: conflictWithCursor.value ? `${newEventPos.value.left + getWidth(0.75)}px` : `${newEventPos.value.left}px`,    
    top: `${newEventPos.value.top}px`,    
    width: !conflictWithCursor.value ? `${getWidth()}px` :`${getWidth(0.25)}px`,    
    height: `${getHeight(state.durationToSchedule)}px`,
    backgroundColor: conflictWithCursor.value ? '#540000' : 'var(--fix-conflict-highlight)'
  }
})

const newEventSmoothStyle = computed(() => {
  return {
    left: `${x.value - calX.value - getWidth()/2}px`,    
    top: `${y.value - calY.value - getHeight(state.durationToSchedule)/2}px`,    
    width: `${getWidth()}px`,    
    height: `${getHeight(state.durationToSchedule)}px`,
    backgroundColor: conflictWithCursor.value ? 'red' : 'green'
  }
})

const cursor = computed(() => {
  return {
    day: getDay(newEventPos.value.left),
    time: getTime(newEventPos.value.top),
    timeEnd: getTime(newEventPos.value.top) + state.durationToSchedule
  }
})

const cursorLabel = computed(() => {
  
  function formatTime(hoursFloat) {
    let minutes = 60 * (hoursFloat%1)
    minutes = minutes.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    })
    return `${Math.floor(hoursFloat)}:${minutes}`;
  }

  return `${formatTime(cursor.value.time)} - ${formatTime(cursor.value.timeEnd)}`
})

////////////////////////////////////////////////////////////////////////
// Scheduling
////////////////////////////////////////////////////////////////////////
function schedule(message) {
  state.scheduling = !state.scheduling
}

function reschedule(message) {
  let eventToReschedule = events[9]
  eventToReschedule.time = 10.5
  events[9] = eventToReschedule
}

function clickedSuggestion(suggestion) {
  // Lock suggestion coordinates
  suggestions[0].locked = true;
  suggestions[0].lockedCoordinates = JSON.parse(JSON.stringify(suggestionPositions.value[0]))
  console.log(suggestions[0].lockedCoordinates.height)
  events[suggestion.changedEvents[0].indexToChange] = suggestion.changedEvents[0].newEventDetails
}

</script>



<template>
  <div class="calendar-wrapper">
    <div class="controls">
      <button @click="schedule('test')">{{ state.scheduling ? 'Cancel' : 'Schedule' }}</button>
      <select v-if="state.scheduling" v-model.number="state.durationToSchedule">
        <option disabled value="">Please select one</option>
        <option value="0.25">15 mins</option>
        <option value="0.5">30 mins</option>
        <option value="0.75">45 mins</option>
        <option value="1">1 hour</option>
        <option value="1.5">1.5 hours</option>
      </select>
      <button @click="reschedule('test')">Test rescheduling</button>
    </div>    
    
    <div class="calendar-container" :style="calendarStyle" ref="$calContainer">

      <!-- <div class="new-event" :style="newEventSmoothStyle"></div> -->     
      <!-- <div class="new-event-dropzone-filled" :style="newEventStyleFilled" v-if="state.scheduling">
        {{ cursorLabel }}
      </div> -->

        <Event
          v-for="ev in eventPositions"
          v-bind="ev"
          :style="{
            left: `${ev.x}px`,
            top: `${ev.y}px`,
            height: `${ev.height}px`,
            width: `${ev.width}px`,
            position: 'absolute',
            transition: '0.3s all'
          }"
        />

        <!-- <Suggestion
          @clickedSuggestion="clickedSuggestion"
          v-for="suggestion in suggestionPositions"
          v-if="!state.scheduling"
          v-bind="suggestion"
          :style="{
            left: suggestion.locked ? `${suggestion.lockedCoordinates.x}px` : `${suggestion.x}px`,
            top: suggestion.locked ? `${suggestion.lockedCoordinates.y}px` : `${suggestion.y}px`,
            width: suggestion.locked ? `${suggestion.lockedCoordinates.width}px` : `${suggestion.width}px`,
            height: suggestion.locked ? `${suggestion.lockedCoordinates.height}px` : `${suggestion.height}px`,
            position: 'absolute'
          }"
        /> -->

    </div>
  </div>
</template>



<style scoped>

  .calendar-wrapper {
    background: white;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0px 0px 24px rgba(0,0,0,0.1);
  }

  .controls {
    height: 64px; 
    width: 100%;
    display: flex;
    justify-items: center;
    padding: 8px 0px 20px 0px;
    gap: 12px;
  }

  .calendar-container {
    border-bottom: 1px solid var(--gridlines);
    border-right: 1px solid var(--gridlines);
    background-image:
      linear-gradient(to right, var(--gridlines) 1px, transparent 1px),
      linear-gradient(to bottom, var(--gridlines) 1px, transparent 1px);
  }
  /* .new-event {
    position: absolute;
    overflow: hidden;
    z-index: 1000;
    pointer-events: none;
    border-radius: 4px;
    opacity: 0;
    box-shadow: 0px 4px 4px rgba(0,0,0,0.4);
    padding: 4px 12px;
    transform: scale(0.8);
  } */

  .new-event-dropzone-filled {
    color: white;
    position: absolute;
    overflow: hidden;
    z-index: 1000;
    pointer-events: none;
    border-radius: 4px;
    opacity: 1;
    box-shadow: 0px 4px 4px rgba(0,0,0,0.4);
    padding: 4px 8px;
    font-size: 0.75em;
    font-weight: bold;
  }

  /* .new-event-dropzone {
    position: absolute;
    overflow: hidden;
    z-index: 999;
    pointer-events: none;
    border-radius: 4px;
    opacity: 1;
    border: 2.5px dashed var(--fix-conflict-highlight);
  } */
</style>
