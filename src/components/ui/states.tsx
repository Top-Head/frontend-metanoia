import type { ReactNode } from "react";
import { CloudOff, RotateCw } from "lucide-react";

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-line bg-panel px-6 py-16 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-danger/10 text-danger">
        <CloudOff size={22} />
      </span>
      <p className="font-bold text-ink">Não foi possível carregar</p>
      <p className="mt-1 max-w-sm text-sm text-ink-soft">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
        >
          <RotateCw size={14} />
          Tentar de novo
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-line bg-panel px-6 py-16 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <p className="font-bold text-ink">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-ink-soft">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
