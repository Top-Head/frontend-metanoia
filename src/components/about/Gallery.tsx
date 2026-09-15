import Image from "next/image";

const IMAGES = [
  { src: "/Rectangle 1.png", alt: "Encontro de mentores e alunos" },
  { src: "/Rectangle 7.png", alt: "Workshop sobre o palco" },
  { src: "/Rectangle 9.png", alt: "Sessão de mentoria em grupo" },
  { src: "/Rectangle 10.png", alt: "Momento de networking" },
];

export default function Gallery() {
  return (
    <section className="flex flex-col gap-3 overflow-hidden py-20 md:gap-4">
      <Row animation="animate-marquee" />
      <Row animation="animate-marquee-reverse" />
    </section>
  );
}

function Row({ animation }: { animation: string }) {
  return (
    <div className={`flex h-48 w-max md:h-[338px] ${animation}`}>
      {[...IMAGES, ...IMAGES].map(({ src, alt }, index) => (
        <Image
          key={`${src}-${index}`}
          src={src}
          alt={alt}
          width={338}
          height={338}
          className="mr-3 h-full w-auto object-cover md:mr-4"
        />
      ))}
    </div>
  );
}