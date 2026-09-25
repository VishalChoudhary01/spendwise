"use client";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    FiCheck,
    FiCircle,
    FiShoppingBag,
    FiStar,
} from "react-icons/fi";

import SourceIcon from "@/app/components/common/SourceIcon/SourceIcon";

import { TRANSITION } from "@/app/lib/motion/transitions";

const LIST_ITEMS = [
    {
        id: "oats",
        name: "Oats — 1kg",
        est: 180,
        purchased: true,
    },
    {
        id: "almonds",
        name: "Almonds — 250g",
        est: 420,
        purchased: true,
    },
    {
        id: "bananas",
        name: "Bananas (6)",
        est: 90,
        purchased: true,
    },
    {
        id: "coffee",
        name: "Cold coffee — 500g",
        est: 360,
        purchased: false,
    },
    {
        id: "protein",
        name: "Protein mix — 400g",
        est: 760,
        purchased: false,
    },
];

const COFFEE_SOURCES = [
    {
        id: "amazon",
        name: "Amazon",
        price: 459,
    },
    {
        id: "flipkart",
        name: "Flipkart",
        price: 427,
    },
    {
        id: "supported",
        name: "Supported store",
        price: 410,
        winner: true,
    },
];

const LIST_TOTAL = LIST_ITEMS.reduce(
    (sum, item) => sum + item.est,
    0
);

const PURCHASED_COUNT = LIST_ITEMS.filter(
    (item) => item.purchased
).length;

const REMAINING_TOTAL = LIST_ITEMS.reduce(
    (sum, item) =>
        item.purchased
            ? sum
            : sum + item.est,
    0
);

const COFFEE_BEST = 410;

const COFFEE_SAVINGS = 459 - COFFEE_BEST;

const MONTHLY_SAVINGS = 430;

