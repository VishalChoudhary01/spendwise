"use client";

import {
    AnimatePresence,
    motion,
} from "motion/react";

import { FiPlus } from "react-icons/fi";

const EASE_OUT = [
    0.22,
    1,
    0.36,
    1,
];

export default function FAQItem({
    id,
    question,
    answer,
    open,
    onToggle,
}) {
    const panelId = `faq-panel-${id}`;

    return (
        <div>
            {/* =================================================
                QUESTION
            ================================================= */}

            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={panelId}
                className="
                    group
                    flex
                    min-h-16
                    w-full
                    items-center
                    justify-between
                    gap-5
                    py-5
                    text-left
                    transition-colors
                    duration-150
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-accent/60
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-background
                "
            >
                {/* Question */}

                <span
                    className="
                        font-semibold
                        text-foreground
                        transition-colors
                        duration-150
                        group-hover:text-accent
                    "
                >
                    {question}
                </span>

                {/* =================================================
                    ICON
                ================================================= */}

                <span
                    aria-hidden="true"
                    className="
                        shrink-0
                        text-foreground-muted
                        transition-colors
                        duration-200
                        group-hover:translate-x-0.5
                        group-hover:text-accent
                    "
                >
                    <FiPlus
                        size={18}
                        className="
                            transition-transform
                            duration-200
                        "
                        style={{
                            transform: open
                                ? "rotate(45deg)"
                                : "rotate(0deg)",
                        }}
                    />
                </span>
            </button>

            {/* =================================================
                ANSWER
            ================================================= */}

            <AnimatePresence
                initial={false}
            >
                {open && (
                    <motion.div
                        id={panelId}
                        role="region"
                        initial={{
                            height: 0,
                            opacity: 0,
                        }}
                        animate={{
                            height: "auto",
                            opacity: 1,
                        }}
                        exit={{
                            height: 0,
                            opacity: 0,
                        }}
                        transition={{
                            duration: 0.3,
                            ease: EASE_OUT,
                        }}
                        className="overflow-hidden"
                    >
                        <p
                            className="
                                max-w-[680px]
                                pb-6
                                pr-8
                                text-sm
                                leading-6
                                text-foreground-secondary
                            "
                        >
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}