import { JSX } from 'react'
import { Brain } from 'lucide-react';
import Link from 'next/link';

export function SelectInput(): JSX.Element {
  return (
    <div>
      <label className="text-sm font-bold text-slate-900 dark:text-white mb-2 block">
        Primary Expertise
      </label>
      <div className="relative">
        <Brain size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <select className="w-full h-10 pl-10 pr-3 rounded-md text-sm  border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary appearance-none">
          <option value="">Select your core skill</option>
          <option>Software Engineering</option>
          <option>Product Management</option>
          <option>UI/UX Design</option>
          <option>Digital Marketing</option>
          <option>Data Science</option>
          <option>Leadership & Management</option>
        </select>
      </div>
    </div>
  );
}

export function TermsCheckbox(): JSX.Element {
  return (
    <div className="flex items-start text-xs">
      <div className='flex items-center gap-2'>
        <input type="checkbox" className="mt-1 h-5 w-5 text-primary" />
        <p className="text-sm text-slate-600 dark:text-slate-400">
          I agree to the{" "}
          <Link href="#" className="text-primary font-medium hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-primary font-medium hover:underline">
            Privacy Policy
          </Link>.
        </p>
      </div>
    </div>
  );
}

export function TrustCard({
  icon,
  title,
  description,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
}): JSX.Element {
  return (
    <div className="flex flex-col items-center text-center p-3">
      <div className="bg-primary/10 text-primary p-2 rounded-full mb-2">
        {icon}
      </div>
      <h3 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-slate-500 text-xs">{description}</p>
    </div>
  );
}

export function Footer(): JSX.Element {
  return (
    <footer className="py-10 px-6 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-[960px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-sm text-slate-400">
          © 2024 Metanoia Academy. All rights reserved.
        </span>
        <div className="flex gap-6">
          <Link href="#" className="text-slate-400 hover:text-primary text-sm">
            Support
          </Link>
          <Link href="#" className="text-slate-400 hover:text-primary text-sm">
            Privacy
          </Link>
          <Link href="#" className="text-slate-400 hover:text-primary text-sm">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}