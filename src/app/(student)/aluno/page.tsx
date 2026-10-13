import type { Metadata } from "next";
import StudentHome from "@/components/student/student-home";

export const metadata: Metadata = {
  title: "Painel do aluno",
};

export default function StudentDashboardPage() {
  return <StudentHome />;
}
