import { api } from "@/lib/api/client";
import type {
  CourseDetail,
  CourseList,
  CourseSession,
  CourseWrite,
  Paginated,
  SessionMeeting,
} from "@/lib/api/types";

export async function listMyCourses(mentorId: number) {
  const { data } = await api.get<Paginated<CourseList>>("/api/courses/", {
    params: { page_size: 100, ordering: "-updated_at" },
  });
  return data.results.filter((course) => course.mentor?.id === mentorId);
}

export async function getCourseForEdit(id: number) {
  const { data } = await api.get<CourseDetail>(`/api/courses/${id}/`);
  return data;
}

export async function createCourse(payload: CourseWrite) {
  const { data } = await api.post<CourseWrite & { id: number }>("/api/courses/", payload);
  return data;
}

export async function updateCourse(id: number, payload: Partial<CourseWrite>) {
  const { data } = await api.patch<CourseWrite & { id: number }>(`/api/courses/${id}/`, payload);
  return data;
}

export async function deleteCourse(id: number) {
  await api.delete(`/api/courses/${id}/`);
}

export async function changeCourseStatus(id: number, action: "publish" | "archive" | "cancel") {
  const { data } = await api.post<CourseList>(`/api/courses/${id}/${action}/`);
  return data;
}

export interface SessionPayload {
  name: string;
  capacity: number | null;
  is_active?: boolean;
}

export async function createSession(courseId: number, payload: SessionPayload) {
  const { data } = await api.post<CourseSession>(`/api/courses/${courseId}/sessions/`, {
    ...payload,
  });
  return data;
}

export async function updateSession(id: number, payload: Partial<SessionPayload>) {
  const { data } = await api.patch<CourseSession>(`/api/sessions/${id}/`, payload);
  return data;
}

export async function deleteSession(id: number) {
  await api.delete(`/api/sessions/${id}/`);
}

export type MeetingPayload = { location?: string } & (
  | { starts_at: string; ends_at: string }
  | { day_of_week: number; start_time: string; end_time: string }
);

export async function createMeeting(sessionId: number, payload: MeetingPayload) {
  const { data } = await api.post<SessionMeeting>(`/api/sessions/${sessionId}/meetings/`, {
    ...payload,
  });
  return data;
}

export async function updateMeeting(id: number, payload: Partial<MeetingPayload>) {
  const { data } = await api.patch<SessionMeeting>(`/api/meetings/${id}/`, payload);
  return data;
}

export async function deleteMeeting(id: number) {
  await api.delete(`/api/meetings/${id}/`);
}
