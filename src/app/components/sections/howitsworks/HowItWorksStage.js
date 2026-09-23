"use client";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import ListCreationState from "./states/ListCreationState";
import ProductListState from "./states/ProductListState";
import ComparisonState from "./states/ComparisonState";
import BestDealState from "./states/BestDealState";
import SpendingState from "./states/SpendingState";

const STAGES = [
    {
        index: "01",
        title: "Create a List",
    },
    {
        index: "02",
        title: "Add What You Need",
    },
    {
        index: "03",
        title: "Compare Real Prices",
    },
    {
        index: "04",
        title: "Choose the Better Deal",
    },
    {
        index: "05",
        title: "Track Your Spend",
    },
];

const STATES = [
    ListCreationState,
    ProductListState,
    ComparisonState,
    BestDealState,
    SpendingState,
];

const EASE = [0.22, 1, 0.36, 1];

export default function HowItWorksStage({
    activeStage,
}) {
    const State =
        STATES[activeStage] ??
        ListCreationState;

    const current =
        STAGES[activeStage] ??
        STAGES[0];

    return (
        <div className="w-full max-w-[470px]">
            <div
                className="
                    h-[420px]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border
                    bg-surface
                    shadow-sm
                "
            >
                {/* =================================================
                    CARD HEADER
                ================================================= */}

                <div
                    className="
                        flex
                        h-[60px]
                        shrink-0
                        items-center
                        justify-between
                        border-b
                        border-border
                        px-6
                    "
                >
                    <span
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.18em]
                            text-foreground-muted
                        "
                    >
                        Step {current.index}
                    </span>

                    <span
                        className="
                            text-sm
                            font-semibold
                            text-accent
                        "
                    >
                        {current.title}
                    </span>
                </div>

                {/* =================================================
                    CARD BODY

                    Fixed height prevents different states from
                    changing the card dimensions.
                ================================================= */}

                <div
                    className="
                        h-[360px]
                        p-6
                    "
                >
                    <AnimatePresence
                        mode="wait"
                        initial={false}
                    >
                        <motion.div
                            key={activeStage}
                            initial={{
                                opacity: 0,
                                y: 12,
                                filter:
                                    "blur(4px)",
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                filter:
                                    "blur(0px)",
                            }}
                            exit={{
                                opacity: 0,
                                y: -8,
                                filter:
                                    "blur(3px)",
                            }}
                            transition={{
                                duration: 0.4,
                                ease: EASE,
                            }}
                            className="h-full"
                        >
                            <State />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}