"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    motion,
    AnimatePresence,
} from "motion/react";

import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import { REDUCED_MOTION_QUERY } from "@/app/constants/mediaQueries";

import { getListVisual } from "@/app/constants/listVisuals";

import Image from "next/image";
import { FiStar } from "react-icons/fi";

import ProgressIndicator from "@/app/components/common/ProgressIndicator";

/* ────────────────────────────────────────────────────────────── */
/* SELECTOR                                                       */
/* ────────────────────────────────────────────────────────────── */

function CategorySelector({ lists, activeIndex, onSelect }) {
    const scrollRef = useRef(null);

    useEffect(() => {
        const el = scrollRef.current?.children[activeIndex];
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
            });
        }
    }, [activeIndex]);

    return (
        <div
            ref={scrollRef}
            className="
                no-scrollbar
                flex
                gap-2
                overflow-x-auto
                px-6
                pb-1
                snap-x
                snap-mandatory
            "
        >
            {lists.map((list, i) => {
                const isActive = i === activeIndex;

                return (
                    <button
                        key={list.id}
                        onClick={() => onSelect(i)}
                        className={`
                            shrink-0
                            snap-center
                            rounded-full
                            border
                            px-4
                            py-1.5
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            transition-all
                            duration-300
                            ease-[cubic-bezier(0.22,1,0.36,1)]
                            ${
                                isActive
                                    ? "border-accent/40 bg-accent/10 text-accent"
                                    : "border-border/50 bg-surface/60 text-foreground-muted hover:border-border/80 hover:text-foreground-secondary"
                            }
                        `}
                    >
                        {list.name}
                    </button>
                );
            })}
        </div>
    );
}

/* ────────────────────────────────────────────────────────────── */
/* SINGLE CARD                                                    */
/* ────────────────────────────────────────────────────────────── */

function SingleCard({ list }) {
    const pending = Math.max(list.items - list.purchased, 0);
    const pct =
        list.items > 0
            ? Math.round((list.purchased / list.items) * 100)
            : 0;

    const visual = getListVisual(list.category);

    return (
        <article
            className="
                overflow-hidden
                rounded-[18px]
                border
                border-border/60
                bg-surface
                shadow-[0_12px_40px_rgba(15,43,37,0.06)]
                dark:border-white/[0.07]
                dark:shadow-[0_16px_48px_rgba(0,0,0,0.22)]
            "
        >
            {/* ── IMAGE ──────────────────────────────────────── */}
            <div
                className={`relative h-[140px] overflow-hidden ${visual.stage}`}
            >
                <div
                    aria-hidden="true"
                    className={`
                        pointer-events-none
                        absolute
                        left-1/2
                        top-1/2
                        z-0
                        h-24
                        w-48
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        blur-[46px]
                        ${visual.glow}
                    `}
                />

                <div className="absolute inset-0 z-10">
                    <Image
                        src={list.image}
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover"
                    />
                </div>

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        z-15
                        bg-gradient-to-b
                        from-black/20
                        via-transparent
                        to-black/[0.02]
                    "
                />

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        inset-x-0
                        top-0
                        z-15
                        h-14
                        bg-gradient-to-b
                        from-black/25
                        to-transparent
                    "
                />

                <div className="absolute left-4 top-4 z-30">
                    <span
                        className="
                            inline-block
                            rounded-full
                            bg-black/30
                            px-3
                            py-1
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.18em]
                            text-white/90
                            backdrop-blur-sm
                            ring-1
                            ring-white/[0.08]
                        "
                    >
                        {visual.label}
                    </span>
                </div>
            </div>

            {/* ── CONTENT ──────────────────────────────────── */}
            <div className="px-5 pb-5 pt-4">
                <div>
                    <h3
                        className="
                            font-heading
                            text-[19px]
                            font-bold
                            leading-tight
                            tracking-[-0.026em]
                            text-foreground
                        "
                    >
                        {list.name}
                    </h3>
                    <p
                        className="
                            mt-0.5
                            text-[13px]
                            text-foreground-muted
                        "
                    >
                        {list.items} items
                    </p>
                </div>

                <div className="mt-3.5">
                    <p
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.17em]
                            text-foreground-muted
                        "
                    >
                        Planned spend
                    </p>
                    <p
                        className="
                            mt-1
                            font-heading
                            text-[26px]
                            font-bold
                            leading-none
                            tracking-[-0.04em]
                            tabular-nums
                            text-foreground
                        "
                    >
                        ₹{list.total.toLocaleString("en-IN")}
                    </p>
                </div>

                <div className="mt-4">
                    <div className="flex items-baseline justify-between">
                        <span
                            className="
                                text-[13px]
                                font-medium
                                text-foreground
                            "
                        >
                            {list.purchased} of {list.items} purchased
                        </span>
                        <span
                            className="
                                text-[13px]
                                font-semibold
                                tabular-nums
                                text-foreground-muted
                            "
                        >
                            {pct}%
                        </span>
                    </div>

                    <div
                        className="
                            mt-2
                            h-[6px]
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
                                duration-600
                                ease-[cubic-bezier(0.22,1,0.36,1)]
                            "
                            style={{ width: `${pct}%` }}
                        />
                    </div>

                    <div
                        className="
                            mt-2
                            flex
                            items-center
                            gap-4
                            text-[11px]
                            text-foreground-muted
                        "
                    >
                        <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-success" />
                            {list.purchased} purchased
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-foreground-muted/35" />
                            {pending} pending
                        </span>
                    </div>
                </div>

                {list.insight && (
                    <div
                        className="
                            mt-3.5
                            border-t
                            border-border/50
                            pt-3
                        "
                    >
                        <div className="flex items-center gap-2">
                            <span
                                className="
                                    flex
                                    h-5
                                    w-5
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-md
                                    bg-amber-400/10
                                "
                            >
                                <FiStar
                                    size={10}
                                    className="fill-amber-400 text-amber-400"
                                    aria-hidden="true"
                                />
                            </span>
                            <div className="min-w-0">
                                <span
                                    className="
                                        mr-1.5
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.14em]
                                        text-amber-600/70
                                    "
                                >
                                    Smart
                                </span>
                                <span
                                    className="
                                        text-[13px]
                                        font-medium
                                        text-foreground
                                    "
                                >
                                    {list.insight}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}

