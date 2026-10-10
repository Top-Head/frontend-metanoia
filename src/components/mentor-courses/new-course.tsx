"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { createCourse } from "@/services/mentor-course.service";
import { CourseForm } from "./course-form";

export function NewCourse() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl px-8">
      <Link
        href="/dashboard/aulas"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-primary"
      >
        <ArrowLeft size={16} />
        Minhas aulas
      </Link>
      <h1 className="text-2xl font-bold text-ink">Nova aula</h1>
      <p className="mb-8 text-sm text-ink-soft">
        A aula começa como rascunho. Depois de guardar, abra as turmas e publique quando estiver pronta.
      </p>

      <div className="rounded-2xl border border-line bg-panel p-6 shadow-card md:p-8">
        <CourseForm
          submitLabel="Criar rascunho"
          onSubmit={async (payload) => {
            const course = await createCourse(payload);
            toast.success("Rascunho criado! Agora abra a primeira turma.");
            router.replace(`/dashboard/aulas/${course.id}`);
          }}
        />
      </div>
    </div>
  );
}
