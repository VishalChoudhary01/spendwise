"use client";

import {
    motion,
    AnimatePresence,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useTransform,
} from "motion/react";

import { useRef, useState } from "react";

import Eyebrow from "../../common/Eyebrow";
import SectionHeading from "../../common/SectionHeading";

import { useMediaQuery } from "@/app/hooks/useMediaQuery";


import HowItWorksTimeline from "./HowItWorksTimeline";
import HowItWorksStage from "./HowItWorksStage";

import ListCreationState from "./states/ListCreationState";
import ProductListState from "./states/ProductListState";
import ComparisonState from "./states/ComparisonState";
import BestDealState from "./states/BestDealState";
import SpendingState from "./states/SpendingState";

const MOBILE_QUERY = "(max-width: 1023px)";

const STAGES = [
    {
        id: "create",
        index: "01",
        title: "Create a List",
        description:
            "Start with groceries, gifts, travel, or anything you plan to buy.",
    },
    {
        id: "add",
        index: "02",
        title: "Add What You Need",
        description:
            "Add products, quantities, priorities, and notes.",
    },
    {
        id: "compare",
        index: "03",
        title: "Compare Real Prices",
        description:
            "Compare supported sources and understand the difference.",
    },
    {
        id: "deal",
        index: "04",
        title: "Choose the Better Deal",
        description:
            "See the available options and understand what you save.",
    },
    {
        id: "track",
        index: "05",
        title: "Track Your Spend",
        description:
            "Watch purchases, pending items, and savings in one place.",
    },
];

const STATE_COMPONENTS = [
    ListCreationState,
    ProductListState,
    ComparisonState,
    BestDealState,
    SpendingState,
];

