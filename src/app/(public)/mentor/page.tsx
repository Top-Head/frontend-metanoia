import type { Metadata } from "next";
import { MentorProfileView } from "@/components/mentors/mentor-profile";

export const metadata: Metadata = {
  title: "Perfil do Mentor",
};

export default async function MentorProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return <MentorProfileView id={Number(id)} />;
}
