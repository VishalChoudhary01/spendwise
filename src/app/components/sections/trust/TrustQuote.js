"use client";

import { motion } from "motion/react";

const EASE_OUT = [0.22, 1, 0.36, 1];

export default function TrustQuote() {
    return (
        <motion.figure
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
                margin: "-80px",
            }}
            transition={{
                duration: 0.5,
                delay: 0.3,
                ease: EASE_OUT,
            }}
            className="
                mt-10
                border-t
                border-border
                pt-10
                dark:border-darkBorder
            "
        >
            <blockquote
                className="
                    max-w-xl
                    font-heading
                    text-2xl
                    font-bold
                    leading-snug
                    tracking-[-0.02em]
                    text-foreground
                    md:text-3xl
                "
            >
                &ldquo;I stopped checking five
                different stores before
                buying.&rdquo;
            </blockquote>

            <figcaption
                className="
                    mt-4
                    text-sm
                    text-foreground-muted
                "
            >
                — SmartShop user
            </figcaption>
        </motion.figure>
    );
}