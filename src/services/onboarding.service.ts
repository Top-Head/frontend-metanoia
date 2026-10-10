import { api, ApiError } from "@/lib/api/client";
import type {
  AIConversation,
  DiscoveryResult,
  LearningProfile,
  Paginated,
  PreferredModality,
  Level,
} from "@/lib/api/types";

export async function listConversations() {
  const { data } = await api.get<Paginated<AIConversation>>("/api/onboarding/", {
    params: { ordering: "-updated_at", page_size: 10 },
  });
  return data.results;
}

export async function getConversation(id: number) {
  const { data } = await api.get<AIConversation>(`/api/onboarding/${id}/`);
  return data;
}

export async function startConversation() {
  const { data } = await api.post<AIConversation>("/api/onboarding/start/", {});
  return data;
}

// Corpo não documentado no YAML: enviamos o texto como `content` e `message`.
export async function sendOnboardingMessage(id: number, text: string) {
  const { data } = await api.post<AIConversation>(`/api/onboarding/${id}/message/`, {
    content: text,
    message: text,
  });
  return data;
}

export async function skipConversation(id: number) {
  const { data } = await api.post<AIConversation>(`/api/onboarding/${id}/skip/`, {});
  return data;
}

// O id do perfil de aprendizagem não é exposto; presume-se igual ao do perfil de aluno.
export async function getLearningProfile(id: number) {
  try {
    const { data } = await api.get<LearningProfile>(`/api/learning-profile/${id}/`);
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export interface LearningProfilePatch {
  goals?: string;
  topics?: number[];
  topics_text?: string;
  level?: Level;
  preferred_modality?: PreferredModality;
  availability?: string;
}

export async function updateLearningProfile(id: number, patch: LearningProfilePatch) {
  const { data } = await api.patch<LearningProfile>(`/api/learning-profile/${id}/`, patch);
  return data;
}

export async function getRecommendations(q?: string) {
  const { data } = await api.get<DiscoveryResult[] | Paginated<DiscoveryResult>>(
    "/api/discovery/recommendations/",
    { params: { q: q || undefined } }
  );
  return Array.isArray(data) ? data : data.results;
}
