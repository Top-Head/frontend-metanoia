import type { Metadata } from "next";
import { CourseDetailView } from "@/components/courses/course-detail";

export const metadata: Metadata = {
  title: "Aula",
  description: "Detalhes da aula, turmas disponíveis e mentor responsável.",
};

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CourseDetailView id={Number(id)} />;
}
