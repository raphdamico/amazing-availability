export function generateSuggestions(CONFIG, slots, aggressivenessScore) {
    let suggestions = [];

    slots.forEach(slot => {
        if (slot.score < aggressivenessScore) { suggestions.push(slot); }
    })
    return suggestions;
}