"use client";

import Link from "next/link";
import { useState, JSX } from "react";
import {
  User,
  Mail,
  ArrowRight,
  Verified,
  CreditCard,
  Users,
} from "lucide-react";
import FormInput from "../ui/form-input";
import PasswordInput from "../ui/password-input";
import { Footer, SelectInput, TermsCheckbox, TrustCard } from "../ui/select-input";
import { Header } from "./_components/register-components/header";
import { ProgressBar } from "./_components/register-components/progress-bar";

export default function RegistrationPage(): JSX.Element {
  const [isPasswordVisible, setIsPasswordVisible] =
    useState<boolean>(false);

  function handleTogglePasswordVisibility(): void {
    setIsPasswordVisible((previousState) => !previousState);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header />

      <main className="flex-1 flex justify-center py-6 px-4">
        <div className="w-full max-w-[520px] flex flex-col">

          <ProgressBar progressPercentage={50} />

          {/* Headline */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-2">
              Join Metanoia Academy as a Mentor
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
              Share your expertise and inspire the next generation of learners.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
            <form className="p-6 flex flex-col gap-4">
              <FormInput
                label="Full Name"
                placeholder="e.g. John Doe"
                icon={<User size={18} />}
              />

              <FormInput
                label="Work Email Address"
                placeholder="john@company.com"
                type="email"
                icon={<Mail size={18} />}
              />

              <PasswordInput
                isPasswordVisible={isPasswordVisible}
                onToggle={handleTogglePasswordVisibility}
              />

              <SelectInput />

              <TermsCheckbox />

              <button
                type="submit"
                className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                Continue to Profile Setup
                <ArrowRight size={18} />
              </button>

              <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
                Already have a mentor account?{" "}
                <Link
                  href="#"
                  className="text-primary font-bold hover:underline"
                >
                  Log in here
                </Link>
              </p>
            </form>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            <TrustCard
              icon={<Verified size={28} />}
              title="Vetted Experts"
              description="Join an elite community of top industry professionals."
            />
            <TrustCard
              icon={<CreditCard size={28} />}
              title="Flexible Earnings"
              description="Set your own rates and schedule that works for you."
            />
            <TrustCard
              icon={<Users size={28} />}
              title="Global Impact"
              description="Help students from over 50 countries achieve their goals."
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}