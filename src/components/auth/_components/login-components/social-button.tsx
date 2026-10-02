import { JSX } from "react";
import { SiGoogle, SiLinkedin } from "react-icons/si";
import { toast } from "react-hot-toast";

type SocialProvider = "Google" | "LinkedIn";

const PROVIDER_META: Record<
  SocialProvider,
  { label: string; icon: JSX.Element }
> = {
  Google: {
    label: "Continuar com Google",
    icon: <SiGoogle size={18} className="text-[#4285F4]" />,
  },
  LinkedIn: {
    label: "Continuar com LinkedIn",
    icon: <SiLinkedin size={18} className="text-[#0A66C2]" />,
  },
};

export default function SocialButton({
  provider,
}: {
  provider: SocialProvider;
}) {
  const { label, icon } = PROVIDER_META[provider];

  function handleClick() {
    // TODO: implementar OAuth/SSO na integração com a API.
    toast("Login social disponível em breve.", { icon: "🚧" });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center justify-center gap-3 rounded-lg border border-line-strong px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-slate-50"
    >
      {icon}
      <span className="hidden xl:inline">{label}</span>
      <span className="xl:hidden">{provider}</span>
    </button>
  );
}