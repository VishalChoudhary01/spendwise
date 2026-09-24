"use client";

import { motion } from "motion/react";

import Eyebrow from "../../common/Eyebrow";
import SectionHeading from "../../common/SectionHeading";
import Reveal from "../../common/motion/Reveal";
import Container from "@/app/components/layout/container";

import CTAButtons from "./CTAButtons";

const EASE = [0.16, 1, 0.3, 1];

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
                border-t
                border-border/70
                bg-background
                py-16
                sm:py-28
                lg:py-36
            "
        >
            <Container>
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
                            amount: 0.4,
                        }}
                        transition={{
                            duration: 0.55,
                            ease: EASE,
                        }}
                    >
                        <Eyebrow
                            label="Get Started"
                            className="
                                mb-3
                                justify-center
                            "
                        />
                    </motion.div>

                    {/* =================================================
                        HEADING
                    ================================================= */}

                    <Reveal>
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
                            <span className="text-accent dark:text-darkBrandTeal">
                                Overpaying
                            </span>
                            .
                        </SectionHeading>
                    </Reveal>

                    {/* =================================================
                        CTA BUTTONS
                    ================================================= */}

                    <CTAButtons />

                    {/* =================================================
                        REASSURANCE
                    ================================================= */}

                    <motion.p
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
                            amount: 0.35,
                        }}
                        transition={{
                            delay: 0.28,
                            duration: 0.5,
                            ease: EASE,
                        }}
                        className="
                            mt-5
                            text-sm
                            text-foreground-muted
                        "
                    >
                        Free forever. No credit card required.
                    </motion.p>
                </div>
            </Container>
        </section>
    );
}