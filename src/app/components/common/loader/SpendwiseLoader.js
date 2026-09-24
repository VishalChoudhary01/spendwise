"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loaderFinished } from "@/app/features/uiSlice";
import { EASE } from "@/app/lib/motion/easings";

const SpendwiseLoader = () => {
    const dispatch = useDispatch();

    const [showLoader, setShowLoader] = useState(true);
    const [coverScale, setCoverScale] = useState(1);

    /**
     * Calculate the scale required for the i-dot
     * to cover the entire viewport.
     *
     * We only calculate this while the loader is mounted.
     */
    useEffect(() => {
        const updateCoverScale = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            const diagonal = Math.sqrt(
                width ** 2 + height ** 2
            );

            setCoverScale(diagonal / 2.5);
        };

        updateCoverScale();

        return () => {
            // Nothing else required here.
        };
    }, []);

    /**
     * Loader completion is controlled ONLY
     * by the actual i-dot animation.
     *
     * No timeout is used.
     */
    const handleLoaderComplete = () => {
        dispatch(loaderFinished());
        setShowLoader(false);
    };

    return (
        <AnimatePresence mode="wait">
            {showLoader && (
                <motion.div
                    className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: {
                            duration: 0.15,
                        },
                    }}
                >
                    {/* ------------------------------------------------ */}
                    {/* Base Background */}
                    {/* ------------------------------------------------ */}

                    <div className="absolute inset-0 bg-surface dark:bg-darkBackgroundSecondary" />

                    {/* ------------------------------------------------ */}
                    {/* Soft Emerald Glow */}
                    {/* ------------------------------------------------ */}

                    <motion.div
                        className="
                            absolute
                            left-1/2
                            top-1/2
                            h-[420px]
                            w-[420px]
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-full
                            bg-brand-emerald/[0.07]
                            blur-[110px]
                            dark:bg-brand-teal/10
                        "
                        initial={{
                            opacity: 0,
                            scale: 0.7,
                        }}
                        animate={{
                            opacity: 1,
                            scale: [0.7, 1.05, 0.95],
                        }}
                        transition={{
                            duration: 2.5,
                            ease: "easeInOut",
                        }}
                    />

                    {/* ------------------------------------------------ */}
                    {/* Subtle Orange Ambient Glow */}
                    {/* ------------------------------------------------ */}

                    <motion.div
                        className="
                            absolute
                            left-1/2
                            top-1/2
                            h-[190px]
                            w-[190px]
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-full
                            bg-brand-orange/[0.035]
                            blur-[75px]
                        "
                        animate={{
                            scale: [0.8, 1.25, 0.95],
                            opacity: [0.2, 0.55, 0.25],
                        }}
                        transition={{
                            duration: 2.4,
                            ease: "easeInOut",
                        }}
                    />

                    {/* ------------------------------------------------ */}
                    {/* Logo */}
                    {/* ------------------------------------------------ */}

                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{
                            opacity: 0,
                            scale: 0.94,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            opacity: {
                                duration: 0.4,
                            },                                    scale: {
                                        duration: 0.7,
                                        ease: EASE.standard,
                                    },
                        }}
                    >
                        <div className="flex items-center gap-0.5">

                            {/* Logo Icon */}

                            <Image
                                src="/logo/logo.png"
                                alt="Spendwise"
                                width={45}
                                height={45}
                                priority
                                className="
                                    h-10
                                    w-10
                                    object-contain
                                    md:h-11
                                    md:w-12
                                "
                            />

                            {/* Wordmark */}

                            <span
                                aria-label="Spendwise"
                                className="
                                    font-brand
                                    text-[1.1rem]
                                    font-light
                                    text-textPrimary
                                    md:text-xl
                                "
                            >
                                <span>S</span>
                                <span>p</span>
                                <span>e</span>
                                <span>n</span>
                                <span>d</span>

                                {/* ------------------------------------------------ */}
                                {/* Brand Word */}
                                {/* ------------------------------------------------ */}

                                <span
                                    className="
                                        font-semibold
                                        text-brand-emerald
                                        md:tracking-wider
                                        dark:text-brand-teal
                                    "
                                >
                                    <span>w</span>

                                    {/* ------------------------------------------------ */}
                                    {/* i + Animated Dot */}
                                    {/* ------------------------------------------------ */}

                                    <span className="relative inline-block">

                                        {/* i stem */}

                                        <span>ı</span>

                                        {/* Animated i-dot */}

                                        <motion.span
                                            className="
                                                absolute
                                                left-1/2
                                                top-[0.18em]
                                                z-[10000]
                                                size-[0.16em]
                                                rounded-full
                                                bg-brand-orange
                                            "
                                            initial={{
                                                x: "-50%",
                                                y: 0,
                                                scale: 0.8,
                                            }}
                                            animate={{
                                                x: "-50%",
                                                y: [
                                                    0,
                                                    -7,
                                                    0,
                                                    -9,
                                                    0,
                                                    -11,
                                                    0,
                                                    -14,
                                                    0,
                                                    0,
                                                    0,
                                                    0,
                                                    0,
                                                    -9,
                                                    0,
                                                ],
                                                scale: [
                                                    0.8,
                                                    2.2,
                                                    0.9,
                                                    2.5,
                                                    0.9,
                                                    2.8,
                                                    1,
                                                    3.4,
                                                    1,
                                                    coverScale * 1.12,
                                                    coverScale * 1.12,
                                                    3.2,
                                                    2.2,
                                                    1,
                                                ],
                                            }}
                                            transition={{
                                                duration: 3.4,

                                                times: [
                                                    0,
                                                    0.055,
                                                    0.11,
                                                    0.165,
                                                    0.22,
                                                    0.275,
                                                    0.33,
                                                    0.385,
                                                    0.44,
                                                    0.57,
                                                    0.69,
                                                    0.84,
                                                    0.92,
                                                    1,
                                                ],

                                                ease: [
                                                    // Bounce 1
                                                    [0.34, 1.56, 0.64, 1],
                                                    [0.34, 1.56, 0.64, 1],

                                                    // Bounce 2
                                                    [0.34, 1.56, 0.64, 1],
                                                    [0.34, 1.56, 0.64, 1],

                                                    // Bounce 3
                                                    [0.34, 1.56, 0.64, 1],
                                                    [0.34, 1.56, 0.64, 1],

                                                    // Big anticipation
                                                    [0.34, 1.56, 0.64, 1],
                                                    [0.34, 1.56, 0.64, 1],

                                                    // Explode outward
                                                    [0.76, 0, 0.24, 1],

                                                    // Hold fullscreen
                                                    "linear",

                                                    // Shrink back
                                                    [0.76, 0, 0.24, 1],

                                                    // Return bounce
                                                    [0.34, 1.56, 0.64, 1],

                                                    // Final settle
                                                    [0.34, 1.56, 0.64, 1],
                                                ],
                                            }}
                                            onAnimationComplete={
                                                handleLoaderComplete
                                            }
                                        />
                                    </span>

                                    <span>s</span>
                                    <span>e</span>
                                </span>
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SpendwiseLoader;