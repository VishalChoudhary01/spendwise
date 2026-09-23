"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useState } from "react";
import { FiArrowUpRight, FiEdit2, FiShield, FiShoppingBag, FiTrash2, } from "react-icons/fi";

import ToggleSwitch from "../ui/ToggleSwitch";
import NumberRoll from "@/app/components/common/NumberRoll";

const ListCard = ({ list, itemsCount, pendingCount, purchasedCount, estimatedCost, onToggleDuplicate, onEdit, onDelete, }) => {
  const router = useRouter();

  const [isToggleHovered, setIsToggleHovered] = useState(false);

  const handleEdit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onEdit(list);
  };

  const handleDelete = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onDelete(list.id);
  };

  const handleOpen = () => {
    router.push(`/dashboard/list/${list.id}`);
  };

  return (
    <motion.article
      layoutId={`list-card-${list.id}`}
      initial="rest"
      whileHover={isToggleHovered ? "rest" : "hover"}
      whileTap={isToggleHovered ? undefined : "tap"}
      onClick={handleOpen}
      variants={{
        rest: {
          y: 0,
          scale: 1,
        },

        hover: {
          y: -3,
          scale: 1,
        },

        tap: {
          scale: 0.985,
        },
      }}
      transition={{
        y: {
          duration: 0.2,
          ease: "easeOut",
        },

        scale: {
          duration: 0.15,
          ease: "easeOut",
        },

        layout: {
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      className="group relative flex min-h-[220px] cursor-pointer flex-col overflow-hidden rounded-lg border border-border bg-surface p-5 shadow-sm hover:border-border-hover hover:shadow-md sm:p-6"
    >
      {/* =========================================================
                BAG OPENING EDGE
            ========================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-5 top-0 z-20 sm:inset-x-6"
      >
        {/* Left edge */}
        <motion.span
          variants={{
            rest: {
              width: "43%",
              x: 0,
              opacity: 0.25,
            },

            hover: {
              width: "31%",
              x: -4,
              opacity: 0.8,
            },
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="absolute left-0 top-0 h-px bg-accent"
        />

        {/* Right edge */}
        <motion.span
          variants={{
            rest: {
              width: "43%",
              x: 0,
              opacity: 0.25,
            },

            hover: {
              width: "31%",
              x: 4,
              opacity: 0.8,
            },
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="absolute right-0 top-0 h-px bg-accent"
        />

        {/* Center opening */}
        <motion.span
          variants={{
            rest: {
              width: 0,
              opacity: 0,
            },

            hover: {
              width: "4rem",
              opacity: 1,
            },
          }}
          transition={{
            duration: 0.28,
            delay: 0.04,
            ease: "easeOut",
          }}
          className="absolute left-1/2 top-0 h-px -translate-x-1/2 bg-accent"
        />

        {/* Large bag handle */}
        <motion.span
          layoutId={`list-handle-${list.id}`}
          variants={{
            rest: {
              y: 5,
              scaleX: 0.65,
              scaleY: 0.8,
              opacity: 0,
            },

            hover: {
              y: -3,
              scaleX: 1,
              scaleY: 1,
              opacity: 0.9,
            },
          }}
          transition={{
            duration: 0.38,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute left-1/2 top-0 h-5 w-28 -translate-x-1/2 rounded-b-full border-b border-l border-r border-accent"
        />
      </div>

      {/* =========================================================
                BACKGROUND BAG
            ========================================================== */}

      <motion.div
        variants={{
          rest: {
            opacity: 0.025,
            scale: 1,
            rotate: 0,
            x: 0,
            y: 0,
          },

          hover: {
            opacity: 0.07,
            scale: 1.06,
            rotate: -4,
            x: -3,
            y: -3,
          },
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        className="pointer-events-none absolute -bottom-8 -right-8 text-accent"
      >
        <FiShoppingBag
          aria-hidden="true"
          className="h-32 w-32"
          strokeWidth={1}
        />
      </motion.div>

      {/* =========================================================
                HEADER
            ========================================================== */}

      <div className="relative z-10 flex items-start justify-between gap-4 pointer-events-none">
        <div className="flex min-w-0 items-start gap-3">
          <motion.div
            layoutId={`list-icon-${list.id}`}
            variants={{
              rest: {
                x: 0,
                y: 0,
                rotate: 0,
              },

              hover: {
                x: 2,
                y: -1,
                rotate: -3,
              },
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-surface-muted text-accent"
          >
            <FiShoppingBag
              aria-hidden="true"
              className="h-4 w-4"
            />
          </motion.div>

          <div className="min-w-0">
            <motion.h3
              layoutId={`list-title-${list.id}`}
              className="truncate text-body-md font-bold text-text-primary"
            >
              {list.name}
            </motion.h3>

            <p className="mt-1 text-label-sm text-text-muted">
              {itemsCount}{" "}
              {itemsCount === 1 ? "item" : "items"}
              {" · "}
              {pendingCount} pending
            </p>
          </div>
        </div>

        {/* =====================================================
                    ACTIONS
                ====================================================== */}

        <div className="pointer-events-auto flex shrink-0 items-center gap-1">
          <motion.button
            type="button"
            onClick={handleEdit}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.94 }}
            aria-label={`Edit ${list.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-md text-text-muted hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <FiEdit2
              aria-hidden="true"
              className="h-4 w-4"
            />
          </motion.button>

          <motion.button
            type="button"
            onClick={handleDelete}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.94 }}
            aria-label={`Delete ${list.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-md text-text-muted hover:bg-surface-muted hover:text-action focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
          >
            <FiTrash2
              aria-hidden="true"
              className="h-4 w-4"
            />
          </motion.button>
        </div>
      </div>

      {/* =========================================================
                MAIN INFORMATION
            ========================================================== */}

      <div className="relative z-10 mt-7 pointer-events-none">
        <span className="text-label-sm font-medium text-text-muted">
          Estimated
        </span>

        <motion.div
          layoutId={`list-cost-${list.id}`}
          className="mt-1 text-heading-md font-bold tracking-tight text-text-primary"
        >
          <NumberRoll
            value={estimatedCost}
            prefix="₹"
            minimumFractionDigits={2}
            maximumFractionDigits={2}
          />
        </motion.div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-label-sm text-text-muted">
          <span>{purchasedCount} purchased</span>

          <span aria-hidden="true">·</span>

          <span>{pendingCount} pending</span>
        </div>
      </div>

      {/* =========================================================
                FOOTER
            ========================================================== */}

      <div className="relative z-10 mt-auto flex flex-col gap-4 pt-6 pointer-events-none">
        {/* Duplicate protection */}

        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-start gap-2.5">
            <FiShield
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-text-muted"
            />

            <div className="min-w-0">
              <p className="text-label-sm font-semibold text-text-primary">
                Duplicate products
              </p>

              <p className="mt-0.5 text-label-sm leading-relaxed text-text-muted">
                Prevent the same product from being added twice
              </p>
            </div>
          </div>

          {/* Toggle isolated from card interaction */}

          <div
            className="pointer-events-auto shrink-0"
            onPointerEnter={() => setIsToggleHovered(true)}
            onPointerLeave={() => setIsToggleHovered(false)}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <ToggleSwitch
              checked={Boolean(list.duplicateToggle)}
              onChange={(checked) =>
                onToggleDuplicate(list.id, checked)
              }
              showState
            />
          </div>
        </div>

        {/* =====================================================
                    OPEN AFFORDANCE
                ====================================================== */}

        <motion.div
          variants={{
            rest: {
              y: 8,
              opacity: 0.7,
            },

            hover: {
              y: 0,
              opacity: 1,
            },
          }}
          transition={{
            duration: 0.22,
            ease: "easeOut",
          }}
          className="flex items-center justify-between border-t border-border pt-4"
        >
          <motion.span
            variants={{
              rest: {
                x: 0,
              },

              hover: {
                x: 2,
              },
            }}
            className="text-label-sm font-semibold text-text-muted"
          >
            View shopping list
          </motion.span>

          <motion.span
            variants={{
              rest: {
                x: 0,
                y: 0,
                rotate: 0,
              },

              hover: {
                x: 4,
                y: -2,
                rotate: 2,
              },
            }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-muted text-text-primary"
          >
            <FiArrowUpRight
              aria-hidden="true"
              className="h-4 w-4"
            />
          </motion.span>
        </motion.div>
      </div>
    </motion.article>
  );
};

export default ListCard;