import { Search } from "lucide-react";
import Image from "next/image";
export default function Sidebar() {
  return (
    <aside className="w-[380px] shrink-0 flex flex-col border-r bg-white border-[#E7ECF3] px-4 py-4">
      <div className="shrink-0">
        <h1 className="text-[20px] font-bold text-[#0D131B]">Messages</h1>
        <p className="text-[14px] text-[#4C6C9A]">Communication Hub</p>
        <div className="hidden md:flex relative h-11 mt-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4c6c9a]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search mentors..."
            className="w-full bg-[#e7ecf3] border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#136dec]/20 outline-none"
          />
        </div>
        <div className="bg-[#F0F3F8] rounded-xl h-[44px] mt-4 flex gap-4 px-2 text-[#4C6C9A]">
          <button className="bg-white rounded-[6px] w-[113px] h-[28px] mt-1.5 mb-1.5 shadow">
            All
          </button>
          <button className="mt-1.5 mb-1.5">Mentors</button>
          <button className="mt-1.5 mb-1.5">Students</button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto mt-4 space-y-0.5 pr-1">
        <div className="flex gap-4 bg-[#136DEC0D] border-l-4 border-[#136DEC] items-center rounded-r-xl p-2">
          <Image className="shrink-0" src="/Container.png" alt="" width={56} height={56} />
          <div className="min-w-0">
            <h1 className="text-black font-semibold text-[18px] truncate">
              Alex Rivera
            </h1>
            <span className="text-[#136DEC] text-[12px] font-medium">
              UI Design Path
            </span>
            <p className="text-[#4C6C9A] text-[14px] truncate">
              Can we reschedule the session?
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center border-t border-[#E7ECF3] p-2">
          <Image className="shrink-0" src="/Container.png" alt="" width={56} height={56} />
          <div className="min-w-0">
            <h1 className="text-black font-semibold text-[18px] truncate">
              Alex Rivera
            </h1>
            <span className="text-[#136DEC] text-[12px] font-medium">
              UI Design Path
            </span>
            <p className="text-[#4C6C9A] text-[14px] truncate">
              Can we reschedule the session?
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center border-t border-[#E7ECF3] p-2">
          <Image className="shrink-0" src="/Container.png" alt="" width={56} height={56} />
          <div className="min-w-0">
            <h1 className="text-black font-semibold text-[18px] truncate">
              Alex Rivera
            </h1>
            <span className="text-[#136DEC] text-[12px] font-medium">
              UI Design Path
            </span>
            <p className="text-[#4C6C9A] text-[14px] truncate">
              Can we reschedule the session?
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center border-t border-[#E7ECF3] p-2">
          <Image className="shrink-0" src="/Container.png" alt="" width={56} height={56} />
          <div className="min-w-0">
            <h1 className="text-black font-semibold text-[18px] truncate">
              Alex Rivera
            </h1>
            <span className="text-[#136DEC] text-[12px] font-medium">
              UI Design Path
            </span>
            <p className="text-[#4C6C9A] text-[14px] truncate">
              Can we reschedule the session?
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center border-t border-[#E7ECF3] p-2">
          <Image className="shrink-0" src="/Container.png" alt="" width={56} height={56} />
          <div className="min-w-0">
            <h1 className="text-black font-semibold text-[18px] truncate">
              Alex Rivera
            </h1>
            <span className="text-[#136DEC] text-[12px] font-medium">
              UI Design Path
            </span>
            <p className="text-[#4C6C9A] text-[14px] truncate">
              Can we reschedule the session?
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-center border-t border-[#E7ECF3] p-2">
          <Image className="shrink-0" src="/Container.png" alt="" width={56} height={56} />
          <div className="min-w-0">
            <h1 className="text-black font-semibold text-[18px] truncate">
              Alex Rivera
            </h1>
            <span className="text-[#136DEC] text-[12px] font-medium">
              UI Design Path
            </span>
            <p className="text-[#4C6C9A] text-[14px] truncate">
              Can we reschedule the session?
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-center border-t border-[#E7ECF3] p-2">
          <Image className="shrink-0" src="/Container.png" alt="" width={56} height={56} />
          <div className="min-w-0">
            <h1 className="text-black font-semibold text-[18px] truncate">
              Alex Rivera
            </h1>
            <span className="text-[#136DEC] text-[12px] font-medium">
              UI Design Path
            </span>
            <p className="text-[#4C6C9A] text-[14px] truncate">
              Can we reschedule the session?
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
