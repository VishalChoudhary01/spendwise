import Image from "next/image";
import { FiStar } from "react-icons/fi";
import { bestAvailablePrice, product, sources } from "@/app/constants/productLandingCard";

export default function ProductSummary({ comparisonActive = false }) {
  return (
    <div
      className={`overflow-hidden  rounded-md border border-border bg-surface transition-opacity duration-500 ${
        comparisonActive ? "opacity-80 dark:opacity-75" : ""
      } dark:bg-surface`}
    >
      {/* Product image — clean shot reused from the hero (§10.2 Imagery) */}
      <div className="relative flex h-20 sm:h-44 items-center justify-center overflow-hidden border-b border-border/70 bg-white dark:bg-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(118,171,174,0.14), transparent 65%)", }} />
        <Image
          src={product.image}
          alt={`${product.name} with charging case`}
          width={1397}
          height={1482}
          sizes="(max-width: 1024px) 480px, 400px"
          className="h-full w-auto object-contain p-2 sm:p-4"
        />
      </div>

      <div className="p-2.5 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-heading text-base sm:text-lg font-semibold tracking-tight text-foreground">
              {product.name}
            </h3>
            <p className="mt-0.5 text-xs text-foreground-muted">
              {product.detail}
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="flex items-center gap-0.5 text-amber-400">
                {[0, 1, 2, 3, 4].map((i) => (
                  <FiStar key={i} size={11} className="fill-amber-400" />
                ))}
              </span>
              <span className="text-xs font-semibold text-foreground">
                {product.rating}
              </span>
              <span className="text-xs text-foreground-muted">
                ({product.reviews})
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 flex items-end justify-between border-t border-border/70 pt-2.5 sm:pt-3.5">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-foreground-muted">
              From
            </p>
            <p className="font-heading text-xl sm:text-2xl font-bold tabular-nums text-foreground">
              ₹{bestAvailablePrice.toLocaleString()}
            </p>
          </div>
          {comparisonActive && <span className={`text-xs font-medium  ${comparisonActive ? "text-success" : "text-foreground-muted"}`}>
            {sources.length} stores compared
          </span>}
          
        </div>
      </div>
    </div>
  );
}
