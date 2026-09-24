"use client";

import { motion } from "motion/react";
import PrimaryLinkButton from "../../common/button/PrimaryLinkButton";
import SecondaryLinkButton from "../../common/button/SecondaryLinkButton";

const BUTTON_EASE = [0.16, 1, 0.3, 1];

const buttonVariants = {
    hidden: {
        opacity: 0,
        y: 18,
        scale: 0.96,
    },

    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay,
            duration: 0.6,
            ease: BUTTON_EASE,
        },
    }),
};

export default function CTAButtons() {
    return (
        <motion.div
            className="
                mt-7
                flex
                flex-wrap
                items-center
                justify-center
                gap-3
                sm:mt-8
                sm:gap-4
            "
            initial="hidden"
            whileInView="visible"
            viewport={{
                once: true,
                amount: 0.35,
            }}
        >
            {/* Primary CTA */}
            <motion.div
                custom={0}
                variants={buttonVariants}
            >
                <PrimaryLinkButton href="/dashboard">
                    Start Free
                </PrimaryLinkButton>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
                custom={0.08}
                variants={buttonVariants}
            >
                <SecondaryLinkButton href="#how-it-works">
                    See How It Works
                </SecondaryLinkButton>
            </motion.div>
        </motion.div>
    );
}