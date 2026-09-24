import { motion } from "motion/react";

import SourceIcon from "@/app/components/common/SourceIcon/SourceIcon";

import { sources } from "@/app/constants/productLandingCard"
import { TRANSITION } from "@/app/lib/motion/transitions"


const rowVariants = {
    hidden: {
        opacity: 0,
        x: 20,
    },

    show: {
        opacity: 1,
        x: 0,
        transition: TRANSITION.normal,
    },
};

const listVariants = {
    hidden: {},

    show: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

export default function CompareState() {
    return (
        <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground-muted">
                {sources.length} sources checked
            </p>

            <motion.div
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="space-y-2"
            >
                {sources.map((source) => (
                    <motion.div
                        key={source.id}
                        variants={rowVariants}
                        className="flex items-center justify-between rounded-sm border border-border/70 bg-surface-muted px-3.5 py-2.5"
                    >
                        <span className="flex items-center gap-2.5">
                            <SourceIcon
                                source={source}
                                className="text-lg text-foreground-secondary"
                            />

                            <span className="text-sm font-medium text-foreground-secondary">
                                {source.name}
                            </span>
                        </span>

                        <span className="text-sm font-semibold tabular-nums text-foreground">
                            ₹{source.price.toLocaleString()}
                        </span>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
