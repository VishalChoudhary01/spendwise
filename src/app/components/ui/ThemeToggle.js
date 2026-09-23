"use client";

import { motion } from "motion/react";
import { TbSunFilled } from "react-icons/tb";
import { FaMoon } from "react-icons/fa6";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="h-10 w-18" />
        );
    }

    const dark = resolvedTheme === "dark";

    const toggleTheme = () => {
        setTheme(dark ? "light" : "dark");
    };

    return (
        <motion.button
            type="button"
            onClick={toggleTheme}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            aria-label={
                dark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            }
            className="relative flex items-center cursor-pointer h-10 w-18 rounded-full p-1 bg-backgroundSecondary/80 dark:bg-darkBackgroundSecondary/20 backdrop-blur-md border border-black/5 dark:border-white/10 transition-colors duration-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brandTeal/50 dark:focus-visible:ring-darkBrandTeal/60"
        >
            {/* Icons */}
            <div className="absolute inset-0 flex items-center justify-between px-2.5">
                <TbSunFilled
                    size={14}
                    className="text-amber-800 dark:text-darkTextMuted"
                />

                <FaMoon
                    size={12}
                    className="text-textMuted dark:text-amber-300"
                />
            </div>

            {/* Sliding Knob */}
            <motion.div
                animate={{
                    x: dark ? 32 : 0,
                }}
                transition={{
                    duration: 0.25,
                    ease: "easeInOut",
                }}
                className="relative z-10 flex items-center justify-center h-8 w-8 rounded-full bg-white dark:bg-slate-900 border border-black/5 dark:border-white/10 shadow-md"
            >
                {dark ? (
                    <FaMoon
                        size={12}
                        className="text-darkAccent"
                    />
                ) : (
                    <TbSunFilled
                        size={14}
                        className="text-amber-700"
                    />
                )}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;