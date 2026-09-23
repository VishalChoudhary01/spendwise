"use client";

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  id,
  showState = false,
  className = "",
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {(label || description) && (
        <div className="flex flex-col select-none">
          {label && <span className="text-body-sm font-semibold text-text-primary">{label}</span>}
          {description && (
            <span className="text-label-sm text-text-muted mt-0.5">{description}</span>
          )}
        </div>
      )}
      <div className="flex items-center gap-2 shrink-0">
        {showState && (
          <span className="text-label-sm font-semibold text-text-muted select-none tabular-nums">
            {checked ? "On" : "Off"}
          </span>
        )}
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange && onChange(!checked)}
          className={`relative inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 ${
            checked ? "bg-brand" : "bg-border-strong"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out mt-[1px] ${
              checked ? "translate-x-[19px]" : "translate-x-[-1px]"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
