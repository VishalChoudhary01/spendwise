"use client";

import { motion, useTransform } from "motion/react";
import ActiveCard from "./ActiveCard";
import TeaserCard from "./TeaserCard";

const EASE_OUT = [0.22, 1, 0.36, 1];

export default function ShoppingListSlot({
    list,
    index,
    length,
    scrollYProgress,
    type = "active",
}) {
    const step = 1 / length;
    const start = index * step;
    const next = start + step;

    let opacity;
    let y;

    const fadeIn = step * 0.4;

    if (index === 0) {
        opacity = useTransform(
            scrollYProgress,
            [0, start + step, start + step + fadeIn],
            [1, 1, 0]
        );

        y = useTransform(
            scrollYProgress,
            [0, start + step, start + step + fadeIn],
            [0, 0, -14]
        );
    } else if (index === length - 1) {
        opacity = useTransform(
            scrollYProgress,
            [start - fadeIn, start, 1],
            [0, 1, 1]
        );

        y = useTransform(
            scrollYProgress,
            [start - fadeIn, start, 1],
            [14, 0, 0]
        );
    } else {
        opacity = useTransform(
            scrollYProgress,
            [
                start,
                start + fadeIn,
                next,
                next + fadeIn,
            ],
            [0, 1, 1, 0]
        );

        y = useTransform(
            scrollYProgress,
            [
                start,
                start + fadeIn,
                next,
                next + fadeIn,
            ],
            [14, 0, 0, -14]
        );
    }

    return (
        <motion.div
            style={{
                opacity,
                y,
            }}
            transition={{
                ease: EASE_OUT,
            }}
            className="col-start-1 row-start-1"
        >
            {type === "active" ? (
                <ActiveCard list={list} />
            ) : (
                <TeaserCard list={list} />
            )}
        </motion.div>
    );
}