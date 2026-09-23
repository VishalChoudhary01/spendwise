import SourceIcon from "@/app/components/common/SourceIcon/SourceIcon";

import {sources} from "@/app/constants/productLandingCard"

export default function DiscoverState() {
    return (
        <div>
            <div className="flex items-center gap-2 rounded-sm border border-border/70 bg-surface-muted px-3.5 py-2.5">
                <span className="h-2 w-2 rounded-full bg-accent" />

                <span className="text-[0.8rem] font-medium text-foreground-secondary">
                    Comparing supported sources…
                </span>
            </div>

            <div className="mt-2 space-y-1.5">
                {sources.map((source) => (
                    <div
                        key={source.id}
                        className="flex items-center gap-2.5 rounded-sm border border-dashed border-border/60 bg-surface-muted/40 px-3.5 py-2" >
                        <SourceIcon
                            source={source}
                            className="text-sm text-foreground-muted opacity-50"
                        />

                        <span className="text-xs font-medium text-foreground-muted">
                            {source.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}