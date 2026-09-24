"use client";

import {
    FiArrowRight,
    FiPlus,
} from "react-icons/fi";

export default function ListCreationState() {
    return (
        <div className="w-full">
            {/* Label */}

            <p
                className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-foreground-muted
                "
            >
                New shopping list
            </p>

            {/* List content */}

            <div className="mt-3 space-y-2">
                {/* Existing list */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        rounded-md
                        border
                        border-border/70
                        bg-surface-muted
                        px-3.5
                        py-2.5
                    "
                >
                    <span
                        className="
                            min-w-0
                            truncate
                            text-sm
                            font-medium
                            text-foreground
                        "
                    >
                        Home Office Setup
                    </span>

                    <span
                        className="
                            shrink-0
                            text-xs
                            text-foreground-muted
                        "
                    >
                        4 items
                    </span>
                </div>

                {/* Add product */}

                <div
                    className="
                        flex
                        items-center
                        gap-2
                        rounded-md
                        border
                        border-dashed
                        border-border/70
                        px-3.5
                        py-2.5
                        text-sm
                        text-foreground-muted
                    "
                >
                    <FiPlus
                        size={14}
                        className="shrink-0"
                    />

                    <span>
                        Add product
                    </span>
                </div>
            </div>

            {/* Dashboard-style action */}

            <div
                className="
                    mt-3
                    flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-md
                    bg-action
                    px-4
                    text-sm
                    font-semibold
                    text-white
                    transition-[transform,background-color]
                    duration-200
                    ease-out
                "
            >
                <span>
                    Create list
                </span>

                <FiArrowRight
                    size={14}
                    className="
                        transition-transform
                        duration-200
                        group-hover:translate-x-0.5
                    "
                />
            </div>
        </div>
    );
}