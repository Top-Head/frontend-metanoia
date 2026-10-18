export type RegisterRole = "STUDENT" | "MENTOR" | "BOTH";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type CourseType = "GROUP" | "INDIVIDUAL";
export type Modality = "ONLINE" | "PRESENTIAL";
export type PreferredModality = Modality | "ANY";
export type CourseStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "ARCHIVED";
export type EnrollmentStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type PaymentStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED";
export type Level = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "UNKNOWN";
export type AIConversationStatus = "ACTIVE" | "COMPLETED" | "SKIPPED";
export type AIMessageRole = "USER" | "ASSISTANT" | "SYSTEM";

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type Detail = { id?: number; name?: string } & Record<string, unknown>;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  password_confirm: string;
  name: string;
  role?: RegisterRole;
  phone?: string;
  bio?: string;
  experience_description?: string;
  specialties?: number[];
}

export interface Student {
  id: number;
  name: string;
  phone?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Mentor {
  id: number;
  name: string;
  bio?: string;
  specialties?: number[];
  specialty_details: Detail[];
  experience_description?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface MentorSummary {
  id: number;
  name: string;
  bio?: string;
  specialty_details: Detail[];
}

export interface User {
  id: number;
  email: string;
  status: UserStatus;
  created_at: string;
  student_profile: Student | null;
  mentor_profile: Mentor | null;
}

export interface TokenEnvelope {
  access: string;
  refresh: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active?: boolean;
}

/** Encontro pontual (`starts_at`/`ends_at`) ou semanal (`day_of_week` + horas). */
export interface NestedMeeting {
  id: number;
  day_of_week?: number | null;
  /** "HH:MM:SS" */
  start_time?: string | null;
  end_time?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  location?: string;
}

export interface SessionMeeting extends NestedMeeting {
  session: number;
  created_at: string;
  updated_at: string;
}

export interface CourseSession {
  id: number;
  course: number;
  name: string;
  capacity: number | null;
  effective_capacity: number;
  total_students: number;
  is_active?: boolean;
  meetings?: NestedMeeting[];
  created_at: string;
  updated_at: string;
}

export interface CourseList {
  id: number;
  title: string;
  image?: string;
  description?: string;
  category: Category;
  mentor: MentorSummary;
  type?: CourseType;
  modality?: Modality;
  location?: string;
  /** Decimal em string, ex.: "15000.00". */
  price_amount?: string;
  currency?: string;
  is_free: boolean;
  capacity: number | null;
  total_capacity: number;
  total_enrolled: number;
  days_of_week: number[];
  /** "YYYY-MM-DD" */
  start_date?: string | null;
  end_date?: string | null;
  status?: CourseStatus;
  session_count: number;
  created_at: string;
  updated_at: string;
}

export interface CourseDetail extends CourseList {
  sessions: CourseSession[];
}

export interface CourseWrite {
  title: string;
  image?: string;
  start_date?: string | null;
  end_date?: string | null;
  description?: string;
  category: number;
  type?: CourseType;
  modality?: Modality;
  location?: string;
  price_amount?: string;
  currency?: string;
  capacity?: number | null;
}

export interface DiscoveryResult {
  score: number;
  reasons: string[];
  has_capacity: boolean;
  course: CourseList;
}

export interface EnrollmentCourse {
  id: number;
  title: string;
  category_name: string;
  type?: CourseType;
  modality?: Modality;
  location?: string;
  price_amount?: string;
  currency?: string;
  is_free: boolean;
  status?: CourseStatus;
}

export interface EnrollmentSession {
  id: number;
  name: string;
  capacity: number | null;
  effective_capacity: number;
  total_students: number;
}

export interface Enrollment {
  id: number;
  student: number;
  student_name: string;
  course: EnrollmentCourse;
  session: EnrollmentSession;
  status: EnrollmentStatus;
  payment_status: PaymentStatus;
  requested_at: string;
  decided_at: string | null;
  decision_note: string;
  payment_decided_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: number;
  role: AIMessageRole;
  content: string;
  created_at: string;
}

export interface AIConversation {
  id: number;
  status?: AIConversationStatus;
  messages: AIMessage[];
  created_at: string;
  updated_at: string;
}

export interface ChatRoom {
  id: number;
  course_title: string;
  session_name: string;
  mentor_name: string;
  member_count: number;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  room: number;
  sender: number;
  sender_name: string;
  content: string;
  created_at: string;
}

export interface LearningProfile {
  id: number;
  goals?: string;
  topics?: number[];
  topic_details: Detail[];
  topics_text?: string;
  level?: Level;
  preferred_modality?: PreferredModality;
  availability?: string;
  notes?: string;
  extracted_at: string | null;
  created_at: string;
  updated_at: string;
}
