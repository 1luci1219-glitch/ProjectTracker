export function SectionHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{eyebrow}</p>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--ink)] md:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)] md:text-[15px]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
