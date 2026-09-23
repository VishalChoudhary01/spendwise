export default function Badge({
  children,
  variant = "slate",
  size = "md",
  className = "",
}) {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-full select-none";

  const variants = {
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    indigo:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/30",
    emerald:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30",
    amber:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-100 dark:border-amber-900/30",
    red: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300 border border-red-100 dark:border-red-900/30",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-caption",
    md: "px-2.5 py-0.5 text-xs",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
