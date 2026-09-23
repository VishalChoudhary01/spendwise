"use client";

import { FiArrowRight } from "react-icons/fi";

export default function CTAButtons() {
    return (
        <div
            className="
                mt-8
                flex
                flex-wrap
                items-center
                justify-center
                gap-3
                sm:gap-4
            "
        >
            {/* =================================================
                PRIMARY CTA
            ================================================= */}

            <a
                href="#pricing"
                className="
                    group
                    inline-flex
                    h-12
                    items-center
                    gap-2
                    rounded-full
                    bg-action
                    px-5
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    duration-150
                    hover:bg-action-hover
                    active:scale-[0.98]
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-accent
                    sm:px-6
                "
            >
                Start Free

                <FiArrowRight
                    aria-hidden="true"
                    className="
                        transition-transform
                        duration-150
                        group-hover:translate-x-0.5
                    "
                />
            </a>

            {/* =================================================
                SECONDARY CTA
            ================================================= */}

            <a
                href="#how-it-works"
                className="
                    group
                    inline-flex
                    h-12
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-border-strong
                    bg-transparent
                    px-5
                    text-sm
                    font-semibold
                    text-foreground
                    transition-all
                    duration-150
                    hover:border-accent
                    hover:text-accent
                    active:scale-[0.98]
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-accent
                    sm:px-6
                "
            >
                See How It Works

                <FiArrowRight
                    size={16}
                    aria-hidden="true"
                    className="
                        transition-transform
                        duration-150
                        group-hover:translate-x-0.5
                    "
                />
            </a>
        </div>
    );
}