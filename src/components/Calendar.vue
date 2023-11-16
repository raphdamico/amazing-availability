<script setup>

import { calendars } from '../data/calendarData.js'
import { calcEventPositions } from '../helpers/eventPositioner.js'
import { generateSlots } from '../helpers/slotCalculator.js'
import { generateWorkingHours } from '../helpers/workingHoursCalculator.js'
import { generateSuggestions } from '../helpers/suggestionCalculator.js'
import { generateRequestedTimeRangeSlots } from '../helpers/requestedTimeRangesLayerCalculator.js'
import { propsToAttrMap } from '@vue/shared';
import Event from './Event.vue'
import Slot from './Slot.vue'
import Suggestion from './Suggestion.vue'
import {onMounted, onUnmounted, ref, reactive, computed, provide } from 'vue'
import { useMouse } from './mouse.js'
import TimeRangeHighlight from './TimeRangeHighlight.vue'
import UrgencyHeatmapSlot from './UrgencyHeatmapSlot.vue'

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
let RAIL_SIZE = 0.35;

const CONFIG = reactive({
  you: 'raph',
  days: 5,
  startHour: 4,
  hoursPerDay: 15,
  hourPixels: 24,
  dayPixels: 140,
  hPadding: 18,
  vPadding: 2,
  suggestionsRailSpace: RAIL_SIZE,
  suggestionsRailSize: RAIL_SIZE  
})

CONFIG.hourPixels = props.height / CONFIG.hoursPerDay;
CONFIG.dayPixels = props.width / CONFIG.days;
provide('CONFIG', CONFIG)

const state = reactive({
  // days: 14,
  scheduling: true,
  showHeatmap: true,
  showUrgencyHeatmap: false,
  showRequestedTimeHeatmap: false,

  applyRequestedTimeRangesLayer: true,
  applyScoringLayer: true,
  applyStrategiesLayer: true,
  applyUrgencyLayer: true,
  applyChoiceArchitectureLayer: true,

  showWorkingHours: true,
  durationToSchedule: 0.5,
  urgency: 'AMBIVALENT',
  schedulingAggressiveness: "IDGAF", // "RESPECTFUL", "BALANCED", "IDGAF"
  heatmapLevel: "FULL_HEATMAP", //  "NO_OVERLAY", "JUST_WORKING_HOURS", "FULL_HEATMAP"
  visibilityLevel: "FULL", // "FULL", "LOW", "NONE"
  // calendarsToShow: {raph: true, linda: true, vicky: true, dario: false}
  calendarsToShow: {raph: true, linda: false, vicky: false, dario: false},
  requestedTimeRangesPicker: 'WED_THU', // 'ANYTIME', 'MORNINGS_WED_ON', 'MON_WED_FRI
  requestedTimeRanges: {
    ANYTIME: [
      {time: 9, day: 0, duration: 8},
      {time: 9, day: 1, duration: 8},
      {time: 9, day: 2, duration: 8},
      {time: 9, day: 3, duration: 8},
      {time: 9, day: 4, duration: 8}
    ],
    WED_THU: [
      {time: 9, day: 2, duration: 4},
      {time: 13, day: 3, duration: 4}
    ],
    MON_WED_FRI: [
      {time: 9, day: 0, duration: 8},
      {time: 9, day: 2, duration: 8},
      {time: 9, day: 4, duration: 8}
    ],
    MORNINGS_WED_ON: [
      {time: 9, day: 2, duration: 4},
      {time: 9, day: 3, duration: 4},
      {time: 9, day: 4, duration: 4}
    ],
    NEXT_TUE: [
    {time: 9, day: 10, duration: 4}
    ]
  }
})

const railWidth = computed(() => {
  if (state.scheduling === false) { return {space: 0, size: 0}; }
  if (state.visibilityLevel === "NONE") { return {space: 1, size: 1}; }
  return {space: CONFIG.suggestionsRailSpace, size: CONFIG.suggestionsRailSize};
})

const showEventTitles = computed(() => {
  if (state.visibilityLevel === "LOW") { return false }
  return true;
})

const showEvents = computed(() => {
  if (state.visibilityLevel === "NONE") { return false }
  return true;
})

////////////////////////////////////////////////////////////////////////
// Event data
////////////////////////////////////////////////////////////////////////

const aggressivenessScore = computed(() => {
  let lookup = {
        'RESPECTFUL': 2,
        'BALANCED': 15,
        'AGGRESSIVE': 25,
        'IDGAF': 50,
    }
    return lookup[state.schedulingAggressiveness]
  })
