const calendar_raph = [
    
    {title: "Weekly A", day: 0, time: 8, duration: 0.25},

    {title: "Weekly A", day: 0, time: 9, duration: 0.5},
    {title: "Weekly B", day: 0, time: 9, duration: 0.5},
    {title: "Weekly C", day: 0, time: 9, duration: 0.5},
    {title: "Weekly D", day: 0, time: 9, duration: 0.5},
    {title: "Weekly E", day: 0, time: 9, duration: 0.5},
    {title: "Sprint Planning", day: 0, time: 9.7, duration: 0.5},
    {title: "❇️ You/Dan <SBM>", day: 0, time: 10.5, duration: 0.5, rescheduleTime: {day: 0, time: 10}},
    {title: "Marketing meeting", day: 0, time: 11, duration: 1},
    {title: "Team lunch", day: 0, time: 12, duration: 1},
    {title: "Focus Time", day: 0, time: 13, duration: 2},
    {title: "Sync up", day: 0, time: 15, duration: 0.5},
    {title: "Get hot chocolate", day: 0, time: 15.5, duration: 0.5},
  
    {title: "Workshop", day: 1, time: 9, duration: 1},
    {title: "[Interview] Rob Kappa]", day: 1, time: 10, duration: 1},
    {title: "You/Linda", day: 1, time: 11, duration: 0.5, rescheduleTime: {day: 2, time: 9}},
    {title: "You/Amy", day: 1, time: 11, duration: 0.5, offset: 0.2, rescheduleTime: {day: 4, time: 14}},
    {title: "❇️ You/Vicky <SBM>", day: 1, time: 11.5, duration: 0.5},
    {title: "Lunch", day: 1, time: 12, duration: 0.5},
    {title: "Critique", day: 1, time: 12.5, duration: 1.5},
    {title: "Urgent!!", day: 1, time: 13, duration: 0.5, offset: 0.25},
    {title: "Busy (via Clockwise)", day: 1, time: 14, duration: 1},
    {title: "Work on presentation", day: 1, time: 15, duration: 2},
    
    {title: "❇️ You/Jimmy", day: 2, time: 10.5, duration: 0.75, rescheduleTime: {day: 4, time: 11}},
    {title: "You/Dan", day: 2, time: 11.25, duration: 0.5, rescheduleTime: {day: 2, time: 11.5}},
    {title: "Career 1:1", day: 2, time: 12, duration: 1},
    {title: "Lunch", day: 2, time: 12.5, duration: 0.5, offset: 0.25},
    {title: "You/Cecily", day: 2, time: 13, duration: 0.5},
    {title: "Busy (via Clockwise)", day: 2, time: 13.5, duration: 0.5},
    {title: "Sync meeting", day: 2, time: 15, duration: 1},
    {title: "UserTesting", day: 2, time: 16, duration: 1},
  
    {title: "Sprint Sync", day: 3, time: 9, duration: 0.5},
    {title: "[INTERVIEW] Rob Kappa", day: 3, time: 9.5, duration: 1},
    {title: "Standup", day: 3, time: 10.5, duration: 0.5},
    {title: "❇️ Nikita/You", day: 3, time: 11, duration: 0.5, rescheduleTime: {day: 3, time: 12.5}}, 
    {title: "Coordinate", day: 3, time: 11.5, duration: 0.5},
    {title: "❇️ You/Jon", day: 3, time: 12, duration: 0.5},
    {title: "Lunch", day: 3, time: 12.5, duration: 0.5},
    {title: "UserTesting", day: 3, time: 13, duration: 1},
    {title: "Matt/You", day: 3, time: 13.5, duration: 0.5, offset: 0.25},
    {title: "Focus Time", day: 3, time: 14, duration: 3},
  
    {title: "You/Cecily/Linda", day: 4, time: 9.75, duration: 0.75},
    {title: "Sprint Retro", day: 4, time: 10.5, duration: 0.5},
    {title: "Lunch", day: 4, time: 11.5, duration: 0.5},
    {title: "Demos", day: 4, time: 12, duration: 1},
    {title: "Focus Time", day: 4, time: 13, duration: 1},
    {title: "Matt/Cecily", day: 4, time: 13.5, duration: 0.5},
    {title: "Focus Time", day: 4, time: 14.5, duration: 1.5},
    {title: "ASDASDAS", day: 4, time: 16, duration: 0.5}
]

