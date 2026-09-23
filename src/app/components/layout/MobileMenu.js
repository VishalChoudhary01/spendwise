"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import CTAButton from "../common/CTAButton";
import { navLinks } from "@/app/constants";
import ThemeToggle from "../ui/ThemeToggle";

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
                    transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                    }}
                    className="md:hidden fixed top-[4rem] inset-x-0 z-40 overflow-hidden bg-navbarBG dark:bg-darkNavbarBG backdrop-blur-lg border-b border-navbarBorder dark:border-darkNavbarBorder"
                >
                    <div className="max-w-7xl mx-auto px-6 py-6">
                        {/* Navigation Links */}
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) => {
                                const sectionId = link.href.replace("#", "");
                                const isActive = activeSection === sectionId;

                                return (
                                    <motion.a
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        key={link.href}
                                        href={link.href}
                                        onClick={onClose}
                                        className={`rounded-xl px-4 py-2 transition-colors text-[0.88rem] font-medium ${isActive
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
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
