import type { Metadata } from "next";
import { StudentCatalog } from "@/components/student/student-catalog";

export const metadata: Metadata = {
  title: "Catálogo de aulas",
};

export default function StudentCatalogPage() {
  return <StudentCatalog />;
}
