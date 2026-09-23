"use client";
import { useEffect, useState } from "react";

/**
 * Reactively tracks whether a CSS media query matches (client-side only).
 * Defaults to false during SSR to keep the initial markup deterministic.
 */
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia(query);
        const update = () => setMatches(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, [query]);

    return matches;
}
