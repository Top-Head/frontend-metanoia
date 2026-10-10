import type { Metadata } from "next";
import { ForYou } from "@/components/onboarding/for-you";

export const metadata: Metadata = {
  title: "Para você",
};

export default function ParaVocePage() {
  return <ForYou />;
}
