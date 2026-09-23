import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { FiStar } from "react-icons/fi";
import { product } from "@/app/constants/productLandingCard";
import DiscoverState from "./states/DiscoverState";
import CompareState from "./states/CompareState";
import BetterPriceState from "./states/BetterPriceState";
import PayLessState from "./states/PayLessState";

const STATE_TRANSITIONS = [
    {
        duration: 0.22,
        ease: [0.22, 1, 0.36, 1],
    },
    {
        duration: 0.22,
        ease: [0.22, 1, 0.36, 1],
    },
    {
        duration: 0.32,
        ease: [0.16, 1, 0.3, 1],
    },
    {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
    },
];

export default function HeroStoryCard({
    stage = 0,
    isStatic = false,
}) {
    return (
        <div className="relative w-full max-w-[400px]">
            {/* Soft teal atmosphere */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-6 rounded-[32px] bg-brandTeal/8 blur-3xl dark:bg-brandTeal/10"
            />

            <div className="relative rounded-xl border border-border bg-surface p-3.5 shadow-sm dark:bg-surface md:p-5">
                {/* Product image */}
                <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg border border-border bg-white dark:bg-white md:h-40">
                    <Image
                        src={product.image}
                        alt={`${product.name} with charging case`}
                        width={1397}
                        height={1482}
                        priority
                        className="h-full w-auto object-contain p-3"
                    />
                </div>

                {/* Title + rating */}
                <div className="mt-3 md:mt-4">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">
                        {product.name}
                    </h2>

                    <p className="mt-0.5 text-xs text-foreground-muted">
                        {product.detail}
                    </p>

                    <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="flex items-center gap-0.5 text-amber-400">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <FiStar
                                    key={i}
                                    size={11}
                                    className="fill-amber-400"
                                />
                            ))}
                        </span>

                        <span className="text-xs font-semibold text-foreground">
                            {product.rating}
                        </span>

                        <span className="text-xs text-foreground-muted">
                            ({product.reviews})
                        </span>
                    </div>
                </div>

                {/* Story panel */}
                <div className="mt-3 h-[148px] overflow-hidden md:h-[180px]">
                    {isStatic ? (
                        <PayLessState />
                    ) : (
                        <AnimatePresence
                            mode="wait"
                            initial={false}
                        >
                            <motion.div
                                key={stage}
                                initial={{
                                    opacity: 0,
                                    y: 12,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -6,
                                }}
                                transition={
                                    STATE_TRANSITIONS[stage]
                                }
                            >
                                {stage === 0 && (
                                    <DiscoverState />
                                )}

                                {stage === 1 && (
                                    <CompareState />
                                )}

                                {stage === 2 && (
                                    <BetterPriceState />
                                )}

                                {stage === 3 && (
                                    <PayLessState />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
}