const calendar_linda = [
    {title: "Weekly Kickoff", day: 0, time: 9, duration: 0.5},
    {title: "Sprint Planning", day: 0, time: 9.5, duration: 0.5},
    {title: "Sync up", day: 0, time: 14, duration: 0.5},
    {title: "Choc 1a", day: 0, time: 15.25, duration: 0.5},
    {title: "Choc 1b", day: 0, time: 15.25, duration: 0.5},
    {title: "Choc 2", day: 0, time: 15.75, duration: 0.5},
    {title: "Choc 3", day: 0, time: 16, duration: 0.5},
    {title: "Choc 4", day: 0, time: 16.25, duration: 0.5},
  
    {title: "Workshop", day: 1, time: 9, duration: 1},
    {title: "[Interview] Rob Kappa]", day: 1, time: 10, duration: 1},
    {title: "You/Linda", day: 1, time: 11, duration: 0.5, rescheduleTime: {day: 2, time: 9}},
    {title: "You/Amy", day: 1, time: 11, duration: 0.5, offset: 0.5, rescheduleTime: {day: 4, time: 14}},
    {title: "You/Vicky", day: 1, time: 11.5, duration: 0.5},
    {title: "Lunch", day: 1, time: 12, duration: 0.5},
    {title: "Critique", day: 1, time: 12.5, duration: 1.5},
    {title: "Urgent!!", day: 1, time: 13, duration: 0.5, offset: 0.25},
    {title: "Busy (via Clockwise)", day: 1, time: 14, duration: 1},
    {title: "Work on presentation", day: 1, time: 15, duration: 2},
    
    {title: "❇️ Quick Chat", day: 2, time: 9.5, duration: 0.5, rescheduleTime: {day: 2, time: 10}},
    {title: "❇️ You/Jimmy", day: 2, time: 10.5, duration: 0.75, rescheduleTime: {day: 4, time: 11}},
    {title: "You/Dan", day: 2, time: 11.25, duration: 0.5, rescheduleTime: {day: 2, time: 11.5}},
    {title: "Career 1:1", day: 2, time: 12, duration: 1},
    {title: "Lunch", day: 2, time: 12.5, duration: 0.5, offset: 0.25},
    {title: "You/Cecily", day: 2, time: 13, duration: 0.5},
    {title: "Busy (via Clockwise)", day: 2, time: 13.5, duration: 0.5},
    {title: "Sync meeting", day: 2, time: 15, duration: 1},
    {title: "UserTesting", day: 2, time: 16, duration: 1},
  
    {title: "Sprint Sync", day: 3, time: 9, duration: 0.5},
    {title: "[INTERVIEW] Rob Kappa", day: 3, time: 9.5, duration: 1},
    {title: "Standup", day: 3, time: 10.5, duration: 0.5},
    {title: "❇️ Nikita/You", day: 3, time: 11, duration: 0.5, rescheduleTime: {day: 3, time: 12.5}}, 
    {title: "Coordinate", day: 3, time: 11.5, duration: 0.5},
    {title: "❇️ You/Jon", day: 3, time: 12, duration: 0.5},
    {title: "Lunch", day: 3, time: 12.5, duration: 0.5},
    {title: "UserTesting", day: 3, time: 13, duration: 1},
    {title: "Matt/You", day: 3, time: 13.5, duration: 0.5, offset: 0.25},
    {title: "Focus Time", day: 3, time: 14, duration: 3},
  
    {title: "You/Cecily/Linda", day: 4, time: 9.75, duration: 0.75},
    {title: "Sprint Retro", day: 4, time: 10.5, duration: 0.5},
    {title: "Lunch", day: 4, time: 11.5, duration: 0.5},
    {title: "Demos", day: 4, time: 12, duration: 1},
    {title: "Focus Time", day: 4, time: 13, duration: 1},
    {title: "Matt/Cecily", day: 4, time: 13.5, duration: 0.5},
    {title: "Focus Time", day: 4, time: 14.5, duration: 1.5},
    {title: "Wind down & wrap up", day: 4, time: 15.5, duration: 0.5}
]

