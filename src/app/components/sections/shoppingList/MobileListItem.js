import ListIllustration from "@/app/components/ui/ListIllustration";

export default function MobileListItem({ list }) {
  const pct = Math.round((list.purchased / list.items) * 100);

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
        <ListIllustration category={list.category} className="h-8 w-8" />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="truncate font-heading text-base font-semibold text-foreground">
          {list.name}
        </h4>
        <p className="text-xs text-foreground-muted">
          {list.items} items · {list.purchased} purchased
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="font-heading text-lg font-bold tabular-nums text-foreground">
          ₹{list.total.toLocaleString()}
        </p>
        <div className="ml-auto mt-1 h-1 w-16 overflow-hidden rounded-full bg-surface-muted">
          <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
