"use client";

import { JSX, forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { Lock, EyeOff, Eye } from "lucide-react";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ label = "Senha", id, ...rest }, ref): JSX.Element {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div>
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-bold text-ink"
        >
          {label}
        </label>
        <div className="relative">
          <Lock
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <input
            ref={ref}
            id={inputId}
            type={isVisible ? "text" : "password"}
            className="h-11 w-full rounded-lg border border-line-strong bg-panel pl-10 pr-11 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-primary focus:ring-1 focus:ring-primary"
            {...rest}
          />
          <button
            type="button"
            onClick={() => setIsVisible((visible) => !visible)}
            aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint transition-colors hover:text-primary"
          >
            {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
    );
  }
);

export default PasswordInput;