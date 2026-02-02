export function LeftBanner() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage:
            'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDSJgGTInIgDd1y5TgXZLJo0-20Sk_6TPNdjP388AUGjTmIKbdJ53bLy-pHYosuQRECZdROGPsF3NWFZ0eNu7ecpTXmzYVpSFhNFF3Db9GeZx0lvtXP4Wphe_tKp91GMqD-1a0n1MDheItuLEnRMiI0-I-ff9lM4Jq564A2M1i5_232CgEIY1-n3CZj9x81foqajwrZOvK6XWxniquTPloHJYk5AP5cvtsGxWcMxz_ULxaj-jZI-hqLJsjxhSD-n6bKQKFkSkNO6-M")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
      <div className="relative z-10 flex flex-col justify-end p-16 text-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 text-white">
            <svg fill="none" viewBox="0 0 48 48">
              <path
                clipRule="evenodd"
                d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">Metanoia Academy</span>
        </div>
        <h1 className="text-5xl font-black leading-tight mb-4 tracking-[-0.033em]">
          Ignite your potential with expert mentorship.
        </h1>
        <p className="text-xl font-light text-[var(--color-background-dark)] max-w-md">
          Join a community of lifelong learners and industry leaders dedicated to growth and professional excellence.
        </p>
      </div>
    </div>
  )
}