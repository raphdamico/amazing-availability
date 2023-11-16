function calcTimeRange(day, time, duration) {
    const startTime = (24 * day) + time;
    const endTime = startTime + duration;
    return { startTime, endTime }
}

export function generateWorkingHours(calendarId, whStartHour, whEndHour, CONFIG) {

    const BUFFER = 1;
    
    let owh = [];
    for (let day=0; day < CONFIG.days; day++) {

        let before = {
            calendarId: calendarId,
            title: "<OWH>", 
            day: day, 
            time: CONFIG.startHour, 
            duration: (whStartHour - BUFFER) - CONFIG.startHour,
            id: crypto.randomUUID()
        };
        before = {...before, ...calcTimeRange(day, before.time, before.duration)};
        owh.push(before);

        let justBefore = {
            calendarId: calendarId,
            title: "<JOWH>",  // just outside
            day: day, 
            time: whStartHour - BUFFER, 
            duration: 1,
            id: crypto.randomUUID()
        };
        justBefore = {...justBefore, ...calcTimeRange(day, justBefore.time, justBefore.duration)};
        owh.push(justBefore);

        let justAfter = {
            calendarId: calendarId,
            title: "<JOWH>", 
            day: day, 
            time: whEndHour, 
            duration: BUFFER, 
            id: crypto.randomUUID()
        };
        justAfter = {...justAfter, ...calcTimeRange(day, justAfter.time, justAfter.duration)}; 
        owh.push(justAfter);    

        let after = {
            calendarId: calendarId,
            title: "<OWH>", 
            day: day, 
            time: whEndHour + BUFFER, 
            duration: (CONFIG.startHour + CONFIG.hoursPerDay) - (whEndHour + BUFFER), 
            id: crypto.randomUUID()
        };
        after = {...after, ...calcTimeRange(day, after.time, after.duration)}; 
        owh.push(after);    
    }
    return owh;
}