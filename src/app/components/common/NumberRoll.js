"use client";

import { useEffect, useState } from "react";
import { animate } from "motion";
import { useSelector } from "react-redux";

const NumberRoll = ({
    value,
    prefix = "",
    suffix = "",
    minimumFractionDigits = 0,
    maximumFractionDigits = minimumFractionDigits,
    className = "",
}) => {
    const loaderCompleted = useSelector(
        (state) => state.ui.loaderCompleted
    );

    const targetValue = Number(value) || 0;

    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        // Loader is still running.
        // Keep the number at zero.
        if (!loaderCompleted) {
            setDisplayValue(0);
            return;
        }

        // Loader has completed.
        // Now start the number animation.
        const controls = animate(0, targetValue, {
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],

            onUpdate: (latest) => {
                setDisplayValue(latest);
            },

            onComplete: () => {
                setDisplayValue(targetValue);
            },
        });

        return () => {
            controls.stop();
        };
    }, [loaderCompleted, targetValue]);

    const formattedValue = new Intl.NumberFormat("en-IN", {
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(displayValue);

    return (
        <span
            className={`inline-flex items-center ${className}`}
            aria-label={`${prefix}${formattedValue}${suffix}`}
        >
            {prefix && (
                <span className="inline-block">
                    {prefix}
                </span>
            )}

            <span className="inline-block">
                {formattedValue}
            </span>

            {suffix && (
                <span className="inline-block">
                    {suffix}
                </span>
            )}
        </span>
    );
};

export default NumberRoll;