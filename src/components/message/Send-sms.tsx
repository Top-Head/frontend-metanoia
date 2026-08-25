import { SendHorizontal } from "lucide-react";


export default function Send(){
    return (
      <section className="bg-[#FFFFFF] w-[682px] h-[109px] border-t-[#E7ECF3] p-[24px] pl-[60px]">
        <div className="flex gap-4 items-center justify-center">
          <input
            type="text"
            placeholder="Type your message to Alex..."
            className="w-[540px] h-[54px] rounded-[12px] bg-gray-100 p-4 text-zinc-400 focus:outline-none focus:right-0"
          />


          <button  className="bg-[#136DEC] rounded-[8px] w-12 h-10 pl-2.5 text-white">
            <SendHorizontal/>
          </button>
        </div>
      </section>
    );
}