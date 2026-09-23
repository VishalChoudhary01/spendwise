import { motion } from "motion/react";

import { stages } from "@/app/constants/productLandingCard";

export default function HeroStoryProgress({ stage }) {
    const progress =
        ((stage + 1) / stages.length) * 100;

    return (
        <div
            className="mt-3 w-full max-w-[280px] rounded-lg border border-border bg-surface/60 px-3 py-1.5 backdrop-blur-md md:mt-4 md:max-w-[380px] md:rounded-xl md:px-4 md:py-2 dark:border-white/8 dark:bg-white/6"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label={`Product story progress: ${stages[stage].label}`}
        >
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium tabular-nums text-foreground-secondary dark:text-white/50">
                    <span className="font-semibold dark:text-white/70">0{stage + 1}</span>  / 04
                </span>


                <motion.span
                    initial={{
                        opacity: 0,
                        scale: 0.4,
                        filter: "blur(40px)",
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)",
                    }}
                    transition={{
                        duration: 0.8,
                    }}
                    className="text-[10px] font-medium text-foreground-muted dark:text-white/70"
                >
                    {stages[stage].label}
                </motion.span>
            </div>

            <div className="mt-1.5 flex items-center gap-1 md:mt-2 md:gap-1.5">
                {stages.map((s, i) => (
                    <span
                        key={s.id}
                        className={`h-[3px] flex-1 rounded-full transition-all duration-300 ease-out ${i <= stage
                                ? "bg-accent dark:bg-accent/70"
                                : "bg-border-strong dark:bg-white/10"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}