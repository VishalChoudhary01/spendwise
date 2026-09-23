"use client";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  icon: Icon,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold outline-none focus-visible:ring-2 focus-visible:ring-border-focus/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer";

  const variants = {
    primary:
      "bg-action text-white hover:bg-action-hover active:bg-action-pressed active:scale-[0.98] border border-transparent",
    secondary:
      "bg-surface text-text-primary border border-border-default hover:bg-surface-muted active:scale-[0.98]",
    ghost:
      "bg-transparent text-text-muted hover:text-text-primary hover:bg-surface-muted active:scale-[0.98] border border-transparent",
    destructive:
      "bg-danger text-white hover:opacity-90 active:scale-[0.98] border border-transparent",
    icon: "w-8 h-8 px-0 bg-transparent text-text-muted hover:text-text-primary hover:bg-surface-muted active:scale-[0.98] border border-transparent",
  };

  const sizes = {
    sm: "h-9 px-3.5 text-label-md gap-1.5",
    md: "h-10 px-4 text-label-md gap-2",
    lg: "h-11 px-5 text-label-md gap-2",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} rounded ${className}`}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        Icon && <Icon className="w-[18px] h-[18px] shrink-0" />
      )}
      {children}
    </button>
  );
}
