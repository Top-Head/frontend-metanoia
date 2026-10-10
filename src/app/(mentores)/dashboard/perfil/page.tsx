import type { Metadata } from "next";
import { MentorProfilePage } from "@/components/profile/mentor-profile-page";

export const metadata: Metadata = {
  title: "Meu perfil",
};

export default function PerfilMentorPage() {
  return <MentorProfilePage />;
}
