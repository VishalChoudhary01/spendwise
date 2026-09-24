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

import { TRANSITION } from "@/app/lib/motion/transitions";

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
                    overflow-hidden
                    rounded-md
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
                        min-h-[56px]
                        shrink-0
                        items-center
                        justify-between
                        gap-4
                        border-b
                        border-border
                        px-5
                        sm:px-6
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
                            text-right
                        "
                    >
                        {current.title}
                    </span>
                </div>

                {/* =================================================
                    CARD BODY

                    No fixed 360px height.
                    The visual is intentionally compact now.
                ================================================= */}

                <div
                    className="
                        min-h-[250px]
                        p-5
                        sm:min-h-[270px]
                        sm:p-6
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
                                y: 8,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                y: -6,
                            }}
                            transition={{
                                ...TRANSITION.normal,
                                duration: 0.3,
                            }}
                            className="w-full"
                        >
                            <State />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}