import type { Metadata } from "next";
import { CourseEditor } from "@/components/mentor-courses/course-editor";

export const metadata: Metadata = {
  title: "Gerir aula",
};

export default async function GerirAulaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CourseEditor id={Number(id)} />;
}
