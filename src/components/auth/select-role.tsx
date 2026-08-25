"use client";

import { JSX, useState } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap, Brain } from "lucide-react";
import { Header } from "./_components/role-components/header";
import { RoleCard } from "./_components/role-components/role-card";

type UserRole = "learner" | "mentor" | null;

export default function SelectUserRole(): JSX.Element {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  function handleRoleSelection(role: UserRole): void {
    setSelectedRole(role);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-[900px] flex flex-col items-center">

          {/* Headline */}
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wide text-primary uppercase bg-primary/10 rounded-full">
              Step 1 of 2
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Join Metanoia Academy
            </h1>

            <p className="text-slate-600 dark:text-slate-400 text-base max-w-md mx-auto">
              Tell us how you&apos;d like to use the platform to get started.
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-10">

            <RoleCard
              title="I want to Learn"
              description="Find expert mentors and accelerate your growth."
              icon={<GraduationCap size={32} />}
              isSelected={selectedRole === "learner"}
              onSelect={() => handleRoleSelection("learner")}
            />

            <RoleCard
              title="I want to Teach"
              description="Share your expertise and build your brand."
              icon={<Brain size={32} />}
              isSelected={selectedRole === "mentor"}
              onSelect={() => handleRoleSelection("mentor")}
            />

          </div>

          {/* Continue Button */}
          <div className="flex flex-col items-center gap-4 w-full">
            <Link
              href="/auth/cadastro"
              aria-disabled={!selectedRole}
              onClick={(e) => {
                if (!selectedRole) e.preventDefault();
              }}
              className={`flex items-center justify-center gap-2 min-w-[260px] h-12 px-6 rounded-lg bg-primary text-white text-sm font-semibold shadow-md hover:bg-primary/90 transition-all ${
                !selectedRole ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Continue
              <ArrowRight size={18} />
            </Link>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-primary font-semibold hover:underline"
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-400">
        © 2024 Metanoia Academy. All rights reserved.
      </footer>
    </div>
  );
}