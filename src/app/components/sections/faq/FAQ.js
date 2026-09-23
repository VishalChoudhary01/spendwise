"use client";

import { useState } from "react";

import Eyebrow from "../../common/Eyebrow";
import SectionHeading from "../../common/SectionHeading";

import FAQItem from "./FAQItem";

/* ================================================================
   FAQ DATA
================================================================ */

const QUESTIONS = [
    {
        q: "How does SmartShop compare prices?",
        a: "SmartShop compares supported price sources for a product and shows the available options together so you can see the difference before deciding.",
    },
    {
        q: "Where do the prices come from?",
        a: "Prices come from the supported sources SmartShop can actively check — such as Amazon and Flipkart — and each one is shown with its source name.",
    },
    {
        q: "How often are prices updated?",
        a: "Prices are updated based on the connected source and the latest information available to SmartShop.",
    },
    {
        q: "Do I have to buy through SmartShop?",
        a: "No. SmartShop shows you the better available option it found; where you buy is up to you.",
    },
    {
        q: "Can I create multiple shopping lists?",
        a: "Yes. You can create as many shopping lists as you need — groceries, gifts, travel essentials, and more.",
    },
    {
        q: "How does SmartShop calculate savings?",
        a: "Savings are the difference between the highest supported price found and the best available option.",
    },
    {
        q: "Is SmartShop free?",
        a: "Yes. You can create lists, add products, and compare supported prices without a credit card.",
    },
];

/* ================================================================
   FAQ SECTION
================================================================ */

export default function FAQ() {
    /*
     * First question is open by default.
     */

    const [open, setOpen] = useState(0);

    const handleToggle = (index) => {
        setOpen((current) =>
            current === index
                ? -1
                : index
        );
    };

    return (
        <section
            id="faq"
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
                    grid
                    w-full
                    max-w-7xl
                    gap-10
                    lg:grid-cols-[0.8fr_1.2fr]
                    lg:gap-16
                "
            >
                {/* =================================================
                    LEFT — SECTION INTRO
                ================================================= */}

                <div className="max-w-xl">
                    {/* ---------------------------------------------
                        EYEBROW
                    --------------------------------------------- */}

                    <Eyebrow
                        label="FAQ"
                        className="mb-3"
                    />

                    {/* ---------------------------------------------
                        SECTION HEADING
                    --------------------------------------------- */}

                    <SectionHeading
                        align="left"
                        size="md"
                        maxWidth="max-w-xl"
                        description="
                            Everything you need to know before you
                            start shopping smarter.
                        "
                    >
                        Questions,{" "}
                        <span className="text-accent">
                            answered.
                        </span>
                    </SectionHeading>
                </div>

                {/* =================================================
                    RIGHT — ACCORDION
                ================================================= */}

                <div className="w-full max-w-[680px]">
                    <div
                        className="
                            divide-y
                            divide-border
                            border-y
                            border-border
                        "
                    >
                        {QUESTIONS.map(
                            (item, index) => (
                                <FAQItem
                                    key={item.q}
                                    id={index}
                                    question={
                                        item.q
                                    }
                                    answer={
                                        item.a
                                    }
                                    open={
                                        open ===
                                        index
                                    }
                                    onToggle={() =>
                                        handleToggle(
                                            index
                                        )
                                    }
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}