import { Clock } from "lucide-react";
import { Button } from "../ui/button";

type RequestStatus = "pending" | "accepted" | "in_progress";

interface ServiceRequest {
  id: number;
  student: string;
  service: string;
  status: RequestStatus;
  description?: string;
  expiresIn?: string;
  progress?: number;
}

const BOARD_TABS = [
  { label: "Fluxo Ativo", active: true },
  { label: "Serviços Concluídos", active: false },
  { label: "Cancelados", active: false },
];

const REQUESTS: ServiceRequest[] = [
  {
    id: 1,
    student: "John Doe",
    service: "Mentoria UI/UX",
    status: "pending",
    description: "Sessão focada em design de portfólio.",
  },
  {
    id: 2,
    student: "John Doe",
    service: "Revisão de Portfólio",
    status: "pending",
    expiresIn: "Expira em 2h",
  },
  {
    id: 3,
    student: "John Doe",
    service: "Coaching de Carreira",
    status: "accepted",
    description: "Planejamento de transição profissional.",
  },
  {
    id: 4,
    student: "John Doe",
    service: "React Avançado",
    status: "in_progress",
    progress: 75,
  },
];

const COLUMN_META: Record<
  RequestStatus,
  { label: string; dotClass: string }
> = {
  pending: {
    label: "Pendentes",
    dotClass: "bg-warning",
  },
  accepted: {
    label: "Aceitos",
    dotClass: "bg-blue-500",
  },
  in_progress: {
    label: "Em Andamento",
    dotClass: "bg-success",
  },
};

function RequestCard({ request }: { request: ServiceRequest }) {
  return (
    <div className="w-full max-w-64 rounded-xl border border-line-strong bg-panel p-4 shadow-card">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {request.student.charAt(0)}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium text-ink">
            {request.student}
          </h3>
          <p className="truncate text-xs text-ink-soft">{request.service}</p>
        </div>
      </div>

      {request.description && (
        <p className="mt-2 h-6 truncate text-xs text-ink-faint">
          {request.description}
        </p>
      )}

      {request.expiresIn && (
        <div className="mt-2 flex w-fit items-center gap-1 rounded-md bg-warning-soft px-2 py-1 text-xs font-medium text-warning">
          <Clock size={16} />
          <span>{request.expiresIn}</span>
        </div>
      )}

      {request.progress !== undefined && (
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-success-soft">
            <span
              className="block h-full rounded-full bg-success"
              style={{ width: `${request.progress}%` }}
            />
          </div>
          <div className="mb-2 mt-1 flex items-center justify-between text-[11px] text-ink-soft">
            <span>Progresso</span>
            <span>{request.progress}%</span>
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-3">
        {request.status === "pending" && (
          <>
            <Button variant="primary" size="sm">
              Aceitar
            </Button>
            <Button variant="secondary" size="sm">
              Ver
            </Button>
          </>
        )}
        {request.status === "accepted" && (
          <Button variant="blue" size="sm">
            Mensagens do Aluno
          </Button>
        )}
        {request.status === "in_progress" && (
          <Button variant="green" size="sm">
            Sala de Aula
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Service() {
  return (
    <section className="py-10">
      <h2 className="text-xl font-bold text-ink">Quadro de Serviços</h2>

      <div className="mt-4 flex gap-8">
        {BOARD_TABS.map(({ label, active }) => (
          <button
            key={label}
            type="button"
            className={
              active
                ? "border-b-4 border-primary pb-2 text-sm font-bold text-primary"
                : "pb-2 text-sm text-ink-soft"
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        {(Object.keys(COLUMN_META) as RequestStatus[]).map((status) => {
          const columnRequests = REQUESTS.filter(
            (request) => request.status === status
          );
          const meta = COLUMN_META[status];

          return (
            <div key={status}>
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${meta.dotClass}`} />
                <h3 className="text-base font-bold text-ink">{meta.label}</h3>
                <span className="text-xs text-ink-faint">
                  ({columnRequests.length})
                </span>
              </div>
              <div className="mt-4 space-y-4">
                {columnRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}