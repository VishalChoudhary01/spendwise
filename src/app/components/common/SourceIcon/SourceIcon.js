import Image from "next/image";

import { SOURCE_ICONS } from "@/app/config/source-icons.config";

export default function SourceIcon({
    source,
    className = "",
}) {
    const config = SOURCE_ICONS[source.id];

    if (!config) {
        return null;
    }

    if (config.type === "image") {
        return (
            <Image
                src={config.src}
                alt={source.name}
                width={18}
                height={18}
                className={`shrink-0 object-contain ${className}`}
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