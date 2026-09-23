"use client";

import { motion } from "motion/react";

import Eyebrow from "../../common/Eyebrow";
import SectionHeading from "../../common/SectionHeading";

import CTAButtons from "./CTAButtons";

const EASE_OUT = [
    0.22,
    1,
    0.36,
    1,
];

export default function CTA() {
    return (
        <section
            id="cta"
            className="
                relative
                flex
                min-h-[70svh]
                w-full
                items-center
                overflow-hidden
                bg-background
                px-6
                py-16
                sm:py-28
            "
        >
            {/* =================================================
                CONTENT
            ================================================= */}

            <div
                className="
                    relative
                    mx-auto
                    w-full
                    max-w-4xl
                    text-center
                "
            >
                {/* =================================================
                    EYEBROW
                ================================================= */}

                <Eyebrow
                    label="Get Started"
                    className="
                        justify-center
                        mb-3
                    "
                />

                {/* =================================================
                    HEADING + DESCRIPTION
                ================================================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 10,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                        amount: 0.5,
                    }}
                    transition={{
                        duration: 0.5,
                        ease: EASE_OUT,
                    }}
                >
                    <SectionHeading
                        align="center"
                        size="md"
                        maxWidth="max-w-4xl"
                        description="
                            Compare better prices, stay organized,
                            and keep more of your money.
                        "
                    >
                        Stop{" "}
                        <span className="text-accent">
                            Overpaying
                        </span>
                        .
                    </SectionHeading>
                </motion.div>

                {/* =================================================
                    CTA BUTTONS
                ================================================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 8,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                        amount: 0.5,
                    }}
                    transition={{
                        duration: 0.45,
                        delay: 0.1,
                        ease: EASE_OUT,
                    }}
                >
                    <CTAButtons />
                </motion.div>

                {/* =================================================
                    REASSURANCE
                ================================================= */}

                <p
                    className="
                        mt-5
                        text-sm
                        text-foreground-muted
                    "
                >
                    Free forever. No credit card
                    required.
                </p>
            </div>
        </section>
    );
}