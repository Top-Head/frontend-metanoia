import { JSX, useId, type InputHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  /** Mensagem de erro exibida abaixo do campo. */
  error?: string;
}

export default function FormInput({
  label,
  icon,
  error,
  id,
  className,
  ...rest
}: FormInputProps): JSX.Element {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

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
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={clsx(
            "h-11 w-full rounded-lg border bg-panel pr-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:ring-1",
            icon ? "pl-10" : "pl-3",
            error
              ? "border-danger focus:border-danger focus:ring-danger"
              : "border-line-strong focus:border-primary focus:ring-primary",
            className
          )}
          {...rest}
        />
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
