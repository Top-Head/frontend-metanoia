import type { Metadata } from "next";
import { NewCourse } from "@/components/mentor-courses/new-course";

export const metadata: Metadata = {
  title: "Nova aula",
};

export default function NovaAulaPage() {
  return <NewCourse />;
}
