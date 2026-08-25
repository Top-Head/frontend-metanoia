import { EllipsisVertical } from "lucide-react";
import SMS from "./sms";
import Send from "./Send-sms";

export default function Message() {
  return (
    <section className="w-[799px] h-[959px] bg-white ">
      <div className="flex bg-[#f1f1f104] w-[729px] h-[81px] pt-[16px] pr-5 pb-[16px] pl-5 border border-[#E7ECF3]">
        <div className="flex gap-4 items-center">
          <img src="/Container.png" alt="" />
          <h1 className="font-bold">Alex Rivera</h1>
          <span className="bg-[#136DEC1A] rounded-xl h-[19px] w-[68.84px] text-center items-center justify-center text-[#136DEC] font-bold text-[10px]">
            student
          </span>
          <div className="flex gap-3 ml-52">
            <button className="bg-[#E7ECF3] rounded-xl h-10 w-38 px-4">
              Service Details
            </button>

            <button className="bg-[#E7ECF3] rounded-xl h-10 w-10 text-center flex items-center justify-center">
              <EllipsisVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div></div>
      <SMS/>
      <div>
        <Send/>
      </div>
    </section>
  );
}