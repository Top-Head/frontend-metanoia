import type { Metadata } from "next";
import { MyCourses } from "@/components/mentor-courses/my-courses";

export const metadata: Metadata = {
  title: "Minhas aulas",
};

export default function MinhasAulasPage() {
  return <MyCourses />;
}
