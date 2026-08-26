"use client"

import { forwardRef } from "react"
import type { ButtonHTMLAttributes } from "react"
import clsx from "clsx"

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "green"
  | "blue"
  | "blue-secondary"
  | "gray";
type ButtonSize = "sm" | "md" | "lg" | "xl"

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]",

          // Variants
          {
            "bg-primary text-white hover:bg-primary/90": variant === "primary",

            "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700":
              variant === "secondary",

            "bg-transparent text-primary hover:bg-primary/10":
              variant === "ghost",

            "bg-[#10B981] text-white": variant === "green",

            "bg-white text-blue-500 border border-blue-500": variant === "blue",
            "bg-blue-500 text-white rounded-[4px]": variant === "blue-secondary",

            "bg-gray-300  font-bold rounded-[4px]": variant === "gray",
          },

          // Sizes
          {
            "h-10 px-4 text-sm": size === "sm",
            "h-12 px-6 text-base": size === "md",
            "h-14 px-8 text-lg": size === "lg",
            "w-[263.33px] h-10.5": size === "xl",
          },

          className,
        )}
        {...props}
      >
        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        )}

        {children}
      </button>
    );
  }
)

Button.displayName = "Button"