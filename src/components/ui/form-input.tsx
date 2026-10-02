import { JSX, useId, type InputHTMLAttributes, type ReactNode } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
}

export default function FormInput({
  label,
  icon,
  id,
  className,
  ...rest
}: FormInputProps): JSX.Element {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-bold text-ink"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`h-11 w-full rounded-lg border border-line-strong bg-panel pl-10 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-primary focus:ring-1 focus:ring-primary ${className ?? ""}`}
          {...rest}
        />
      </div>
    </div>
  );
}