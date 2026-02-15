import { JSX } from 'react'
 
function FormInput({
  label,
  placeholder,
  type = "text",
  icon,
}: {
  label: string;
  placeholder: string;
  type?: string;
  icon: JSX.Element;
}): JSX.Element {
  return (
    <div>
      <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full h-10 pl-10 pr-3 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}

export default FormInput