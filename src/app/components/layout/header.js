"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import ThemeToggle from "@/app/components/ui/ThemeToggle";
import Logo from "../common/logo";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";
import CTAButton from "../common/CTAButton";
import MobileMenu from "./MobileMenu";
import { navLinks } from "@/app/constants";
import HoverPillMenu from "../common/hoverPillMenu";
import { useSelector } from "react-redux";

const SECTION_IDS = ["compare", "dashboard", "features", "how-it-works", "pricing"];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    const loaderCompleted =useSelector((state)=>state.ui.loaderCompleted)

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setMobileMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Scroll-spy: track which scroll-story section is currently in view so
    // the nav can highlight the active one (and the mobile menu can too).
    useEffect(() => {
        const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            // A horizontal band near the middle of the viewport counts as "active"
            { rootMargin: "-45% 0px -50% 0px" }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={loaderCompleted ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 }}
                transition={{ duration: 0.6,delay:0.1, ease: "easeOut" }}
                className="fixed top-0 transition-all duration-300 inset-x-0 z-50 flex items-center h-16 md:h-20 px-6 bg-navbarBG/60 dark:bg-darkNavbarBG/80 backdrop-blur-lg border-b border-navbarBorder/50 shadow-sm dark:border-darkNavbarBorder"
            >
                <div className="flex w-full max-w-7xl mx-auto items-center justify-between">
                    {/* Logo + Brand */}
                    <a href="#" className="flex items-center gap-3 shrink-0">
                        <Logo />
                    </a>

                    {/* Desktop Navigation */}
                    <HoverPillMenu
                        items={navLinks}
                        className="hidden md:flex items-center gap-8 text-sm font-medium"
                        linkClassName="text-navlink dark:text-darkNavlink hover:text-primary dark:hover:text-accent"
                        activeHref={activeSection ? `#${activeSection}` : ""}
                    />

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        <Link href="/dashboard">
                            <CTAButton>Get Started</CTAButton>
                        </Link>
                    </div>

                    {/* Hamburger (mobile) */}
                    <button
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="md:hidden p-2 rounded-full text-textPrimary dark:text-darkTextPrimary bg-backgroundSecondary/50 dark:bg-darkBackgroundSecondary/40 backdrop-blur-sm border border-navbarBorder/50 dark:border-darkNavbarBorder transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/10"
                    >
                        <FiMenu size={20} />
                    </button>
                </div>
            </motion.header>

            <MobileMenu
                mobileMenuOpen={mobileMenuOpen}
                activeSection={activeSection}
                onClose={() => setMobileMenuOpen(false)}
            />
        </>
    );
}
