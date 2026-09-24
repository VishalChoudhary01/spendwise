"use client";

import {
    motion,
    useMotionValueEvent,
    useScroll,
    useTransform,
} from "motion/react";

import { useRef, useState } from "react";

import { useMediaQuery } from "@/app/hooks/useMediaQuery";

import {
    MOBILE_QUERY,
    REDUCED_MOTION_QUERY,
} from "@/app/constants/mediaQueries";

import Eyebrow from "../../common/Eyebrow";
import SectionHeading from "../../common/SectionHeading";
import Reveal from "../../common/motion/Reveal";
import Container from "@/app/components/layout/container";

import IntegratedUI from "./IntegratedUI";
import PillarBlock from "./PillarBlock";

/* ================================================================
   DATA
================================================================ */

const PILLARS = [
    {
        id: "plan",
        outcome: "Organize your shopping.",
        supports:
            "Multiple lists · Product links · Estimated cost",
        stage: 0,
    },
    {
        id: "compare",
        outcome: "Find the better price.",
        supports:
            "Price comparison · Lowest price · Supported sources",
        stage: 1,
    },
    {
        id: "save",
        outcome: "See what you're saving.",
        supports:
            "Expense tracking · Savings analytics",
        stage: 2,
    },
    {
        id: "control",
        outcome: "Buy only what you need.",
        supports:
            "Duplicate alerts · Shopping progress",
        stage: 3,
    },
];

/* ================================================================
   COMPONENT
================================================================ */

export default function Features() {
    const isMobile = useMediaQuery(
        MOBILE_QUERY
    );

    const reducedMotion = useMediaQuery(
        REDUCED_MOTION_QUERY
    );

    const isStatic =
        isMobile || reducedMotion;

    const sectionRef = useRef(null);

    /*
     * ------------------------------------------------------------
     * SCROLL PROGRESS
     * ------------------------------------------------------------
     */

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: [
            "start start",
            "end 100%",
        ],
    });

    /*
     * ------------------------------------------------------------
     * STAGE PROGRESSION
     *
     * 0 → LIST
     * 1 → COMPARE
     * 2 → SAVE
     * 3 → SMART INSIGHT
     * ------------------------------------------------------------
     */

    const stageProgress = useTransform(
        scrollYProgress,
        (value) => {
            /*
                The UI card finishes fading in at ~0.14, so the
                LIST state must hold well past that point to be
                readable. Even 0.16-sized windows per state,
                with the final insight state lingering.
            */
            if (value >= 0.62) return 3;
            if (value >= 0.46) return 2;
            if (value >= 0.30) return 1;

            return 0;
        }
    );

    const [stage, setStage] = useState(0);

    useMotionValueEvent(
        stageProgress,
        "change",
        (value) => {
            const nextStage =
                Math.round(value);

            setStage((current) =>
                current === nextStage
                    ? current
                    : nextStage
            );
        }
    );

    const activeStage = isStatic
        ? 3
        : stage;

    /*
     * ------------------------------------------------------------
     * DESKTOP HEADER REVEAL
     * ------------------------------------------------------------
     */

    const headerOpacity = useTransform(
        scrollYProgress,
        [0, 0.06],
        [0, 1]
    );

    const headerY = useTransform(
        scrollYProgress,
        [0, 0.06],
        [16, 0]
    );

    /*
     * ------------------------------------------------------------
     * PRODUCT UI REVEAL
     * ------------------------------------------------------------
     */

    const uiOpacity = useTransform(
        scrollYProgress,
        [0.08, 0.14],
        [0, 1]
    );

    const uiScale = useTransform(
        scrollYProgress,
        [0.08, 0.14],
        [0.97, 1]
    );

    /*
     * ------------------------------------------------------------
     * PILLAR REVEALS
     * ------------------------------------------------------------
     */

    const pillarOpacities =
        PILLARS.map(
            (_, index) =>
                useTransform(
                    scrollYProgress,
                    [
                        0.1 +
                        index *
                        0.04,
                        0.17 +
                        index *
                        0.04,
                    ],
                    [0, 1]
                )
        );

    return (
        <section
            ref={sectionRef}
            id="features"
            className={`
                relative
                w-full
                border-t
                border-border/70
                bg-background
                ${isStatic
                    ? ""
                    : "lg:h-[220vh]"
                }
            `}
        >
            {/* ========================================================
                ATMOSPHERE
            ======================================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    overflow-hidden
                "
            >
                <div
                    className="
                        absolute
                        left-1/2
                        top-1/3
                        h-96
                        w-96
                        -translate-x-1/2
                        rounded-full
                        bg-brandTeal/6
                        blur-[130px]
                        dark:bg-brandTeal/8
                    "
                />
            </div>

            {/* ========================================================
                CONTENT
            ======================================================== */}

            <div
                className={`
                    relative
                    overflow-hidden
                    ${isStatic
                        ? ""
                        : "lg:sticky lg:top-0 lg:h-screen"
                    }
                `}
            >
                {isStatic ? (
                    <StaticFeatures
                        pillars={PILLARS}
                    />
                ) : (
                    <DesktopFeatures
                        pillars={PILLARS}
                        stage={stage}
                        activeStage={
                            activeStage
                        }
                        headerOpacity={
                            headerOpacity
                        }
                        headerY={headerY}
                        uiOpacity={uiOpacity}
                        uiScale={uiScale}
                        pillarOpacities={
                            pillarOpacities
                        }
                    />
                )}
            </div>
        </section>
    );
}

