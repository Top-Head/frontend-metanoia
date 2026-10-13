import type { Metadata } from "next";
import { CourseDetail } from "@/components/courses/course-detail";

export const metadata: Metadata = {
  title: "Aula",
};

export default async function StudentCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CourseDetail id={Number(id)} backHref="/aluno/catalogo" />;
}
