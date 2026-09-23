"use client";

import { motion } from "motion/react";
import { useSelector } from "react-redux";

const PageTransition = ({ children }) => {
    const loaderCompleted = useSelector(
        (state) => state.ui.loaderCompleted
    );

    return (
        <motion.div
            initial={false}
            animate={{
                opacity: loaderCompleted ? 1 : 0,
                y: loaderCompleted ? 0 : 30,
                filter: loaderCompleted
                    ? "blur(0px)"
                    : "blur(20px)",
                scale: loaderCompleted ? 1 : 0.98,
            }}
            transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;