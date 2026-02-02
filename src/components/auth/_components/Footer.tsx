export function Footer() {
  return (
    <div className="mt-12 text-center">
      <p className="text-[var(--color-background-dark)] dark:text-[var(--color-background-light)]">
        Don't have an account?
        <a className="text-primary font-bold hover:underline ml-1" href="#">
          Create an account
        </a>
      </p>
    </div>
  )
}