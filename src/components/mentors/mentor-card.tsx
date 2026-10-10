import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import type { Mentor, MentorSummary } from "@/lib/api/types";
import { initials } from "@/lib/format";

export function MentorAvatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  return (
    <span
      className={
        size === "lg"
          ? "flex size-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white"
          : "flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-base font-bold text-white"
      }
    >
      {initials(name)}
    </span>
  );
}

export function MentorCard({ mentor }: { mentor: Mentor | MentorSummary }) {
  const verified = "is_verified" in mentor && mentor.is_verified;

  return (
    <Link
      href={`/mentor?id=${mentor.id}`}
      className="group flex flex-col rounded-2xl border border-line bg-panel p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-float"
    >
      <div className="flex items-center gap-3">
        <MentorAvatar name={mentor.name} />
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 font-bold text-ink">
            <span className="truncate">{mentor.name}</span>
            {verified && (
              <BadgeCheck size={16} className="shrink-0 text-primary" aria-label="Mentor verificado" />
            )}
          </p>
          <p className="truncate text-xs text-ink-soft">
            {mentor.specialty_details.map((detail) => detail.name).join(" · ") || "Mentor"}
          </p>
        </div>
      </div>

      {mentor.bio && <p className="mt-4 line-clamp-2 text-sm text-ink-soft">{mentor.bio}</p>}

      <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-bold text-primary">
        Ver perfil
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
