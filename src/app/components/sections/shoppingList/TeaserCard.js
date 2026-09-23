import Image from "next/image";
import { getListVisual } from "@/app/constants/listVisuals";

export default function TeaserCard({ list }) {
  const visual = getListVisual(list.category);

  const pct =
    list.items > 0
      ? Math.round((list.purchased / list.items) * 100)
      : 0;

  return (
    <div className="w-56 shrink-0 px-2">
      <article
        className="
          group
          overflow-hidden
          rounded-xl
          border
          border-border/45
          bg-surface/[0.42]
          shadow-[0_8px_24px_rgba(15,43,37,0.025)]
          backdrop-blur-sm

          transition-[opacity,transform,border-color,box-shadow]
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]

          opacity-70

          hover:-translate-y-0.5
          hover:opacity-100
          hover:border-border/70
          hover:shadow-[0_14px_34px_rgba(15,43,37,0.06)]

          dark:border-white/[0.06]
          dark:bg-white/[0.025]
          dark:shadow-[0_10px_28px_rgba(0,0,0,0.12)]
          dark:hover:border-white/[0.10]
          dark:hover:shadow-[0_16px_36px_rgba(0,0,0,0.18)]
        "
      >
        {/* ============================================================ */}
        {/* THUMBNAIL                                                    */}
        {/* ============================================================ */}
        <div
          className={`
            relative
            h-[72px]
            overflow-hidden
            border-b
            border-border/30
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
              h-14
              w-24
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              blur-[26px]
              opacity-60
              transition-transform
              duration-700
              ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:scale-[1.12]
              ${visual.glow}
            `}
          />

          {/* Very subtle top depth */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-0
              z-20
              h-7
              bg-gradient-to-b
              from-black/[0.045]
              to-transparent
            "
          />

          {/* Image */}
          <div className="absolute inset-0 z-10">
            <Image
              src={list.image}
              alt=""
              fill
              sizes="224px"
              className="
                object-contain
                px-7
                py-2
                transition-transform
                duration-700
                ease-[cubic-bezier(0.22,1,0.36,1)]
                will-change-transform
                group-hover:scale-[1.045]
              "
            />
          </div>

          {/* Quiet bottom fade */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              z-20
              h-5
              bg-gradient-to-t
              from-black/[0.025]
              to-transparent
            "
          />

          {/* Category label */}
          <div
            className="
              absolute
              left-3
              top-3
              z-30
            "
          >
            <span
              className="
                inline-block
                rounded-full
                bg-black/30
                px-2
                py-0.5
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-white/90
                backdrop-blur-sm
                ring-1
                ring-white/[0.08]
                drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]
              "
            >
              {visual.label}
            </span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CONTENT                                                       */}
        {/* ============================================================ */}
        <div className="px-3.5 py-3">
          {/* Title + price */}
          <div className="flex items-center gap-3">
            <h4
              className="
                min-w-0
                flex-1
                truncate
                font-heading
                text-[13px]
                font-semibold
                leading-tight
                tracking-[-0.018em]
                text-foreground
              "
            >
              {list.name}
            </h4>

            <span
              className="
                shrink-0
                font-heading
                text-[13px]
                font-semibold
                leading-none
                tracking-[-0.015em]
                tabular-nums
                text-foreground
              "
            >
              ₹{list.total.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Metadata */}
          <p
            className="
              mt-1
              text-[11px]
              leading-none
              text-foreground-muted
            "
          >
            {list.items} items
          </p>

          {/* Progress */}
          <div className="mt-3">
            <div
              className="
                h-[3px]
                overflow-hidden
                rounded-full
                bg-surface-muted
              "
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
                mt-1.5
                flex
                items-center
                justify-between
                text-[10px]
                leading-none
                text-foreground-muted
              "
            >
              <span>{pct}% complete</span>

              <span className="tabular-nums">
                {list.purchased}/{list.items}
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}