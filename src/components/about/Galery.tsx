import Image from "next/image";

const IMAGENS = [
  "/Rectangle 7.png",
  "/Rectangle 9.png",
  "/Rectangle 9.png",
  "/Rectangle 10.png",
];

export default function Galery(){
    return (
      <section className="flex flex-col gap-3 overflow-hidden py-20 md:gap-4">
        <Fila animacao="animate-marquee" />
        <Fila animacao="animate-marquee-reverse" />
      </section>
    );
}

function Fila({ animacao }: { animacao: string }){
    return (
      <div className={`flex h-48 w-max ${animacao} md:h-[338px]`}>
        {[...IMAGENS, ...IMAGENS].map((src, i) => (
          <Image
            key={i}
            src={src}
            alt=""
            width={338}
            height={338}
            className="mr-3 h-full w-auto object-cover md:mr-4"
          />
        ))}
      </div>
    );
}