"use client";

import {
    motion,
    useReducedMotion,
    useScroll,
    useSpring,
} from "motion/react";

/**
 * Optional global scroll progress line (§27).
 *
 * Extremely subtle: 2px, existing accent, no glow, never distracts.
 * Hidden entirely when the user prefers reduced motion.
 */
export default function ScrollProgress() {
    const shouldReduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll();

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 30,
        mass: 0.3,
        restDelta: 0.001,
    });

    if (shouldReduceMotion) {
        return null;
    }

    return (
        <motion.div
            aria-hidden="true"
            style={{ scaleX }}
            className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent"
        />
    );
}
