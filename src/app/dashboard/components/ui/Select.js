"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { FiCheck, FiChevronDown } from "react-icons/fi";

const VIEWPORT_PADDING = 8;
const MENU_GAP = 6;
const MIN_MENU_WIDTH = 160;
const MAX_MENU_HEIGHT = 280;

export default function Select({
  value,
  onChange,
  options = [],
  ariaLabel = "Select",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [menuStyle, setMenuStyle] = useState({
    top: 0,
    left: 0,
    width: MIN_MENU_WIDTH,
    maxHeight: MAX_MENU_HEIGHT,
  });

  const [placement, setPlacement] = useState("bottom");

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const listboxId = useId();

  const currentIndex = options.findIndex(
    (option) => option.value === value
  );

  const current = options[currentIndex];

  /* =========================================================
     CLIENT MOUNT
  ========================================================== */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* =========================================================
     POSITION MENU
  ========================================================== */

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const availableBelow =
      viewportHeight -
      rect.bottom -
      VIEWPORT_PADDING -
      MENU_GAP;

    const availableAbove =
      rect.top -
      VIEWPORT_PADDING -
      MENU_GAP;

    const shouldOpenAbove =
      availableBelow < 180 &&
      availableAbove > availableBelow;

    const availableHeight = shouldOpenAbove
      ? availableAbove
      : availableBelow;

    const menuHeight = Math.min(
      MAX_MENU_HEIGHT,
      Math.max(120, availableHeight)
    );

    /*
     * Keep the dropdown at least as wide as the trigger,
     * but never wider than the viewport.
     */
    const menuWidth = Math.min(
      Math.max(rect.width, MIN_MENU_WIDTH),
      viewportWidth - VIEWPORT_PADDING * 2
    );

    /*
     * Align to trigger's left edge first.
     */
    let left = rect.left;

    /*
     * Prevent right-side overflow.
     */
    if (left + menuWidth > viewportWidth - VIEWPORT_PADDING) {
      left =
        viewportWidth -
        menuWidth -
        VIEWPORT_PADDING;
    }

    /*
     * Prevent left-side overflow.
     */
    left = Math.max(
      VIEWPORT_PADDING,
      left
    );

    const top = shouldOpenAbove
      ? Math.max(
        VIEWPORT_PADDING,
        rect.top -
        menuHeight -
        MENU_GAP
      )
      : rect.bottom + MENU_GAP;

    setPlacement(
      shouldOpenAbove
        ? "top"
        : "bottom"
    );

    setMenuStyle({
      top,
      left,
      width: menuWidth,
      maxHeight: menuHeight,
    });
  }, []);

  /* =========================================================
     OPEN / CLOSE POSITION
  ========================================================== */

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const handleScroll = () => {
      updatePosition();
    };

    const handleResize = () => {
      updatePosition();
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      true
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
        true
      );

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [open, updatePosition]);

  /* =========================================================
     OPEN WITH CURRENT VALUE
  ========================================================== */

  useEffect(() => {
    if (!open) return;

    setActiveIndex(
      currentIndex >= 0
        ? currentIndex
        : 0
    );
  }, [open, currentIndex]);

  /* =========================================================
     OUTSIDE CLICK
  ========================================================== */

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      const target = event.target;

      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, [open]);

  /* =========================================================
     KEYBOARD
  ========================================================== */

  const handleKeyDown = (event) => {
    if (!options.length) return;

    if (!open) {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown" ||
        event.key === "ArrowUp"
      ) {
        event.preventDefault();

        setOpen(true);
        return;
      }

      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        setActiveIndex((previous) =>
          previous >= options.length - 1
            ? 0
            : previous + 1
        );
        break;

      case "ArrowUp":
        event.preventDefault();

        setActiveIndex((previous) =>
          previous <= 0
            ? options.length - 1
            : previous - 1
        );
        break;

      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;

      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;

      case "Enter":
      case " ":
        event.preventDefault();

        if (
          activeIndex >= 0 &&
          options[activeIndex]
        ) {
          onChange(
            options[activeIndex].value
          );

          setOpen(false);

          requestAnimationFrame(() => {
            triggerRef.current?.focus();
          });
        }

        break;

      case "Escape":
        event.preventDefault();

        setOpen(false);

        requestAnimationFrame(() => {
          triggerRef.current?.focus();
        });

        break;

      case "Tab":
        setOpen(false);
        break;

      default:
        break;
    }
  };

  /* =========================================================
     SELECT OPTION
  ========================================================== */

  const handleSelect = (option) => {
    onChange(option.value);
    setOpen(false);

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  /* =========================================================
     TOGGLE
  ========================================================== */

  const handleToggle = () => {
    setOpen((previous) => !previous);
  };

  return (
    <div
      ref={rootRef}
      className={`relative ${className}`}
    >
      {/* =====================================================
                TRIGGER
            ====================================================== */}

      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={
          open
            ? listboxId
            : undefined
        }
        aria-label={ariaLabel}
        className="flex h-10 min-w-0 items-center gap-2 rounded border border-border-subtle bg-surface-muted px-3 pr-2.5 text-body-sm font-medium text-text-primary transition-colors hover:border-border-strong focus-visible:border-border-focus focus-visible:outline-none cursor-pointer"
      >
        <span className="min-w-0 truncate">
          {current?.label ?? ariaLabel}
        </span>

        <motion.span
          animate={{
            rotate: open ? 180 : 0,
          }}
          transition={{
            duration: 0.18,
            ease: "easeOut",
          }}
          className="flex shrink-0 items-center justify-center text-text-muted"
        >
          <FiChevronDown
            aria-hidden="true"
            className="h-4 w-4"
          />
        </motion.span>
      </button>

      {/* =====================================================
                DROPDOWN
            ====================================================== */}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.ul
                ref={menuRef}
                id={listboxId}
                role="listbox"
                aria-label={ariaLabel}
                initial={{
                  opacity: 0,
                  y:
                    placement ===
                      "bottom"
                      ? -4
                      : 4,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y:
                    placement ===
                      "bottom"
                      ? -4
                      : 4,
                  scale: 0.98,
                }}
                transition={{
                  duration: 0.16,
                  ease: [
                    0.2,
                    0.65,
                    0.3,
                    1,
                  ],
                }}
                style={{
                  position: "fixed",
                  top: menuStyle.top,
                  left: menuStyle.left,
                  width: menuStyle.width,
                  maxHeight:
                    menuStyle.maxHeight,
                  transformOrigin:
                    placement ===
                      "bottom"
                      ? "top center"
                      : "bottom center",
                }}
                className="z-[100] overflow-y-auto rounded border border-border-subtle bg-surface-elevated p-1 shadow-md"
              >
                {options.map(
                  (
                    option,
                    index
                  ) => {
                    const selected =
                      option.value ===
                      value;

                    const active =
                      index ===
                      activeIndex;

                    return (
                      <li
                        key={
                          option.value
                        }
                        role="option"
                        aria-selected={
                          selected
                        }
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleSelect(
                              option
                            )
                          }
                          onMouseEnter={() =>
                            setActiveIndex(
                              index
                            )
                          }
                          className={`flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2.5 text-left text-body-sm transition-colors ${active
                              ? "bg-surface-muted"
                              : ""
                            } ${selected
                              ? "font-semibold text-text-primary"
                              : "font-medium text-text-primary"
                            }`}
                        >
                          <span className="min-w-0 truncate">
                            {
                              option.label
                            }
                          </span>

                          {selected && (
                            <FiCheck
                              aria-hidden="true"
                              className="h-4 w-4 shrink-0 text-accent"
                            />
                          )}
                        </button>
                      </li>
                    );
                  }
                )}
              </motion.ul>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}