import { DateTime, Interval } from "luxon";
import { generateUrgencyCurve } from "./urgencyLayerCalculator.js"

export function generateRequestedTimeRangeSlots(CONFIG, state, slotDuration, timeRanges, urgency) {
    
    // Calculate search time range
    let indexedTimeRanges = {};
    let requestedDays = [];
    let firstDay = timeRanges[0].day;
    let lastDay = timeRanges[timeRanges.length-1].day;
    timeRanges.forEach((range, i) => {
        if (!indexedTimeRanges.hasOwnProperty(range.day)) { 
            indexedTimeRanges[range.day] = [range]; 
            requestedDays.push(range.day);
        }
        else {
            indexedTimeRanges[range.day].push(range);
        }
    })
    let indexedRequestedDays = [];
    for (let i=0; i < CONFIG.days; i++) {
        indexedRequestedDays[i] = (requestedDays.includes(i)) ? 0 : 1;
    }
    
    // Apply falloff from user's request    
    let requestedDaysScoring = JSON.parse(JSON.stringify(indexedRequestedDays));
    for (let i=firstDay; i <= CONFIG.days; i++) {
        if (indexedRequestedDays[i] !== 0) {
            requestedDaysScoring[i] = requestedDaysScoring[i-1] + 1;        
        }
    }
    for (let i=lastDay; i >=0; i--) {
        if (indexedRequestedDays[i] !== 0) {
            requestedDaysScoring[i] = requestedDaysScoring[i+1] + 1;        
        }
    }

    // Get urgency curve
    let urgencyCurve = generateUrgencyCurve(state.urgency, lastDay - firstDay);
    console.log('urgencyCurve', urgencyCurve)

    // Generate slots
    let slots = [];
    let slotsPerDay = CONFIG.hoursPerDay / slotDuration;
    for (let day=0; day < CONFIG.days; day++) {
        let dayAfterFirst = Math.max(0, day - firstDay);
        for (let slot=0; slot < slotsPerDay; slot++) {
            slots.push({
                day: day,
                time: CONFIG.startHour + slot * slotDuration,
                score: requestedDaysScoring[day] * 20,
                urgencyScore: urgencyCurve[dayAfterFirst]
            })
        }
    }

    function mapTimeToSlot(time) {
        let hour = time%24;
        let day = Math.floor(time/24);

        let slotsSinceStartHour = (hour - CONFIG.startHour) / slotDuration;
        let slotsPerDay = CONFIG.hoursPerDay / slotDuration;

        return slotsSinceStartHour + slotsPerDay * day;
    }

    // Apply time range scoring
    timeRanges.forEach(range => {
        for (let t = range.startTime - slotDuration; t >= CONFIG.startHour + (range.day * 24); t-=slotDuration) {
            let s = mapTimeToSlot(t)
            if (s >= 0) {
                slots[s].score = 10 * (range.startTime - t)
            }
        }
        for (let t = range.endTime; t < CONFIG.startHour + CONFIG.hoursPerDay + (range.day * 24); t+=slotDuration) {
            let s = mapTimeToSlot(t)
            slots[s].score = 10 * (t - range.endTime + slotDuration)
        }
    })

    // Calculate urgency scoring
    

    return slots;
}