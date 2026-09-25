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
}) {
    const [imageFailed, setImageFailed] = useState(false);

    const key = resolveBadgeKey(source);
    const config = key ? SOURCE_ICONS[key] : null;

    // Safe fallback (§13): missing config, removed/legacy platform or a
    // badge image that failed to load — never crash the surrounding UI.
    if (!config || imageFailed) {
        return (
            <Store
                className={`shrink-0 ${className}`}
                aria-hidden="true"
            />
        );
    }

    if (config.type === "image" && config.src) {
        return (
            <Image
                src={config.src}
                alt={source.name || source.store || "Store"}
                width={20}
                height={20}
                onError={() => setImageFailed(true)}
                className={`h-5 w-5 shrink-0 object-contain ${className}`}
            />
        );
    }

    const Icon = config.icon;

    return (
        <Icon
            className={`shrink-0 ${className}`}
            aria-hidden="true"
        />
    );
}