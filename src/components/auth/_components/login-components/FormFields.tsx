export function FormFields() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="text-background-dark text-base font-medium leading-normal">
          Endereço de email
        </label>
        <input
          type="email"
          placeholder="e.g. name@email.com"
          className="form-input flex w-full rounded-lg text-background-dark focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-background-dark bg-background-light focus:border-primary h-14 placeholder:text-background-dark p-[15px] text-base font-normal leading-normal transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-background-dark text-base font-medium leading-normal">
            Senha
          </label>
          <a className="text-primary text-sm font-semibold hover:underline" href="#">
            Esqueceste a Senha?
          </a>
        </div>
        <div className="relative flex w-full items-stretch rounded-lg">
          <input
            type="senha"
            placeholder="••••••••"
            className="form-input flex w-full rounded-lg text-background-dark focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-background-dark bg-background-light focus:border-primary h-14 placeholder:text-background-dark p-[15px] pr-12 text-base font-normal leading-normal transition-colors"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-background-dark cursor-pointer hover:text-primary">
            <span className="material-symbols-outlined" data-icon="visibility">
              Visibilidade
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
