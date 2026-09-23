"use client";

import { FiArrowRight, FiPlus } from "react-icons/fi";

export default function ListCreationState() {
    return (
        <div>
            <p
                className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-foreground-muted
                "
            >
                New shopping list
            </p>

            <div className="mt-3 space-y-2">
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
                    <span className="text-sm font-medium text-foreground">
                        Home Office Setup
                    </span>

                    <span className="text-xs text-foreground-muted">
                        4 items
                    </span>
                </div>

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
                    <FiPlus size={14} />
                    Add product
                </div>
            </div>

            <div
                className="
                    mt-3
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-md
                    bg-action
                    px-3.5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                "
            >
                Create list

                <FiArrowRight size={14} />
            </div>
        </div>
    );
}