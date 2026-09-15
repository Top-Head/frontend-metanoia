import { JSX } from "react";

export function ProgressBar({
  progressPercentage,
}: {
  progressPercentage: number;
}): JSX.Element {
  return (
    <div
      className="mb-6 rounded-lg border border-line bg-panel p-4 shadow-card"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progressPercentage}
      aria-label="Progresso do cadastro"
    >
      <div className="mb-2 flex justify-between">
        <span className="text-sm font-medium text-ink">
          Etapa 1: Criação da conta
        </span>
        <span className="text-xs font-semibold text-primary">
          {progressPercentage}% concluído
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
        />
      </div>
    </div>
  );
}