"use client";

import { animate } from "motion/react";
import { useEffect, useRef } from "react";

import { EASE } from "@/app/lib/motion/easings";

export default function CountUp({
    to,
    prefix = "",
    suffix = "",
    active = false,
}) {
    const valueRef = useRef(null);

    useEffect(() => {
        if (!active) return;

        const controls = animate(0, to, {
            duration: 0.8,
            ease: EASE.standard,

            onUpdate: (latest) => {
                if (!valueRef.current) return;

                valueRef.current.textContent =
                    `${prefix}${Math.round(
                        latest
                    ).toLocaleString("en-IN")}${suffix}`;
            },
        });

        return () => {
            controls.stop();
        };
    }, [
        active,
        to,
        prefix,
        suffix,
    ]);

    return (
        <span ref={valueRef}>
            {prefix}0{suffix}
        </span>
    );
}