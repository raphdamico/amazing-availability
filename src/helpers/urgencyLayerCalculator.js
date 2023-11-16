export function generateUrgencyCurve(urgency, daySpan) {

    const curves = {
        CRITICAL: [-10, -5, 0],
        URGENT: [-5, -3, -3, -2, -1, 0],
        AMBIVALENT: [0],
        LATER: [3, 2, 1, 0]
    }

    let curve = [];
    for (let i=0; i <= daySpan + 1; i++) {
        if (i >= curves[urgency].length) {
            curve[i] = 0;
        }
        else {
            curve[i] = curves[urgency][i];
        }
    }
    return curve;
}