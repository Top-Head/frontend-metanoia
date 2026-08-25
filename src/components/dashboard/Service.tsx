

export default function Service() {
    return (
      <section className="py-20">
        <div>
          <h1 className="font-bold text-[#0F172A] text-[20px]">
            Service Board
          </h1>
          <div className="flex gap-[32px] py-[24px]">
            <a
              className="text-[#136DEC] text-[14px] border-b-4 border-[#136DEC] pb-[12px] "
              href="#"
            >
              Active Workflow
            </a>
            <a className="text-[14px] text-[#64748B] " href="#">
              Completed Services
            </a>
            <a className="text-[14px] text-[#64748B] " href="#">
              Canceled
            </a>
          </div>

          <div className="grid grid-cols-3 gap-1 mt-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                <h1 className="text-[14px] font-semibold text-[#0F172A]">
                  Pending
                </h1>
              </div>
              <div className="h-[169px] w-64 min-w-50 rounded-[12px] bg-white border border-[#E2E8F0] shadow mt-4 p-4">
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full"
                    src="/Image.png"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <h1 className="text-[14px] font-medium text-[#0F172A]">
                      Jonh Doe
                    </h1>
                    <p className="text-[12px] text-[#64748B]">Designer UI</p>
                  </div>
                </div>
                <p className="text-[12px] text-gray-400 mt-2 h-6 ">
                  Lorem ipsum dolor sit amet consectetur
                </p>
                <div className="flex gap-4 mt-4">
                  <button className="bg-[#136DEC] text-white w-[97.67px] font-bold h-[40px] rounded-[4px] shadow text-center">
                    Accept
                  </button>
                  <button className="bg-gray-300 w-[97.67px] h-[40px] font-bold rounded-[4px]">
                    View
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                <h1 className="text-[14px] font-semibold text-[#0F172A]">
                  Accepted
                </h1>
              </div>
              <div className="h-[169px] w-64 min-w-50 rounded-[12px] bg-white border border-[#E2E8F0] shadow mt-4 p-4">
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full"
                    src="/Image.png"
                    alt=""
                  />
                  <div className="flex flex-col">
                    <h1 className="text-[14px] font-medium text-[#0F172A]">
                      Jonh Doe
                    </h1>
                    <p className="text-[12px] text-[#64748B]">Designer UI</p>
                  </div>
                </div>
                <p className="text-[12px] text-gray-400 mt-2 h-6 ">
                  Lorem ipsum dolor sit amet consectetur
                </p>
                <div className="flex gap-4 mt-4">
                  <button className="border  border-[#136DEC] text-[#136DEC] font-bold w-[263.33] h-[42px] rounded-[4px] shadow text-center">
                    Message Student
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400"></span>
                <h1 className="text-[14px] font-semibold text-[#0F172A]">
                  In Progress
                </h1>
              </div>
              <div className="h-[169px] w-64 min-w-50 rounded-[12px] bg-white border border-[#E2E8F0] shadow mt-4 p-4">
                <div className="flex gap-3 ">
                  <img className="w-10 h-10" src="/Image.png" alt="" />
                  <div className="flex flex-col">
                    <h1 className="text-[14px] font-medium text-[#0F172A]">
                      Jonh Doe
                    </h1>
                    <p className="text-[12px] text-[#64748B]">Designer UI</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#D1FAE5]">
                    <span className="block h-full w-[75%] rounded-full bg-[#10B981]"></span>
                  </div>
                  <div className="mb-2 flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <button className="border bg-[#10B981] text-[#FFFFFF] font-bold w-[263.33] h-10.5 rounded-sm shadow text-center">
                    Classroom
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}