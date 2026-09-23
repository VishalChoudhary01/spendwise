"use client";

export default function Input({
  label,
  error,
  type = "text",
  id,
  className = "",
  icon: Icon,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-label-md font-semibold text-text-primary select-none">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-text-muted pointer-events-none">
            <Icon className="w-[18px] h-[18px]" />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full h-10 px-3 text-body-sm bg-surface-muted border border-border-subtle rounded text-text-primary placeholder:text-text-muted outline-none transition-colors duration-200 shadow-none ${
            Icon ? "pl-9" : ""
          } ${
            error
              ? "border-danger"
              : "hover:border-border-strong focus-visible:border-border-focus"
          }`}
          {...props}
        />
      </div>
      {error && <span className="text-label-sm font-medium text-danger">{error}</span>}
    </div>
  );
}
