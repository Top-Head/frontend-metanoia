"use client";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState, JSX } from "react";
import SocialButton from "./_components/login-components/social-botton";
import BrandLogo from "./_components/login-components/brand-logo";

export const metadata: Metadata = {
  title: "Login | Metanoia Academy",
  description: "Login to access your mentorship dashboard and courses.",
};

export default function LoginPage(): JSX.Element {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  function handleTogglePasswordVisibility(): void {
    setIsPasswordVisible((previousState) => !previousState);
  }

  return (
    <main className="flex min-h-screen w-full bg-background-light dark:bg-background-dark">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSJgGTInIgDd1y5TgXZLJo0-20Sk_6TPNdjP388AUGjTmIKbdJ53bLy-pHYosuQRECZdROGPsF3NWFZ0eNu7ecpTXmzYVpSFhNFF3Db9GeZx0lvtXP4Wphe_tKp91GMqD-1a0n1MDheItuLEnRMiI0-I-ff9lM4Jq564A2M1i5_232CgEIY1-n3CZj9x81foqajwrZOvK6XWxniquTPloHJYk5AP5cvtsGxWcMxz_ULxaj-jZI-hqLJsjxhSD-n6bKQKFkSkNO6-M"
          alt="Mentor and student discussing ideas"
          fill
          priority
          className="object-cover opacity-80"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />

        <div className="relative z-10 flex flex-col justify-end p-16 text-white">
          <BrandLogo size="large" />
          <h1 className="text-5xl font-black leading-tight mb-4 tracking-tight">
            Ignite your potential with expert mentorship.
          </h1>
          <p className="text-xl font-light text-slate-100 max-w-md">
            Join a community of lifelong learners and industry leaders dedicated
            to growth and professional excellence.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 bg-white dark:bg-background-dark">
        <div className="w-full max-w-[480px]">
          {/* Mobile Brand */}
          <div className="flex lg:hidden items-center gap-3 mb-12">
            <BrandLogo size="small" />
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h2 className="text-4xl font-black mb-2 text-slate-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Log in to access your mentorship dashboard and courses.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-slate-900 dark:text-slate-200 font-medium">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. name@email.com"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 h-14 px-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-slate-900 dark:text-slate-200 font-medium">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 h-14 px-4 pr-12 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
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

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <span>Login to Dashboard</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
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
          <div className="mt-12 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              Don't have an account?
              <Link
                href="#"
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