import SourceIcon from "@/app/components/common/SourceIcon/SourceIcon";
import { FaCheck } from "react-icons/fa6";


function PriceRow({ source, winner = false }) {


    return (
        <div
            className={`flex items-center justify-between rounded-sm border px-2 py-1.5 sm:px-3.5 sm:py-2.5  ${
                winner
                    ? "border-successBorder bg-successSoft/60"
                    : "border-border bg-surface-muted"
            }`}
        >
            <span className="flex items-center gap-1.5 sm:gap-2.5">
                <SourceIcon
                    source={source}
                    className={`text-base sm:text-lg ${
                        winner ? "text-foreground" : "text-foreground-secondary"
                    }`}
                />
                <span
                    className={`text-xs sm:text-sm font-medium ${
                        winner ? "text-foreground" : "text-foreground-secondary"
                    }`}
                >
                    {source.name}
                </span>
            </span>
            <span
                className={`flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold tabular-nums ${
                    winner ? "text-success" : "text-foreground"
                }`}
            >
                {winner && <FaCheck size={13} className="text-success" /> }
                ₹{source.price.toLocaleString()}
            </span>
        </div>
    );
}

export default PriceRow