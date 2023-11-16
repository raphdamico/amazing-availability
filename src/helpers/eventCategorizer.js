export function categorizeEvent(ev) {

    let category = "meeting";
    if (ev.title.includes("Lunch")) { category = "smarthold"; }
    if (ev.title.includes("Focus")) { category = "focus_time"; }
    if (ev.title.includes("Ask before")) { category = "hold_ask"; }
    if (ev.title.includes("DNS BLOCK")) { category = "hold_dns"; }
    if (ev.title.includes("❇️")) { category = "meeting_flexible"; }
    if (ev.title.includes("✨")) { category = "meeting_external"; } 
    if (ev.title.includes("<JOWH>")) { category = "just_outside"}
    if (ev.title.includes("OOO") ||ev.title.includes("<OWH>")) { category = "unavailable"}
    
    return category
}

export function containsCategory(evArray, category) {
    return evArray.filter(ev => categorizeEvent(ev) === category).length > 0
}

export function isMeeting(ev) {
    let category = categorizeEvent(ev) 
    return category === "meeting" || category === "meeting_flexible" || category === "meeting_external"
}

export function isSmartHold(ev) {
    let category = categorizeEvent(ev) 
    return category === "smarthold" || category === "focus_time" 
}

export function isFlexible(ev) {
    return categorizeEvent(ev) === "meeting_flexible"
}

export function isOutsideWorkingHours(ev) {
    return ev.title.includes("<OWH>")  || ev.title.includes("<JOWH>") 
}
