"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SecondaryLinkButton({
    href = "#",
    children,
    icon: Icon = ArrowRight,
    showIcon = true,
    iconSize = 18,
    className = "",
    ...props
}) {
    return (
        <Link
            href={href}
            className={`
                group
                relative
                inline-flex
                h-11
                md:h-12
                w-fit
                min-w-[170px]
                cursor-pointer
                items-center
                overflow-hidden
                rounded-full
                border
                border-accent/45
                bg-transparent
                py-0
                pr-[52px]
                pl-5
                md:pl-6
                font-jakarta
                text-sm
                font-semibold
                text-foreground
                transition-[border-color,background-color]
                duration-300
                ease-[cubic-bezier(.16,1,.3,1)]
                hover:border-accent
                hover:bg-accent/[0.06]
                active:scale-[0.98]
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-3
                focus-visible:outline-accent
                motion-reduce:transition-none
                ${className}
            `}
            {...props}
        >
            <span className="relative z-10 whitespace-nowrap leading-none">
                {children}
            </span>

            {showIcon && (
                <>
                    {/* Accent circle */}
                    <span
                        aria-hidden="true"
                        className="
                            absolute
                            right-[14px]
                            top-1/2
                            size-5
                            -translate-y-1/2
                            rounded-full
                            bg-accent
                            transition-transform
                            duration-[420ms]
                            ease-[cubic-bezier(.16,1,.3,1)]
                            group-hover:translate-x-[42px]
                            group-focus-visible:translate-x-[42px]
                            motion-reduce:transition-none
                        "
                    />

                    {/* Arrow */}
                    <span
                        aria-hidden="true"
                        className="
                            absolute
                            right-[9px]
                            top-1/2
                            grid
                            size-[30px]
                            -translate-x-6
                            -translate-y-1/2
                            place-items-center
                            rounded-full
                            text-foreground
                            opacity-0
                            [transition:opacity_.18s_ease,transform_.42s_cubic-bezier(.16,1,.3,1)]
                            group-hover:translate-x-0
                            group-hover:opacity-100
                            group-focus-visible:translate-x-0
                            group-focus-visible:opacity-100
                            motion-reduce:transition-none
                        "
                    >
                        <Icon
                            size={iconSize}
                            strokeWidth={2.4}
                        />
                    </span>
                </>
            )}
        </Link>
    );
}