/* ================================================================
   SHARED HEADING

   Eyebrow and SectionHeading are intentionally separate.
================================================================ */

function FeaturesSectionHeading({
    animated = false,
    headerOpacity,
    headerY,
}) {
    const content = (
        <>
            {/* ====================================================
                EYEBROW
            ==================================================== */}

            <Eyebrow
                label="Features"
                className="mb-3"
            />

            {/* ====================================================
                SECTION HEADING
            ==================================================== */}

            <SectionHeading
                align="left"
                size="md"
                description="
                    Organize your shopping, compare prices,
                    track savings, and stay in control of what you buy.
                "
            >
                Everything you need
                <br className="hidden sm:inline" />
                to shop{" "}
                <span className="text-accent dark:text-darkBrandTeal">
                    smarter.
                </span>
            </SectionHeading>
        </>
    );

    /*
     * Desktop:
     *
     * SectionHeading already owns its viewport reveal.
     * This wrapper additionally participates in the
     * section's scroll choreography.
     */

    if (animated) {
        return (
            <motion.div
                style={{
                    opacity: headerOpacity,
                    y: headerY,
                }}
            >
                {content}
            </motion.div>
        );
    }

    return (
        <div className="max-w-2xl">
            {content}
        </div>
    );
}

/* ================================================================
   STATIC EXPERIENCE
   Mobile + Reduced Motion
================================================================ */

function StaticFeatures({ pillars }) {
    return (
        <Container className="relative z-10 py-16 sm:py-24 lg:py-32">
            {/* ====================================================
                HEADING
            ==================================================== */}

            <FeaturesSectionHeading />

            {/* ====================================================
                PRODUCT + PILLARS
            ==================================================== */}

            <div
                className="
                    mt-8
                    grid
                    gap-10
                    lg:grid-cols-[1.05fr_0.95fr]
                    lg:items-start
                "
            >
                {/* ------------------------------------------------
                    PRODUCT
                ------------------------------------------------ */}

                <Reveal delay={0.08}>
                    <IntegratedUI
                        stage={3}
                        isStatic
                    />
                </Reveal>

                {/* ------------------------------------------------
                    PILLARS
                ------------------------------------------------ */}

                <div
                    className="
                        grid
                        gap-3
                        sm:grid-cols-2
                    "
                >                        {pillars.map(
                            (pillar, index) => (
                                <Reveal
                                    key={pillar.id}
                                    delay={
                                        0.12 +
                                        (index % 2) * 0.08
                                    }
                                >
                                    <PillarBlock
                                        pillar={
                                            pillar
                                        }
                                    />
                                </Reveal>
                            )
                        )}
                </div>
            </div>
        </Container>
    );
}

/* ================================================================
   DESKTOP EXPERIENCE
================================================================ */

function DesktopFeatures({
    pillars,
    stage,
    activeStage,
    headerOpacity,
    headerY,
    uiOpacity,
    uiScale,
    pillarOpacities,
}) {
    return (
        <Container className="relative z-10 grid items-center gap-12 lg:h-full lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            {/* ====================================================
                LEFT
            ==================================================== */}

            <div>
                <FeaturesSectionHeading
                    animated
                    headerOpacity={
                        headerOpacity
                    }
                    headerY={headerY}
                />

                {/* =================================================
                    PILLARS
                ================================================= */}

                <div
                    className="
                        mt-8
                        grid
                        grid-cols-2
                        gap-3
                    "
                >
                    {pillars.map(
                        (pillar, index) => (
                            <motion.div
                                key={
                                    pillar.id
                                }
                                style={{
                                    opacity:
                                        pillarOpacities[
                                        index
                                        ],
                                }}
                            >
                                <PillarBlock
                                    pillar={
                                        pillar
                                    }
                                    active={
                                        activeStage ===
                                        pillar.stage
                                    }
                                />
                            </motion.div>
                        )
                    )}
                </div>
            </div>

            {/* ====================================================
                RIGHT
            ==================================================== */}

            <motion.div
                style={{
                    opacity: uiOpacity,
                    scale: uiScale,
                }}
                className="
                    w-full
                    max-w-[480px]
                    justify-self-center
                    lg:justify-self-end
                "
            >
                <IntegratedUI
                    stage={stage}
                />
            </motion.div>
        </Container>
    );
}