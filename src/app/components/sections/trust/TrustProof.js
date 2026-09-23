"use client";

import {
    motion,
    useInView,
} from "motion/react";

import { useRef } from "react";

import { useMediaQuery } from "@/app/hooks/useMediaQuery";

import Eyebrow from "../../common/Eyebrow";
import SectionHeading from "../../common/SectionHeading";

import TrustMetric from "./TrustMetric";
import TrustQuote from "./TrustQuote";

const METRICS = [
    {
        value: 12000,
        prefix: "",
        suffix: "+",
        label: "smart shoppers",
    },
    {
        value: 4500,
        prefix: "₹",
        suffix: "+",
        label: "avg. monthly savings",
    },
    {
        value: 500000,
        prefix: "",
        suffix: "+",
        label: "prices checked",
    },
];

const EASE_OUT = [
    0.22,
    1,
    0.36,
    1,
];

export default function TrustProof() {
    /*
     * ------------------------------------------------------------
     * RESPONSIVE / ACCESSIBILITY
     * ------------------------------------------------------------
     *
     * Using the existing centralized hook.
     * No duplicated media-query constants.
     */

    const isMobile = useMediaQuery(
        "(max-width: 1023px)"
    );

    const reducedMotion = useMediaQuery(
        "(prefers-reduced-motion: reduce)"
    );

    const isStatic =
        isMobile || reducedMotion;

    /*
     * ------------------------------------------------------------
     * SECTION VIEWPORT
     * ------------------------------------------------------------
     */

    const sectionRef = useRef(null);

    const inView = useInView(
        sectionRef,
        {
            once: true,
            margin: "-80px",
        }
    );

    /*
     * Mobile / reduced-motion:
     * show final values immediately.
     *
     * Desktop:
     * start count-up when section enters.
     */

    const countActive =
        isStatic || inView;

    return (
        <section
            id="trust"
            className="
                relative
                w-full
                border-y
                border-border/70
                bg-[#F1F6F4]
                dark:bg-[#101B18]
            "
        >
            <motion.div
                ref={sectionRef}
                initial={{
                    opacity: 0,
                    y: 12,
                }}
                whileInView={{
                    opacity: 1,
                    y: 0,
                }}
                viewport={{
                    once: true,
                    margin: "-80px",
                }}
                transition={{
                    duration: 0.6,
                    ease: EASE_OUT,
                }}
                className="
                    mx-auto
                    grid
                    w-full
                    max-w-7xl
                    gap-10
                    px-6
                    py-16
                    sm:py-24
                    lg:grid-cols-[1fr_1.15fr]
                    lg:items-center
                    lg:gap-20
                    lg:py-28
                "
            >
                {/* =================================================
                    LEFT
                ================================================= */}

                <div className="max-w-xl">
                    {/* Eyebrow */}

                    <Eyebrow
                        label="Real Results"
                        className="mb-3"
                    />

                    {/* Centralized Section Heading */}

                    <SectionHeading
                        align="left"
                        size="md"
                        maxWidth="max-w-xl"
                        description="
                            Real numbers from a growing community
                            of shoppers using SmartShop to organize,
                            compare, and save.
                        "
                    >
                        A smarter way to shop,
                        <br />
                        already making a{" "}
                        <span className="text-accent">
                            difference.
                        </span>
                    </SectionHeading>
                </div>

                {/* =================================================
                    RIGHT
                ================================================= */}

                <div>
                    {/* Metrics */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            divide-y
                            divide-border
                            sm:grid-cols-3
                            sm:divide-x
                            sm:divide-y-0
                        "
                    >
                        {METRICS.map(
                            (metric, index) => (
                                <TrustMetric
                                    key={
                                        metric.label
                                    }
                                    metric={
                                        metric
                                    }
                                    index={
                                        index
                                    }
                                    active={
                                        countActive
                                    }
                                    isStatic={
                                        isStatic
                                    }
                                />
                            )
                        )}
                    </div>

                    {/* Quote */}

                    <TrustQuote />
                </div>
            </motion.div>
        </section>
    );
}