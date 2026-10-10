import { api } from "@/lib/api/client";
import type {
  CourseDetail,
  CourseType,
  DiscoveryResult,
  Modality,
  Paginated,
} from "@/lib/api/types";

export interface CourseSearchParams {
  q?: string;
  category?: number;
  type?: CourseType;
  modality?: Modality;
  max_price?: number;
  free?: boolean;
  page?: number;
  page_size?: number;
}

/**
 * GET /api/discovery/search/ — aulas publicadas com ranking.
 * O YAML declara uma lista, mas a API devolve um objeto paginado;
 * aceitamos os dois formatos.
 */
export async function searchCourses(params: CourseSearchParams) {
  const { data } = await api.get<Paginated<DiscoveryResult> | DiscoveryResult[]>(
    "/api/discovery/search/",
    { params: { ...params, q: params.q || undefined } }
  );

  return Array.isArray(data)
    ? { count: data.length, next: null, previous: null, results: data }
    : data;
}

/** GET /api/courses/{id}/ — detalhe com mentor, turmas e encontros. */
export async function getCourse(id: number) {
  const { data } = await api.get<CourseDetail>(`/api/courses/${id}/`);
  return data;
}
