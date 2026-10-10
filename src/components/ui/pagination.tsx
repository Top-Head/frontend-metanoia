import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  label?: string;
}

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  label = "Paginação",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label={label}
      className="mt-16 flex items-center justify-center gap-2"
    >
      <button
        type="button"
        aria-label="Página anterior"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-xl border border-line p-2.5 text-ink-soft shadow-card transition-colors hover:bg-panel disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft size={18} />
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <button
            key={page}
            type="button"
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => onPageChange(page)}
            className={clsx(
              "size-10 rounded-xl text-sm font-bold transition-colors",
              page === currentPage
                ? "bg-primary text-white shadow-card"
                : "border border-transparent text-ink-faint hover:border-line hover:bg-panel"
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="Próxima página"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-xl border border-line p-2.5 text-ink-soft shadow-card transition-colors hover:bg-panel disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}