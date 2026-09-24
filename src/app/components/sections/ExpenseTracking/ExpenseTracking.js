"use client";

import { useRef, useState } from "react";
import {
    motion,
    useMotionValue,
    useMotionValueEvent,
    useScroll,
    useTransform,
} from "motion/react";
import { FiStar } from "react-icons/fi";

import Eyebrow from "../../common/Eyebrow";
import SectionHeading from "../../common/SectionHeading";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";

import ApexLineChart from "./ApexLineChart";
import CompletionRing from "./CompletionRing";
import SpendByPlan from "./SpendByPlan";

const plans = [
    {
        id: "grocery",
        name: "Monthly Grocery",
        short: "Grocery",
        planned: 4520,
        spent: 3950,
    },
    {
        id: "office",
        name: "Home Office Setup",
        short: "Office",
        planned: 32450,
        spent: 12200,
    },
    {
        id: "birthday",
        name: "Birthday Shopping",
        short: "Birthday",
        planned: 8750,
        spent: 5250,
    },
    {
        id: "travel",
        name: "Travel Essentials",
        short: "Travel",
        planned: 5500,
        spent: 2750,
    },
    {
        id: "wishlist",
        name: "Wishlist",
        short: "Wishlist",
        planned: 12500,
        spent: 3100,
    },
];

const spentTotal = plans.reduce(
    (sum, plan) => sum + plan.spent,
    0
);

const plannedTotal = plans.reduce(
    (sum, plan) => sum + plan.planned,
    0
);

const savingsTotal = 4300;
const purchasedTotal = 44;
const itemsTotal = 79;

