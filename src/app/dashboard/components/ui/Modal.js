"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { FiX } from "react-icons/fi";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Portaled to <body>: page containers can carry inline `filter`/
  // `transform` from Motion entry animations, which would otherwise
  // become the containing block for `position: fixed` and clip the
  // backdrop to the container instead of the full viewport.
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/50 dark:bg-black/65"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`relative bg-surface border border-border-subtle w-full max-w-[580px] rounded-lg shadow-modal overflow-hidden z-[70] flex flex-col max-h-[88vh] ${className}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle select-none shrink-0">
              <h3 className="text-body-lg font-bold text-text-primary">{title}</h3>
              <button
                onClick={onClose}
                title="Close"
                aria-label="Close dialog"
                className="w-9 h-9 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors duration-150 cursor-pointer"
              >
                <FiX className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
