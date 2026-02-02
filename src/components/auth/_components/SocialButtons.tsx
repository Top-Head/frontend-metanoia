export function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Google */}
      <button className="flex items-center justify-center gap-3 px-4 py-3 border border-[var(--color-background-dark)] dark:border-[var(--color-background-light)] rounded-lg hover:bg-[var(--color-background-light)] dark:hover:bg-[var(--color-background-dark)] transition-colors">
        <svg className="size-5" viewBox="0 0 24 24">
          {/* paths do Google */}
        </svg>
        <span className="text-sm font-semibold text-background-dark dark:text-[var(--color-background-light)]">Google</span>
      </button>

      {/* LinkedIn */}
      <button className="flex items-center justify-center gap-3 px-4 py-3 border border-[var(--color-background-dark)] dark:border-[var(--color-background-light)] rounded-lg hover:bg-[var(--color-background-light)] dark:hover:bg-[var(--color-background-dark)] transition-colors">
        <svg className="size-5" fill="#0077b5" viewBox="0 0 24 24">
          {/* paths do LinkedIn */}
        </svg>
        <span className="text-sm font-semibold text-background-dark dark:text-[var(--color-background-light)]">LinkedIn</span>
      </button>
    </div>
  )
}
