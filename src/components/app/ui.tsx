import type { ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowLeft, RotateCw } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";
type ButtonSize = "sm" | "md";

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-strong active:bg-primary-strong",
  secondary: "bg-panel text-ink ring-1 ring-inset ring-line-strong hover:bg-tone",
  quiet: "text-ink-soft hover:bg-tone hover:text-ink",
  danger: "bg-danger text-white hover:bg-red-600",
};

const BUTTON_SIZE: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-[13px]",
  md: "h-10 gap-2 px-4 text-sm",
};

/** Classes de botão da área de trabalho, para <button> e <Link>. */
export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return clsx(
    "inline-flex shrink-0 items-center justify-center rounded-md font-semibold transition-[background-color,color,transform] duration-150 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50",
    BUTTON_VARIANT[variant],
    BUTTON_SIZE[size],
    className
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={clsx("size-4 animate-spin rounded-full border-2 border-current border-t-transparent", className)}
    />
  );
}

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-8">
      {back && (
        <Link
          href={back.href}
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[32px]">
            {title}
          </h1>
          {description && <p className="mt-2 max-w-2xl text-[15px] leading-6 text-ink-soft">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={clsx("rounded-lg border border-line bg-panel", className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-start justify-between gap-3 px-5 pb-1 pt-5">
          <div className="min-w-0">
            {title && <h2 className="text-base font-semibold text-ink">{title}</h2>}
            {description && <p className="mt-0.5 text-[13px] leading-5 text-ink-soft">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={clsx("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export type Tone = "neutral" | "info" | "success" | "warning" | "danger";

const DOT: Record<Tone, string> = {
  neutral: "bg-ink-faint",
  info: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const STATUS_TEXT: Record<Tone, string> = {
  neutral: "text-ink-soft",
  info: "text-primary",
  success: "text-success-ink",
  warning: "text-warning-ink",
  danger: "text-danger",
};

export function Status({ tone, children, className }: { tone: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-1.5 text-[13px] font-medium", STATUS_TEXT[tone], className)}>
      <span aria-hidden="true" className={clsx("size-1.5 shrink-0 rounded-full", DOT[tone])} />
      {children}
    </span>
  );
}

export interface Figure {
  label: string;
  value: number | string;
  note?: string;
  tone?: Tone;
}

/** Faixa de números: cada célula separada por um degrau de tom, sem ícones. */
export function FigureBand({ figures, isLoading }: { figures: Figure[]; isLoading?: boolean }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line lg:grid-cols-4">
      {figures.map((figure) => (
        <div key={figure.label} className="bg-panel px-5 py-4">
          <dt className="text-[13px] font-medium text-ink-soft">{figure.label}</dt>
          <dd className="mt-2">
            {isLoading ? (
              <span className="block h-9 w-12 animate-pulse rounded bg-tone" />
            ) : (
              <span
                className={clsx(
                  "font-display text-[34px] font-semibold leading-none tracking-[-0.03em] tabular-nums",
                  figure.tone === "warning" && Number(figure.value) > 0 ? "text-warning-ink" : "text-ink"
                )}
              >
                {figure.value}
              </span>
            )}
            {figure.note && <span className="mt-2 block text-xs text-ink-soft">{figure.note}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={clsx("block animate-pulse rounded-md bg-tone", className)} />;
}

export function EmptyNote({
  title,
  children,
  action,
  className,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("rounded-lg bg-tone px-6 py-8 text-center", className)}>
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {children && <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-ink-soft">{children}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-lg bg-danger-soft px-6 py-8 text-center">
      <p className="font-semibold text-ink">Não foi possível carregar</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={buttonClass("secondary", "sm", "mt-4")}>
          <RotateCw size={14} aria-hidden="true" />
          Tentar de novo
        </button>
      )}
    </div>
  );
}

export function Avatar({
  name,
  size = "md",
  solid = false,
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  solid?: boolean;
  className?: string;
}) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = ((parts[0]?.[0] ?? "?") + (parts.length > 1 ? parts.at(-1)![0] : "")).toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-full font-semibold",
        solid ? "bg-primary text-white" : "bg-primary-soft text-primary",
        size === "sm" && "size-8 text-xs",
        size === "md" && "size-10 text-sm",
        size === "lg" && "size-16 text-xl",
        className
      )}
    >
      {letters}
    </span>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: ReactNode; count?: number }>;
  onChange: (value: T) => void;
}) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex max-w-full gap-1 overflow-x-auto rounded-md bg-tone p-1">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            className={clsx(
              "inline-flex h-8 shrink-0 items-center gap-2 rounded px-3 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-primary",
              selected ? "bg-panel text-ink" : "text-ink-soft hover:text-ink"
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span className={clsx("tabular-nums", selected ? "text-ink-soft" : "text-ink-faint")}>{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
