"use client";

import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function Eyebrow({
    label,
    className = "",
}) {
    const words = label.trim().split(/\s+/);

    const loaderCompleted = useSelector(
        (state) => state.ui.loaderCompleted
    );

    return (
        <div className={["inline-flex items-center", "text-[10px] sm:text-[11px]", "font-medium uppercase tracking-[0.18em]", "text-textMuted dark:text-darkTextMuted ", className,].join(" ")} >
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
                    <motion.span key={`${word}-${index}`} initial={{ rotateX: -110, }} animate={{ rotateX: loaderCompleted ? 0 : -110, }} transition={{ duration: 0.9, delay: index * 0.08, ease: [0.22, 1, 0.36, 1], }} className="mr-[0.4em] inline-block last:mr-0" style={{ transformStyle: "preserve-3d", transformOrigin: "50% 100%", backfaceVisibility: "hidden", willChange: "transform", }} >
                        {word}
                    </motion.span>
                ))}
            </span>
        </div>
    );
}