"use client";

import PlanBar from "./PlanBar";

export default function SpendByPlan({
    plans,
    progress,
}) {
    const maxSpent = Math.max(
        ...plans.map((plan) => plan.spent)
    );

    return (
        <div>
            <h3 className="text-sm font-semibold text-foreground">
                Spend by shopping plan
            </h3>

            <div className="mt-4 space-y-3">
                {plans.map((plan, index) => (
                    <PlanBar
                        key={plan.id}
                        progress={progress}
                        plan={plan}
                        index={index}
                        maxSpent={maxSpent}
                    />
                ))}
            </div>
        </div>
    );
}