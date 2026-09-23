"use client";

import { useRef, useState } from "react";
import {
    useMotionValueEvent,
    useScroll,
    useTransform,
} from "motion/react";

import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import {
    MOBILE_QUERY,
    REDUCED_MOTION_QUERY,
} from "@/app/constants/mediaQueries";

import {
    shoppingLists,
    SECTION_LABEL,
    SECTION_DESCRIPTION,
    SECTION_TITLE,
} from "@/app/constants/shoppingLists";

import MobileShoppingListCarousel from "./MobileShoppingListCarousel";
import ShoppingListSlot from "./ShoppingListSlot";

import Eyebrow from "@/app/components/common/Eyebrow";
import SectionHeading from "../../common/SectionHeading";
import ProgressIndicator from "@/app/components/common/ProgressIndicator";

export default function ShoppingListsShowcaseSection() {
    const isMobile = useMediaQuery(MOBILE_QUERY);
    const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

    const isStatic = isMobile || reducedMotion;

    const sectionRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end 100%"],
    });

    /*
     * Scroll stages — one per shopping list.
     * Thresholds are computed dynamically so adding
     * new lists to the array automatically extends the section.
     */
    const stageProgress = useTransform(scrollYProgress, (value) => {
        const count = shoppingLists.length;
        const step = 1 / count;

        for (let i = count - 1; i >= 1; i--) {
            if (value >= i * step + step * 0.4) return i;
        }

        return 0;
    });

    const [stage, setStage] = useState(0);

    useMotionValueEvent(stageProgress, "change", (value) => {
        const nextStage = Math.round(value);

        setStage((current) =>
            current === nextStage ? current : nextStage
        );
    });

    return (
        <section
            ref={sectionRef}
            className={`
        relative
        w-full
        bg-background
        ${isStatic ? "" : "lg:h-[500vh]"}
      `}
        >
            {/* ================================================================ */}
            {/* STATIC ATMOSPHERE                                                */}
            {/* ================================================================ */}

            {/*
       * Deliberately static.
       *
       * No animated blobs.
       * No transforms tied to scroll.
       * This gives the section depth without competing
       * with the card transitions.
       */}
            <div
                aria-hidden="true"
                className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_50%_36%,rgba(23,183,193,0.035),transparent_42%)]
          dark:bg-[radial-gradient(circle_at_50%_36%,rgba(23,183,193,0.045),transparent_42%)]
        "
            />

            {/* ================================================================ */}
            {/* STICKY VIEWPORT                                                  */}
            {/* ================================================================ */}

            <div
                className={`
          relative
          overflow-hidden
          ${isStatic
                        ? ""
                        : "lg:sticky lg:top-0 lg:h-screen"
                    }
        `}
            >
                <div
                    className={`
            relative
            z-10
            mx-auto
            flex
            w-full
            max-w-7xl
            flex-col
            items-center
            px-6
            ${isStatic
                            ? "py-16 sm:py-28"
                            : "pt-20 lg:h-full"
                        }
          `}
                >
                    {/* ============================================================ */}
                    {/* HEADING                                                       */}
                    {/* ============================================================ */}

                    <div className="max-w-2xl text-center">
                        <Eyebrow label={SECTION_LABEL} />

                        <SectionHeading
                            align="center"
                            size="md"
                            description={SECTION_DESCRIPTION}
                            className="mt-1"
                        >
                            {SECTION_TITLE}
                        </SectionHeading>
                    </div>

                    {/* ============================================================ */}
                    {/* MOBILE                                                        */}
                    {/* ============================================================ */}

                    {isStatic ? (
                        <div className="mt-8 w-full max-w-xl">
                            <MobileShoppingListCarousel
                                lists={shoppingLists}
                            />
                        </div>
                    ) : (
                        <>
                            {/* ======================================================== */}
                            {/* DESKTOP CAROUSEL                                         */}
                            {/* ======================================================== */}

                            <div
                                className="
                  mt-7
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-4
                  lg:flex-nowrap
                "
                            >
                                {/* ------------------------------------------------------ */}
                                {/* LEFT TEASER                                            */}
                                {/* ------------------------------------------------------ */}

                                <div className="hidden w-56 shrink-0 lg:block">
                                    <div className="grid">
                                        {shoppingLists.map((list, index) => {
                                            const teaserIndex =
                                                (index + 1) %
                                                shoppingLists.length;

                                            return (
                                                <ShoppingListSlot
                                                    key={`${list.id}-left`}
                                                    list={
                                                        shoppingLists[
                                                        teaserIndex
                                                        ]
                                                    }
                                                    index={index}
                                                    length={shoppingLists.length}
                                                    scrollYProgress={
                                                        scrollYProgress
                                                    }
                                                    type="teaser"
                                                />
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ------------------------------------------------------ */}
                                {/* ACTIVE CARD                                             */}
                                {/* ------------------------------------------------------ */}

                                {/*
                 * Intentionally NO scale transform here.
                 *
                 * The active card should remain physically anchored
                 * while the content transitions through it.
                 */}
                                <div
                                    className="
                    w-full
                    max-w-[560px]
                  "
                                >
                                    <div className="grid">
                                        {shoppingLists.map(
                                            (list, index) => (
                                                <ShoppingListSlot
                                                    key={`${list.id}-active`}
                                                    list={list}
                                                    index={index}
                                                    length={
                                                        shoppingLists.length
                                                    }
                                                    scrollYProgress={
                                                        scrollYProgress
                                                    }
                                                    type="active"
                                                />
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* ------------------------------------------------------ */}
                                {/* RIGHT TEASER                                           */}
                                {/* ------------------------------------------------------ */}

                                <div className="hidden w-56 shrink-0 lg:block">
                                    <div className="grid">
                                        {shoppingLists.map((list, index) => {
                                            const teaserIndex =
                                                (index +
                                                    shoppingLists.length -
                                                    1) %
                                                shoppingLists.length;

                                            return (
                                                <ShoppingListSlot
                                                    key={`${list.id}-right`}
                                                    list={
                                                        shoppingLists[
                                                        teaserIndex
                                                        ]
                                                    }
                                                    index={index}
                                                    length={shoppingLists.length}
                                                    scrollYProgress={
                                                        scrollYProgress
                                                    }
                                                    type="teaser"
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* ======================================================== */}
                            {/* SCROLL PROGRESS                                          */}
                            {/* ======================================================== */}

                            <div
                                className="
                  absolute
                  bottom-5
                  left-1/2
                  z-30
                  hidden
                  -translate-x-1/2
                  lg:block
                "
                            >
                                <ProgressIndicator
                                    current={stage}
                                    total={shoppingLists.length}
                                    label="Shopping lists progress"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}