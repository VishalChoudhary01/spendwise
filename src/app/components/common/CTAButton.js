
"use client";
import React from "react";
import { motion } from "motion/react";


const CTAButton = ({ children }) => {
    return (
        <motion.button
            whileHover={{
                scale: 1.03,
                y: -1,
            }}
            whileTap={{
                scale: 0.98,
            }}
            transition={{
                duration: 0.25,
                ease: "easeOut",
            }}
            className="relative cursor-pointer overflow-hidden rounded-full bg-brandOrange px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brandOrange/25 transition-colors duration-300 hover:bg-brandOrangeHover focus-visible:outline-none"
        >
            {/* Premium inner shine */}
            <span className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-b from-white/20 via-transparent to-transparent" />

            {/* Button text */}
            <span className="relative z-10 text-sm font-semibold tracking-wide">
                {children}
            </span>
        </motion.button>
    );
};

export default CTAButton;
