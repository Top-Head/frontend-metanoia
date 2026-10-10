import { api } from "@/lib/api/client";
import type { Mentor, Paginated } from "@/lib/api/types";

export interface MentorSearchParams {
  search?: string;
  specialties?: number[];
  page?: number;
  page_size?: number;
}

/** GET /api/mentors/ — diretório público de mentores. */
export async function listMentors(params: MentorSearchParams = {}) {
  const { data } = await api.get<Paginated<Mentor>>("/api/mentors/", {
    params: { ...params, search: params.search || undefined },
  });
  return data;
}

/**
 * A API não tem GET /api/mentors/{id}/; procuramos o mentor no
 * diretório. Trocar pelo endpoint dedicado quando existir.
 */
export async function getMentor(id: number) {
  const { results } = await listMentors({ page_size: 100 });
  return results.find((mentor) => mentor.id === id) ?? null;
}
