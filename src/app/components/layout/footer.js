"use client";

import { useCallback, useRef, useState } from "react";
import { FaGithub, FaLinkedinIn} from "react-icons/fa6";
import FooterAmbient from "@/app/components/layout/FooterAmbient";
import Container from "./container";
import Logo from "../common/logo";
import Link from "next/link";

const initialLinkGroups = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "Pricing", href: "#pricing" },
        ],
    },
    {
        title: "Resources",
        links: [
            { label: "FAQ", href: "#faq" },
            { label: "Support", href: "#" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About", href: "#" },
            { label: "Contact", href: "#" },
        ],
    },
];

const initialSocials = [
    { label: "GitHub", icon: FaGithub, href: "#" },
    { label: "LinkedIn", icon: FaLinkedinIn, href: "#" },
];

export default function Footer() {
    const footerRef = useRef(null);
    const panelRef = useRef(null);
    const focusTimeoutRef = useRef(null);
    const jumpTimeoutRef = useRef(null);

    const [isFooterFocused, setIsFooterFocused] = useState(false);
    const [jumpKey, setJumpKey] = useState(0);

    // Drag-and-drop state
    const [linkGroups, setLinkGroups] = useState(initialLinkGroups);
    const [socials, setSocials] = useState(initialSocials);
    const [draggedSection, setDraggedSection] = useState(null);
    const [dragOverSection, setDragOverSection] = useState(null);

    // Combine link groups and socials into one reorderable list
    const sections = [
        ...linkGroups.map((group) => ({
            ...group,
            _type: "linkGroup",
        })),
        {
            _type: "socials",
            title: "Follow",
            items: socials,
        },
    ];

    const handleDragStart = useCallback((e, index) => {
        setDraggedSection(index);

        e.dataTransfer.effectAllowed = "move";

        const img = new Image();
        img.src =
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

        e.dataTransfer.setDragImage(img, 0, 0);
    }, []);

    const handleDragOver = useCallback((e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setDragOverSection(index);
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggedSection(null);
        setDragOverSection(null);
    }, []);

    const handleDrop = useCallback(
        (e, dropIndex) => {
            e.preventDefault();

            if (
                draggedSection === null ||
                draggedSection === dropIndex
            ) {
                setDraggedSection(null);
                setDragOverSection(null);
                return;
            }

            const newSections = [...sections];

            const [moved] = newSections.splice(draggedSection, 1);
            newSections.splice(dropIndex, 0, moved);

            // Separate back into link groups and socials
            const newGroups = [];
            let newSocialItems = null;

            for (const section of newSections) {
                if (section._type === "socials") {
                    newSocialItems = section.items;
                } else {
                    newGroups.push({
                        title: section.title,
                        links: section.links,
                    });
                }
            }

            setLinkGroups(newGroups);

            if (newSocialItems) {
                setSocials(newSocialItems);
            }

            setDraggedSection(null);
            setDragOverSection(null);
        },
        [draggedSection, sections]
    );

    const handleFocusEnter = useCallback(() => {
        clearTimeout(focusTimeoutRef.current);
        setIsFooterFocused(true);
    }, []);

    const handleFocusLeave = useCallback(() => {
        focusTimeoutRef.current = setTimeout(() => {
            setIsFooterFocused(false);
        }, 120);
    }, []);

    const handleAmbientSettled = useCallback(() => {
        setJumpKey((key) => key + 1);
        clearTimeout(jumpTimeoutRef.current);
    }, []);

    return (
        <footer ref={footerRef} className=" relative overflow-hidden border-t border-border bg-footerBg pb-12 sm:pb-16 lg:pb-20 dark:bg-darkFooterBg "
            onMouseEnter={handleFocusEnter}
            onMouseLeave={handleFocusLeave}
            onFocusCapture={handleFocusEnter}
            onBlurCapture={handleFocusLeave}
        >
            <FooterAmbient
                footerRef={footerRef}
                panelRef={panelRef}
                isFooterFocused={isFooterFocused}
                onSettled={handleAmbientSettled}
            />

            <Container className="relative z-10 pt-12 pb-6 sm:pt-16 sm:pb-8 lg:pt-20 lg:pb-10">
                <div key={jumpKey} ref={panelRef} className=" rounded-2xl border border-border bg-surface/30 p-5 backdrop-blur-md dark:bg-surface/20 sm:p-8 lg:p-10 xl:p-12 footer-jump " >
                    {/*
                     * Desktop:
                     *
                     * Brand       Product    Resources    Company    Follow
                     * 2fr         1fr        1fr          1fr        200px+
                     */}
                    <div className=" grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(200px,auto)] lg:gap-x-8 lg:gap-y-0 xl:gap-x-10 " >
                
                        <div className=" min-w-0 sm:col-span-2 md:col-span-3 lg:col-span-1 " >
                            <Link href="#home" className=" inline-flex rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " >
                                <Logo />
                            </Link>

                            <p className=" mt-4 max-w-sm text-sm leading-relaxed text-foreground-muted " >
                                Compare prices, organize purchases, and shop
                                with more confidence.
                            </p>
                        </div>

                        {/* DRAGGABLE SECTIONS */}
                        {sections.map((section, index) => {
                            const isDragging =
                                draggedSection === index;

                            const isOver =
                                dragOverSection === index &&
                                draggedSection !== index;

                            const isSocials =
                                section._type === "socials";

                            return (
                                <div
                                    key={section.title}
                                    draggable
                                    onDragStart={(e) =>
                                        handleDragStart(e, index)
                                    }
                                    onDragOver={(e) =>
                                        handleDragOver(e, index)
                                    }
                                    onDragEnd={handleDragEnd}
                                    onDrop={(e) =>
                                        handleDrop(e, index)
                                    }
                                    className={` min-w-0 transition-opacity duration-150 cursor-grab active:cursor-grabbing ${isDragging ? "opacity-40" : "opacity-100"} ${isOver ? "rounded-lg ring-2 ring-accent/40" : ""} ${isSocials ? "lg:min-w-[200px]" : ""} `}
                                >
                                    {/* Section title */}
                                    <h4 className=" font-label text-xs font-semibold uppercase tracking-[0.14em] text-foreground-secondary " >
                                        {section.title}
                                    </h4>

                                    {/*  SOCIALS */}
                                    {isSocials ? (
                                        <div className=" mt-4 flex flex-wrap gap-2 " >
                                            {section.items.map(
                                                (social) => {
                                                    const Icon =
                                                        social.icon;

                                                    return (
                                                        <Link key={social.label} href={social.href} aria-label={social.label}
                                                            className=" flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface-muted text-foreground-muted transition-colors duration-150 hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:bg-surface-muted " >
                                                            <Icon size={16} aria-hidden="true" />
                                                        </Link>
                                                    );
                                                }
                                            )}
                                        </div>
                                    ) : (
                                            //     LINK GROUP
                                            <ul className=" mt-4 space-y-3 " >
                                            {section.links.map(
                                                (link) => (
                                                    <li
                                                        key={
                                                            link.label
                                                        }
                                                    >
                                                        <Link href={link.href} className=" group inline-flex max-w-full items-center text-sm font-medium text-foreground-muted transition-colors duration-150 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent "  >
                                                            <span className=" transition-transform duration-150 group-hover:translate-x-0.5 " >
                                                                {
                                                                    link.label
                                                                }
                                                            </span>
                                                        </Link>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* LEGAL / COPYRIGHT */}
                    <div className=" mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs text-foreground-muted sm:mt-12 sm:flex-row sm:gap-6 " >
                        <p className="text-center sm:text-left">
                            © {new Date().getFullYear()} Spendwise
                        </p>

                        <div className=" flex flex-wrap items-center justify-center gap-x-6 gap-y-2 " >
                            <Link href="#" className=" transition-colors duration-150 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " >
                                Privacy Policy
                            </Link>

                            <Link href="#" className=" transition-colors duration-150 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " >
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
}