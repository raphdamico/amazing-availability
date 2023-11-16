import { categorizeEvent, isMeeting } from "./eventCategorizer.js";

function scoring(ev) {
    
    let DEFAULT = 25;
    let category = categorizeEvent(ev)
    
    let scores = {
        "focus_time": 3,
        "smarthold": 5,
        
        "meeting_flexible": 25,
        "meeting": 35,
        "meeting_external": 50,
        
        "just_outside": 25, // Conceptually makes sense to treat it kinda like a flexible meeting level of inconvenience?
        
        "hold_flexible": 5,
        "hold_ask": 7,
        "hold_dns": 10, // How seriously to take a DNS? Good candidate for "ask "
        
        "personal_calendar_sync": 1000,
        "unavailable": 1000
    }

    let out = {
        score: scores[category],
        category 
    }

    return out;
}

export function generateSlots(CONFIG, state, slotDuration, events, aggressiveness, urgencySlots) {

    // Helpers
    function floorTime(time) {
        let hour = time%24;
        let quantizedHour = Math.floor(hour / slotDuration) * slotDuration;
        let day = Math.floor(time/24);
        return quantizedHour + day * 24;
    }
    function ceilTime(time) {
        let hour = time%24;
        let quantizedHour = Math.ceil(hour / slotDuration) * slotDuration;
        let day = Math.floor(time/24);
        return quantizedHour + day * 24;
    }

    function mapTimeToSlot(time) {
        let hour = time%24;
        let day = Math.floor(time/24);

        let slotsSinceStartHour = (hour - CONFIG.startHour) / slotDuration;
        let slotsPerDay = CONFIG.hoursPerDay / slotDuration;

        return slotsSinceStartHour + slotsPerDay * day;
    }

    // Generate slots
    let slots = [];
    let slotsPerDay = CONFIG.hoursPerDay / slotDuration;
    for (let day=0; day < CONFIG.days; day++) {
        for (let slot=0; slot < slotsPerDay; slot++) {
            slots.push({
                day: day,
                time: CONFIG.startHour + slot * slotDuration,
                events: [],
                score: 0
            })
        }
    }

    ////////////////////////////////////////////////////////////////////
    // Populate slots with events & scores
    events.forEach(ev => {
        for (let hour=floorTime(ev.startTime); hour < ceilTime(ev.endTime); hour+=slotDuration) {
            let slot = slots[mapTimeToSlot(hour)];
            slot.events.push(ev);

            let startOrEnd = (ev.time === slot.time || ev.time + ev.duration === slot.time + slotDuration)
            slot.startOrEnd = startOrEnd;
            slot.score += scoring(ev, aggressiveness, startOrEnd).score;
            slot.outsideWorkingHours = slot.score >= 1000;
            slot.justOutsideWorkingHours = scoring(ev, aggressiveness).category === 'just_outside';
        }
    })

    // Check for strategies
    slots = slots.map((slot, i) => {

        ////////////////////////////////////////////////////////////
        // Check for "start or end of focus time"
        let startOrEndCount = 0;
        slot.events.filter(ev => categorizeEvent(ev) === "focus_time").forEach(ev => {
            let startOrEnd = (ev.time === slot.time || ev.time + ev.duration === slot.time + slotDuration)
            if (startOrEnd) { startOrEndCount++; }
        })
        slot.endsOfFocusTimeStrategy = (startOrEndCount > 0 && startOrEndCount === slot.events.length)

        ////////////////////////////////////////////////////////////
        // Check for "schedule by moving"
        let totalMeetings = 0;
        let sbmCandidates = 0;        
        slot.events.filter(ev => isMeeting(ev)).forEach(ev => {
            if (ev.title.includes("<SBM>")) { sbmCandidates++; }
            totalMeetings++;
        })
        slot.sbmStrategy = (sbmCandidates > 0 && sbmCandidates === totalMeetings);
        slot.partialSbmStrategy = (sbmCandidates > 0 && sbmCandidates < totalMeetings);
        if (slot.time === 10.5 && slot.day === 0) { 
        // console.log(slot)
        }

        ////////////////////////////////////////////////////////////
        // Check for "partial fit" strategy
        let maxIncursionStart = 0;
        let maxIncursionEnd = 0;
        slot.events.filter(ev => isMeeting(ev)).forEach(ev => {
            let incursionStart = 0
            let incursionEnd = 0;
            // First check for events overlapping from the top
            // Hours that the END of the event pushes into the start of the slot
            if (ev.time <= slot.time) { 
                incursionStart  = Math.max(0, (ev.time + ev.duration) - slot.time);
            }
            // Hours that the start of the event pushes into the end of the slot
            if (ev.time + ev.duration >= slot.time + slotDuration) {
                incursionEnd    = Math.max(0, (slot.time + slotDuration) - ev.time); 
            }

            maxIncursionStart   = Math.max(maxIncursionStart, incursionStart);
            maxIncursionEnd     = Math.max(maxIncursionEnd, incursionEnd);            
            // console.log(slot.time, incursionStart, incursionEnd, ev.title, ev.duration)
        })
        let totalSpaceLeftInSlot = slotDuration - maxIncursionStart - maxIncursionEnd;
        slot.partialFitStrategy = (totalSpaceLeftInSlot >= 0.25 && totalSpaceLeftInSlot !== slotDuration);
        ////////////////////////////////////////////////////////////

        // Apply strategy weights
        if (state.applyStrategiesLayer) {
            if (slot.partialFitStrategy) { slot.score -= 5; }
            if (slot.sbmStrategy) { slot.score -= 10; }
            if (slot.endsOfFocusTimeStrategy) { slot.score = 1; }
        }
        
        // if (slot.time <11&& slot.day === 0) {
        //     console.log(totalSpaceLeftInSlot, (totalSpaceLeftInSlot >= 0.25 && totalSpaceLeftInSlot !== slotDuration), slotDuration, slot)
        // }


        ////////////////////////////////////////////////////////////
        // Apply urgency layer
        if (state.applyRequestedTimeRangesLayer) {
            slot.score += urgencySlots[i].score
        }

        if (state.applyUrgencyLayer) {
            console.log(slot.score, urgencySlots[i].urgencyScore)
            slot.score += urgencySlots[i].urgencyScore
        }


        return slot;
    })

    return slots;
}

