"use client";

import CountUp from "./CountUp";
import Reveal from "../../common/motion/Reveal";

export default function TrustMetric({
    metric,
    index,
    active,
    isStatic,
}) {
    const className = `
        py-6
        first:pt-0
        sm:px-6
        sm:py-0
        sm:first:pl-0
        sm:last:pr-0
    `;

    const content = (
        <>
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
        </>
    );

    /*
     * Mobile / reduced motion:
     * static values, no entrance animation (§9, §23).
     *
     * Desktop:
     * one shared reveal with a short stagger — count-up fires once,
     * then everything settles (§31, §46).
     */
    if (isStatic) {
        return <div className={className}>{content}</div>;
    }

    return (
        <Reveal
            className={className}
            delay={0.1 + index * 0.08}
        >
            {content}
        </Reveal>
    );
}