"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, } from "motion/react";

import ProgressIndicator from "@/app/components/common/ProgressIndicator";
import  Background  from "@/app/components/common/background/Background";

import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import { MOBILE_QUERY, REDUCED_MOTION_QUERY, } from "@/app/constants/mediaQueries";

import ComparisonPanel from "./ComparisonPanel";
import ProductSummary from "./ProductSummary";
import SectionHeading from "../../common/SectionHeading";
import Eyebrow from "../../common/Eyebrow";

const STAGES = [
    { id: "context", label: "Product context" },
    { id: "amazon", label: "Amazon" },
    { id: "flipkart", label: "Flipkart" },
    { id: "better-price", label: "Better available option" },
    { id: "savings", label: "Savings resolution" },
];

export default function ProductComparisonSection() {
    const isMobile = useMediaQuery(MOBILE_QUERY);
    const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

    const isStatic = isMobile || reducedMotion;

    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end 100%"],
    });

    /*
     * Scroll story
     *
     * 0.00 - 0.19 => Product context
     * 0.20 - 0.37 => Amazon
     * 0.38 - 0.55 => Flipkart
     * 0.56 - 0.71 => Better available option
     * 0.72 - 1.00 => Savings resolution
     */
    const stageProgress = useTransform(scrollYProgress, (v) => {
        if (v >= 0.72) return 4;
        if (v >= 0.56) return 3;
        if (v >= 0.38) return 2;
        if (v >= 0.20) return 1;

        return 0;
    });

    const cardScale = useTransform(
        scrollYProgress,
        [0, 0.06],
        [0.97, 1]
    );

    const hintOpacity = useTransform(
        scrollYProgress,
        [0, 0.08],
        [1, 0]
    );

    const [stage, setStage] = useState(0);

    useMotionValueEvent(stageProgress, "change", (value) => {
        setStage(Math.round(value));
    });

    return (
        <section
            ref={sectionRef}
            id="compare"
            className={`relative w-full bg-background ${isStatic ? "" : "lg:h-[500vh]"  }`} >
            <div className={`relative ${isStatic ? "" : "overflow-hidden lg:sticky lg:top-0 lg:h-screen" }`}>
            
                <Background showGrid={true} gridSize={44} gridOpacity={0.05}
                    orbs={[
                        {
                            id: "teal",
                            position: "top-left",
                            size: "24rem",
                            blur: "120px",
                            color: "var(--brand-teal)",
                            opacity: 0.08,
                        },
                        {
                            id: "orange",
                            position: "bottom-right",
                            size: "20rem",
                            blur: "110px",
                            color: "var(--brand-orange)",
                            opacity: 0.05,
                        },
                    ]}/>

               
                <div className={`relative z-10 mx-auto grid w-full max-w-7xl gap-4 px-5 sm:px-6 ${isStatic ? "py-6 sm:py-28" : "pt-20 lg:h-full lg:items-center lg:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-0"}`} >
                
                    <div>
                        <div>
                            <Eyebrow label={"Price Comparison"} className="mb-1 sm:mb-0"/>
                            <SectionHeading
                                as="h2"
                                align="left"
                                size="sm"
                                isVisible={stage >=0 }
                                description="SmartShop checks multiple stores, compares the real prices, and surfaces the option that saves you the most."
                                headingClassName="!mt-0"
                                descriptionClassName="!mt-2 sm:!mt-4 text-base sm:text-lg leading-6 sm:leading-8 max-w-md"
                            >
                                One Product.{" "}
                                <span className="text-accent">
                                    Every Price <span className="font-basic">.</span> 
                                </span>
                            </SectionHeading>
                        </div>

                        {/* Product summary */}
                        <div className="mt-3 sm:mt-8 max-w-sm">
                            <ProductSummary comparisonActive={stage >= 1} />
                        </div>
                    </div>

                    <div className="flex flex-col items-center w-full">
                        <motion.div
                            style={isStatic ? undefined : { scale: cardScale }}
                            className="w-full max-w-[400px]" >
                            <ComparisonPanel stage={stage} isStatic={isStatic} />
                        </motion.div>

                        {/* Progress indicator */}
                        {!isStatic && (
                            <ProgressIndicator current={stage} total={STAGES.length} label="Price comparison progress" className="mt-6" />
                        )}
                    </div>
                </div>

               
                {!isStatic && (
                    <motion.div style={{ opacity: hintOpacity }} className=" pointer-events-none absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2.5 rounded-full border border-border bg-surface/70 px-4 py-2 backdrop-blur-md lg:flex dark:bg-surface/60 " >
                        <span className="text-xs font-medium text-foreground-muted">
                            Scroll to compare prices
                        </span>

                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    </motion.div>
                )}
            </div>
        </section>
    );
}