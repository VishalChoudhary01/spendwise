"use client";

import Image from "next/image";
import { useState } from "react";
import { Store } from "lucide-react";

import { SOURCE_ICONS } from "@/app/config/source-icons.config";
import { getPlatformByStoreName } from "@/app/constants/platforms";

/**
 * Resolves a source object to a badge key in SOURCE_ICONS.
 *
 * Supports landing sources (`id`), persisted dashboard sources
 * (`platform`) and legacy store names (`store` / `name`) such as
 * "JioMart" or the removed "Jio Mart" spelling. Unknown/legacy
 * platforms resolve to null so the caller can render the generic
 * fallback badge instead of crashing.
 */
function resolveBadgeKey(source) {
    if (!source) return null;
    if (source.id) return source.id;
    if (source.platform) return source.platform;
    return getPlatformByStoreName(source.store || source.name);
}

export default function SourceIcon({
    source,
    className = "",
    /**
     * Optional explicit box size (e.g. "h-4 w-4"). When omitted the
     * image badge keeps its original 20px box and icon components stay
     * sized purely by the caller's `className`, exactly as before.
     */
    sizeClass,
    /**
     * Draws a light chip behind image badges so dark brand logos
     * (Myntra, Zepto…) stay visible on dark surfaces. Icon badges
     * (Amazon) and the fallback are unaffected.
     */
    chip = false,
}) {
    const [imageFailed, setImageFailed] = useState(false);

    const size = sizeClass || "";

    const key = resolveBadgeKey(source);
    const config = key ? SOURCE_ICONS[key] : null;

    // Safe fallback (§13): missing config, removed/legacy platform or a
    // badge image that failed to load — never crash the surrounding UI.
    if (!config || imageFailed) {
        return (
            <Store
                className={`shrink-0 ${size} ${className}`.trim()}
                aria-hidden="true"
            />
        );
    }

    if (config.type === "image" && config.src) {
        if (chip) {
            return (
                <span
                    className={`inline-flex ${sizeClass || "h-5 w-5"} shrink-0 items-center justify-center rounded-[4px] bg-white p-[2px]`}
                    title={source.name || source.store || "Store"}
                >
                    <Image
                        src={config.src}
                        alt={source.name || source.store || "Store"}
                        width={20}
                        height={20}
                        onError={() => setImageFailed(true)}
                        className="h-full w-full object-contain"
                    />
                </span>
            );
        }

        return (
            <Image
                src={config.src}
                alt={source.name || source.store || "Store"}
                width={20}
                height={20}
                onError={() => setImageFailed(true)}
                className={`${sizeClass || "h-5 w-5"} shrink-0 object-contain ${className}`}
            />
        );
    }

    const Icon = config.icon;

    return (
        <Icon
            className={`shrink-0 ${size} ${className}`.trim()}
            aria-hidden="true"
        />
    );
}