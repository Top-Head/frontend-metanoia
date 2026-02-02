export function FormFields() {
  return (
    <>
      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-background-dark dark:text-[var(--color-background-light)] text-base font-medium leading-normal">
          Email Address
        </label>
        <input
          type="email"
          placeholder="e.g. name@email.com"
          className="form-input flex w-full rounded-lg text-background-dark dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[var(--color-background-dark)] dark:border-[var(--color-background-light)] bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]/50 focus:border-primary h-14 placeholder:text-[var(--color-background-dark)] p-[15px] text-base font-normal leading-normal transition-colors"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-background-dark dark:text-[var(--color-background-light)] text-base font-medium leading-normal">
            Password
          </label>
          <a className="text-primary text-sm font-semibold hover:underline" href="#">
            Forgot Password?
          </a>
        </div>
        <div className="relative flex w-full items-stretch rounded-lg">
          <input
            type="password"
            placeholder="••••••••"
            className="form-input flex w-full rounded-lg text-background-dark dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[var(--color-background-dark)] dark:border-[var(--color-background-light)] bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)]/50 focus:border-primary h-14 placeholder:text-[var(--color-background-dark)] p-[15px] pr-12 text-base font-normal leading-normal transition-colors"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-background-dark)] cursor-pointer hover:text-primary">
            <span className="material-symbols-outlined" data-icon="visibility">
              visibility
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
