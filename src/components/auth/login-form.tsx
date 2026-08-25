"use client";

import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState, JSX } from "react";
import SocialButton from "./_components/login-components/social-botton";
import BrandLogo from "./_components/login-components/brand-logo";
import LeftSection from "./_components/login-components/left-section";

export default function LoginPage(): JSX.Element {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  function handleTogglePasswordVisibility(): void {
    setIsPasswordVisible((previousState) => !previousState);
  }

  return (
    <main className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Left Section */}
      <LeftSection />

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-10 lg:p-14 bg-white dark:bg-background-dark">
        <div className="w-full max-w-105">
          {/* Mobile Brand */}
          <div className="flex lg:hidden items-center gap-3 mb-12">
            <BrandLogo size="small" />
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h2 className="text-2xl xl:text-3xl font-bold mb-1 text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Log in to access your mentorship dashboard and courses.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-slate-900 dark:text-slate-200 font-medium">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. name@email.com"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 h-11 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-slate-900 dark:text-slate-200 font-medium">
                  Password
                </label>
                <Link
                  href="/auth/recuperar-senha"
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 h-11 px-4 pr-12 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={handleTogglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                >
                  {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
           
           <Link href="/dashboard" >
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <span>Login to Dashboard</span>
                <ArrowRight size={18} />
              </button>
           </Link>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-background-dark px-4 text-slate-500 uppercase tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <SocialButton provider="Google" />
            <SocialButton provider="LinkedIn" />
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?
              <Link
                href="/auth/cadastro"
                className="text-primary font-bold hover:underline ml-1"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}