export default function ExpenseTracking() {
    const isMobile = useMediaQuery("(max-width: 1023px)");

    const reducedMotion = useMediaQuery(
        "(prefers-reduced-motion: reduce)"
    );

    const isStatic = isMobile || reducedMotion;

    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end 100%"],
    });

    const staticProgress = useMotionValue(1);

    const activeProgress = isStatic
        ? staticProgress
        : scrollYProgress;

    const [chartRevealed, setChartRevealed] =
        useState(false);

    useMotionValueEvent(
        activeProgress,
        "change",
        (value) => {
            if (value >= 0.12) {
                setChartRevealed(true);
            }
        }
    );

    const showChart =
        chartRevealed || isStatic;

    /* ---------------- HEADER ---------------- */

    const headerOpacity = useTransform(
        activeProgress,
        [0, 0.08],
        [0, 1]
    );

    const headerY = useTransform(
        activeProgress,
        [0, 0.08],
        [16, 0]
    );

    /* ---------------- SPEND ---------------- */

    const primaryOpacity = useTransform(
        activeProgress,
        [0.04, 0.12],
        [0, 1]
    );

    const spentCount = useTransform(
        activeProgress,
        [0.04, 0.16],
        [0, spentTotal]
    );

    const spentDisplay = useTransform(
        spentCount,
        (value) =>
            `₹${Math.round(value).toLocaleString("en-IN")}`
    );

    /* ---------------- CHART ---------------- */

    const chartOpacity = useTransform(
        activeProgress,
        [0.12, 0.18],
        [0, 1]
    );

    const chartScale = useTransform(
        activeProgress,
        [0.12, 0.18],
        [0.97, 1]
    );

    const chartReveal = useTransform(
        activeProgress,
        [0.16, 0.42],
        [0, 100]
    );

    const chartClip = useTransform(
        chartReveal,
        (value) =>
            `inset(0 ${100 - value}% 0 0)`
    );

    /* ---------------- COMPLETION ---------------- */

    const ringOpacity = useTransform(
        activeProgress,
        [0.24, 0.3],
        [0, 1]
    );

    const ringScale = useTransform(
        activeProgress,
        [0.24, 0.3],
        [0.97, 1]
    );

    /* ---------------- PLAN BARS ---------------- */

    const barsOpacity = useTransform(
        activeProgress,
        [0.4, 0.46],
        [0, 1]
    );

    const barsScale = useTransform(
        activeProgress,
        [0.4, 0.46],
        [0.97, 1]
    );

    /* ---------------- INSIGHT ---------------- */

    const insightOpacity = useTransform(
        activeProgress,
        [0.56, 0.64],
        [0, 1]
    );

    const insightY = useTransform(
        activeProgress,
        [0.56, 0.64],
        [4, 0]
    );

    return (
        <section
            ref={sectionRef}
            id="expense-tracking"
            className={`relative w-full bg-background ${isStatic ? "" : "lg:h-[500vh]"
                }`}
        >
            <div
                className={`relative overflow-hidden ${isStatic
                        ? ""
                        : "lg:sticky lg:top-0 lg:h-screen"
                    }`}
            >
                {/* Ambient background */}

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                >
                    <div
                        className="
                            absolute
                            right-1/4
                            top-1/3
                            h-96
                            w-96
                            rounded-full
                            bg-brandTeal/6
                            blur-[130px]
                            dark:bg-brandTeal/8
                        "
                    />
                </div>

                {/* Main content */}

                <div
                    className={`
                        relative
                        z-10
                        mx-auto
                        grid
                        w-full
                        max-w-7xl
                        items-center
                        gap-10
                        px-5
                        sm:px-6
                        ${isStatic
                            ? "py-16 sm:py-28"
                            : "pt-20 lg:h-full lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:pt-24"
                        }
                    `}
                >
                    {/* LEFT */}

                    <div className="min-w-0">
                        <motion.div
                            style={{
                                opacity: headerOpacity,
                                y: headerY,
                            }}
                        >
                            <Eyebrow label="Smart Analytics" />

                            <div className="mt-4">
                                <SectionHeading
                                    align="left"
                                    size="md"
                                    animate={false}
                                    className="max-w-xl"
                                    headingClassName="max-w-xl"
                                    descriptionClassName="max-w-lg"
                                    description="
                                        Track what you've spent, what you've
                                        saved, and what's still ahead —
                                        without turning shopping into
                                        spreadsheets.
                                    "
                                >
                                    Know Where Your{" "}
                                    <span className="text-accent">
                                        Money Goes.
                                    </span>
                                </SectionHeading>
                            </div>
                        </motion.div>

                        {/* Spend statement */}

                        <motion.div
                            style={{
                                opacity: primaryOpacity,
                            }}
                            className="mt-8"
                        >
                            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground-muted">
                                Spent so far
                            </p>

                            <p className="mt-1 font-heading text-5xl font-bold tabular-nums tracking-tight text-foreground sm:text-6xl">
                                <motion.span>
                                    {spentDisplay}
                                </motion.span>
                            </p>

                            <div className="mt-4 flex max-w-lg flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-foreground-muted">
                                <span>
                                    ₹
                                    {plannedTotal.toLocaleString(
                                        "en-IN"
                                    )}{" "}
                                    planned
                                </span>

                                <span aria-hidden="true">
                                    ·
                                </span>

                                <span>
                                    ₹
                                    {savingsTotal.toLocaleString(
                                        "en-IN"
                                    )}{" "}
                                    saved
                                </span>

                                <span aria-hidden="true">
                                    ·
                                </span>

                                <span>
                                    {purchasedTotal} purchased ·{" "}
                                    {itemsTotal - purchasedTotal}{" "}
                                    left
                                </span>
                            </div>
                        </motion.div>

                        {/* Insight */}

                        <motion.div
                            style={{
                                opacity: insightOpacity,
                                y: insightY,
                            }}
                            className="
                                mt-8
                                flex
                                items-start
                                gap-2
                                text-sm
                                text-foreground-secondary
                            "
                        >
                            <FiStar
                                size={13}
                                className="
                                    mt-0.5
                                    shrink-0
                                    fill-amber-400
                                    text-amber-400
                                "
                            />

                            <span>
                                You saved ₹
                                {savingsTotal.toLocaleString(
                                    "en-IN"
                                )}{" "}
                                with better available prices.
                            </span>
                        </motion.div>
                    </div>

                    {/* RIGHT — ANALYTICS */}

                    <div className="grid min-w-0 gap-4">
                        {/* Planned vs actual */}

                        <motion.div
                            style={{
                                opacity: chartOpacity,
                                scale: chartScale,
                            }}
                            className="
                                min-w-0
                                rounded-xl
                                border
                                border-border
                                bg-surface
                                p-4
                                sm:p-5
                            "
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <h3 className="text-sm font-semibold text-foreground">
                                    Planned vs actual
                                </h3>

                                <div className="flex items-center gap-3 text-[11px] text-foreground-muted sm:gap-4 sm:text-xs">
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-0.5 w-4 rounded-full bg-accent" />
                                        Actual
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <span className="w-4 border-t-2 border-dashed border-foreground-muted/70" />
                                        Planned
                                    </span>
                                </div>
                            </div>

                            <div className="mt-3 min-w-0 overflow-hidden">
                                {showChart && (
                                    <motion.div
                                        style={{
                                            clipPath: chartClip,
                                        }}
                                        className="min-w-0"
                                    >
                                        <ApexLineChart
                                            plans={plans}
                                        />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>

                        {/* Completion + Spend by plan */}

                        <div className="grid gap-4 sm:grid-cols-2">
                            <motion.div
                                style={{
                                    opacity: ringOpacity,
                                    scale: ringScale,
                                }}
                                className="
                                    rounded-xl
                                    border
                                    border-border
                                    bg-surface
                                    p-5
                                "
                            >
                                <CompletionRing />
                            </motion.div>

                            <motion.div
                                style={{
                                    opacity: barsOpacity,
                                    scale: barsScale,
                                }}
                                className="
                                    rounded-xl
                                    border
                                    border-border
                                    bg-surface
                                    p-5
                                "
                            >
                                <SpendByPlan
                                    plans={plans}
                                    progress={activeProgress}
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}