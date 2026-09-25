"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  FiCheck,
  FiChevronDown,
  FiEdit2,
  FiExternalLink,
  FiTrash2,
} from "react-icons/fi";

import { getCheapestSource, getItemTotal } from "../../utils/priceEngine";
import NumberRoll from "@/app/components/common/NumberRoll";
import SourceIcon from "@/app/components/common/SourceIcon/SourceIcon";

const UNIT_LABELS = {
  piece: (qty) => (qty === 1 ? "piece" : "pieces"),
  weight: () => "kg",
  litre: () => "L",
};

const formatINR = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function ItemCard({
  item,
  onTogglePurchased,
  onEdit,
  onDelete,
}) {
  const [expanded, setExpanded] = useState(false);

  const isPurchased = Boolean(item.isPurchased);

  const qty = Number(item.quantity) || 1;

  const unitLabel = (
    UNIT_LABELS[item.unit] || ((quantity) => String(quantity))
  )(qty);

  const pricedSources = (item.priceSources || []).filter(
    (source) =>
      source &&
      source.price !== undefined &&
      source.price !== ""
  );

  const cheapest = getCheapestSource(item.priceSources);

  const total = getItemTotal(item);

  const hasBest =
    pricedSources.length > 0 &&
    cheapest?.store !== "No Source";

  const canExpand = pricedSources.length > 1;

  const handleExpand = () => {
    if (!canExpand) return;

    setExpanded((current) => !current);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    onEdit(item);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(item.id);
  };

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 6,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.22,
        ease: [0.2, 0.65, 0.3, 1],
      }}
      className={`group overflow-hidden rounded-sm border bg-surface ${isPurchased
          ? "border-border opacity-60"
          : "border-border hover:border-border-hover"
        }`}
    >
      {/* =========================================================
                MAIN ITEM
            ========================================================== */}

      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex min-w-0 items-start gap-3.5">
          {/* =================================================
                        PURCHASE CHECKBOX
                    ================================================== */}

          <motion.button
            type="button"
            onClick={() => onTogglePurchased(item.id)}
            whileTap={{ scale: 0.94 }}
            aria-label={
              isPurchased
                ? "Mark as pending"
                : "Mark as purchased"
            }
            aria-pressed={isPurchased}
            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] border transition-colors ${isPurchased
                ? "border-accent bg-accent text-white"
                : "border-border-strong bg-transparent text-transparent hover:border-accent"
              }`}
          >
            <motion.span
              initial={false}
              animate={{
                scale: isPurchased ? 1 : 0.5,
                opacity: isPurchased ? 1 : 0,
              }}
              transition={{
                duration: 0.14,
                ease: "easeOut",
              }}
              className="flex items-center justify-center"
            >
              <FiCheck
                aria-hidden="true"
                className="h-3 w-3"
                strokeWidth={2.5}
              />
            </motion.span>
          </motion.button>

          {/* =================================================
                        PRODUCT INFORMATION
                    ================================================== */}

          <div className="min-w-0 flex-1 select-none">
            <motion.span
              layout="position"
              className={`block break-words text-body-md font-semibold ${isPurchased
                  ? "text-text-muted line-through decoration-border-strong"
                  : "text-text-primary"
                }`}
            >
              {item.name}
            </motion.span>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-body-sm text-text-muted">
              <span>
                {qty} {unitLabel}
              </span>

              {hasBest && (
                <>
                  <span
                    aria-hidden="true"
                    className="text-border-strong"
                  >
                    ·
                  </span>

                  <span>
                    Best available:
                  </span>

                  <span className="flex min-w-0 items-center gap-1.5 font-medium text-text-secondary">
                    <SourceIcon
                      source={cheapest}
                      sizeClass="h-4 w-4"
                      chip
                    />

                    <span className="truncate">
                      {cheapest.store}
                    </span>
                  </span>
                </>
              )}
            </div>

            {/* =================================================
                            SOURCE COMPARISON TRIGGER
                        ================================================== */}

            {pricedSources.length > 0 && (
              <motion.button
                type="button"
                onClick={handleExpand}
                disabled={!canExpand}
                whileHover={
                  canExpand
                    ? { x: 2 }
                    : undefined
                }
                whileTap={
                  canExpand
                    ? { scale: 0.98 }
                    : undefined
                }
                className={`mt-2 inline-flex items-center gap-1.5 text-label-sm font-medium ${canExpand
                    ? "cursor-pointer text-text-muted hover:text-accent"
                    : "cursor-default text-text-muted"
                  }`}
              >
                <span>
                  {pricedSources.length}{" "}
                  {pricedSources.length === 1
                    ? "source compared"
                    : "sources compared"}
                </span>

                {canExpand && (
                  <motion.span
                    animate={{
                      rotate: expanded ? 180 : 0,
                    }}
                    transition={{
                      duration: 0.18,
                      ease: "easeOut",
                    }}
                  >
                    <FiChevronDown
                      aria-hidden="true"
                      className="h-3.5 w-3.5"
                    />
                  </motion.span>
                )}
              </motion.button>
            )}
          </div>

          {/* =================================================
                        PRICE + ACTIONS
                    ================================================== */}

          <div className="flex shrink-0 flex-col items-end gap-3">
            {/* Price */}

            <motion.span
              layout="position"
              className={`whitespace-nowrap text-heading-sm font-bold tracking-tight tabular-nums ${isPurchased
                  ? "text-text-muted"
                  : "text-text-primary"
                }`}
            >
              <NumberRoll
                value={total}
                prefix="₹"
                minimumFractionDigits={2}
                maximumFractionDigits={2}
              />
            </motion.span>

            {/* =================================================
                            ACTIONS
                        ================================================== */}

            <div className="flex items-center gap-1">
              {/* Edit */}

              <motion.button
                type="button"
                onClick={handleEdit}
                whileHover={{
                  y: -1,
                }}
                whileTap={{
                  scale: 0.94,
                }}
                aria-label={`Edit ${item.name}`}
                title="Edit item"
                className="flex h-8 w-8 items-center justify-center rounded-sm text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <FiEdit2
                  aria-hidden="true"
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </motion.button>

              {/* Delete */}

              <motion.button
                type="button"
                onClick={handleDelete}
                whileHover={{
                  y: -1,
                }}
                whileTap={{
                  scale: 0.94,
                }}
                aria-label={`Delete ${item.name}`}
                title="Delete item"
                className="flex h-8 w-8 items-center justify-center rounded-sm text-text-muted transition-colors hover:bg-danger/10 hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
              >
                <FiTrash2
                  aria-hidden="true"
                  className="h-4 w-4"
                  strokeWidth={1.8}
                />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
                PROGRESSIVE PRICE COMPARISON
            ========================================================== */}

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              height: {
                duration: 0.32,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: 0.18,
                ease: "easeOut",
              },
            }}
            className="overflow-hidden"
          >
            <div className="mx-5 border-t border-border pt-4 pb-5 sm:mx-6 sm:pb-6">
              <div className="flex flex-col gap-1">
                {pricedSources.map((source, index) => {
                  const isBest =
                    source === cheapest;

                  return (
                    <motion.div
                      key={`${source.store}-${source.price}-${index}`}
                      initial={{
                        opacity: 0,
                        y: 4,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.035,
                        ease: "easeOut",
                      }}
                      className={`flex items-center justify-between gap-4 rounded-sm px-3 py-2.5 text-body-sm ${isBest
                          ? "border border-success/15 bg-success/5"
                          : "border border-transparent"
                        }`}
                    >
                      {/* Store */}

                      <span
                        className={`flex min-w-0 items-center gap-2 ${isBest
                            ? "font-semibold text-text-primary"
                            : "text-text-muted"
                          }`}
                      >
                        <SourceIcon
                          source={source}
                          sizeClass="h-4 w-4"
                          chip
                        />

                        <span className="truncate">
                          {source.store}
                        </span>

                        {isBest && (
                          <FiCheck
                            aria-label="Best price"
                            className="h-4 w-4 shrink-0 text-success"
                            strokeWidth={2.5}
                          />
                        )}
                      </span>

                      {/* Source price */}

                      <div className="flex shrink-0 items-center gap-3">
                        {source.url && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) =>
                              event.stopPropagation()
                            }
                            aria-label={`Open ${source.store} product`}
                            title="Open product link"
                            className="text-text-muted transition-colors hover:text-accent"
                          >
                            <FiExternalLink
                              aria-hidden="true"
                              className="h-3.5 w-3.5"
                            />
                          </a>
                        )}

                        <span
                          className={`tabular-nums ${isBest
                              ? "font-semibold text-text-primary"
                              : "text-text-muted"
                            }`}
                        >
                          ₹
                          {formatINR(
                            Number(
                              source.price
                            )
                          )}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}