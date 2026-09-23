import { EASE } from "./easings";
import { DURATION } from "./durations";

export const TRANSITION = {
    fast: {
        duration: DURATION.fast,
        ease: EASE.standard,
    },

    normal: {
        duration: DURATION.normal,
        ease: EASE.standard,
    },

    smooth: {
        duration: DURATION.smooth,
        ease: EASE.standard,
    },

    reveal: {
        duration: DURATION.reveal,
        ease: EASE.standard,
    },

    emphasis: {
        duration: DURATION.emphasis,
        ease: EASE.emphasis,
    },

    dramatic: {
        duration: DURATION.dramatic,
        ease: EASE.emphasis,
    },
};