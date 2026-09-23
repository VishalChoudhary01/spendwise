"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { FiSliders, FiZap } from "react-icons/fi";

import ToggleSwitch from "../ui/ToggleSwitch";
import DuplicateShieldIcon from "../ui/DuplicateShieldIcon";

const GlobalDuplicateSafeguard = ({
    checked,
    onChange,
}) => {
    const [isActivating, setIsActivating] = useState(false);

    const handleChange = () => {
        const nextValue = !checked;

        if (nextValue) {
            setIsActivating(true);

            window.setTimeout(() => {
                setIsActivating(false);
            }, 500);
        }

        onChange();
    };

    return (
        <motion.div
            animate={
                isActivating
                    ? {
                        x: [0, -2, 2, -1, 1, 0],
                    }
                    : {
                        x: 0,
                    }
            }
            transition={{
                duration: 0.4,
                ease: "easeOut",
            }}
            className="flex flex-col gap-4 rounded-lg border border-border bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
            {/* Information */}
            <div className="flex items-center gap-3">
                <motion.div
                    animate={
                        isActivating
                            ? {
                                scale: [1, 1.08, 1],
                            }
                            : {
                                scale: 1,
                            }
                    }
                    transition={{
                        duration: 0.35,
                        ease: "easeOut",
                    }}
                    className="shrink-0"
                >
                    <DuplicateShieldIcon
                        size={20}
                        strokeWidth={1.8}
                        active={checked}
                        animateOnClick={false}
                        className={checked ? "text-accent" : "text-text-muted"}
                    />
                </motion.div>

                <div>
                    <div className="flex items-center gap-2">
                        <p className="text-body-sm font-semibold text-text-primary">
                            Global Duplicate Safeguard
                        </p>

                        {checked && (
                            <motion.span
                                initial={{
                                    opacity: 0,
                                    scale: 0.8,
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                }}
                                className="text-label-sm font-semibold text-accent"
                            >
                                Active
                            </motion.span>
                        )}
                    </div>

                    <motion.p
                        key={checked ? "active" : "inactive"}
                        initial={{
                            opacity: 0.5,
                            y: 2,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.2,
                        }}
                        className="mt-1 text-label-sm text-text-muted"
                    >
                        {checked
                            ? "Matching product names are blocked across all lists"
                            : "Prevent matching product names across all shopping lists"}
                    </motion.p>
                </div>
            </div>

            {/* Toggle */}
            <motion.div
                animate={
                    isActivating
                        ? {
                            scale: [1, 1.08, 1],
                        }
                        : {
                            scale: 1,
                        }
                }
                transition={{
                    duration: 0.35,
                    ease: "easeOut",
                }}
                className="shrink-0 self-start sm:self-auto"
            >
                <ToggleSwitch
                    checked={checked}
                    onChange={handleChange}
                    showState
                />
            </motion.div>
        </motion.div>
    );
};

export default GlobalDuplicateSafeguard;