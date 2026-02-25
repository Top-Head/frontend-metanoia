import { JSX } from "react";

function SocialButton({
  provider,
}: {
  provider: "Google" | "LinkedIn";
}): JSX.Element {
  return (
    <button className="flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
      <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">
        {provider}
      </span>
    </button>
  );
}

export default SocialButton;