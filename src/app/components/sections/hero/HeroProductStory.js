"use client";
import { useCallback, useEffect, useRef, useState, } from "react";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import dynamic from "next/dynamic";
const HeroBackgroundVideo = dynamic(
    () => import("./HeroBackgroundVideo"),
    { ssr: false }
);
import HeroStoryCard from "./HeroStoryCard";
import HeroStoryProgress from "./HeroStoryProgress";

import { stages } from "@/app/constants/productLandingCard";
import { MOBILE_QUERY, REDUCED_MOTION_QUERY, } from "@/app/constants/mediaQueries";

const STATE_HOLD_MS = 2600;

export default function HeroProductStory({ children }) {
    const isMobile = useMediaQuery(MOBILE_QUERY);

    const reducedMotion = useMediaQuery(
        REDUCED_MOTION_QUERY
    );

    const isStatic = reducedMotion;

    const [stage, setStage] = useState(0);

    const [hovering, setHovering] =
        useState(false);

    const timerRef = useRef(null);

    /* ---------------------------------------------
       Auto-cycle
    --------------------------------------------- */

    const advance = useCallback(() => {
        setStage(  (prev) => (prev + 1) % stages.length);
    }, []);

    useEffect(() => {
        if (isStatic || hovering) {
            return;
        }

        timerRef.current = setInterval(
            advance,
            STATE_HOLD_MS
        );

        return () => {
            clearInterval(timerRef.current);
        };
    }, [
        isStatic,
        hovering,
        advance,
    ]);

    /* ---------------------------------------------
       Hover pause
    --------------------------------------------- */

    const handleMouseEnter = () => {
        setHovering(true);
    };

    const handleMouseLeave = () => {
        setHovering(false);
    };

    return (
        <section
            id="home"
            className="relative min-h-dvh w-full bg-background"
        >
            {/* Background layer — absolute so it never pushes content */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Background video — desktop */}
                {!isStatic && !isMobile && (
                    <HeroBackgroundVideo enabled />
                )}

                {/* Static atmosphere */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(226,246,238,0.85)_0%,rgba(245,248,247,0)_70%)] dark:bg-[linear-gradient(180deg,rgba(13,38,31,0.9)_0%,rgba(11,17,16,0)_70%)]" />

                    <div className="absolute -left-24 -top-16 h-96 w-96 rounded-full bg-brandTeal/10 blur-[120px] dark:bg-brandTeal/12" />

                    <div className="absolute -right-16 top-1/4 h-80 w-80 rounded-full bg-brandOrange/5 blur-[110px] dark:bg-brandOrange/6" />
                </div>
            </div>

            {/* Hero content — flows naturally, no fixed height */}
            <div className="relative z-10 mx-auto grid min-h-dvh w-full max-w-7xl items-center gap-6 px-6 pb-16 pt-20 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-0">

                {/* Left */}
                <div>
                    {children}
                </div>

                {/* Right */}
                <div
                    className="flex flex-col items-center"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="w-full max-w-[400px]">
                        <HeroStoryCard
                            stage={stage}
                            isStatic={isStatic}
                        />
                    </div>

                    {!isStatic && (
                        <HeroStoryProgress
                            stage={stage}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}