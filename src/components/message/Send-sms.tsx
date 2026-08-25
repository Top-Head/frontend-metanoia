import { SendHorizontal } from "lucide-react";


export default function Send(){
    return (
      <section className="bg-white shrink-0 border-t border-[#E7ECF3] p-5 px-14">
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Type your message to Alex..."
            className="flex-1 h-[54px] rounded-[12px] bg-gray-100 p-4 text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#136dec]/20"
          />
          <button className="bg-[#136DEC] rounded-[8px] w-12 h-10 flex items-center justify-center text-white shrink-0">
            <SendHorizontal className="w-5 h-5"/>
          </button>
        </div>
      </section>
    );
}