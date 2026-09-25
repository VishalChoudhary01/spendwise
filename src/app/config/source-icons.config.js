import { FaAmazon } from "react-icons/fa";
import { MdNotListedLocation } from "react-icons/md";

import { PRODUCT_PLATFORMS } from "@/app/constants/platforms";

/**
 * React-icon badges — brands rendered as components instead of image
 * assets. Amazon intentionally uses `FaAmazon`; no Amazon SVG exists in
 * the project and none should be added.
 */
const ICON_BADGES = {
    amazon: FaAmazon,
};

/**
 * Single badge mapping for every approved platform.
 *
 * Brand assets come straight from the canonical platform registry
 * (`constants/platforms.js`), so the landing page and the dashboard can
 * never drift apart or introduce duplicate platform entries.
 */
export const SOURCE_ICONS = Object.fromEntries(
    Object.values(PRODUCT_PLATFORMS).map((platform) => [
        platform.id,
        ICON_BADGES[platform.id]
            ? { type: "component", icon: ICON_BADGES[platform.id] }
            : { type: "image", src: platform.badge },
    ])
);

/**
 * Generic placeholder row used by the landing-page demo cards
 * ("Supported source" / "Supported store"). It is not a platform — it
 * only keeps a neutral, non-brand row in the marketing demos.
 */
SOURCE_ICONS.supported = {
    type: "component",
    icon: MdNotListedLocation,
};