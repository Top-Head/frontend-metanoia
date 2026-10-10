import type { Metadata } from "next";
import { MentorDirectory } from "@/components/mentors/mentor-directory";

export const metadata: Metadata = {
  title: "Mentores",
  description: "Conheça os mentores da Academia Metanoia e as suas especialidades.",
};

export default function MentoresPage() {
  return <MentorDirectory />;
}
