"use client";

import { useCallback } from "react";
import { motion, useAnimate } from "motion/react";

const DuplicateShieldIcon = ({
    size = 24,
    strokeWidth = 2,
    className = "",
    active = false,
    animateOnClick = true,
}) => {
    const [scope, animate] = useAnimate();

    const activateAnimation = useCallback(async () => {
        if (!animateOnClick) return;

        await Promise.all([
            animate(
                ".duplicate-shield",
                {
                    x: [0, -2, 2, -1, 1, 0],
                    rotate: [0, -3, 3, -2, 2, 0],
                },
                {
                    duration: 0.4,
                    ease: "easeInOut",
                }
            ),

            animate(
                ".duplicate-shield-check",
                {
                    pathLength: [0.8, 1],
                    opacity: [0.6, 1],
                },
                {
                    duration: 0.3,
                    ease: "easeOut",
                }
            ),
        ]);
    }, [animate, animateOnClick]);

    const hoverAnimation = useCallback(async () => {
        await animate(
            ".duplicate-shield",
            {
                scale: 1.05,
            },
            {
                duration: 0.2,
                ease: "easeOut",
            }
        );
    }, [animate]);

    const hoverEndAnimation = useCallback(async () => {
        await animate(
            ".duplicate-shield",
            {
                scale: 1,
            },
            {
                duration: 0.2,
                ease: "easeOut",
            }
        );
    }, [animate]);

    return (
        <motion.svg
            ref={scope}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`duplicate-shield ${className}`}
            onHoverStart={hoverAnimation}
            onHoverEnd={hoverEndAnimation}
            onTap={activateAnimation}
            aria-hidden="true"
        >
            {/* Shield */}
            <motion.path
                d="M12 3 5 6v5c0 4.4 2.8 8.4 7 10 4.2-1.6 7-5.6 7-10V6l-7-3Z"
                className="duplicate-shield"
            />

            {/* Protection check */}
            <motion.path
                d="m8.5 12 2.2 2.2 4.8-5"
                className="duplicate-shield-check"
                initial={{
                    pathLength: active ? 1 : 0,
                    opacity: active ? 1 : 0,
                }}
                animate={{
                    pathLength: active ? 1 : 0,
                    opacity: active ? 1 : 0,
                }}
                transition={{
                    duration: 0.25,
                    ease: "easeOut",
                }}
            />
        </motion.svg>
    );
};

export default DuplicateShieldIcon;