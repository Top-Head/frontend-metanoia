import { JSX } from "react";
import clsx from "clsx";

interface RoleCardProperties {
  title: string;
  description: string;
  icon: JSX.Element;
  isSelected: boolean;
  onSelect: () => void;
}

export function RoleCard({
  title,
  description,
  icon,
  isSelected,
  onSelect,
}: RoleCardProperties): JSX.Element {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        "group flex flex-col items-center text-center p-6 rounded-xl border-2 transition-all duration-200 shadow-sm",
        "bg-white",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-slate-200 hover:border-primary hover:bg-primary/5"
      )}
    >
      <div className="mb-4 size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-4">
        <div
          className={clsx(
            "size-5 rounded-full border-2 flex items-center justify-center transition-all",
            isSelected
              ? "border-primary"
              : "border-slate-300 group-hover:border-primary"
          )}
        >
          <div
            className={clsx(
              "size-2.5 rounded-full bg-primary transition-opacity",
              isSelected ? "opacity-100" : "opacity-0"
            )}
          />
        </div>
      </div>
    </button>
  );
}