const events = reactive([

    calendars.filter(ev => ev.calendarId === 'raph'),
    generateWorkingHours('raph', 9, 17, CONFIG),

    calendars.filter(ev => ev.calendarId === 'linda'), 
    generateWorkingHours('linda', 10, 18, CONFIG),
    
    calendars.filter(ev => ev.calendarId === 'vicky'), 
    generateWorkingHours('vicky', 7, 15, CONFIG),
    
    calendars.filter(ev => ev.calendarId === 'dario'), 
    generateWorkingHours('dario', 6, 12, CONFIG)
  ].flat())
  
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

////////////////////////////////////////////////////////////////////////
// Requested time range
////////////////////////////////////////////////////////////////////////

const requestedTimeRanges = computed(() => {

  function convertToPosition(ev) {
  
    return {
      ...ev, 
      timeEnd: ev.time + ev.duration,
      x: getX(ev.day), 
      y: getY(ev.time) + 1,
      width: CONFIG.dayPixels,
      height: getHeight(ev.duration),
      startTime: (24 * ev.day) + ev.time,
      endTime: (24 * ev.day) + ev.time + ev.duration
    }
  }
  
  return state.requestedTimeRanges[state.requestedTimeRangesPicker].map(ev => convertToPosition(ev))

})

const urgencyLayerSlots = computed(() => {
  function convertToPosition(ev) {  
    return {
        ...ev, 
        timeEnd: ev.time + ev.duration,
        x: getX(ev.day), 
        y: getY(ev.time),
        width: CONFIG.dayPixels,
        height: getHeight(slotDuration)+2,
        showUrgency: state.showUrgencyHeatmap,
      }
  } 
  
  const slotDuration = state.durationToSchedule; //0.5;
  let l = generateRequestedTimeRangeSlots(CONFIG, state, slotDuration, requestedTimeRanges.value)
  return l.map(ev => convertToPosition(ev))
})

////////////////////////////////////////////////////////////////////////
// Events
////////////////////////////////////////////////////////////////////////

const eventPositions = computed(() => {

  function convertToPosition(ev) {
    const rail = railWidth.value.space;
  
    return {
      ...ev, 
      displayTitle: (!showEventTitles.value && ev.calendarId !== CONFIG.you) ? '' : ev.title,
      timeEnd: ev.time + ev.duration,
      x: 1+ (1-rail) * getX(ev.day, ev.depth / ev.maxDepth) + (rail) * getX(ev.day), 
      y: getY(ev.time) + 1,
      width: (1-rail) * getWidth('offset' in ev ? ev.offset : 0)  / (ev.maxDepth),
      height: getHeight(ev.duration),
      rescheduleOffset: {
        x: 'rescheduleTime' in ev ? getX(ev.rescheduleTime.day - ev.day) : 0,
        y: 'rescheduleTime' in ev ? getY(ev.rescheduleTime.time) - getY(ev.time) : 0,
      },
      scheduling: state.scheduling,
      calendarId: ev.calendarId
    }
  }

  let calendarIdsToShow = Object.entries(state.calendarsToShow).filter(([calendarId, visible]) => visible).map(([calendarId, visible]) => calendarId)
  let filteredEvents = events.filter(ev => calendarIdsToShow.includes(ev.calendarId))
  let positionedEvents = calcEventPositions(filteredEvents)
  return positionedEvents.map(ev => convertToPosition(ev))
})

////////////////////////////////////////////////////////////////////////
// Slots
////////////////////////////////////////////////////////////////////////

const slotPositions = computed(() => {
  
  function showSlot(slot) {
    if (state.scheduling === false) { return false; } else {
      if (state.heatmapLevel === "FULL_HEATMAP") { return true; } 
      if (state.heatmapLevel === "JUST_WORKING_HOURS") {
        if (slot.outsideWorkingHours || slot.justOutsideWorkingHours) { return true; }
      }
    }
    return false;
}

  const slotDuration = state.durationToSchedule; //0.5;
  const slots = generateSlots(CONFIG, state, slotDuration, eventPositions.value, state.schedulingAggressiveness, urgencyLayerSlots.value);
  function convertToPosition(slot) {    
    return {
      ...slot,
      timeEnd: slot.time + slotDuration,
      x: getX(slot.day, 0), 
      y: getY(slot.time),
      width: CONFIG.dayPixels - 1,
      height: CONFIG.hourPixels * slotDuration,
      label: `${slot.events.length}`,
      visible: showSlot(slot),
      aggressiveness: aggressivenessScore.value
    }
  }  
  return slots.map(slot => convertToPosition(slot))
})



