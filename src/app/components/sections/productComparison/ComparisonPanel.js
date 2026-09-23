"use client";

import { AnimatePresence, motion } from "motion/react";
import Connector from "./Connector";
import PriceRow from "./PriceRow";
import SavingsBar from "./SavingsBar";
import { sources } from "@/app/constants/productLandingCard";

const easeOut = [0.22, 1, 0.36, 1];

const rowMotion = (visible) => ({
  initial: { opacity: 0, y: 8 },
  animate: visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
  transition: { duration: 0.2, ease: easeOut },
});

const savingsMotion = (visible) => ({
  initial: { opacity: 0, y: 10 },
  animate: visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
  transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
});

/* ------------------------------------------------------------------ */
/* Comparison panel — the story object (§10.2 Layout)                 */
/* ------------------------------------------------------------------ */

export default function ComparisonPanel({ stage = 0, isStatic = false }) {
  const show = (n) => isStatic || stage >= n;
  const [amazon, flipkart, supported] = sources;

  return (
    <div className="relative w-full max-w-[400px] mx-auto">
      {/* Clean analytical surface — no glow/halo. Radius stays within the
          spec's 12–20px band (§4.1, §10.2); the page itself carries the
          atmosphere, so cards stay calm and flat. */}
      <div className="relative rounded-md border border-border bg-surface p-3 sm:p-5 min-h-[260px] sm:min-h-0 dark:bg-surface">
        {/* Stores checked label */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground-muted">
          {sources.length} stores checked
        </p>

        <div className="relative mt-3 sm:mt-4">
          {/* Rows accumulate in flow so the panel keeps stable
              dimensions — hidden rows hold the layout space. */}
          <div className="space-y-1.5 sm:space-y-2">
            <motion.div {...rowMotion(show(1))}>
              <PriceRow source={amazon} />
            </motion.div>
            <Connector visible={show(2)} />
            <motion.div {...rowMotion(show(2))}>
              <PriceRow source={flipkart} />
            </motion.div>
            <Connector visible={show(3)} />
            <motion.div {...rowMotion(show(3))}>
              <PriceRow source={supported} winner />
            </motion.div>
            <motion.div {...savingsMotion(show(4))}>
              <SavingsBar />
            </motion.div>
          </div>

          {/* Stage 0 — quiet placeholder over the empty story area */}
          <AnimatePresence>
            {!show(1) && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-x-0 top-0 flex items-center gap-2 rounded-md border border-dashed border-border bg-surface-muted/60 px-3.5 py-3"
              >
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span className="md:text-[0.8rem]  font-medium text-foreground-secondary">
                  Comparing supported sources…
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
