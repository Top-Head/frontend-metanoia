import { Search } from "lucide-react";
export default function Sidebar() {
  return (
    <aside className="w-[380px] h-[959px] border-x bg-white border-[#E7ECF3] px-4 py-4">
      <h1 className="text-[20px] font-bold text-[#0D131B] w-[347px] h-[28px]  ">
        Messages
      </h1>
      <p className="text-[14px] w-[347px] text-[#4C6C9A] space-y-4">
        Commmunication Hub
      </p>
      <div className="hidden md:flex relative w-[347px] h-11 mt-4">
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
      <div className="bg-[#F0F3F8] w-[346px] rounded-xl h-[44px] mt-4 flex gap-4 px-2 text-[#4C6C9A]">
        <button className="bg-white rounded-[6px] w-[113px] h-[28px] mt-1.5 mb-1.5 shadow ">
          All
        </button>
        <button>Mentors</button>
        <button>Students</button>
      </div>

      <div className="mt-4  space-x-2.5">
        <div className="flex gap-4 w-[346px] h-[88px] bg-[#136DEC0D] border-l-4 border-[#136DEC] items-center rounded-r-xl">
          <img className="w-14 h-14" src="/Container.png" alt="" />
          <div className="">
            <h1 className="text-black font-semibold text-[18px]">
              Alex Rivera
            </h1>
            <span className="text-[#136DEC] text-[12px] font-medium">
              UI Design Path
            </span>
            <p className="text-[#4C6C9A] text-[14px] ">
              Can we reschedule the session?
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-2 w-[346px] h-[88px]  items-center  border-t border-[#E7ECF3]">
          <img className="w-14 h-14" src="/Container.png" alt="" />
          <div className="">
            <h1 className="text-black font-semibold text-[18px]">
              Alex Rivera
            </h1>
            <span className="text-[#136DEC] text-[12px] font-medium">
              UI Design Path
            </span>
            <p className="text-[#4C6C9A] text-[14px] ">
              Can we reschedule the session?
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-2 w-[346px] h-[88px]  items-center  border-t border-[#E7ECF3]">
          <img className="w-14 h-14" src="/Container.png" alt="" />
          <div className="">
            <h1 className="text-black font-semibold text-[18px]">
              Alex Rivera
            </h1>
            <span className="text-[#136DEC] text-[12px] font-medium">
              UI Design Path
            </span>
            <p className="text-[#4C6C9A] text-[14px] ">
              Can we reschedule the session?
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-2 w-[346px] h-[88px] items-center  border-t border-[#E7ECF3]">
          <img className="w-14 h-14" src="/Container.png" alt="" />
          <div className="">
            <h1 className="text-black font-semibold text-[18px]">
              Alex Rivera
            </h1>
            <span className="text-[#136DEC] text-[12px] font-medium">
              UI Design Path
            </span>
            <p className="text-[#4C6C9A] text-[14px] ">
              Can we reschedule the session?
            </p>
          </div>
        </div>

        <div className="flex gap-4 mt-2 w-[346px] h-[88px] border-t border-[#E7ECF3] items-center ">
          <img className="w-14 h-14" src="/Container.png" alt="" />
          <div className="">
            <h1 className="text-black font-semibold text-[18px]">
              Alex Rivera
            </h1>
            <span className="text-[#136DEC] text-[12px] font-medium">
              UI Design Path
            </span>
            <p className="text-[#4C6C9A] text-[14px] ">
              Can we reschedule the session?
            </p>
          </div>
        </div>

      </div>
    </aside>
  );
}
