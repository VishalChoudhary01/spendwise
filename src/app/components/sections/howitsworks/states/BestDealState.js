"use client";

export default function BestDealState() {
    return (
        <div
            className="
                rounded-md
                border
                border-successBorder
                bg-successSoft
                px-4
                py-5
            "
        >
            <p
                className="
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-success
                "
            >
                Best available option
            </p>

            <p
                className="
                    mt-2
                    text-4xl
                    font-bold
                    tabular-nums
                    tracking-tight
                    text-success
                "
            >
                ₹1,24,999
            </p>

            <p
                className="
                    mt-1
                    text-sm
                    font-semibold
                    text-success
                "
            >
                Save ₹5,000
            </p>
        </div>
    );
}