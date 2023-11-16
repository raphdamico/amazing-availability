function doesOverlap(earlierEvent, laterEvent) {
    return (laterEvent.startTime >= earlierEvent.startTime 
        && laterEvent.startTime < earlierEvent.endTime)
        ||
        (earlierEvent.startTime >= laterEvent.startTime 
        && earlierEvent.startTime < laterEvent.endTime)
}

export function calcEventPositions(events) {
    
    // Everything breaks if the list isn't sorted!
    events = events.sort((a, b) => a.startTime - b.startTime);
    let nonLayoutEvents = events.filter(ev => ev.title === '<OWH>' || ev.title === '<JOWH>');
    events = events.filter(ev => ev.title != '<OWH>' && ev.title != '<JOWH>');

    let calculation_count = 0;

    // Clusters are groups of events that overlap
    let currentClusterIndex = 0;
    let clustersDepth = [0];
    let overlapsInThisCluster = 0;
    let lastClusterStart = 0;
    
    // Set up first event
    events[0].cluster = 0;
    events[0].depth = 0;
    events[0].maxDepth = 0;

    // For each event after the first...
    for(let i=1; i<events.length; i++) {    
        events[i].depth = 0;
        // console.log("======", events[i].title, events[i].depth)
        
        //...check all previous events for overlap
        //...first from right to left
        let overlappingEvents = [];
        let j=i-1;
        while(j >= 0) {
            if (events[i].day !== events[j].day) { break; }
            if (doesOverlap(events[j], events[i])) {
                overlapsInThisCluster++;
                if (events[i].depth >= events[j].depth) {
                    events[i].depth = events[j].depth + 1;
                    // console.log("👉 to the right of", events[j].title, "new depth", events[i].depth)
                }
                overlappingEvents.push(j);
            }
            calculation_count++;
            j--;
        }
        
        //...then mopping up in reverse
        //...only looking at ones that overlapped in previous loop
        // overlappingEvents.reverse();
        // overlappingEvents.forEach((ev, j) => {
        //     if (events[i].depth === events[j].depth) {
        //         events[i].depth = events[j].depth + 1;
        //     }
        //     calculation_count++;
        // })

        let overlappingEventsAlt = [];
        j = lastClusterStart;
        while(j < i) {
            if (events[i].day !== events[j].day) { break; }
            overlappingEventsAlt.push(j);
            if (doesOverlap(events[j], events[i])) {
                if (events[i].depth === events[j].depth) {
                    events[i].depth = events[j].depth + 1;
                    // console.log("👈 to the left of", events[j].title, "new depth", events[i].depth)
                }
            }            
            calculation_count++;
            j++;
        }
        // console.log("========================")
        // console.log("overlappingEvents", events[i].title)
        // console.log(overlappingEvents)
        // console.log(overlappingEventsAlt)
        // console.log("========================")

        // Split a new cluster if there are no overlaps
        if (overlapsInThisCluster === 0) {
            currentClusterIndex++;
            clustersDepth[currentClusterIndex] = 0;
            lastClusterStart = i;
        }
        else {
            if (events[i].depth > clustersDepth[currentClusterIndex]) {
                clustersDepth[currentClusterIndex] = events[i].depth;
            }
        }
        overlapsInThisCluster = 0;
        events[i].cluster = currentClusterIndex;
    }

    // console.log("Number of overlaps considered: ", calculation_count)
    // console.log("Cluster depth", clustersDepth)
    
    events = events.map((ev, i) => {
        return { ...ev, maxDepth: clustersDepth[ev.cluster] + 1 };
      });
    
    // LOGS
    // console.log("TEST", events)
    // for (const [i, ev] of events.entries()) {
    //     console.log(`${ev.cluster} | ${ev.depth} | ${ev.maxDepth} | ${ev.title}` )
    // }

    nonLayoutEvents = nonLayoutEvents.map(ev => {
        return { ...ev, depth: 0, maxDepth: 1, cluster: -1}
    })
    return [...events, ...nonLayoutEvents];

}

