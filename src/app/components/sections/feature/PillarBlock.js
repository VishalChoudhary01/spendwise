"use client";

export default function PillarBlock({
    pillar,
    active = false,
}) {
    return (
        <div
            className={`
                rounded-md
                border
                p-4
                transition-colors
                duration-300
                ${active
                    ? "border-accent/30 bg-accent/[0.04]"
                    : "border-border bg-surface"
                }
            `}
        >
            <p
                className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-accent
                "
            >
                {pillar.id}
            </p>

            <p
                className="
                    mt-1.5
                    text-sm
                    font-semibold
                    leading-snug
                    text-foreground
                "
            >
                {pillar.outcome}
            </p>

            <p
                className="
                    mt-1.5
                    text-xs
                    leading-5
                    text-foreground-muted
                "
            >
                {pillar.supports}
            </p>
        </div>
    );
}