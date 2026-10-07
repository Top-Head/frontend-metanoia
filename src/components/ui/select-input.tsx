import { JSX, useId, type SelectHTMLAttributes } from "react";
import { Brain, type LucideIcon } from "lucide-react";
import Link from "next/link";

const EXPERTISE_OPTIONS = [
  "Engenharia de Software",
  "Gestão de Produto",
  "Design UI/UX",
  "Marketing Digital",
  "Ciência de Dados",
  "Liderança e Gestão",
];

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: LucideIcon;
  placeholder?: string;
}

export function SelectInput({
  label = "Especialidade principal",
  icon: Icon = Brain,
  placeholder = "Selecione sua especialidade",
  id,
  ...rest
}: SelectInputProps): JSX.Element {
  const autoId = useId();
  const selectId = id ?? autoId;

  return (
    <div>
      <label
        htmlFor={selectId}
        className="mb-2 block text-sm font-bold text-ink"
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
        />
        <select
          id={selectId}
          className="h-11 w-full appearance-none rounded-lg border border-line-strong bg-panel pl-10 pr-3 text-sm text-ink outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
          {...rest}
        >
          <option value="">{placeholder}</option>
          {EXPERTISE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function TermsCheckbox(): JSX.Element {
  return (
    <div className="flex items-start gap-2">
      <input
        type="checkbox"
        className="mt-1 size-5 rounded accent-primary"
        id="terms"
      />
      <label htmlFor="terms" className="text-sm text-ink-soft">
        Concordo com os{" "}
        <Link href="/termos" className="font-medium text-primary hover:underline">
          Termos de Serviço
        </Link>{" "}
        e a{" "}
        <Link
          href="/privacidade"
          className="font-medium text-primary hover:underline"
        >
          Política de Privacidade
        </Link>
        .
      </label>
    </div>
  );
}

interface TrustCardProps {
  icon: JSX.Element;
  title: string;
  description?: string;
}

export function TrustCard({
  icon,
  title,
  description,
}: TrustCardProps): JSX.Element {
  return (
    <div className="flex flex-col items-center rounded-xl border border-line bg-panel p-4 text-center">
      <div className="mb-3 rounded-full bg-primary/10 p-2 text-primary">
        {icon}
      </div>
      <h3 className="mb-1 text-sm font-bold text-ink">{title}</h3>
      <p className="text-xs text-ink-soft">{description}</p>
    </div>
  );
}

export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-line px-6 py-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 md:flex-row">
        <span className="text-sm text-ink-faint">
          © {new Date().getFullYear()} Academia Metanoia. Todos os direitos
          reservados.
        </span>
        <div className="flex gap-6">
          <Link
            href="/ajuda"
            className="text-sm text-ink-faint transition-colors hover:text-primary"
          >
            Suporte
          </Link>
          <Link
            href="/privacidade"
            className="text-sm text-ink-faint transition-colors hover:text-primary"
          >
            Privacidade
          </Link>
          <Link
            href="/termos"
            className="text-sm text-ink-faint transition-colors hover:text-primary"
          >
            Termos
          </Link>
        </div>
      </div>
    </footer>
  );
}