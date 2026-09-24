"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PrimaryLinkButton({
    href = "#",
    children,
    icon: Icon = ArrowRight,
    showIcon = true,
    iconSize = 18,
    size = "default",
    className = "",
    ...props
}) {
    const sizes = {
        default: {
            wrapper: `
                h-11
                md:h-12
                min-w-[150px]
                pr-[52px]
                pl-5
                md:pl-6
                text-sm
            `,
            circle: `
                right-[14px]
                size-5
            `,
            arrow: `
                right-[9px]
                size-[30px]
                -translate-x-6
            `,
        },

        compact: {
            wrapper: `
                h-10
                min-w-[154px]
                pr-[44px]
                pl-5
                text-sm
            `,
            circle: `
                right-[11px]
                size-[17px]
            `,
            arrow: `
                right-[6px]
                size-[26px]
                -translate-x-5
            `,
        },
    };

    const currentSize = sizes[size] ?? sizes.default;

    return (
        <Link
            href={href}
            className={`
                group
                relative
                inline-flex
                w-fit
                cursor-pointer
                items-center
                overflow-hidden
                rounded-full

                border
                border-brandOrange

                bg-linear-to-b
                from-[#ff6841]
                via-brandOrange
                to-[#ff5930]

                font-jakarta
                font-semibold
                text-white

                shadow-[0_6px_20px_rgba(255,90,45,0.14)]

                transition-[background,box-shadow,transform,border-color]
                duration-300
                ease-[cubic-bezier(.16,1,.3,1)]

                hover:from-[#ff704b]
                hover:via-brandOrangeHover
                hover:to-[#ff5b32]

                hover:border-brandOrangeHover
                hover:-translate-y-px
                hover:shadow-[0_10px_30px_rgba(255,90,45,0.22)]

                active:translate-y-0
                active:scale-[0.98]

                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-3
                focus-visible:outline-accent

                motion-reduce:transition-none

                ${currentSize.wrapper}
                ${className}
            `}
            {...props}
        >
            {/* Subtle orange surface highlight */}
            <span
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    top-0
                    h-1/2
                    rounded-t-full
                    bg-linear-to-b
                    from-white/[0.06]
                    to-transparent
                "
            />

            {/* Label */}
            <span
                className="
                    relative
                    z-10
                    whitespace-nowrap
                    leading-none
                "
            >
                {children}
            </span>

            {showIcon && (
                <>
                    {/* Circle */}
                    <span
                        aria-hidden="true"
                        className={`
                            absolute
                            top-1/2
                            -translate-y-1/2
                            rounded-full
                            bg-white/20

                            transition-transform
                            duration-[420ms]
                            ease-[cubic-bezier(.16,1,.3,1)]

                            group-hover:translate-x-[38px]
                            group-focus-visible:translate-x-[38px]

                            motion-reduce:transition-none

                            ${currentSize.circle}
                        `}
                    />

                    {/* Arrow */}
                    <span
                        aria-hidden="true"
                        className={`
                            absolute
                            top-1/2
                            grid
                            -translate-y-1/2
                            place-items-center
                            rounded-full
                            text-white
                            opacity-0

                            [transition:opacity_.18s_ease,transform_.42s_cubic-bezier(.16,1,.3,1)]

                            group-hover:translate-x-0
                            group-hover:opacity-100

                            group-focus-visible:translate-x-0
                            group-focus-visible:opacity-100

                            motion-reduce:transition-none

                            ${currentSize.arrow}
                        `}
                    >
                        <Icon
                            size={size === "compact" ? 16 : iconSize}
                            strokeWidth={2.4}
                        />
                    </span>
                </>
            )}
        </Link>
    );
}