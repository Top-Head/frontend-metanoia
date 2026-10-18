import { api } from "@/lib/api/client";
import type { Enrollment, Paginated } from "@/lib/api/types";

/** GET /api/student/enrollments/ */
export async function listMyEnrollments(params: { page?: number; page_size?: number } = {}) {
  const { data } = await api.get<Paginated<Enrollment>>("/api/student/enrollments/", {
    params: { ordering: "-requested_at", ...params },
  });
  return data;
}

/** GET /api/student/enrollments/{id}/ */
export async function getMyEnrollment(id: number) {
  const { data } = await api.get<Enrollment>(`/api/student/enrollments/${id}/`);
  return data;
}

/**
 * POST /api/student/enrollments/ — pede inscrição numa turma.
 * Campos de escrita não documentados; presume-se `session`.
 */
export async function requestEnrollment(sessionId: number, courseId: number) {
  const { data } = await api.post<Enrollment>("/api/student/enrollments/", {
    session: sessionId,
    course: courseId,
  });
  return data;
}

/** POST /api/student/enrollments/{id}/cancel/ */
export async function cancelEnrollment(id: number) {
  const { data } = await api.post<Enrollment>(`/api/student/enrollments/${id}/cancel/`);
  return data;
}
