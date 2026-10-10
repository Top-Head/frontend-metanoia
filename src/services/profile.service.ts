import { api, ApiError } from "@/lib/api/client";
import type { Mentor, Student } from "@/lib/api/types";

export interface MentorProfilePayload {
  name: string;
  bio?: string;
  specialties?: number[];
  experience_description?: string;
}

export interface StudentProfilePayload {
  name: string;
  phone?: string;
  bio?: string;
}

async function orNull<T>(request: Promise<{ data: T }>) {
  try {
    return (await request).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export const getMentorProfile = () => orNull(api.get<Mentor>("/api/me/mentor/"));
export const getStudentProfile = () => orNull(api.get<Student>("/api/me/student/"));

export async function saveMentorProfile(payload: MentorProfilePayload, create = false) {
  const { data } = create
    ? await api.post<Mentor>("/api/me/mentor/", payload)
    : await api.patch<Mentor>("/api/me/mentor/", payload);
  return data;
}

export async function saveStudentProfile(payload: StudentProfilePayload, create = false) {
  const { data } = create
    ? await api.post<Student>("/api/me/student/", payload)
    : await api.patch<Student>("/api/me/student/", payload);
  return data;
}
