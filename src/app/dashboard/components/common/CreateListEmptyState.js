"use client";

import { motion } from "motion/react";
import {
    FiArrowRight,
    FiPlus,
    FiShoppingBag,
} from "react-icons/fi";

const CreateListEmptyState = ({ onCreate }) => {
    return (
        <motion.button
            type="button"
            onClick={onCreate}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            variants={{
                rest: {
                    y: 0,
                },
                hover: {
                    y: -2,
                },
                tap: {
                    scale: 0.99,
                },
            }}
            transition={{
                y: {
                    duration: 0.2,
                    ease: "easeOut",
                },
                scale: {
                    duration: 0.12,
                    ease: "easeOut",
                },
            }}
            className="group relative flex min-h-[280px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-surface px-6 py-10 text-center hover:border-accent"
        >
            {/* =====================================================
                TOP BAG OPENING
            ====================================================== */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-0"
            >
                {/* Left edge */}
                <motion.span
                    variants={{
                        rest: {
                            width: "38%",
                            opacity: 0.2,
                            x: 0,
                        },
                        hover: {
                            width: "28%",
                            opacity: 0.65,
                            x: -3,
                        },
                    }}
                    transition={{
                        duration: 0.3,
                        ease: "easeOut",
                    }}
                    className="absolute left-0 top-0 h-px bg-accent"
                />

                {/* Right edge */}
                <motion.span
                    variants={{
                        rest: {
                            width: "38%",
                            opacity: 0.2,
                            x: 0,
                        },
                        hover: {
                            width: "28%",
                            opacity: 0.65,
                            x: 3,
                        },
                    }}
                    transition={{
                        duration: 0.3,
                        ease: "easeOut",
                    }}
                    className="absolute right-0 top-0 h-px bg-accent"
                />

                {/* Bag handle */}
                <motion.span
                    variants={{
                        rest: {
                            y: 4,
                            scaleX: 0.7,
                            opacity: 0.25,
                        },
                        hover: {
                            y: -4,
                            scaleX: 1,
                            opacity: 0.9,
                        },
                    }}
                    transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute left-1/2 top-0 h-5 w-28 -translate-x-1/2 rounded-b-full border-b border-l border-r border-accent"
                />
            </div>

            {/* =====================================================
                BAG
            ====================================================== */}
            <motion.div
                variants={{
                    rest: {
                        y: 0,
                        rotate: 0,
                        scale: 1,
                    },
                    hover: {
                        y: -4,
                        rotate: -2,
                        scale: 1.04,
                    },
                }}
                transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="relative flex h-16 w-16 items-center justify-center rounded-lg bg-surface-muted text-accent"
            >
                <motion.div
                    variants={{
                        rest: {
                            y: 0,
                            rotate: 0,
                        },
                        hover: {
                            y: -2,
                            rotate: -3,
                        },
                    }}
                    transition={{
                        duration: 0.25,
                        ease: "easeOut",
                    }}
                >
                    <FiShoppingBag
                        aria-hidden="true"
                        className="h-8 w-8"
                        strokeWidth={1.4}
                    />
                </motion.div>

                {/* Plus */}
                <motion.span
                    variants={{
                        rest: {
                            opacity: 0.9,
                            scale: 1,
                            y: 0,
                        },
                        hover: {
                            opacity: 1,
                            scale: 1.12,
                            y: -2,
                        },
                    }}
                    transition={{
                        duration: 0.2,
                        ease: "easeOut",
                    }}
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-accent"
                >
                    <FiPlus
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                    />
                </motion.span>
            </motion.div>

            {/* =====================================================
                COPY
            ====================================================== */}
            <div className="relative z-10 mt-6">
                <h3 className="text-body-md font-bold text-text-primary">
                    Your next shopping list starts here
                </h3>

                <p className="mx-auto mt-2 max-w-md text-label-sm leading-relaxed text-text-muted">
                    Create a list, add products, and compare prices as you shop.
                </p>
            </div>

            {/* =====================================================
                CTA
            ====================================================== */}
            <motion.span
                variants={{
                    rest: {
                        x: 0,
                    },
                    hover: {
                        x: 3,
                    },
                }}
                transition={{
                    duration: 0.2,
                    ease: "easeOut",
                }}
                className="relative z-10 mt-5 inline-flex items-center gap-2 text-label-sm font-semibold text-accent"
            >
                <span>Create your first list</span>

                <FiArrowRight
                    aria-hidden="true"
                    className="h-4 w-4"
                />
            </motion.span>
        </motion.button>
    );
};

export default CreateListEmptyState;