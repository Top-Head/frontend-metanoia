import type { Metadata } from "next";
import DashboardHome from "@/components/dashboard/dashboard-home";

export const metadata: Metadata = {
  title: "Painel do mentor",
};

export default function Dashboard() {
  return <DashboardHome />;
}
