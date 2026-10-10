import type { Metadata } from "next";
import { EnrollmentList } from "@/components/enrollments/enrollment-list";

export const metadata: Metadata = {
  title: "Minhas inscrições",
};

export default function MinhasInscricoesPage() {
  return <EnrollmentList />;
}
