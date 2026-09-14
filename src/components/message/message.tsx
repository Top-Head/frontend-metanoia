import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import SMS from "./sms";
import Send from "./Send-sms";

export default function Message() {
  return (
    <section className="flex-1 min-w-0 flex flex-col border-x border-[#E7ECF3] bg-white">
      <div className="flex bg-[#f1f1f104] h-[81px] shrink-0 pt-[16px] pr-5 pb-[16px] pl-5 border-b border-[#E7ECF3]">
        <div className="flex gap-4 items-center">
          <Image src="/Container.png" alt="" width={40} height={40} />
          <h1 className="font-bold">Alex Rivera</h1>
          <span className="bg-[#136DEC1A] rounded-xl h-[19px] w-[68.84px] text-center items-center justify-center text-[#136DEC] font-bold text-[10px]">
            student
          </span>
          <div className="flex gap-3 ml-auto">
            <button className="bg-[#E7ECF3] rounded-xl h-10 w-38 px-4">
              Service Details
            </button>

            <button className="bg-[#E7ECF3] rounded-xl h-10 w-10 text-center flex items-center justify-center">
              <EllipsisVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <SMS/>
      </div>
      <Send/>
    </section>
  );
}