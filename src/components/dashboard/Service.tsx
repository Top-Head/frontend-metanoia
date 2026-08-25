

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

          <div className="flex grid grid-cols-3">
            <div>
              <h1 className="">Pending</h1>
              <div className="  h-[203.5px] w-64 min-w-50 rounded-[12px] bg-white border border-[#E2E8F0] shadow mt-4 p-4">
                <div className="flex">
                  <img className="w-14 h-16" src="/Margin.png" alt="" />
                  <h1 className="w-10 h-4">Jonh Doe</h1>
                  <p>Designer UI</p>
                </div>
                <p className="text-[12px] text-gray-400">
                  Lorem ipsum dolor sit amet consectetur
                </p>
                <div className="flex gap-4 mt-4">
                  <button className="bg-[#136DEC] text-white w-[77.67px] h-[30px]  shadow text-center">
                    Accept
                  </button>
                  <button className="bg-gray-300 w-[77.67px] h-[30px]">
                    View
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h1 className="">Pending</h1>
              <div className="  h-[203.5px] w-64 min-w-50 rounded-[12px] bg-white border border-[#E2E8F0] shadow mt-4 p-4">
                <div className="flex">
                  <img className="w-14 h-16" src="/Margin.png" alt="" />
                  <h1 className="w-10 h-4">Jonh Doe</h1>
                  <p>Designer UI</p>
                </div>
                <p className="text-[12px] text-gray-400">
                  Lorem ipsum dolor sit amet consectetur
                </p>
                <div className="flex gap-4 mt-4">
                  <button className="bg-[#136DEC] text-white w-[77.67px] h-[30px]  shadow text-center">
                    aceitar
                  </button>
                  <button className="bg-gray-300 w-[77.67px] h-[30px]">
                    View
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h1 className="">Pending</h1>
              <div className="  h-[203.5px] w-64 min-w-50 rounded-[12px] bg-white border border-[#E2E8F0] shadow mt-4 p-4">
                <div className="flex">
                  <img className="w-14 h-16" src="/Margin.png" alt="" />
                  <h1 className="w-10 h-4">Jonh Doe</h1>
                  <p>Designer UI</p>
                </div>
                <p className="text-[12px] text-gray-400">
                  Lorem ipsum dolor sit amet consectetur
                </p>
                <div className="flex gap-4 mt-4">
                  <button className="bg-[#136DEC] text-white w-[77.67px] h-[30px]  shadow text-center">
                    Accept
                  </button>
                  <button className="bg-gray-300 w-[77.67px] h-[30px]">
                    View
                  </button>
                </div>
              </div>
            </div>

            <div>
            
              <div className="  h-[203.5px] w-64 min-w-50 rounded-[12px] bg-white border border-[#E2E8F0] shadow mt-4 p-4">
                <div className="flex">
                  <img className="w-14 h-16" src="/Margin.png" alt="" />
                  <h1 className="w-10 h-4">Jonh Doe</h1>
                  <p>Designer UI</p>
                </div>
                <p className="text-[12px] text-gray-400">
                  Lorem ipsum dolor sit amet consectetur
                </p>
                <div className="flex gap-4 mt-4">
                  <button className="bg-[#136DEC] text-white w-[77.67px] h-[30px] shadow text-center">
                    Accept
                  </button>
                  <button className="bg-gray-300 w-[77.67px] h-[30px]">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}