import type { Metadata } from "next";
import { StudentProfilePage } from "@/components/profile/student-profile-page";

export const metadata: Metadata = {
  title: "Meu perfil",
};

export default function PerfilAlunoPage() {
  return <StudentProfilePage />;
}
