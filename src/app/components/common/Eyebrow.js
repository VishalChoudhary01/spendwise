"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useSelector } from "react-redux";

import { EASE } from "@/app/lib/motion/easings";

export default function Eyebrow({
    label,
    className = "",
}) {
    const words = label.trim().split(/\s+/);

    const loaderCompleted = useSelector(
        (state) => state.ui.loaderCompleted
    );

    const eyebrowRef = useRef(null);

    /*
     * Reveal once, when the section actually enters the viewport —
     * so the hierarchy reads eyebrow → heading → description (§12, §32).
     */
    const inView = useInView(eyebrowRef, {
        once: true,
        amount: 0.6,
    });

    const visible = loaderCompleted && inView;

    return (
        <div ref={eyebrowRef} className={["inline-flex items-center", "text-[10px] sm:text-[11px]", "font-medium uppercase tracking-[0.18em]", "text-textMuted dark:text-darkTextMuted ", className,].join(" ")} >
            {/* Accent marker */}
            <span aria-hidden="true" className="mr-2.5 flex h-1.5 w-1.5 shrink-0 items-center justify-center" >
                <span className="h-1.5 w-1.5 rounded-full bg-accent/60 dark:bg-accent/75" />
            </span>

            {/* 3D Flip Stage */}
            <span
                className="flex items-center"
                style={{
                    perspective: "320px",
                }}
            >
                {words.map((word, index) => (
                    <motion.span key={`${word}-${index}`} initial={{ rotateX: -110, }} animate={{ rotateX: visible ? 0 : -110, }} transition={{ duration: 0.5, delay: visible ? index * 0.06 : 0, ease: EASE.standard, }} className="mr-[0.4em] inline-block last:mr-0" style={{ transformStyle: "preserve-3d", transformOrigin: "50% 100%", backfaceVisibility: "hidden", }} >
                        {word}
                    </motion.span>
                ))}
            </span>
        </div>
    );
}