/* ────────────────────────────────────────────────────────────── */
/* MAIN CAROUSEL                                                  */
/* ────────────────────────────────────────────────────────────── */

export default function MobileShoppingListCarousel({ lists }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

    const paginate = useCallback(
        (newDirection) => {
            const next = activeIndex + newDirection;
            if (next < 0 || next >= lists.length) return;
            setDirection(newDirection);
            setActiveIndex(next);
        },
        [activeIndex, lists.length]
    );

    const goTo = useCallback(
        (index) => {
            if (index === activeIndex) return;
            setDirection(index > activeIndex ? 1 : -1);
            setActiveIndex(index);
        },
        [activeIndex]
    );

    /* ── Swipe / drag on the card itself ──────────────────────── */

    const handleDragEnd = (_, info) => {
        const swipe = info.offset.x;
        const velocity = info.velocity.x;

        if (swipe < -50 || velocity < -300) {
            paginate(1);
        } else if (swipe > 50 || velocity > 300) {
            paginate(-1);
        }
    };

    /* ── Animation variants ───────────────────────────────────── */

    const cardVariants = {
        enter: (dir) => ({
            x: dir > 0 ? 60 : -60,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir) => ({
            x: dir > 0 ? -60 : 60,
            opacity: 0,
        }),
    };

    const reducedCardVariants = {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const imageVariants = {
        enter: (dir) => ({
            x: dir > 0 ? "6%" : "-6%",
            scale: 1.04,
        }),
        center: {
            x: 0,
            scale: 1,
        },
        exit: (dir) => ({
            x: dir > 0 ? "-6%" : "6%",
            scale: 1.04,
        }),
    };

    const reducedImageVariants = {
        enter: { scale: 1.01 },
        center: { scale: 1 },
        exit: { scale: 1.01 },
    };

    return (
        <div className="flex w-full flex-col items-center">
            {/* Selector */}
            <div className="mb-5 w-full">
                <CategorySelector
                    lists={lists}
                    activeIndex={activeIndex}
                    onSelect={goTo}
                />
            </div>

            {/* Card viewport — relative container for absolute stacking */}
            <div className="relative w-full px-4">
                <AnimatePresence
                    initial={false}
                    custom={direction}
                    mode="wait"
                >
                    <motion.div
                        key={lists[activeIndex].id}
                        custom={direction}
                        variants={
                            reducedMotion
                                ? reducedCardVariants
                                : cardVariants
                        }
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: {
                                type: "tween",
                                duration: 0.32,
                                ease: [0.22, 1, 0.36, 1],
                            },
                            opacity: {
                                duration: 0.28,
                                ease: "easeOut",
                            },
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.18}
                        onDragEnd={handleDragEnd}
                        className="w-full cursor-grab active:cursor-grabbing"
                    >
                        {/* Image parallax layer */}
                        <motion.div
                            custom={direction}
                            variants={
                                reducedMotion
                                    ? reducedImageVariants
                                    : imageVariants
                            }
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: {
                                    type: "tween",
                                    duration: 0.36,
                                    ease: [0.22, 1, 0.36, 1],
                                },
                                scale: {
                                    duration: 0.38,
                                    ease: [0.22, 1, 0.36, 1],
                                },
                            }}
                            className="w-full"
                        >
                            <SingleCard list={lists[activeIndex]} />
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Pagination */}
            <div className="mt-5">
                <ProgressIndicator
                    current={activeIndex}
                    total={lists.length}
                    label="Shopping lists progress"
                />
            </div>

            {/* Swipe hint */}
            <p
                className="
                    mt-3
                    text-[11px]
                    text-foreground-muted/60
                "
            >
                Swipe to explore
            </p>
        </div>
    );
}
