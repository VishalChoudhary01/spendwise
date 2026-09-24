"use client";

import Eyebrow from "../../common/Eyebrow";
import SectionHeading from "../../common/SectionHeading";
import Reveal from "../../common/motion/Reveal";

import PlanCard from "./PlanCard";
import Container from "@/app/components/layout/container";

/* ================================================================
   PLANS
================================================================ */

const PLANS = [
    {
        name: "Free",
        price: "₹0",
        billing: "Free forever",

        positioning:
            "For getting every list and price in one place.",

        cta: "Start Free",

        differences: [
            "Unlimited shopping lists",
            "Supported price comparisons",
            "Expense & savings overview",
        ],

        detail: "No credit card required.",

        preferred: false,
    },

    {
        name: "Spendwise Plus",
        price: "Coming soon",

        billing:
            "Priority access when it launches",

        positioning:
            "For deeper insights and more ways to shop better.",

        cta: "Get Started",

        differences: [
            "Everything in Free",
            "Advanced spending insights",
            "Priority product features",
        ],

        detail: "Early access first.",

        preferred: true,
    },
];

/* ================================================================
   PRICING
================================================================ */

export default function Pricing() {
    return (
        <section
            id="pricing"
            className="
                relative
                w-full
                bg-background
                py-16
                dark:bg-darkBackground
                sm:py-24
                lg:py-32
            "
        >
            <Container>
                <div className="mx-auto w-full max-w-6xl">

                    {/* =================================================
                        SECTION HEADER
                    ================================================= */}

                    <div className="max-w-2xl">
                        <Eyebrow
                            label="Pricing"
                            className="mb-3"
                        />

                        <Reveal>
                            <SectionHeading
                                align="left"
                                size="md"
                                maxWidth="max-w-2xl"
                                description="
                                    Everything you need to organise purchases
                                    and compare supported prices.
                                "
                            >
                                Start with a{" "}
                                <span className="text-accent dark:text-darkBrandTeal">
                                    smarter
                                </span>{" "}
                                shopping habit.
                            </SectionHeading>
                        </Reveal>
                    </div>

                    {/* =================================================
                        PLANS
                    ================================================= */}

                    <div
                        className="
                            mx-auto
                            mt-10
                            grid
                            w-full
                            max-w-[350px]
                            gap-5
                            sm:gap-7
                            md:max-w-none
                            md:grid-cols-2
                        "
                    >
                        {PLANS.map((plan, index) => (
                            <Reveal
                                key={plan.name}
                                delay={0.08 + index * 0.08}
                            >
                                <PlanCard plan={plan} />
                            </Reveal>
                        ))}
                    </div>

                    {/* =================================================
                        REASSURANCE
                    ================================================= */}

                    <div
                        className="
                            mx-auto
                            mt-8
                            w-full
                            max-w-[350px]
                            border-t
                            border-border/60
                            pt-5
                            md:max-w-none
                        "
                    >
                        <p
                            className="
                                text-sm
                                text-foreground-muted
                            "
                        >
                            Free to start. No credit
                            card required.
                        </p>
                    </div>

                </div>
            </Container>
        </section>
    );
}