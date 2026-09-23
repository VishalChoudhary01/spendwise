"use client";

export default function SpendingState() {
    return (
        <div className="flex h-full flex-col">
            {/* Metrics */}

            <div className="space-y-2.5">
                <Metric
                    label="Items"
                    value="18 / 24"
                />

                <Metric
                    label="Spent"
                    value="₹12,450"
                />

                <Metric
                    label="Saved"
                    value="₹4,300"
                    success
                />
            </div>

            {/* Bottom message */}

            <div className="mt-auto pt-8">
                <div
                    className="
                        mb-5
                        h-px
                        w-full
                        bg-border
                    "
                />

                <p
                    className="
                        text-base
                        font-semibold
                        tracking-[-0.01em]
                        text-foreground
                    "
                >
                    Then shop smarter next time.
                </p>

                <p
                    className="
                        mt-2
                        max-w-[360px]
                        text-sm
                        leading-6
                        text-foreground-secondary
                    "
                >
                    Your lists, prices, and savings
                    stay organized so the next
                    shopping decision gets easier.
                </p>
            </div>
        </div>
    );
}

function Metric({
    label,
    value,
    success = false,
}) {
    return (
        <div
            className={[
                "flex items-center justify-between",
                "rounded-xl border",
                "px-4 py-3.5",
                success
                    ? [
                        "border-successBorder",
                        "bg-successSoft",
                    ].join(" ")
                    : [
                        "border-border",
                        "bg-surface-muted",
                    ].join(" "),
            ].join(" ")}
        >
            <span
                className={[
                    "text-sm font-medium",
                    success
                        ? "text-success"
                        : "text-foreground-secondary",
                ].join(" ")}
            >
                {label}
            </span>

            <span
                className={[
                    "text-sm font-bold tabular-nums",
                    success
                        ? "text-success"
                        : "text-foreground",
                ].join(" ")}
            >
                {value}
            </span>
        </div>
    );
}