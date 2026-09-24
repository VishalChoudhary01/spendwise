"use client";

import {
    motion,
    useInView,
    useReducedMotion,
} from "motion/react";
import { useRef } from "react";

import { TRANSITION } from "@/app/lib/motion/transitions";

const ALIGNMENT_CLASSES = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
};

const HEADING_SIZES = {
    sm: "text-3xl md:text-4xl",
    md: "text-4xl md:text-5xl",
    lg: "text-5xl md:text-6xl lg:text-7xl",
};

export default function SectionHeading({
    as: HeadingTag = "h2",
    children,
    description,

    align = "left",
    size = "md",

    // Enables/disables the entrance animation.
    // It should NOT be connected to stage.
    isVisible = true,

    animate = true,

    className = "",
    headingClassName = "",
    descriptionClassName = "",
    maxWidth = "max-w-2xl",
}) {
    const shouldReduceMotion = useReducedMotion();

    const headingRef = useRef(null);

    const inView = useInView(headingRef, {
        // Reveal once, then settle — no re-animation on scroll-back (§32, §46).
        once: true,
        amount: 0.35,
    });

    const alignmentClass =
        ALIGNMENT_CLASSES[align] || ALIGNMENT_CLASSES.left;

    const sizeClass =
        HEADING_SIZES[size] || HEADING_SIZES.md;

    /*
     * Animation happens only when:
     *
     * 1. animate is enabled
     * 2. reduced motion is not requested
     * 3. component is allowed to animate via isVisible
     * 4. component has entered the viewport
     */
    const shouldAnimate =
        animate &&
        !shouldReduceMotion &&
        isVisible;

    const visible = shouldAnimate ? inView : true;

    return (
        <div
            ref={headingRef}
            className={`flex flex-col ${alignmentClass} ${className}`}
        >
            {/* Heading */}
            <motion.div
                initial={
                    shouldAnimate
                        ? {
                            opacity: 0,
                            y: 18,
                        }
                        : false
                }
                animate={
                    visible
                        ? {
                            opacity: 1,
                            y: 0,
                        }
                        : {
                            opacity: 0,
                            y: 18,
                        }
                }
                transition={TRANSITION.reveal}
            >
                <HeadingTag
                    className={`
                        ${maxWidth}
                        ${sizeClass}
                        font-heading
                        font-bold
                        leading-[1.05]
                        tracking-[-0.03em]
                        text-foreground
                        mt-0.5
                        md:mt-1
                        ${headingClassName}
                    `}
                >
                    {children}
                </HeadingTag>
            </motion.div>

            {/* Description */}
            {description && (
                <motion.p
                    initial={
                        shouldAnimate
                            ? {
                                opacity: 0,
                                y: 10,
                            }
                            : false
                    }
                    animate={
                        visible
                            ? {
                                opacity: 1,
                                y: 0,
                            }
                            : {
                                opacity: 0,
                                y: 10,
                            }
                    }
                transition={{
                    ...TRANSITION.reveal,
                    delay: visible ? 0.15 : 0,
                }}
                    className={`
                        mt-4
                        max-w-lg
                        text-lg
                        leading-8
                        text-foreground-secondary
                        ${descriptionClassName}
                    `}
                >
                    {description}
                </motion.p>
            )}
        </div>
    );
}