export default function HowItWorks() {
    const sectionRef = useRef(null);

    const isMobile = useMediaQuery(MOBILE_QUERY);
    const shouldReduceMotion = useReducedMotion();

    const [activeStage, setActiveStage] = useState(0);

    const staticMode =
        isMobile || shouldReduceMotion;

    /*
     * ---------------------------------------------------------
     * Scroll progress
     * ---------------------------------------------------------
     */

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: [
            "start start",
            "end 100%",
        ],
    });

    /*
     * ---------------------------------------------------------
     * Convert scroll progress → active stage
     *
     * 0 → 01
     * 1 → 02
     * 2 → 03
     * 3 → 04
     * 4 → 05
     * ---------------------------------------------------------
     */

    const stageProgress = useTransform(
        scrollYProgress,
        (progress) => {
            if (progress >= 0.68) return 4;
            if (progress >= 0.54) return 3;
            if (progress >= 0.40) return 2;
            if (progress >= 0.26) return 1;

            return 0;
        }
    );

    useMotionValueEvent(
        stageProgress,
        "change",
        (value) => {
            const nextStage = Math.round(value);

            setActiveStage((current) =>
                current === nextStage
                    ? current
                    : nextStage
            );
        }
    );

    /*
     * ---------------------------------------------------------
     * Timeline active progress
     * ---------------------------------------------------------
     */

    const timelineProgress = useTransform(
        scrollYProgress,
        [0.12, 0.68],
        ["0%", "100%"]
    );

    /*
     * ---------------------------------------------------------
     * Mobile / reduced-motion
     * ---------------------------------------------------------
     */

    if (staticMode) {
        return (
            <StaticHowItWorks />
        );
    }

    /*
     * ---------------------------------------------------------
     * Desktop
     * ---------------------------------------------------------
     */

    return (
        <section
            ref={sectionRef}
            id="how-it-works"
            className="
                relative
                w-full
                bg-background
                lg:h-[440vh]
            "
        >
            {/* Sticky viewport */}

            <div
                className="
                    sticky
                    top-0
                    h-screen
                    overflow-hidden
                "
            >
                {/* Ambient background */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                    "
                >
                    <div
                        className="
                            absolute
                            left-[8%]
                            top-[18%]
                            h-[28rem]
                            w-[28rem]
                            rounded-full
                            bg-accent/[0.035]
                            blur-[120px]
                        "
                    />

                    <div
                        className="
                            absolute
                            bottom-[5%]
                            right-[8%]
                            h-[24rem]
                            w-[24rem]
                            rounded-full
                            bg-accent/[0.025]
                            blur-[110px]
                        "
                    />
                </div>

                {/* Main container */}

                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        grid
                        h-full
                        max-w-7xl
                        items-center
                        gap-16
                        px-6
                        lg:grid-cols-[0.9fr_1.1fr]
                        lg:px-8
                    "
                >
                    {/* =================================================
                        LEFT CONTENT
                    ================================================= */}

                    <div className="w-full">
                        {/* -------------------------------------------------
                            EYEBROW

                            IMPORTANT:
                            This is intentionally used directly here.
                        ------------------------------------------------- */}

                        <Eyebrow
                            label="How It Works"
                            className="mb-3"
                        />

                        {/* -------------------------------------------------
                            SECTION HEADING

                            IMPORTANT:
                            SectionHeading is used directly here.
                        ------------------------------------------------- */}

                        <SectionHeading
                            align="left"
                            size="md"
                            description="
                                Add what you need, compare the options,
                                and let SmartShop help you make the smarter choice.
                            "
                        >
                            From List to{" "}
                            <span className="text-accent">
                                Better Buy.
                            </span>
                        </SectionHeading>

                        {/* -------------------------------------------------
                            TIMELINE
                        ------------------------------------------------- */}

                        <div className="mt-10">
                            <HowItWorksTimeline
                                stages={STAGES}
                                activeStage={
                                    activeStage
                                }
                                progress={
                                    timelineProgress
                                }
                            />
                        </div>
                    </div>

                    {/* =================================================
                        RIGHT VISUAL
                    ================================================= */}

                    <div
                        className="
                            flex
                            w-full
                            justify-center
                            lg:justify-end
                        "
                    >
                        <HowItWorksStage
                            activeStage={
                                activeStage
                            }
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* =============================================================
   MOBILE / REDUCED MOTION VERSION
============================================================= */

function StaticHowItWorks() {
    return (
        <section
            id="how-it-works"
            className="
                relative
                w-full
                overflow-hidden
                bg-background
            "
        >
            {/* Ambient background */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                "
            >
                <div
                    className="
                        absolute
                        left-[5%]
                        top-[10%]
                        h-72
                        w-72
                        rounded-full
                        bg-accent/[0.035]
                        blur-[100px]
                    "
                />
            </div>

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    w-full
                    max-w-7xl
                    px-6
                    py-20
                    sm:py-28
                "
            >
                {/* =================================================
                    EYEBROW
                ================================================= */}

                <Eyebrow
                    label="How It Works"
                    className="mb-3"
                />

                {/* =================================================
                    SECTION HEADING
                ================================================= */}

                <SectionHeading
                    align="left"
                    size="md"
                    description="
                        Add what you need, compare the options,
                        and let SmartShop help you make the smarter choice.
                    "
                >
                    From List to{" "}
                    <span className="text-accent">
                        Better Buy.
                    </span>
                </SectionHeading>

                {/* =================================================
                    MOBILE STEPS
                ================================================= */}

                <div className="mt-12 space-y-6">
                    {STAGES.map(
                        (item, index) => {
                            const State =
                                STATE_COMPONENTS[
                                index
                                ];

                            return (
                                <motion.article
                                    key={item.id}
                                    initial={{
                                        opacity: 0,
                                        y: 18,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    viewport={{
                                        once: true,
                                        margin: "-60px",
                                    }}
                                    transition={{
                                        duration: 0.55,
                                        ease: [
                                            0.22,
                                            1,
                                            0.36,
                                            1,
                                        ],
                                    }}
                                    className="
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-border
                                        bg-surface
                                    "
                                >
                                    {/* Step header */}

                                    <div
                                        className="
                                            border-b
                                            border-border
                                            px-5
                                            py-4
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-4
                                            "
                                        >
                                            <div>
                                                <p
                                                    className="
                                                        text-[10px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-[0.16em]
                                                        text-accent
                                                    "
                                                >
                                                    {
                                                        item.index
                                                    }{" "}
                                                    / 05
                                                </p>

                                                <h3
                                                    className="
                                                        mt-1
                                                        font-heading
                                                        text-lg
                                                        font-bold
                                                        tracking-tight
                                                        text-foreground
                                                    "
                                                >
                                                    {
                                                        item.title
                                                    }
                                                </h3>
                                            </div>

                                            <span
                                                className="
                                                    text-xs
                                                    text-foreground-muted
                                                "
                                            >
                                                {
                                                    item.index
                                                }
                                            </span>
                                        </div>

                                        <p
                                            className="
                                                mt-2
                                                max-w-md
                                                text-sm
                                                leading-6
                                                text-foreground-secondary
                                            "
                                        >
                                            {
                                                item.description
                                            }
                                        </p>
                                    </div>

                                    {/* Step visual */}

                                    <div className="p-5">
                                        <State />
                                    </div>
                                </motion.article>
                            );
                        }
                    )}
                </div>
            </div>
        </section>
    );
}