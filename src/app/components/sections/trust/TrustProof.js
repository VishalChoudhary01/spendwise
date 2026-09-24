"use client";

import { useInView } from "motion/react";

import { useRef } from "react";

import { useMediaQuery } from "@/app/hooks/useMediaQuery";

import {
    MOBILE_QUERY,
    REDUCED_MOTION_QUERY,
} from "@/app/constants/mediaQueries";

import Eyebrow from "../../common/Eyebrow";
import SectionHeading from "../../common/SectionHeading";
import Container from "@/app/components/layout/container";

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

export default function TrustProof() {
    /*
     * ------------------------------------------------------------
     * RESPONSIVE / ACCESSIBILITY
     * ------------------------------------------------------------
     *
     * Using the existing centralized hook.
     * No duplicated media-query constants.
     */

    const isMobile = useMediaQuery(MOBILE_QUERY);

    const reducedMotion = useMediaQuery(
        REDUCED_MOTION_QUERY
    );

    const isStatic =
        isMobile || reducedMotion;

    /*
     * ------------------------------------------------------------
     * SECTION VIEWPORT
     * ------------------------------------------------------------
     */

    const sectionRef = useRef(null);

    const inView = useInView(sectionRef, {
        once: true,
        margin: "-80px",
    });

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
            ref={sectionRef}
            id="trust"
            className="
                relative
                w-full
                border-y
                border-border/70
                bg-background-secondary
            "
        >
            <Container className="grid gap-10 py-16 sm:py-24 lg:py-32 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-20">
                {/* =================================================
                    LEFT
                ================================================= */}

                <div className="max-w-2xl">
                    {/* Eyebrow */}

                    <Eyebrow
                        label="Real Results"
                        className="mb-3"
                    />

                    {/* Centralized Section Heading */}

                    <SectionHeading
                        align="left"
                        size="md"
                        maxWidth="max-w-2xl"
                        description="
                            Real numbers from a growing community
                            of shoppers using Spendwise to organize,
                            compare, and save.
                        "
                    >
                        A smarter way to shop,
                        <br className="hidden sm:inline" />
                        already making a{" "}
                        <span className="text-accent dark:text-darkBrandTeal">
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
            </Container>
        </section>
    );
}