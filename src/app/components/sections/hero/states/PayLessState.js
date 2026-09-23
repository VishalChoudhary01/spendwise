import { bestAvailablePrice, savings } from "@/app/constants/productLandingCard";


export default function PayLessState() {
    return (
        <div className="rounded-sm border border-successBorder bg-successSoft dark:bg-successSoft/40 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-success">
                Best available option
            </p>

            <div className="mt-2 flex items-end justify-between gap-3">
                <p className="text-3xl font-bold tracking-tight text-success md:text-4xl">
                    ₹{bestAvailablePrice.toLocaleString()}
                </p>
 
                <p className="pb-0.5 text-sm font-semibold text-success">
                    Save ₹{savings.toLocaleString()}
                </p>
            </div>
        </div>
    );
}