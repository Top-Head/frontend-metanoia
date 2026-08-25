

export default function Hero(){
    return (
      <section className="relative">
        <img
          src="/Rectangle 1.png"
          alt=""
          className="w-full h-[663px] object-cover"
        />
        <div className="absolute inset-0 flex flex-col px-10 justify-center  px-6">
          <h1 className="font-bold text-[40px] text-white">Resiliencia</h1>
          <p className="text-[20px] text-white max-w-2xl w-[497px] h-[80px]">
            A resiliência é a capacidade de enfrentar crises, superar
            adversidades e adaptar-se a mudanças difíceis, recuperando o
            equilíbrio emocional sem se render ao conformismo.
          </p>
        </div>
      </section>
    );
}