////////////////////////////////////////////////////////////////////////
// Suggestions
////////////////////////////////////////////////////////////////////////

const suggestionPositions = computed(() => {
  const suggestionDuration = state.durationToSchedule; //0.5;
  const suggestions = generateSuggestions(CONFIG, slotPositions.value, aggressivenessScore.value);
  console.log(suggestions)
  function convertToPosition(suggestion) {    
    return {
      ...suggestion,
      timeEnd: suggestion.time + suggestionDuration,
      x: getX((1-railWidth.value.size) + suggestion.day), 
      y: getY(suggestion.time) + 2,
      width: CONFIG.dayPixels * railWidth.value.size - 2,
      height: CONFIG.hourPixels * suggestionDuration - 4,
      label: `${suggestion.events.length}`,
    }
  }  
  return suggestions.map(suggestion => convertToPosition(suggestion))
})

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

const cursor = computed(() => {
  return {
    day: getDay(newEventPos.value.left),
    time: getTime(newEventPos.value.top),
    timeEnd: getTime(newEventPos.value.top) + state.durationToSchedule
  }
})

////////////////////////////////////////////////////////////////////////
// Scheduling
////////////////////////////////////////////////////////////////////////
function schedule(message) {
  state.scheduling = !state.scheduling
}

function urgencyHeatmap(heatmap) {
  if (heatmap === 'REQUESTED_TIMES') {
    state.showRequestedTimeHeatmap = !state.showRequestedTimeHeatmap
    state.showUrgencyHeatmap = false;
  }
  if (heatmap === 'URGENCY') {
    state.showUrgencyHeatmap = !state.showUrgencyHeatmap
    state.showRequestedTimeHeatmap = false;
  }
}

function toggleCalendar(calendarId) {
  state.calendarsToShow[calendarId] = !state.calendarsToShow[calendarId]
}

function toggleHeatmap() {
  state.showHeatmap = !state.showHeatmap
}

function toggleWorkingHours() {
  state.showWorkingHours = !state.showWorkingHours
}

function reschedule(message) {
  let eventToReschedule = events[9]
  eventToReschedule.time = 10.5
  events[9] = eventToReschedule
}

const daysOfWeekLabels = computed(() => {
  let dateHeaders = [];
  let daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (let day=0; day<CONFIG.days; day++) {
    dateHeaders[day] = {
      x: getX(day), 
      label: `${daysOfWeek[day%7]} ${day+1}`
  }
  }
  return dateHeaders;
})


</script>



