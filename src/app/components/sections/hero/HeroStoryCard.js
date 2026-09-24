import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { FiStar } from "react-icons/fi";
import { product } from "@/app/constants/productLandingCard";
import { TRANSITION } from "@/app/lib/motion/transitions";
import DiscoverState from "./states/DiscoverState";
import CompareState from "./states/CompareState";
import BetterPriceState from "./states/BetterPriceState";
import PayLessState from "./states/PayLessState";

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

            <div className="relative rounded-lg border border-border bg-surface p-3.5 shadow-sm dark:bg-surface md:p-5">
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

                {/*
                  Story panel — fixed height masks the stage cross-fade.
                  Must fit the tallest state (Discover: header + 3 source
                  rows ≈ 175px) or the last rows get cropped — 180px is
                  the proven desktop value, now shared by mobile.
                */}
                <div className="mt-3 h-[180px] overflow-hidden">
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
                                transition={TRANSITION.normal}
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