import { api } from "@/lib/api/client";
import type { Category } from "@/lib/api/types";

export async function listCategories(search?: string) {
  const { data } = await api.get<Category[]>("/api/categories/", {
    params: { search: search || undefined, ordering: "name" },
    skipAuth: true,
  });
  return data.filter((category) => category.is_active !== false);
}
