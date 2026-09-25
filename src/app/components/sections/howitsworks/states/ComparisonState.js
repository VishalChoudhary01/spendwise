"use client";

import SourceIcon from "@/app/components/common/SourceIcon/SourceIcon";

const sources = [
    {
        id: "amazon",
        name: "Amazon",
        price: 129999,
        accent: "text-[#FF9900]",
    },
    {
        id: "flipkart",
        name: "Flipkart",
        price: 127499,
        accent: "text-[#2874F0]",
    },
    {
        id: "supported",
        name: "Supported source",
        price: 124999,
        accent: "text-accent",
    },
];

export default function ComparisonState() {
    return (
        <div>
            <p className="text-sm font-semibold text-foreground">
                MacBook Pro
            </p>

            <div className="mt-3 space-y-1.5">
                {sources.map((source) => {
                    return (
                        <div
                            key={source.id}
                            className="
                                flex
                                items-center
                                justify-between
                                rounded-md
                                border
                                border-border/70
                                bg-surface-muted
                                px-3.5
                                py-2
                            "
                        >
                            <span
                                className="
                                    flex
                                    items-center
                                    gap-2.5
                                    text-xs
                                    font-medium
                                    text-foreground-secondary
                                "
                            >
                                <SourceIcon
                                    source={source}
                                    className={`
                                        text-base
                                        ${source.accent}
                                    `}
                                />

                                {source.name}
                            </span>

                            <span
                                className="
                                    text-xs
                                    font-semibold
                                    tabular-nums
                                    text-foreground
                                "
                            >
                                ₹
                                {source.price.toLocaleString(
                                    "en-IN"
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>

            <p
                className="
                    mt-3
                    text-xs
                    text-foreground-muted
                "
            >
                3 sources compared
            </p>
        </div>
    );
}