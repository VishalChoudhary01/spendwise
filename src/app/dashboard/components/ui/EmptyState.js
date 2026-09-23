"use client";

import Button from "./Button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-8 border border-dashed border-border-default rounded-md bg-surface-muted/30 ${className}`}
    >
      {Icon && <Icon aria-hidden="true" className="w-6 h-6 text-accent mb-5" />}
      <h3 className="text-body-md font-semibold text-text-primary mb-2.5 select-none">{title}</h3>
      <p className="text-body-sm text-text-muted max-w-[300px] mb-7 select-none">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
