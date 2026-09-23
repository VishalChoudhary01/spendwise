"use client";

import { motion } from "motion/react";
import {
    FiArrowRight,
    FiPlus,
    FiShoppingBag,
} from "react-icons/fi";

const CreateListTile = ({ onCreate }) => {
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
                    y: -3,
                },
                tap: {
                    scale: 0.985,
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
            className="group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-surface-muted/30 p-6 text-center hover:border-accent hover:bg-surface-muted"
        >
            {/* Top bag opening */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-0"
            >
                {/* Left edge */}
                <motion.span
                    variants={{
                        rest: {
                            width: "38%",
                            opacity: 0.15,
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
                            opacity: 0.15,
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
                            opacity: 0.2,
                        },
                        hover: {
                            y: -3,
                            scaleX: 1,
                            opacity: 0.85,
                        },
                    }}
                    transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute left-1/2 top-0 h-5 w-28 -translate-x-1/2 rounded-b-full border-b border-l border-r border-accent"
                />
            </div>

            {/* Bag */}
            <motion.div
                variants={{
                    rest: {
                        y: 0,
                        rotate: 0,
                        scale: 1,
                    },
                    hover: {
                        y: -3,
                        rotate: -3,
                        scale: 1.05,
                    },
                }}
                transition={{
                    duration: 0.28,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="relative flex h-11 w-11 items-center justify-center rounded-md bg-surface text-accent"
            >
                <FiShoppingBag
                    aria-hidden="true"
                    className="h-5 w-5"
                    strokeWidth={1.5}
                />

                {/* Plus badge */}
                <motion.span
                    variants={{
                        rest: {
                            scale: 1,
                            rotate: 0,
                        },
                        hover: {
                            scale: 1.12,
                            rotate: 90,
                        },
                    }}
                    transition={{
                        duration: 0.25,
                        ease: "easeOut",
                    }}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-surface text-accent"
                >
                    <FiPlus
                        aria-hidden="true"
                        className="h-3 w-3"
                    />
                </motion.span>
            </motion.div>

            {/* Text */}
            <div className="relative z-10 mt-5">
                <motion.span
                    variants={{
                        rest: {
                            y: 0,
                        },
                        hover: {
                            y: -1,
                        },
                    }}
                    className="block text-body-sm font-semibold text-text-primary group-hover:text-accent"
                >
                    Create a new list
                </motion.span>

                <span className="mt-1.5 block text-label-sm text-text-muted">
                    Start another shopping journey
                </span>
            </div>

            {/* Action */}
            <motion.span
                variants={{
                    rest: {
                        opacity: 0.65,
                        x: 0,
                    },
                    hover: {
                        opacity: 1,
                        x: 3,
                    },
                }}
                transition={{
                    duration: 0.2,
                    ease: "easeOut",
                }}
                className="relative z-10 mt-4 flex items-center gap-1.5 text-label-sm font-semibold text-accent"
            >
                <span>Create list</span>

                <FiArrowRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5"
                />
            </motion.span>
        </motion.button>
    );
};

export default CreateListTile;