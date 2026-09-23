"use client";

import Image from "next/image";
import { FiStar } from "react-icons/fi";
import { getListVisual } from "@/app/constants/listVisuals";

export default function ActiveCard({ list }) {
  const pending = Math.max(list.items - list.purchased, 0);

  const pct =
    list.items > 0
      ? Math.round((list.purchased / list.items) * 100)
      : 0;

  const visual = getListVisual(list.category);

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-[20px]
        border
        border-border/70
        bg-surface
        shadow-[0_16px_48px_rgba(15,43,37,0.055)]
        transition-[box-shadow,border-color]
        duration-700
        ease-[cubic-bezier(0.22,1,0.36,1)]
        hover:border-border/90
        hover:shadow-[0_24px_64px_rgba(15,43,37,0.08)]
        dark:border-white/[0.07]
        dark:shadow-[0_20px_60px_rgba(0,0,0,0.20)]
        dark:hover:border-white/[0.11]
        dark:hover:shadow-[0_28px_72px_rgba(0,0,0,0.28)]
      "
    >
      {/* ================================================================ */}
      {/* IMAGE                                                            */}
      {/* ================================================================ */}
      <div
        className={`
          relative
          h-[138px]
          overflow-hidden
          ${visual.stage}
        `}
      >
        {/* Soft atmospheric glow */}
        <div
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            z-0
            h-32
            w-64
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            blur-[58px]
            transition-transform
            duration-[1000ms]
            ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:scale-[1.08]
            ${visual.glow}
          `}
        />

        {/* Secondary glow */}
        <div
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute
            -right-12
            bottom-[-56px]
            z-0
            h-32
            w-32
            rounded-full
            blur-[46px]
            transition-transform
            duration-[1100ms]
            ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:translate-x-2
            ${visual.secondaryGlow}
          `}
        />

        {/* Image */}
        <div
          className="
            absolute
            inset-0
            z-10
            overflow-hidden
          "
        >
          <Image
            src={list.image}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="
              object-cover
              transition-transform
              duration-[900ms]
              ease-[cubic-bezier(0.22,1,0.36,1)]
              will-change-transform
              group-hover:scale-[1.035]
            "
          />

          {/* Image depth overlay */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-b
              from-black/20
              via-black/[0.03]
              to-black/[0.02]
            "
          />

          {/* Label readability layer */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-0
              h-20
              bg-gradient-to-b
              from-black/25
              via-black/[0.08]
              to-transparent
            "
          />

          {/* Premium sheen */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              -left-[35%]
              z-20
              w-[24%]
              skew-x-[-18deg]
              bg-gradient-to-r
              from-transparent
              via-white/[0.08]
              to-transparent
              opacity-0
              transition-[left,opacity]
              duration-[1000ms]
              ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:left-[125%]
              group-hover:opacity-100
            "
          />
        </div>

        {/* Category */}
        <div
          className="
            absolute
            left-4
            top-4
            z-30
          "
        >
          <span
            className="
              inline-block
              rounded-full
              bg-black/30
              px-3
              py-1
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-white/90
              backdrop-blur-sm
              ring-1
              ring-white/[0.08]
              drop-shadow-[0_1px_6px_rgba(0,0,0,0.25)]
            "
          >
            {visual.label}
          </span>
        </div>
      </div>

      {/* ================================================================ */}
      {/* CONTENT                                                          */}
      {/* ================================================================ */}
      <div className="px-5 pb-5 pt-[18px]">
        {/* Title */}
        <div>
          <h3
            className="
              font-heading
              text-[21px]
              font-bold
              leading-tight
              tracking-[-0.028em]
              text-foreground
            "
          >
            {list.name}
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-foreground-muted
            "
          >
            {list.items} items
          </p>
        </div>

        {/* Planned spend */}
        <div className="mt-[18px]">
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.17em]
              text-foreground-muted
            "
          >
            Planned spend
          </p>

          <p
            className="
              mt-1
              font-heading
              text-[27px]
              font-bold
              leading-none
              tracking-[-0.04em]
              tabular-nums
              text-foreground
            "
          >
            ₹{list.total.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Progress */}
        <div className="mt-[18px]">
          <div className="flex items-baseline justify-between">
            <span
              className="
                text-[14px]
                font-medium
                tracking-[-0.01em]
                text-foreground
              "
            >
              {list.purchased} of {list.items} purchased
            </span>

            <span
              className="
                text-xs
                font-medium
                tabular-nums
                text-foreground-muted
              "
            >
              {pct}%
            </span>
          </div>

          <div
            className="
              mt-2
              h-[7px]
              overflow-hidden
              rounded-full
              bg-surface-muted
            "
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label={`${list.purchased} of ${list.items} items purchased`}
          >
            <div
              className="
                h-full
                rounded-full
                bg-accent
                transition-[width]
                duration-700
                ease-[cubic-bezier(0.22,1,0.36,1)]
              "
              style={{
                width: `${pct}%`,
              }}
            />
          </div>

          <div
            className="
              mt-2
              flex
              items-center
              justify-between
              text-[11px]
              text-foreground-muted
            "
          >
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {list.purchased} purchased
            </span>

            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground-muted/35" />
              {pending} pending
            </span>
          </div>
        </div>

        {/* Smart insight */}
        {list.insight && (
          <div
            className="
              mt-[17px]
              border-t
              border-border/60
              pt-[13px]
              dark:border-white/[0.07]
            "
          >
            <div className="flex items-center gap-2.5">
              <span
                className="
                  flex
                  h-6
                  w-6
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  bg-amber-400/10
                "
              >
                <FiStar
                  size={12}
                  className="fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0">
                <span
                  className="
                    mr-1.5
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-amber-600/75
                    dark:text-amber-300/70
                  "
                >
                  Smart
                </span>

                <span
                  className="
                    text-sm
                    font-medium
                    text-foreground
                  "
                >
                  {list.insight}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}