"use client";

import {
    motion,
    useTransform,
} from "motion/react";

const purchasedTotal = 44;
const itemsTotal = 79;

const completionPercent = Math.round(
    (purchasedTotal / itemsTotal) * 100
);

export default function CompletionRing() {
    /*
     * This card is now rendered in its final state on
     * mobile/reduced-motion exactly as before.
     *
     * Desktop animation remains controlled by the
     * parent through CSS/layout visibility.
     */

    const radius = 50;

    const circumference =
        2 * Math.PI * radius;

    return (
        <div>
            <h3 className="text-sm font-semibold text-foreground">
                Completion
            </h3>

            <div className="relative mx-auto mt-4 h-32 w-32">
                <svg
                    viewBox="0 0 120 120"
                    className="h-full w-full -rotate-90"
                    aria-hidden="true"
                >
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        strokeWidth="9"
                        className="stroke-border-strong"
                    />

                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={
                            circumference -
                            (circumference *
                                completionPercent) /
                            100
                        }
                        className="stroke-success"
                    />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-heading text-2xl font-bold tabular-nums text-foreground">
                        {completionPercent}%
                    </span>
                </div>
            </div>

            <p className="mt-3 text-center text-xs tabular-nums text-foreground-muted">
                {purchasedTotal} of {itemsTotal} items
            </p>
        </div>
    );
}