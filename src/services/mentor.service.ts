import { MENTORS, type Mentor } from "@/data/mentors";

/**
 * Camada de acesso aos dados dos mentores.
 *
 * TODO: substituir a fonte local pela API quando a integração
 * de backend estiver disponível.
 */
export async function listMentors(): Promise<Mentor[]> {
  return MENTORS;
}

export async function getMentorById(id: number): Promise<Mentor | undefined> {
  return MENTORS.find((mentor) => mentor.id === id);
}