const calendar_jeff = [
    {title: "Weekly Kickoff", day: 0, time: 9, duration: 0.5},
    {title: "Sprint Planning", day: 0, time: 9.5, duration: 0.5},
    {title: "DNS - Ask before scheduling", day: 0, time: 12.5, duration: 4.5, rescheduleTime: {day: 0, time: 10}},
    {title: "Plan OKRs", day: 0, time: 13, duration: 1},
    {title: "Sync up", day: 0, time: 14, duration: 0.5},
    {title: "Choc 1", day: 0, time: 15.25, duration: 0.5},
    {title: "Choc 2", day: 0, time: 15.75, duration: 0.5},
    {title: "Choc 3", day: 0, time: 16, duration: 0.5},
    {title: "Choc 4", day: 0, time: 16.25, duration: 0.5},
  
    {title: "Workshop", day: 1, time: 9, duration: 1},
    {title: "[Interview] Rob Kappa]", day: 1, time: 10, duration: 1},
    {title: "You/Linda", day: 1, time: 11, duration: 0.5, rescheduleTime: {day: 2, time: 9}},
    {title: "You/Amy", day: 1, time: 11, duration: 0.5, offset: 0.5, rescheduleTime: {day: 4, time: 14}},
    {title: "You/Vicky", day: 1, time: 11.5, duration: 0.5},
    {title: "Lunch", day: 1, time: 12, duration: 0.5},
    {title: "Critique", day: 1, time: 12.5, duration: 1.5},
    {title: "Urgent!!", day: 1, time: 13, duration: 0.5, offset: 0.25},
    {title: "Busy (via Clockwise)", day: 1, time: 14, duration: 1},
    {title: "Work on presentation", day: 1, time: 15, duration: 2},
    
    {title: "❇️ Quick Chat", day: 3, time: 9.5, duration: 0.5, rescheduleTime: {day: 2, time: 10}},
    {title: "❇️ You/Jimmy", day: 3, time: 10.5, duration: 0.75, rescheduleTime: {day: 4, time: 11}},
    {title: "You/Dan", day: 3, time: 11.25, duration: 0.5, rescheduleTime: {day: 2, time: 11.5}},
    {title: "✨ [Interview]", day: 3, time: 11, duration: 1},
    {title: "✨ Lunch offsite", day: 3, time: 12.5, duration: 0.5, offset: 0.25},
    {title: "✨ Coffee", day: 3, time: 13, duration: 0.5},
    {title: "Busy (via Clockwise)", day: 2, time: 13.5, duration: 0.5},
    {title: "Sync meeting", day: 3, time: 15, duration: 1},
    {title: "UserTesting", day: 3, time: 16, duration: 1},
  
    {title: "Sprint Sync", day: 2, time: 9, duration: 0.5},
    {title: "✨ [INTERVIEW] Rob Kappa", day: 2, time: 9.5, duration: 1},
    {title: "Standup", day: 2, time: 10.5, duration: 0.5},
    {title: "❇️ Nikita/You", day: 2, time: 11, duration: 0.5, rescheduleTime: {day: 3, time: 12.5}}, 
    {title: "Coordinate", day: 2, time: 11.5, duration: 0.5},
    {title: "❇️ You/Jon", day:2, time: 12, duration: 0.5},
    {title: "Lunch", day: 2, time: 12.5, duration: 0.5},
    {title: "UserTesting", day: 2, time: 13, duration: 1},
    {title: "Matt/You", day: 2, time: 13.5, duration: 0.5, offset: 0.25},
    {title: "Focus Time", day: 2, time: 14, duration: 3},
  
    {title: "OOO", day: 4, time: 12, duration: 6},
]

