export function MobileLogo() {
  return (
    <div className="flex lg:hidden items-center gap-3 mb-12">
      <div className="size-8 text-primary">
        <svg fill="none" viewBox="0 0 48 48">
          <path
            clipRule="evenodd"
            d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
            fill="currentColor"
            fillRule="evenodd"
          />
        </svg>
      </div>
      <h2 className="text-background-dark dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
        Metanoia Academy
      </h2>
    </div>
  )
}