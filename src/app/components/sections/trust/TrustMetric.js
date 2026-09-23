"use client";

import { motion } from "motion/react";

import CountUp from "./CountUp";

const EASE_OUT = [0.22, 1, 0.36, 1];

export default function TrustMetric({
    metric,
    index,
    active,
    isStatic,
}) {
    return (
        <motion.div
            initial={
                isStatic
                    ? false
                    : {
                        opacity: 0,
                        y: 8,
                    }
            }
            whileInView={
                isStatic
                    ? undefined
                    : {
                        opacity: 1,
                        y: 0,
                    }
            }
            viewport={{
                once: true,
                margin: "-80px",
            }}
            transition={{
                duration: 0.5,
                delay:
                    0.1 + index * 0.08,
                ease: EASE_OUT,
            }}
            className="
                py-6
                first:pt-0
                sm:px-6
                sm:py-0
                sm:first:pl-0
                sm:last:pr-0
            "
        >
            <p
                className="
                    font-heading
                    text-3xl
                    font-bold
                    tabular-nums
                    tracking-tight
                    text-foreground
                    md:text-4xl
                "
            >
                {isStatic ? (
                    <>
                        {metric.prefix}
                        {metric.value.toLocaleString(
                            "en-IN"
                        )}
                        {metric.suffix}
                    </>
                ) : (
                    <CountUp
                        to={metric.value}
                        prefix={metric.prefix}
                        suffix={metric.suffix}
                        active={active}
                    />
                )}
            </p>

            <p
                className="
                    mt-1.5
                    text-sm
                    text-foreground-muted
                "
            >
                {metric.label}
            </p>
        </motion.div>
    );
}