const calendar_dario = [
    {title: "Choc 2", day: 0, time: 6, duration: 0.5},
    {title: "Choc 4", day: 0, time: 7, duration: 0.5},
    {title: "Lunch", day: 0, time: 8.5, duration: 0.5},
    {title: "Weekly Kickoff", day: 0, time: 9, duration: 0.5},
    {title: "Sprint Planning", day: 0, time: 9.5, duration: 0.5},
    {title: "Plan OKRs", day: 0, time: 10, duration: 1},
    {title: "Sync up", day: 0, time: 11, duration: 0.5},

    {title: "Busy (via Clockwise)", day: 1, time: 6, duration: 1},
    {title: "Design time", day: 1, time: 7, duration: 1},
    {title: "Workshop", day: 1, time: 9, duration: 1},
    {title: "Urgent!!", day: 1, time: 9.25, duration: 0.5},
    {title: "Lunch", day: 1, time: 8, duration: 0.5},
    {title: "You/Linda", day: 1, time: 11, duration: 0.5, rescheduleTime: {day: 2, time: 9}},
    {title: "You/Amy", day: 1, time: 11, duration: 0.5, offset: 0.5, rescheduleTime: {day: 4, time: 14}},
    {title: "You/Vicky", day: 1, time: 11.5, duration: 0.5},
    {title: "Critique", day: 1, time: 12.5, duration: 1.5},
    

    {title: "Lunch", day: 2, time: 8.5, duration: 0.5},
    {title: "UserTesting", day: 2, time: 7, duration: 1},

    {title: "Sprint Sync", day: 2, time: 9, duration: 0.5},
    {title: "✨ [INTERVIEW] Rob Kappa", day: 2, time: 9.5, duration: 1},
    {title: "Standup", day: 2, time: 10.5, duration: 0.5},
    {title: "❇️ Nikita/You", day: 2, time: 11, duration: 0.5, rescheduleTime: {day: 3, time: 12.5}}, 
    {title: "Coordinate", day: 2, time: 11.5, duration: 0.5},
    {title: "❇️ You/Jon", day:2, time: 12, duration: 0.5},

    {title: "✨ Coffee", day: 3, time: 5.5, duration: 1},
    {title: "Busy (via Clockwise)", day: 2, time: 6.5, duration: 1},
    {title: "Sync meeting", day: 3, time: 8, duration: 1},
    {title: "UserTesting", day: 3, time: 9, duration: 1},

    {title: "❇️ Quick Chat", day: 3, time: 9.5, duration: 0.5, rescheduleTime: {day: 2, time: 10}},
    {title: "❇️ You/Jimmy", day: 3, time: 10.5, duration: 0.75, rescheduleTime: {day: 4, time: 11}},
    {title: "You/Dan", day: 3, time: 11.25, duration: 0.5, rescheduleTime: {day: 2, time: 11.5}},
    {title: "✨ [Interview]", day: 3, time: 11, duration: 1},
    {title: "✨ Lunch offsite", day: 3, time: 12.5, duration: 0.5, offset: 0.25},

  

    {title: "OOO", day: 4, time: 6, duration: 8},
]

function processEvents(events, calendarId) {

    let eventList = events.map(event => {
        const id = crypto.randomUUID();
        const startTime = (24 * event.day) + event.time;
        const endTime = startTime + event.duration;
        return {...event, startTime, endTime, calendarId, id};
    })

    eventList.forEach(event => { 
        let eventNextWeek = JSON.parse(JSON.stringify(event));
        eventNextWeek.day += 7;
        eventNextWeek.id = crypto.randomUUID();
        eventNextWeek.startTime = (24 * eventNextWeek.day) + eventNextWeek.time;
        eventNextWeek.endTime = eventNextWeek.startTim + eventNextWeek.duration;
        eventList.push(eventNextWeek) 
    }) 

    return eventList;
}

export const calendars = [
    ...processEvents(calendar_raph, "raph"),
    ...processEvents(calendar_linda, "linda"),
    ...processEvents(calendar_linda, "vicky"),
    ...processEvents(calendar_jeff, "michael"),
    ...processEvents(calendar_dario, "dario")
]