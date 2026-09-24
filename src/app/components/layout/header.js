"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { EASE } from "@/app/lib/motion/easings";
import ThemeToggle from "@/app/components/ui/ThemeToggle";
import Logo from "../common/logo";
import { FiMenu } from "react-icons/fi";
import MobileMenu from "./MobileMenu";
import Container from "./container";
import { navLinks } from "@/app/constants";
import HoverPillMenu from "../common/hoverPillMenu";
import PrimaryLinkButton from "../common/button/PrimaryLinkButton";
import { useSelector } from "react-redux";

const SECTION_IDS = ["features", "how-it-works", "pricing"];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    const loaderCompleted = useSelector(
        (state) => state.ui.loaderCompleted
    );

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Scroll-spy
    useEffect(() => {
        const sections = SECTION_IDS
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        if (sections.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-45% 0px -50% 0px",
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <motion.header
                initial={{
                    y: -80,
                    opacity: 0,
                }}
                animate={
                    loaderCompleted
                        ? {
                            y: 0,
                            opacity: 1,
                        }
                        : {
                            y: -80,
                            opacity: 0,
                        }
                }
                transition={{
                    duration: 0.6,
                    delay: 0.1,
                    ease: EASE.standard,
                }}
                className="
                    fixed
                    inset-x-0
                    top-0
                    z-50
                    flex
                    h-16
                    items-center
                    border-b
                    border-navbarBorder/50
                    bg-navbarBG/60
                    shadow-sm
                    backdrop-blur-lg
                    transition-all
                    duration-300
                    dark:border-darkNavbarBorder
                    dark:bg-darkNavbarBG/80
                    md:h-20
                "
            >
                <Container className="flex items-center justify-between">
                    {/* Logo + Brand */}
                    <a
                        href="#"
                        className="flex shrink-0 items-center gap-3"
                    >
                        <Logo />
                    </a>

                    {/* Desktop Navigation */}
                    <HoverPillMenu
                        items={navLinks}
                        className="
                            hidden
                            items-center
                            gap-8
                            text-sm
                            font-medium
                            lg:flex
                        "
                        linkClassName="
                            text-navlink
                            hover:text-primary
                            dark:text-darkNavlink
                            dark:hover:text-accent
                        "
                        activeHref={
                            activeSection
                                ? `#${activeSection}`
                                : ""
                        }
                    />

                    {/* CTA */}
                    <div className="hidden items-center gap-4 lg:flex">
                        <ThemeToggle />

                        <PrimaryLinkButton size="compact" href="/dashboard">
                            Get Started
                        </PrimaryLinkButton>
                    </div>

                    {/* Hamburger */}
                    <button
                        type="button"
                        onClick={() =>
                            setMobileMenuOpen((prev) => !prev)
                        }
                        aria-label={
                            mobileMenuOpen
                                ? "Close menu"
                                : "Open menu"
                        }
                        aria-expanded={mobileMenuOpen}
                        className="
                            rounded-full
                            border
                            border-navbarBorder/50
                            bg-backgroundSecondary/50
                            p-3
                            text-textPrimary
                            backdrop-blur-sm
                            transition-all
                            duration-300
                            hover:bg-white/80
                            dark:border-darkNavbarBorder
                            dark:bg-darkBackgroundSecondary/40
                            dark:text-darkTextPrimary
                            dark:hover:bg-white/10
                            lg:hidden
                        "
                    >
                        <FiMenu size={20} />
                    </button>
                </Container>
            </motion.header>

            <MobileMenu
                mobileMenuOpen={mobileMenuOpen}
                activeSection={activeSection}
                onClose={() => setMobileMenuOpen(false)}
            />
        </>
    );
}