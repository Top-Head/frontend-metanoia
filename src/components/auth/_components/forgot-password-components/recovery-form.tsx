"use client";

import { JSX, useState, FormEvent } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export function RecoveryForm(): JSX.Element {
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!emailAddress) return;

    try {
      setIsSubmitting(true);

      console.log("Send reset link to:", emailAddress);

    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Headline */}
      <div className="mb-2 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Reset your password
        </h1>
      </div>

      {/* Body */}
      <div className="mb-6 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Enter your email address and we’ll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-2">
            Email Address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="email"
              required
              value={emailAddress}
              onChange={(event) => setEmailAddress(event.target.value)}
              placeholder="mentor@metanoia.edu"
              className="w-full h-11 pl-10 pr-3 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-background-dark text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {/* Back to login */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/auth/login"
          className="flex items-center gap-2 text-primary text-sm font-medium hover:opacity-80 transition"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </>
  );
}