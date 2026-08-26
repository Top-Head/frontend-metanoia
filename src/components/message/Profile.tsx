import { Ban, Eye, Calendar } from "lucide-react";

export default function Profile (){
    return (
      <section className="w-[487px] shrink-0 flex flex-col border-l border-[#E7ECF3] bg-white overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center">
            <img src="/Margin.png" alt="" className="w-20 h-20 rounded-full" />
            <h1 className="font-semibold text-lg mt-2">Alex Rivera</h1>
            <p className="text-[#4C6C9A] text-[14px]">Student since Sep 2023</p>
          </div>

          <div className="px-2">
            <h1 className="text-[10px] font-bold text-[#4C6C9A] uppercase">
              Active Course
            </h1>
            <div className="bg-[#136DEC0D] rounded-xl p-4 border border-[#136DEC33] mt-2">
              <h1 className="text-[#136DEC] text-[14px] font-semibold">
                UI Design Path
              </h1>
              <p className="text-[#4C6C9A] text-[11px]">
                Next Session: Wed, 10:00 AM
              </p>
            </div>
          </div>

          <div className="px-2">
            <h1 className="text-[#4C6C9A] font-bold text-[10px] uppercase">
              Quick Actions
            </h1>
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#4C6C9A]" />
                <p className="text-sm">Schedule Session</p>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#4C6C9A]" />
                <p className="text-sm">View Progress</p>
              </div>
              <div className="flex items-center gap-2">
                <Ban className="w-4 h-4 text-red-500" />
                <p className="text-sm text-red-500">Mute Notifications</p>
              </div>
            </div>
          </div>

          <div className="px-2">
            <h1 className="text-[#4C6C9A] font-bold text-[10px] uppercase">
              Shared Files (3)
            </h1>
            <div className="flex gap-3 mt-3">
              <div className="bg-[#F1F5F9] w-[84px] h-[68px] rounded-[8px]"></div>
              <div className="bg-[#F1F5F9] w-[84px] h-[68px] rounded-[8px]"></div>
              <div className="bg-[#F1F5F9] w-[84px] h-[54px] rounded-[8px]"></div>
            </div>
          </div>
        </div>
      </section>
    );
}