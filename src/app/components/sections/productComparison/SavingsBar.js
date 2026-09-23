import { FiCheck } from "react-icons/fi";
import { savings } from "@/app/constants/productLandingCard";

// Stage 05 — calm semantic success, no flashy celebration (spec §10.2).
export default function SavingsBar() {
  return (
    <div className="flex items-center justify-between rounded-sm border border-successBorder/90 dark:border-successBorder/60 bg-successSoft/70 dark:bg-successSoft/50 px-2 py-2 sm:px-3.5 sm:py-3">
      <span className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-foreground">
        <FiCheck size={12} className="text-success sm:w-3.5 sm:h-3.5" />
        Best available option
      </span>
      <span className="text-xs sm:text-sm font-bold tabular-nums text-success">
        Save ₹{savings.toLocaleString()}
      </span>
    </div>
  );
}
