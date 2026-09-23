"use client";

export default function Card({
  children,
  className = "",
  onClick,
  hoverable = false,
  ...props
}) {
  const cardStyles = `bg-surface border border-border-subtle rounded-md p-5 shadow-none transition-colors duration-200 ${
    hoverable
      ? "hover:border-border-strong hover:bg-surface-muted/60 cursor-pointer select-none"
      : ""
  } ${className}`;

  if (onClick) {
    return (
      <div
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(e);
          }
        }}
        tabIndex={0}
        role="button"
        className={`${cardStyles} text-left w-full block`}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div className={cardStyles} {...props}>
      {children}
    </div>
  );
}
