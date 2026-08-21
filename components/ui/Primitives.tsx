import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type BadgeType = "tech" | "concept" | "feature";

const badgeStyles: Record<BadgeType, string> = {
  tech: "bg-accent/8 border-accent/25 [--dot:var(--color-accent)]",
  concept: "bg-cyan/8 border-cyan/25 [--dot:var(--color-cyan)]",
  feature: "bg-elevated border-border [--dot:var(--color-muted)]",
};

export function Badge({
  children,
  type = "tech",
  href,
}: {
  children: React.ReactNode;
  type?: BadgeType;
  href?: string;
}) {
  const classes = `text-sm px-3 py-1.5 rounded-full flex items-center gap-2 border hover:opacity-80 transition-opacity ${badgeStyles[type]}`;
  const dot = <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--dot)" }} />;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {dot}
        {children}
      </Link>
    );
  }
  return (
    <span className={classes}>
      {dot}
      {children}
    </span>
  );
}

export function SectionLabel({
  children,
  count,
}: {
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase font-medium tracking-wider text-muted">
        {children}
      </span>
      {count != null && <span className="text-xs text-muted-dim">{count}</span>}
    </div>
  );
}

export function BackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm mb-6 text-muted hover:text-ink opacity-70 hover:opacity-100 transition-opacity"
    >
      <ArrowLeftIcon /> Back
    </Link>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ActionButton({
  children,
  icon: Icon,
  onClick,
  primary,
  href,
  external,
}: {
  children: React.ReactNode;
  icon?: LucideIcon;
  onClick?: () => void;
  primary?: boolean;
  href?: string;
  external?: boolean;
}) {
  const classes = `text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 hover:opacity-85 transition-opacity ${
    primary ? "bg-accent text-bg" : "bg-transparent text-ink border border-border"
  }`;

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={classes}
      >
        {Icon && <Icon size={14} />}
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={classes}>
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

export function Check({ active }: { active: boolean }) {
  return (
    <span className={active ? "text-accent text-base" : "text-border-soft text-base"}>
      {active ? "✓" : "–"}
    </span>
  );
}

export function Stat({ value, label, href }: { value: number; label: string; href?: string }) {
  const inner = (
    <>
      <div className="text-2xl font-semibold text-ink">{value}</div>
      <div className="text-xs uppercase tracking-wide mt-0.5 text-muted-dim">{label}</div>
    </>
  );
  if (href) {
    return (
      <Link href={href} className="text-center hover:opacity-80 transition-opacity">
        {inner}
      </Link>
    );
  }
  return <div className="text-center">{inner}</div>;
}
