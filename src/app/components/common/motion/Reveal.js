"use client";

import { motion, useReducedMotion } from "motion/react";

import { TRANSITION } from "@/app/lib/motion/transitions";
import {
    REVEAL_VIEWPORT,
    reveal,
} from "@/app/lib/motion/variants";

/**
 * Shared viewport-entry reveal (§30, §42, §49).
 *
 * Default reveal: opacity 0 → 1, y 16 → 0, once, using the centralized
 * `reveal` variant + `TRANSITION.reveal`. Animation details belong to the
 * motion system — components only describe intent:
 *
 *   <Reveal delay={0.08}><FeatureCard /></Reveal>
 *
 * Respects prefers-reduced-motion: renders children statically.
 */
export default function Reveal({
    children,
    className = "",
    delay = 0,
    amount,
}) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            initial={reveal.hidden}
            whileInView={reveal.visible}
            viewport={
                amount === undefined
                    ? REVEAL_VIEWPORT
                    : { once: true, amount }
            }
            transition={{
                ...TRANSITION.reveal,
                delay,
            }}
        >
            {children}
        </motion.div>
    );
}
