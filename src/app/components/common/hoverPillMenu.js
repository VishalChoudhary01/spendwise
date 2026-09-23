"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";


export default function HoverPillMenu({
    items,
    direction = "horizontal",
    className = "",
    linkClassName,
    activeHref = "",
}) {
    const navRef = useRef(null);
    const linkRefs = useRef({});

    const [position, setPosition] = useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        opacity: 0,
    });
    const [hovering, setHovering] = useState(false);

    const getPosition = useCallback((el) => {
        const parentRect = navRef.current.getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        return {
            left: rect.left - parentRect.left,
            top: rect.top - parentRect.top,
            width: rect.width,
            height: rect.height,
            opacity: 1,
        };
    }, []);


    useEffect(() => {
        if (hovering) return;
        const activeEl = activeHref ? linkRefs.current[activeHref] : null;
        if (activeEl) {
            setPosition(getPosition(activeEl));
        } else {
            setPosition((prev) => ({ ...prev, opacity: 0 }));
        }
    }, [activeHref, hovering, getPosition]);

    
    useEffect(() => {
        const handleResize = () => {
            if (hovering) return;
            const activeEl = activeHref ? linkRefs.current[activeHref] : null;
            if (activeEl) setPosition(getPosition(activeEl));
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [activeHref, hovering, getPosition]);

    const handleHover = (e) => {
        setHovering(true);
        setPosition(getPosition(e.currentTarget));
    };

    const handleLeave = () => {
        setHovering(false);
        // Spring back to the active link — or fade out if there is none.
        const activeEl = activeHref ? linkRefs.current[activeHref] : null;
        if (activeEl) {
            setPosition(getPosition(activeEl));
        } else {
            setPosition((prev) => ({ ...prev, opacity: 0 }));
        }
    };

    return (
        <nav
            ref={navRef}
            onMouseLeave={handleLeave}
            className={`
                relative flex
                ${direction === "horizontal" ? "flex-row" : "flex-col"}
                gap-2
                ${className}
            `}
        >
            <motion.div
                animate={position}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                }}
                className="absolute rounded-full pointer-events-none backdrop-blur-2xl bg-brandTeal/12 dark:bg-brandTeal/14 border border-white/60 dark:border-white/5 shadow-[inset_0_1px_1px_rgba(20,20,20,0.18),0_0_12px_rgba(255,255,255,0.03)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_0_12px_rgba(255,255,255,0.03)] "
            />
            {items.map((item) => {
                const isActive = activeHref === item.href;
                return (
                    <Link
                        key={item.href}
                        ref={(el) => {
                            linkRefs.current[item.href] = el;
                        }}
                        href={item.href}
                        onMouseEnter={handleHover}
                        className={`${linkClassName} relative z-10 px-4 py-2 rounded-full transition-colors duration-300 ${isActive ? "text-primary dark:text-accent" : ""
                            }`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
