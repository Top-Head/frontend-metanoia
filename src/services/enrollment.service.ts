import { api } from "@/lib/api/client";
import type { Enrollment, Paginated } from "@/lib/api/types";

/** Tamanho máximo aceite no envio de comprovativos (validação no cliente). */
export const MAX_PROOF_BYTES = 5 * 1024 * 1024;
export const PROOF_ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";

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

/** POST /api/student/enrollments/{id}/proof/ — upload multipart do comprovativo. */
export async function submitPaymentProof(id: number, file: File) {
  const form = new FormData();
  form.append("payment_proof", file);

  const { data } = await api.post<Enrollment>(`/api/student/enrollments/${id}/proof/`, form);
  return data;
}

/** GET /api/student/enrollments/{id}/download-proof/ — devolve o ficheiro. */
export async function downloadMyPaymentProof(id: number) {
  const { data } = await api.get<Blob>(`/api/student/enrollments/${id}/download-proof/`, {
    responseType: "blob",
  });
  return data;
}
