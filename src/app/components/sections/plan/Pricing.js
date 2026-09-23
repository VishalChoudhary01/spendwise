"use client";

import Eyebrow from "../../common/Eyebrow";
import SectionHeading from "../../common/SectionHeading";

import PlanCard from "./PlanCard";

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

        detail:
            "No credit card required.",

        preferred: false,
    },

    {
        name: "SmartShop Plus",
        price: "Coming soon",

        billing:
            "Priority access when it launches",

        positioning:
            "For deeper insights and more ways to shop better.",

        cta: "Get started",

        differences: [
            "Everything in Free",
            "Advanced spending insights",
            "Priority product features",
        ],

        detail:
            "Early access first.",

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
                px-6
                py-16
                dark:bg-darkBackground
                sm:py-24
                lg:py-32
            "
        >
            <div
                className="
                    mx-auto
                    w-full
                    max-w-7xl
                "
            >
                {/* =================================================
                    SECTION HEADER
                ================================================= */}

                <div className="max-w-2xl">
                    {/* ---------------------------------------------
                        EYEBROW

                        Shared project component.
                    --------------------------------------------- */}

                    <Eyebrow
                        label="Pricing"
                        className="mb-3"
                    />

                    {/* ---------------------------------------------
                        SECTION HEADING

                        Shared project component.
                    --------------------------------------------- */}

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
                        <span className="text-accent">
                            smarter
                        </span>{" "}
                        shopping habit.
                    </SectionHeading>
                </div>

                {/* =================================================
                    PLANS
                ================================================= */}

                <div
                    className="
                        mt-10
                        grid
                        gap-5
                        md:grid-cols-2
                    "
                >
                    {PLANS.map(
                        (plan) => (
                            <PlanCard
                                key={plan.name}
                                plan={plan}
                            />
                        )
                    )}
                </div>

                {/* =================================================
                    REASSURANCE
                ================================================= */}

                <p
                    className="
                        mt-6
                        text-sm
                        text-foreground-muted
                    "
                >
                    Free to start. No credit
                    card required.
                </p>
            </div>
        </section>
    );
}