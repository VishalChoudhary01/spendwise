import React from 'react'
import { FiCheck } from "react-icons/fi";

import SourceIcon from "@/app/components/common/SourceIcon/SourceIcon";

import { sources } from "@/app/constants/productLandingCard"


function BetterPriceState() {
    const supported = sources[2];

    return (
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-success">
                Best available option
            </p>

            <div className="mt-2 flex items-center justify-between  rounded-sm border border-accent/30 dark:border-accent/20 bg-accent/10 dark:bg-accent/5 px-3.5 py-3">
                <span className="flex items-center gap-2.5">
                    <SourceIcon
                        source={supported}
                        className="text-lg text-accent"  />

                    <span className="text-sm font-medium text-foreground">
                        {supported.name}
                    </span>
                </span>

                <span className="flex items-center gap-1.5">
                    <FiCheck
                        className="text-success"
                        aria-hidden="true"
                    />

                    <span className="text-sm font-bold tabular-nums text-success">
                        ₹{supported.price.toLocaleString()}
                    </span>
                </span>
            </div>

            <p className="mt-2 text-xs text-foreground-muted">
                Lowest price we found
            </p>
        </div>
    );
}

export default BetterPriceState