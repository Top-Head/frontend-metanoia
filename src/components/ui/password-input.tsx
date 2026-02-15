import { JSX } from 'react'
import { Lock, EyeOff, Eye } from 'lucide-react';

function PasswordInput({
  isPasswordVisible,
  onToggle,
}: {
  isPasswordVisible: boolean;
  onToggle: () => void;
}): JSX.Element {
  return (
    <div>
      <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">
        Create Password
      </label>
      <div className="relative">
        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type={isPasswordVisible ? "text" : "password"}
          placeholder="At least 8 characters"
          className="w-full h-12 pl-12 pr-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
        >
          {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput