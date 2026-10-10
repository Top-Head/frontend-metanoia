import type { Metadata } from "next";
import { OnboardingChat } from "@/components/onboarding/onboarding-chat";

export const metadata: Metadata = {
  title: "Os seus objetivos",
};

export default function OnboardingPage() {
  return <OnboardingChat />;
}
