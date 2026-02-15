import { JSX } from 'react'
import { ArrowRight } from 'lucide-react';
import Link from 'next/link'
import { Button } from '@/components/ui/button';

export function Header(): JSX.Element {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark px-4 md:px-8 py-2.5 sticky top-0 z-50">
      <div className="flex items-center gap-3 text-slate-900 dark:text-white">
        <div className="text-primary">
          <ArrowRight size={20} />
        </div>
        <h2 className="text-lg font-semibold">Metanoia Academy</h2>
      </div>

      <div className="hidden md:flex gap-8 items-center">
        <Link href="#" className="hover:text-primary text-sm">
          Find Mentors
        </Link>
        <Link href="#" className="hover:text-primary text-sm">
          Courses
        </Link>
        <Link href="#" className="hover:text-primary text-sm">
          Community
        </Link>

        <Button className="bg-primary text-white rounded-md">
          Log In
        </Button>
      </div>
    </header>
  );
}