"use client";

import {
    motion,
    useTransform,
} from "motion/react";

export default function PlanBar({
    progress,
    plan,
    index,
    maxSpent,
}) {
    const start = 0.42 + index * 0.028;

    const width = useTransform(
        progress,
        [start, start + 0.05],
        [
            0,
            (plan.spent / maxSpent) * 100,
        ]
    );

    const widthPercentage = useTransform(
        width,
        (value) => `${value}%`
    );

    return (
        <div className="flex items-center gap-3">
            <span className="w-20 shrink-0 truncate text-xs font-medium text-foreground-secondary">
                {plan.short}
            </span>

            <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-muted">
                <motion.div
                    className="h-full rounded-full bg-accent"
                    style={{
                        width: widthPercentage,
                    }}
                />
            </div>

            <span className="w-16 shrink-0 text-right text-xs font-semibold tabular-nums text-foreground">
                ₹{plan.spent.toLocaleString("en-IN")}
            </span>
        </div>
    );
}