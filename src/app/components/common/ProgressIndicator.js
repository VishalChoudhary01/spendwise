"use client";

/**
 * Reusable step-based progress indicator.
 *
 * Renders a compact pill showing "0X / 0Y" alongside a row of segment
 * bars — active segments are teal and slightly wider, inactive are neutral.
 *
 * On mobile the pill is tighter and the segment bars are shorter.
 * On desktop (lg+) the pill is slightly more generous.
 *
 * Props:
 *   current   — 0-indexed active step (required)
 *   total     — total number of steps (default 5)
 *   label     — accessible label text (default "Progress")
 *   className — extra classes on the outer wrapper
 */
export default function ProgressIndicator({ current = 0, total = 5, label = "Progress", className = "",}) {
    const padded = String(current + 1).padStart(2, "0");
    const paddedTotal = String(total).padStart(2, "0");

    return (
        <div
            className={`
                flex items-center gap-2.5
                rounded-full
                border border-border/70
                bg-surface/70
                px-3 py-1.5
                backdrop-blur-md
                dark:border-white/[0.07]
                dark:bg-surface/60
                lg:gap-3 lg:px-4 lg:py-2
                ${className}
            `}
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={current + 1}
            aria-label={label}
        >
            <span
                className=
                    "text-[11px] font-semibold tabular-nums text-foreground-secondary dark:text-foreground-muted lg:text-xs"
            >
                <span className="font-bold">{padded}</span> / {paddedTotal}
            </span>
            <div className="flex items-center gap-1 lg:gap-1.5">
                {Array.from({ length: total }, (_, i) => (
                    <span
                        key={i}
                        className={
                            `h-[5px] rounded-full transition-all duration-500
                            ${
                                i <= current
                                    ? "w-5 bg-accent lg:w-8"
                                    : "w-4 bg-border/80 lg:w-6 dark:bg-border-strong"
                            }`
                        }
                    />
                ))}
            </div>
        </div>
    );
}
