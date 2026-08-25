

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const calendarDays = [
  null,
  null,
  null,
  null,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  13,
  14,
  15,
  null,
  null,
];

export default function Calendar() {
  return (
    <aside className="h-[1024px] w-[320px] border-l border-[#E2E8F0] bg-white p-6">
      <div className="rounded-[20px] bg-[#F8FAFC] p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-[20px] font-bold text-[#0F172A]">October 2023</h1>
          <div className="flex items-center gap-3 text-[#64748B]">
            <button className="text-lg">‹</button>
            <button className="text-lg">›</button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-[12px] font-medium text-[#64748B]">
          {weekDays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-7 gap-2 text-center text-[13px] text-[#334155]">
          {calendarDays.map((day, index) => (
            <div
              key={`${day ?? "empty"}-${index}`}
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                day === 15
                  ? "bg-[#5d9aee] font-semibold text-white"
                  : day === 18 || day === 22
                    ? "bg-[#DBEAFE] font-medium text-[#136DEC]"
                    : day
                      ? "hover:bg-slate-100"
                      : ""
              }`}
            >
              {day ?? ""}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-[#0F172A]">
            Upcoming Sessions
          </h2>
        </div>

        <div className="space-y-3">
          <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[#136DEC]">
                Design Review
              </span>
              <span className="rounded-full bg-[#DBEAFE] px-2 py-1 text-[10px] text-[#136DEC]">
                10:00 AM
              </span>
            </div>
            <p className="mt-2 text-[12px] text-[#64748B]">
              Oct 15 • Mentor session
            </p>
          </div>

          <div className="rounded-[12px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[#10B981]">
                Workshop
              </span>
              <span className="rounded-full bg-[#D1FAE5] px-2 py-1 text-[10px] text-[#047857]">
                02:30 PM
              </span>
            </div>
            <p className="mt-2 text-[12px] text-[#64748B]">
              Oct 22 • UI/UX Lab
            </p>
          </div>
        </div>
      </div>
      <button className="flex items-center justify-center gap-2 text-[#64748B] font-bold text-[11px] w-[271px] h-[52px] rounded-[8px] border border-dashed border-[#E2E8F0] shadow mt-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span className="text-[14px]">Add Custom Slot</span>
      </button>
    </aside>
  );
}
