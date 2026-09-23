"use client";


import { motion } from "motion/react";
import NumberRoll from "@/app/components/common/NumberRoll";

const StatsCard = ({
  title,
  value,
  prefix = "",
  suffix = "",
  minimumFractionDigits = 0,
  maximumFractionDigits = minimumFractionDigits,
  description,
  icon: Icon,
  accentColor = "text-accent",
}) => { 
  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22, ease: [0.2, 0.65, 0.3, 1] }}
      className="group relative min-h-[162px] overflow-hidden rounded-lg border  border-border bg-surface p-6 shadow-sm hover:border-border-hover hover:shadow-md"
    >
      <motion.div
        initial={{ opacity: 0.035, scale: 1, rotate: 0 }}
        whileHover={{ opacity: 0.1, scale: 1.08, rotate: -3 }}
        transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }} 
        className={`absolute -right-7 -bottom-8 ${accentColor}`}
      >
        <Icon
          aria-hidden="true"
          className="h-36 w-36"
          strokeWidth={1}
        />
      </motion.div>

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <Icon
            aria-hidden="true"
            className={`h-4 w-4 ${accentColor}`}
            strokeWidth={1.8}
          />

          <span className="text-label-sm font-semibold uppercase tracking-[0.08em] text-text-muted">
            {title}
          </span>
        </div>

        <NumberRoll
          value={value}
          prefix={prefix}
          suffix={suffix}
          minimumFractionDigits={minimumFractionDigits}
          maximumFractionDigits={maximumFractionDigits}
          className="mt-4 text-dashboard-num font-bold leading-none tracking-tight text-text-primary"
        />

        <p className="mt-3 text-label-sm text-text-muted">
          {description}
        </p>
      </div>
    </motion.article>
  );
};

export default StatsCard;