"use client";

import { FiCheck, FiCircle } from "react-icons/fi";

const items = [
    {
        name: "Laptop",
        done: true,
    },
    {
        name: "Monitor",
        done: true,
    },
    {
        name: "Keyboard",
        done: false,
    },
    {
        name: "Desk Lamp",
        done: false,
    },
];

export default function ProductListState() {
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
                Home Office Setup
            </p>

            <div className="mt-3 space-y-1.5">
                {items.map((item) => (
                    <div
                        key={item.name}
                        className="
                            flex
                            items-center
                            gap-2.5
                            rounded-md
                            border
                            border-border/70
                            bg-surface-muted
                            px-3.5
                            py-2
                        "
                    >
                        {item.done ? (
                            <FiCheck
                                size={14}
                                className="text-success"
                            />
                        ) : (
                            <FiCircle
                                size={14}
                                className="text-foreground-muted/50"
                            />
                        )}

                        <span
                            className={`
                                text-sm
                                ${item.done
                                    ? "text-foreground"
                                    : "text-foreground-secondary"
                                }
                            `}
                        >
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>

            <p
                className="
                    mt-3
                    text-xs
                    text-foreground-muted
                "
            >
                4 items
            </p>
        </div>
    );
}