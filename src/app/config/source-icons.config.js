import { GrAmazon } from "react-icons/gr";
import { MdNotListedLocation } from "react-icons/md";

import flipkart from "../../../public/images/svg/platform/flipkart.svg";

export const SOURCE_ICONS = {
    amazon: {
        type: "component",
        icon: GrAmazon,
    },

    flipkart: {
        type: "image",
        src: flipkart,
    },

    supported: {
        type: "component",
        icon: MdNotListedLocation,
    },
};