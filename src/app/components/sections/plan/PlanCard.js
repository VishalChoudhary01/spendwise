"use client";

import {
    FiArrowRight,
    FiCheck,
} from "react-icons/fi";

export default function PlanCard({ plan }) {
    return (
        <article
            className={[
                "relative",
                "mx-auto",
                "flex",
                "h-full",
                "w-full",
                "max-w-[350px]",
                "flex-col",
                "rounded-xl",
                "border",
                "p-5",
                "sm:max-w-none",
                "sm:p-8",
                "transition-[border-color,box-shadow]",
                "duration-300",

                plan.preferred
                    ? [
                        "border-accent/40",
                        "bg-surface",
                        "shadow-sm",
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

            <div className="relative min-h-[86px] sm:min-h-0">
                <div className="min-w-0 pr-2">
                    <h3
                        className="
                            font-heading
                            text-xl
                            font-semibold
                            tracking-[-0.01em]
                            text-foreground
                        "
                    >
                        {plan.name}
                    </h3>

                    <p
                        className="
                            mt-2
                            max-w-[28rem]
                            text-sm
                            leading-5
                            text-foreground-secondary
                            sm:leading-6
                        "
                    >
                        {plan.positioning}
                    </p>
                </div>

                {/* Recommended badge */}

                {plan.preferred && (
                    <span
                        className="
                            absolute
                            right-0
                            top-0
                            shrink-0
                            rounded-full
                            border
                            border-accent/30
                            bg-accent/10
                            px-2.5
                            py-1
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.14em]
                            text-accent
                            sm:text-[10px]
                        "
                    >
                        Recommended
                    </span>
                )}
            </div>

            {/* =================================================
                PRICE
            ================================================= */}

            <div className="mt-5 sm:mt-8">
                <p
                    className="
                        font-heading
                        text-4xl
                        font-bold
                        leading-none
                        tracking-[-0.04em]
                        text-foreground
                    "
                >
                    {plan.price}
                </p>

                <p
                    className="
                        mt-2
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.1em]
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
                    "group",
                    "mt-6",
                    "flex",
                    "h-10",
                    "w-full",
                    "items-center",
                    "justify-center",
                    "gap-1.5",
                    "rounded-full",
                    "px-4",
                    "font-jakarta",
                    "text-[13px]",
                    "font-semibold",
                    "transition-[background-color,border-color,box-shadow,transform]",
                    "duration-300",
                    "ease-[cubic-bezier(.16,1,.3,1)]",
                    "focus-visible:outline",
                    "focus-visible:outline-2",
                    "focus-visible:outline-offset-2",
                    "focus-visible:outline-accent",
                    "active:scale-[0.98]",

                    /* Desktop */
                    "sm:mt-8",
                    "sm:h-12",
                    "sm:gap-2",
                    "sm:px-5",
                    "sm:text-sm",

                    plan.preferred
                        ? [
                            "border",
                            "border-brandOrange",

                            "bg-linear-to-b",
                            "from-[#ff6841]",
                            "via-brandOrange",
                            "to-[#ff5930]",

                            "text-white",

                            "shadow-[0_5px_16px_rgba(255,90,45,0.10)]",

                            "hover:border-brandOrangeHover",
                            "hover:from-[#ff704b]",
                            "hover:via-brandOrangeHover",
                            "hover:to-[#ff5b32]",

                            "hover:-translate-y-px",

                            "hover:shadow-[0_8px_24px_rgba(255,90,45,0.18)]",
                        ].join(" ")
                        : [
                            "border",
                            "border-accent/50",
                            "bg-transparent",
                            "text-foreground",

                            "hover:border-accent",
                            "hover:bg-accent/8",

                            "active:bg-accent/14",
                            "active:border-accent",
                        ].join(" "),
                ].join(" ")}
            >
                <span>{plan.cta}</span>

                <FiArrowRight
                    size={15}
                    className="
                        shrink-0
                        transition-transform
                        duration-300
                        group-hover:translate-x-0.5
                        sm:h-4
                        sm:w-4
                    "
                />
            </button>

            {/* =================================================
                FEATURES
            ================================================= */}

            <ul
                className="
                    mt-5
                    space-y-3
                    border-t
                    border-border/60
                    pt-5

                    sm:mt-8
                    sm:space-y-3
                    sm:pt-6
                "
            >
                {plan.differences.map((item) => (
                    <li
                        key={item}
                        className="
                            flex
                            items-start
                            gap-2.5
                            text-sm
                            leading-5
                            text-foreground-secondary
                        "
                    >
                        <span
                            aria-hidden="true"
                            className="
                                mt-0.5
                                flex
                                h-5
                                w-5
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-success/10
                                text-success
                            "
                        >
                            <FiCheck className="h-3 w-3" />
                        </span>

                        <span>{item}</span>
                    </li>
                ))}
            </ul>

            {/* =================================================
                DETAIL
            ================================================= */}

            <p
                className="
                    pt-5
                    text-xs
                    text-foreground-muted
                "
            >
                {plan.detail}
            </p>
        </article>
    );
}