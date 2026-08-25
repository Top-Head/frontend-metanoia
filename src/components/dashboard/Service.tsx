

export default function Service() {
    return (
      <section className="py-20">
        <div>
          <h1 className="font-bold text-[#0F172A] text-[20px]">
            Service Board
          </h1>
          <div className="flex gap-[32px] py-[24px]">
            <a className="text-[#136DEC] text-[14px] " href="#">
              Active Workflow
            </a>
            <a className="text-[14px] text-[#64748B] " href="#">
              Completed Services
            </a>
            <a className="text-[14px] text-[#64748B] " href="#">
              Canceled
            </a>
          </div>

          <div className="flex gap-4 grid-rows-2">
            <div>
              <h1 className="">Pending</h1>
              <div className=" w-[197.33px] h-[159px] rounded-[12px] bg-white border border-[#E2E8F0] shadow mt-4 p-4">
                <div className="flex">
                  <img className="w-14 h-16" src="/Margin.png" alt="" />
                  <h1 className="w-10 h-4">Jonh Doe</h1>
                  <p>Designer UI</p>
                </div>
                <p className="text-[12px]">
                  Lorem ipsum dolor sit amet consectetur
                </p>
                <div className="flex gap-3">
                  <button className="bg-blue">gj</button>
                  <button className="bg-gray-300">gh</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
}