<template>
  <div class="calendar-wrapper">
    <div class="controls">
      <button @click="schedule('test')">{{ state.scheduling ? 'Cancel' : 'Schedule' }}</button>
      <!-- <select v-if="state.scheduling" v-model.number="state.durationToSchedule">
        <option disabled value="">Please select one</option>
        <option value="0.25">15 mins</option>
        <option value="0.5">30 mins</option>
        <option value="1">1 hour</option>
      </select> -->
      <select v-if="state.scheduling" v-model.number="state.requestedTimeRangesPicker">
        <option disabled value="">Please select one</option>
        <option value="ANYTIME">Anytime</option>
        <option value="MORNINGS_WED_ON">Mornings Wed-Fri</option>
        <option value="WED_THU">Wed morn, or Thu afternoon</option>
        <option value="MON_WED_FRI">Mon, Wed, or Fri</option>
        <option value="NEXT_TUE">Next Tue</option>
      </select>
      <select v-if="state.scheduling" v-model.number="state.schedulingAggressiveness">
        <option disabled value="">Please select one</option>
        <option value="RESPECTFUL">Most respectful</option>
        <option value="BALANCED">Balanced</option>
        <option value="AGGRESSIVE">Aggressive</option>
        <option value="IDGAF">DGAF</option>
      </select>
      <select v-if="state.scheduling" v-model.number="state.heatmapLevel">
        <option disabled value="">Please select one</option>
        <option value="NO_OVERLAY">No overlay</option>
        <option value="JUST_WORKING_HOURS">Just working hours</option>
        <option value="FULL_HEATMAP">Full heatmap</option>
      </select>
      <select v-if="state.scheduling" v-model.number="state.visibilityLevel">
        <option disabled value="">Please select one</option>
        <option value="FULL">Full</option>
        <option value="LOW">Low viz</option>
        <option value="NONE">None (external)</option>
      </select>
      <div>
        <button 
          v-for="[calendarId, calendarIdVisible] in Object.entries(state.calendarsToShow)"
          class="avatar"
          :style="{ 
              textDecoration: calendarIdVisible ? '' : 'line-through',
              opacity: calendarIdVisible ? '' : '0.3'
            }"
          @click="toggleCalendar(calendarId)">{{ calendarId }}
        </button>
      </div>
    </div>    
    
    <div class="more-controls">
      <input type="checkbox" id="checkboxScoringLayer" v-model="state.applyScoringLayer" disabled/>
      <label for="checkboxScoringLayer"> Base scoring layer</label> >
      <input type="checkbox" id="checkboxRequestedTimeRangesLayer" v-model="state.applyRequestedTimeRangesLayer" />
      <label for="checkboxRequestedTimeRangesLayer"> Requested time layer</label>&nbsp;
      <button @click="urgencyHeatmap('REQUESTED_TIMES')">{{ state.showRequestedTimeHeatmap ? 'Hide' : 'Show' }} </button> &nbsp;>
      <input type="checkbox" id="checkboxStrategiesLayer" v-model="state.applyStrategiesLayer" />
      <label for="checkboxStrategiesLayer"> Strategies layer</label> >
      <input type="checkbox" id="checkboxUrgencyLayer" v-model="state.applyUrgencyLayer" />
      <label for="checkboxUrgencyLayer"> Urgency layer</label>&nbsp;
      <button @click="urgencyHeatmap('URGENCY')">{{ state.showUrgencyHeatmap ? 'Hide' : 'Show' }} </button> 
      <select v-if="state.scheduling" v-model.number="state.urgency">
        <option disabled value="">Please select one</option>
        <option value="CRITICAL">Critical</option>
        <option value="URGENT">Urgent</option>
        <option value="AMBIVALENT">Ambivalent</option>
        <option value="LATER">Later</option>
      </select>
    </div>

    <div class="calendar-header" style="height: 24px;">
      <div 
        v-for="day in daysOfWeekLabels"
        :style="{
          left: `${day.x}px`,
          position: 'absolute',
          fontSize: `13px`
        }"
      >
      {{ day.label }}
      </div>
    </div>

    <div class="calendar-container" :style="calendarStyle" ref="$calContainer">

        <Event
          v-for="ev in eventPositions"
          v-bind="ev"
          :key="ev.id"
          :style="{
            left: `${ev.x}px`,
            top: `${ev.y}px`,
            height: `${ev.height}px`,
            width: `${ev.width}px`,
            position: 'absolute',
            transition: '0.3s all',
            display: showEvents ? 'block' : 'none'
          }"
        />

        <Slot
          v-for="slot in slotPositions"
          v-bind="slot"
          :style="{
            left: `${slot.x}px`,
            top: `${slot.y}px`,
            height: `${slot.height}px`,
            width: `${slot.width}px`,
            position: 'absolute',
            display: slot.visible ? 'block' : 'none'
          }"
        />

        <UrgencyHeatmapSlot
          v-if="state.showUrgencyHeatmap || state.showRequestedTimeHeatmap"
          v-for="slot in urgencyLayerSlots"
          v-bind="slot"
          :style="{
            left: `${slot.x}px`,
            top: `${slot.y}px`,
            height: `${slot.height}px`,
            // height: `${22}px`,
            width: `${slot.width}px`,
            position: 'absolute'
          }"
        />

        <Suggestion
          v-if="state.scheduling"
          v-for="suggestion in suggestionPositions"
          v-bind="suggestion"
          :style="{
            left:   `${suggestion.x}px`,
            top:    `${suggestion.y}px`,
            height: `${suggestion.height}px`,
            width:  `${suggestion.width}px`,
            position: 'absolute'
          }"
        />

        <TimeRangeHighlight
          v-if="state.scheduling"
          v-for="timeRange in requestedTimeRanges"
          v-bind="timeRange"
          :style="{
            left:   `${timeRange.x}px`,
            top:    `${timeRange.y}px`,
            height: `${timeRange.height}px`,
            width:  `${timeRange.width}px`,
            position: 'absolute'
          }"
        />

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

  /* .new-event-dropzone-filled {
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
  } */

  .avatar {
    border-radius: 40px;
    height: 36px;
    width: 36px;
    text-align: center;
    padding: 0px;
    margin-right: 4px;
  }

  select {
    width: 13%;
  }

</style>
