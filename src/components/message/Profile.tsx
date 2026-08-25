import { Ban, Eye, Calendar } from "lucide-react";

export default function Profile (){
    return (
      <section className="border-l border-gray-100 w-[487px] h-[583.44px] pt-4 ">
        <div>
          <div className="items-center justify-center flex ">
            <img src="/Margin.png" alt="" />
          </div>
          <div className="text-center">
            <h1>Alex Rivera</h1>
            <p className="text-[#4C6C9A] text-[14px]">Student since Sep 2023</p>
          </div>
          <div className="justify-center items-center p-[24px] m-4">
            <h1 className="text-[10px] font-bold text-[#4C6C9A] uppercase">
              Active Course
            </h1>
            <div className="bg-[#136DEC0D] w-[279px] h-[63px]  rounded-xl p-[12px] border-[#136DEC33] mt-1  ">
              <h1 className="text-[#136DEC] text-[14px] font-semibold pl-4">
                UI Design Path
              </h1>
              <p className="text-[#4C6C9A] text-[11px] pl-4">
                Next Session: Wed, 10:00 AM
              </p>
            </div>
          </div>

          <div className="p-6 m-4">
            <h1 className="text-[#4C6C9A] font-bold text-[10px] uppercase">
              Quick Actions
            </h1>
            <div className="mt-4 gap-2">
              <div className="flex items-center gap-2 mt-2">
                <Calendar />
                <p className="">Schedule Session</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Eye />
                <p className="">View Progress</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Ban className="text-red-500" />
                <p className="text-red-500 ">Mute Notifications</p>
              </div>
            </div>
          </div>

          <div className="p-6 m-4 ">
            <h1 className="text-[#4C6C9A] font-bold text-[10px] uppercase">
              Shared Files (3)
            </h1>
            <div className="flex gap-3 mt-4">
              <div className="bg-[#F1F5F9] pt-[25.16] pb-[25.17] w-[84.33px] h-[68.33px] rounded-[8px]"></div>
              <div className="bg-[#F1F5F9] pt-[25.16] pb-[25.17] w-[84.33px] h-[68.33px] rounded-[8px]"></div>
              <div className="bg-[#F1F5F9] pt-[25.16] pb-[25.17] w-[84.34px] h-[54.34px] rounded-[8px] "></div>
            </div>
          </div>
        </div>
      </section>
    );
}