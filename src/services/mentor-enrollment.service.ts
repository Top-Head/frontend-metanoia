import { api } from "@/lib/api/client";
import type { Enrollment, Paginated } from "@/lib/api/types";

export async function listReceivedEnrollments(params: { page_size?: number } = {}) {
  const { data } = await api.get<Paginated<Enrollment>>("/api/mentor/enrollments/", {
    params: { ordering: "-requested_at", page_size: 100, ...params },
  });
  return data;
}

type Action = "approve" | "reject";

export async function decideEnrollment(id: number, action: Action) {
  const { data } = await api.post<Enrollment>(
    `/api/mentor/enrollments/${id}/${action}/`
  );
  return data;
}
