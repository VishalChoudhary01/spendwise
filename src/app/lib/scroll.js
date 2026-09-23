"use client";
import { useTransform, useSpring } from "motion/react";

/**
 * Shared scroll-choreography math used by every scroll-driven section.
 *
 * Plain piecewise-linear interpolation, evaluated fresh every frame from the
 * current scroll position — nothing is handed to the animation library as a
 * range to interpret on its own. Below the first breakpoint -> first output
 * value; at/above the last breakpoint -> last output value, permanently.
 *
 * This is the single source of truth for the timing math so every section
 * stays perfectly in sync with scroll (same rules, same holds).
 */
export function interpolate(p, inputRange, outputRange) {
  if (p <= inputRange[0]) return outputRange[0];
  const last = inputRange.length - 1;
  if (p >= inputRange[last]) return outputRange[last];
  for (let i = 0; i < last; i++) {
    if (p >= inputRange[i] && p <= inputRange[i + 1]) {
      const t = (p - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
      return outputRange[i] + t * (outputRange[i + 1] - outputRange[i]);
    }
  }
  return outputRange[last];
}

/**
 * Builds a `useHeld` hook hard-locked to a specific HOLD_START fraction.
 *
 * Same as interpolate(), but ALSO pins every wrapped value to its final
 * output once scroll passes HOLD_START — so past the hold point nothing can
 * drift back, no matter what. Each section keeps its own HOLD_START so the
 * existing per-section timing is preserved exactly.
 */
export function createHeld(HOLD_START) {
  return (scrollYProgress, inputRange, outputRange) => {
    const finalValue = outputRange[outputRange.length - 1];
    return useTransform(scrollYProgress, (p) =>
      p >= HOLD_START ? finalValue : interpolate(p, inputRange, outputRange)
    );
  };
}

/**
 * Spring wrapper so positional/scale motion feels smooth rather than tracking
 * scroll 1:1. Each section can pass its own spring tuning to preserve its
 * existing feel.
 */
export function useSmooth(
  motionValue,
  springOptions = { stiffness: 300, damping: 30, mass: 0.5 }
) {
  return useSpring(motionValue, springOptions);
}
