"use client";

import {
    FiArrowRight,
    FiCheck,
} from "react-icons/fi";

export default function PlanCard({
    plan,
}) {
    return (
        <article
            className={[
                "group",
                "relative",
                "rounded-lg",
                "border",
                "p-7",
                "transition-colors",
                "duration-200",

                plan.preferred
                    ? [
                        "border-accent/40",
                        "bg-surface",
                        "hover:border-accent/70",
                    ].join(" ")
                    : [
                        "border-border",
                        "bg-surface",
                        "hover:border-border-strong",
                    ].join(" "),
            ].join(" ")}
        >
            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >
                <div>
                    <h3
                        className="
                            text-xl
                            font-semibold
                            text-foreground
                        "
                    >
                        {plan.name}
                    </h3>

                    <p
                        className="
                            mt-2
                            text-sm
                            leading-6
                            text-foreground-secondary
                        "
                    >
                        {plan.positioning}
                    </p>
                </div>

                {/* Static recommendation marker */}

                {plan.preferred && (
                    <span
                        className="
                            shrink-0
                            rounded-full
                            border
                            border-accent/30
                            bg-accent/10
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-accent
                        "
                    >
                        Recommended
                    </span>
                )}
            </div>

            {/* =================================================
                PRICE
            ================================================= */}

            <div className="mt-8">
                <p
                    className="
                        font-heading
                        text-4xl
                        font-bold
                        tracking-[-0.04em]
                        text-foreground
                    "
                >
                    {plan.price}
                </p>

                <p
                    className="
                        mt-1
                        text-xs
                        text-foreground-muted
                    "
                >
                    {plan.billing}
                </p>
            </div>

            {/* =================================================
                CTA
            ================================================= */}

            <button
                type="button"
                className={[
                    "group/button",
                    "mt-8",
                    "flex",
                    "h-12",
                    "w-full",
                    "items-center",
                    "justify-center",
                    "gap-2",
                    "rounded-lg",
                    "text-sm",
                    "font-semibold",
                    "transition-all",
                    "duration-150",
                    "active:scale-[0.98]",

                    plan.preferred
                        ? [
                            "bg-action",
                            "text-white",
                            "hover:bg-action-hover",
                        ].join(" ")
                        : [
                            "border",
                            "border-border-strong",
                            "text-foreground",
                            "hover:bg-backgroundSecondary",
                        ].join(" "),
                ].join(" ")}
            >
                {plan.cta}

                <FiArrowRight
                    size={14}
                    className="
                        transition-transform
                        duration-150
                        group-hover/button:translate-x-0.5
                    "
                />
            </button>

            {/* =================================================
                FEATURES
            ================================================= */}

            <ul
                className="
                    mt-7
                    space-y-3
                "
            >
                {plan.differences.map(
                    (item) => (
                        <li
                            key={item}
                            className="
                                flex
                                items-center
                                gap-3
                                text-sm
                                text-foreground-secondary
                            "
                        >
                            <FiCheck
                                aria-hidden="true"
                                className="
                                    shrink-0
                                    text-success
                                "
                            />

                            <span>
                                {item}
                            </span>
                        </li>
                    )
                )}
            </ul>

            {/* =================================================
                DETAIL
            ================================================= */}

            <p
                className="
                    mt-5
                    text-xs
                    text-foreground-muted
                "
            >
                {plan.detail}
            </p>
        </article>
    );
}