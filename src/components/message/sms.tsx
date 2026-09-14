import Image from "next/image";


export default function SMS (){
    return (
      <section className="py-10 px-5 space-y-4">
        <div className="flex gap-3">
          <div className="pt-1 shrink-0">
            <Image className="w-10 h-12" src="/Margin.png" alt="" width={40} height={48} />
          </div>
          <div className="bg-[#F0F3F8] max-w-[407px] rounded-b-[12px] rounded-r-[12px] rounded-b-l-[12px] p-4 text-[14px]">
            <p>
              Hi Mentor! Ive been working on the accessibility module you
              suggested last week. The color contrast ratios are much better
              now.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-[#3277ee] max-w-[407px] rounded-b-[12px] rounded-l-[12px] p-4 text-[14px]">
            <p className="text-white">
              Hi Mentor! Ive been working on the accessibility module you
              suggested last week. The color contrast ratios are much better
              now.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="pt-1 shrink-0">
            <Image className="w-10 h-12" src="/Margin.png" alt="" width={40} height={48} />
          </div>
          <div className="bg-[#F0F3F8] max-w-[407px] rounded-b-[12px] rounded-r-[12px] rounded-b-l-[12px] p-4 text-[14px]">
            <p>
              Hi Mentor! Ive been working on the accessibility module you
              suggested last week. The color contrast ratios are much better
              now.
            </p>
            <div className="bg-white w-full h-[52px] rounded-[8px] p-[12px] border border-[#E2E8F0] mt-3"></div>
          </div>
        </div>
        
      </section>
    );
}