export default function IntegratedUI({
    stage = 0,
    isStatic = false,
}) {
    const activeStage = isStatic ? 3 : stage;

    const coffeeFocused =
        isStatic || stage >= 1;

    return (
        <div
            className="
                overflow-hidden
                rounded-lg
                border
                border-border
                bg-surface
            "
        >
            {/* HEADER */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-border/70
                    px-5
                    py-3.5
                "
            >
                <div className="flex items-center gap-2.5">
                    <span
                        className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-sm
                            bg-accent/10
                            text-accent
                        "
                    >
                        <FiShoppingBag size={14} />
                    </span>

                    <div>
                        <p
                            className="
                                text-sm
                                font-semibold
                                text-foreground
                            "
                        >
                            Monthly Grocery
                        </p>

                        <p
                            className="
                                text-[11px]
                                text-foreground-muted
                            "
                        >
                            {LIST_ITEMS.length} items · ₹
                            {LIST_TOTAL.toLocaleString()} est.
                        </p>
                    </div>
                </div>

                <span
                    className="
                        rounded-full
                        bg-successSoft
                        px-2.5
                        py-1
                        text-[11px]
                        font-semibold
                        text-success
                    "
                >
                    {PURCHASED_COUNT} of {LIST_ITEMS.length}
                </span>
            </div>

            {/* LIST */}

            <div className="space-y-1.5 px-5 py-3.5">
                {LIST_ITEMS.map((item) => (
                    <div
                        key={item.id}
                        className={`
                            flex
                            items-center
                            justify-between
                            rounded-sm
                            px-2.5
                            py-1.5
                            transition-all
                            duration-200
                            ${coffeeFocused &&
                                item.id === "coffee"
                                ? "bg-accent/8 ring-1 ring-accent/15"
                                : ""
                            }
                        `}
                    >
                        <span className="flex items-center gap-2.5">
                            {item.purchased ? (
                                <FiCheck
                                    size={14}
                                    className="text-success"
                                />
                            ) : (
                                <FiCircle
                                    size={14}
                                    className="text-foreground-muted/50"
                                />
                            )}

                            <span
                                className={`
                                    text-xs
                                    font-medium
                                    ${item.purchased
                                        ? "text-foreground-muted line-through decoration-foreground-muted/40"
                                        : "text-foreground"
                                    }
                                `}
                            >
                                {item.name}
                            </span>
                        </span>

                        <span
                            className="
                                text-xs
                                font-semibold
                                tabular-nums
                                text-foreground-secondary
                            "
                        >
                            ₹{item.est.toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>

            {/* STAGE */}

            <div
                className="
                    border-t
                    border-border/70
                    bg-surface-muted/50
                    px-5
                    py-4
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
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -6,
                        }}
                        transition={
                            TRANSITION.normal
                        }
                    >
                        {activeStage === 0 && (
                            <ListStage />
                        )}

                        {activeStage === 1 && (
                            <CompareStage />
                        )}

                        {activeStage === 2 && (
                            <SaveStage />
                        )}

                        {activeStage === 3 && (
                            <InsightStage />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

/* ================================================================
   LIST STAGE
================================================================ */

function ListStage() {
    const progress = Math.round(
        (PURCHASED_COUNT / LIST_ITEMS.length) *
        100
    );

    return (
        <div>
            <div className="flex items-center justify-between">
                <p
                    className="
                        text-xs
                        font-semibold
                        text-foreground
                    "
                >
                    Planned spend
                </p>

                <p
                    className="
                        text-xs
                        font-semibold
                        tabular-nums
                        text-foreground
                    "
                >
                    ₹{LIST_TOTAL.toLocaleString()}
                </p>
            </div>

            <div
                className="
                    mt-2.5
                    h-1.5
                    overflow-hidden
                    rounded-full
                    bg-surface-muted
                "
            >
                <div
                    className="
                        h-full
                        rounded-full
                        bg-accent
                        transition-[width]
                        duration-500
                    "
                    style={{
                        width: `${progress}%`,
                    }}
                />
            </div>

            <p
                className="
                    mt-2
                    text-xs
                    text-foreground-muted
                "
            >
                {PURCHASED_COUNT} of {LIST_ITEMS.length}{" "}
                purchased · ₹
                {REMAINING_TOTAL.toLocaleString()} left
                to spend
            </p>
        </div>
    );
}

/* ================================================================
   COMPARE STAGE
================================================================ */

function CompareStage() {
    return (
        <div>
            <p
                className="
                    text-xs
                    font-semibold
                    text-foreground
                "
            >
                Cold coffee — 500g
            </p>

            <div className="mt-2 space-y-1.5">
                {COFFEE_SOURCES.map(
                    (source) => {
                        return (
                            <div
                                key={source.id}
                                className={`
                                    flex
                                    items-center
                                    justify-between
                                    rounded-sm
                                    border
                                    px-3
                                    py-2
                                    ${source.winner
                                        ? "border-accent/25 bg-accent/5"
                                        : "border-border/70 bg-surface"
                                    }
                                `}
                            >
                                <span
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-xs
                                        font-medium
                                        text-foreground-secondary
                                    "
                                >
                                    <SourceIcon
                                        source={source}
                                        className="
                                            text-sm
                                            text-foreground-muted
                                        "
                                    />

                                    {source.name}
                                </span>

                                <span
                                    className={`
                                        flex
                                        items-center
                                        gap-1
                                        text-xs
                                        font-semibold
                                        tabular-nums
                                        ${source.winner
                                            ? "text-success"
                                            : "text-foreground"
                                        }
                                    `}
                                >
                                    {source.winner && (
                                        <FiCheck
                                            size={12}
                                        />
                                    )}

                                    ₹
                                    {source.price.toLocaleString()}
                                </span>
                            </div>
                        );
                    }
                )}
            </div>
        </div>
    );
}

/* ================================================================
   SAVE STAGE
================================================================ */

function SaveStage() {
    return (
        <div
            className="
                flex
                items-center
                justify-between
                rounded-md
                border
                border-successBorder
                bg-successSoft
                px-3.5
                py-3
            "
        >
            <div>
                <p
                    className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-success
                    "
                >
                    Best available option
                </p>

                <p
                    className="
                        mt-0.5
                        font-heading
                        text-xl
                        font-bold
                        tabular-nums
                        text-success
                    "
                >
                    ₹{COFFEE_BEST.toLocaleString()}
                </p>
            </div>

            <div className="text-right">
                <p
                    className="
                        text-xs
                        font-medium
                        text-foreground-secondary
                    "
                >
                    You save
                </p>

                <p
                    className="
                        mt-0.5
                        text-sm
                        font-bold
                        tabular-nums
                        text-success
                    "
                >
                    ₹{COFFEE_SAVINGS.toLocaleString()}
                </p>
            </div>
        </div>
    );
}

/* ================================================================
   INSIGHT STAGE
================================================================ */

function InsightStage() {
    return (
        <div className="flex items-start gap-2.5">
            <span
                className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    bg-amber-400/10
                    text-amber-400
                "
            >
                <FiStar
                    size={15}
                    className="fill-amber-400"
                />
            </span>

            <div>
                <p
                    className="
                        text-sm
                        font-semibold
                        text-foreground
                    "
                >
                    3 better prices found
                </p>

                <p
                    className="
                        mt-0.5
                        text-xs
                        leading-5
                        text-foreground-muted
                    "
                >
                    You&rsquo;ve saved ₹
                    {MONTHLY_SAVINGS.toLocaleString()}{" "}
                    across your lists this month.
                </p>
            </div>
        </div>
    );
}