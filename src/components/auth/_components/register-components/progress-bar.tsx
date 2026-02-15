import { JSX } from 'react'

export function ProgressBar({
  progressPercentage,
}: {
  progressPercentage: number;
}): JSX.Element {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 mb-6 border border-slate-200 dark:border-slate-800">
      <div className="flex justify-between mb-1">
        <span className="font-medium text-sm text-slate-900 dark:text-white">
          Step 1: Account Creation
        </span>
        <span className="text-primary font-semibold text-xs">
          {progressPercentage}% Complete
        </span>
      </div>
      <div className="rounded-full bg-slate-100 dark:bg-slate-800 h-2">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}