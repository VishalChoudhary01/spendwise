"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { TRANSITION } from "@/app/lib/motion/transitions";
import Link from "next/link";
import CTAButton from "../common/CTAButton";
import { navLinks } from "@/app/constants";
import ThemeToggle from "../ui/ThemeToggle";
import Container from "./container";

const MobileMenu = ({ mobileMenuOpen, activeSection, onClose }) => {
    return (
        <AnimatePresence>
            {mobileMenuOpen && (
                <motion.div
                    initial={{
                        height: 0,
                        opacity: 0,
                    }}
                    animate={{
                        height: "auto",
                        opacity: 1,
                    }}
                    exit={{
                        height: 0,
                        opacity: 0,
                    }}
                    transition={TRANSITION.normal}
                    className="lg:hidden fixed top-[4rem] md:top-[5rem] inset-x-0 z-40 overflow-hidden bg-navbarBG dark:bg-darkNavbarBG backdrop-blur-lg border-b border-navbarBorder dark:border-darkNavbarBorder"
                >
                    <Container className="py-6">
                        {/* Navigation Links */}
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => {
                                const sectionId = link.href.replace("#", "");
                                const isActive = activeSection === sectionId;

                                return (
                                    <motion.a
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={TRANSITION.normal}
                                        key={link.href}
                                        href={link.href}
                                        onClick={onClose}
                                        className={`inline-flex min-h-11 items-center rounded-xl px-4 py-2 transition-colors text-[0.88rem] font-medium ${isActive
                                                ? "bg-primarySoft text-primary dark:bg-darkPrimarySoft dark:text-darkAccent"
                                                : "text-textSecondary dark:text-darkTextSecondary"
                                            }`}
                                    >
                                        {link.label}
                                    </motion.a>
                                );
                            })}
                        </nav>

                        {/* Divider */}
                        <div className="my-6 border-t border-navbarBorder dark:border-darkNavbarBorder" />

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-4 px-2">
                            <Link href="/dashboard">
                                <CTAButton>Get Started</CTAButton>
                            </Link>
                            <ThemeToggle />
                        </div>
                    </Container>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
