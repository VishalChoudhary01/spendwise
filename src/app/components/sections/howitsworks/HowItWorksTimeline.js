"use client";

import { motion } from "motion/react";
import { FiCheck } from "react-icons/fi";

import { EASE } from "@/app/lib/motion/easings";

export default function HowItWorksTimeline({
    stages,
    activeStage,
    progress,
}) {
    return (
        <div className="relative">
            {/* Base line */}

            <div
                aria-hidden="true"
                className="
                    absolute
                    bottom-5
                    left-[17px]
                    top-1
                    w-px
                    bg-border
                "
            />

            {/* Active progress */}

            <motion.div
                aria-hidden="true"
                style={{
                    height: progress,
                }}
                className="
                    absolute
                    left-[17px]
                    top-1
                    w-px
                    bg-accent
                "
            />

            <div className="space-y-7">
                {stages.map(
                    (item, index) => {
                        const active =
                            index === activeStage;

                        const completed =
                            index < activeStage;

                        return (
                            <TimelineItem
                                key={item.id}
                                item={item}
                                index={index}
                                active={active}
                                completed={
                                    completed
                                }
                            />
                        );
                    }
                )}
            </div>
        </div>
    );
}

function TimelineItem({
    item,
    index,
    active,
    completed,
}) {
    return (
        <div
            className="
                relative
                flex
                items-start
                gap-4
            "
        >
            {/* Marker */}

            <motion.div
                animate={{
                    scale: active ? 1.08 : 1,
                }}
                transition={{
                    duration: 0.3,
                    ease: EASE.standard,
                }}
                className={[
                    "relative z-10",
                    "flex h-[34px] w-[34px]",
                    "shrink-0 items-center justify-center",
                    "rounded-full border",
                    "text-xs font-bold",
                    active
                        ? "border-accent bg-accent text-white"
                        : completed
                            ? "border-accent/40 bg-accent/10 text-accent"
                            : "border-border bg-surface text-foreground-muted",
                ].join(" ")}
            >
                {completed ? (
                    <FiCheck size={14} />
                ) : (
                    index + 1
                )}
            </motion.div>

            {/* Content */}

            <div className="pt-1">
                <p
                    className={[
                        "text-[10px]",
                        "font-semibold uppercase",
                        "tracking-[0.15em]",
                        active || completed
                            ? "text-accent"
                            : "text-foreground-muted",
                    ].join(" ")}
                >
                    {item.index}
                </p>

                <p
                    className={[
                        "mt-1 text-sm font-semibold",
                        active
                            ? "text-foreground"
                            : completed
                                ? "text-foreground-secondary"
                                : "text-foreground-muted",
                    ].join(" ")}
                >
                    {item.title}
                </p>
            </div>
        </div>
    );
}