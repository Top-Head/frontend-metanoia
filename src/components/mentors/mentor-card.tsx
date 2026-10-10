import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Mentor } from "@/data/mentors";
import { formatKz } from "@/lib/currency";

interface MentorCardProps {
  mentor: Mentor;
}

export function MentorCard({ mentor }: MentorCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-panel shadow-card transition-all duration-300 hover:shadow-float">
      <div className="relative h-52 overflow-hidden bg-slate-200">
        <Image
          src={mentor.image}
          alt={`Foto de ${mentor.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-white/95 px-2 py-1 shadow-card">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="text-[11px] font-bold">{mentor.rating}</span>
          <span className="text-[10px] font-medium text-ink-faint">
            ({mentor.reviews})
          </span>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div>
          <h3 className="text-lg font-bold text-ink">{mentor.name}</h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-primary">
            {mentor.role}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {mentor.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-md border border-line bg-slate-50 px-2 py-1 text-[9px] font-bold uppercase tracking-tighter text-ink-faint"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-line pt-4">
          <div>
            <p className="text-[10px] font-medium text-ink-faint">
              A partir de
            </p>
            <p className="text-lg font-bold text-ink">
              {formatKz(mentor.price)}
              <span className="text-xs font-normal text-ink-soft">/h</span>
            </p>
          </div>
          <Link
            href={`/mentor?id=${mentor.id}`}
            className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-strong"
          >
            Ver Perfil
          </Link>
        </div>
      </div>
    </article>
  );
}