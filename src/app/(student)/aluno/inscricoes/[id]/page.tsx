import type { Metadata } from "next";
import { EnrollmentDetailView } from "@/components/enrollments/enrollment-detail";

export const metadata: Metadata = {
  title: "Inscrição",
};

export default async function InscricaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EnrollmentDetailView id={Number(id)} />;
}
