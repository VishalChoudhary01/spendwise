"use client";
import Lenis from "lenis";
import { useEffect } from "react";

const LenisProvider = ({ children }) => {
    useEffect(() => {
        // Respect prefers-reduced-motion: skip smooth scrolling entirely.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const lenis = new Lenis({
            smoothWheel: true,
            // Let wheel events scroll nested scrollable containers (mobile
            // dashboard/features overflow) natively, then take over the page
            // at their scroll boundaries.
            allowNestedScroll: true,
            // Smooth-scroll anchor navigation (#features, #compare, ...) with
            // the same eased motion as the page itself.
            anchors: true,
        });

        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
};

export default LenisProvider;
