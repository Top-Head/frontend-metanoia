"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/app/ui";
import { createCourse } from "@/services/mentor-course.service";
import { CourseForm } from "./course-form";

export function NewCourse() {
  const router = useRouter();

  return (
    <div className="max-w-3xl">
      <PageHeader
        back={{ href: "/dashboard/aulas", label: "Aulas" }}
        title="Nova aula"
        description="A aula começa como rascunho. Depois de guardar, abra a primeira turma e publique quando estiver pronta."
      />
      <div className="rounded-lg border border-line bg-panel p-6 md:p-8">
        <CourseForm
          submitLabel="Criar rascunho"
          onSubmit={async (payload) => {
            const course = await createCourse(payload);
            toast.success("Rascunho criado. Agora abra a primeira turma.");
            router.replace(`/dashboard/aulas/${course.id}`);
          }}
        />
      </div>
    </div>
  );
}
