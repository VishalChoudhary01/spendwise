"use client";

import Reveal from "../../common/motion/Reveal";

export default function TrustQuote() {
    return (
        <Reveal delay={0.3}>
            <figure
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
                — Spendwise user
            </figcaption>
            </figure>
        </Reveal>
    );
}