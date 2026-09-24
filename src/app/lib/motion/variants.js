/*
 * Shared motion variants (LANDING-PAGE-MOTION-UI-SYSTEM-v2.md §43).
 *
 * Keep variants small — one visual language across the landing page:
 * opacity + y for reveals, opacity for fades, scale for product visuals.
 * Animation details live here / in Reveal, never inside sections.
 */
export const reveal = {
    hidden: {
        opacity: 0,
        y: 16,
    },

    visible: {
        opacity: 1,
        y: 0,
    },
};

export const fade = {
    hidden: {
        opacity: 0,
    },

    visible: {
        opacity: 1,
    },
};

export const scaleReveal = {
    hidden: {
        opacity: 0,
        scale: 0.96,
    },

    visible: {
        opacity: 1,
        scale: 1,
    },
};

/*
 * Shared viewport-entry settings (§32): reveal once when the element
 * is meaningfully inside the viewport.
 */
export const REVEAL_VIEWPORT = {
    once: true,
    amount: 0.2,
};
