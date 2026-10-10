import Image from "next/image";
import clsx from "clsx";

interface GalleryImage {
  src: string;
  alt: string;
  wide?: boolean;
}

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

/*
 * Cada faixa tem fotos próprias (nenhuma se repete entre as duas) e um
 * conjunto mais largo que a tela, para que a mesma foto nunca apareça
 * duas vezes ao mesmo tempo.
 */
const TOP_ROW: GalleryImage[] = [
  { src: unsplash("1522202176988-66273c2fd55f"), alt: "Estudantes conversando em volta de notebooks", wide: true },
  { src: unsplash("1552664730-d307ca884978"), alt: "Mentora conduzindo uma sessão no quadro" },
  { src: unsplash("1524178232363-1fb2b075b655"), alt: "Workshop com apresentação para a turma", wide: true },
  { src: unsplash("1531482615713-2afd69097998"), alt: "Dupla programando lado a lado" },
  { src: unsplash("1544531586-fde5298cdd40"), alt: "Palestrante diante de um auditório lotado", wide: true },
  { src: unsplash("1556484687-30636164638b"), alt: "Mãos unidas sobre a mesa, símbolo da comunidade" },
];

const BOTTOM_ROW: GalleryImage[] = [
  { src: unsplash("1543269865-cbf427effbad"), alt: "Grupo de estudo trocando ideias" },
  { src: unsplash("1556761175-5973dc0f32e7"), alt: "Encontro presencial da comunidade", wide: true },
  { src: unsplash("1600880292203-757bb62b4baf"), alt: "Mentor e mentorada celebrando uma conquista" },
  { src: unsplash("1515187029135-18ee286d815b"), alt: "Roda de conversa em evento de networking", wide: true },
  { src: unsplash("1529070538774-1843cb3265df"), alt: "Participantes fazendo anotações durante uma palestra" },
  { src: unsplash("1556761175-b413da4baf72"), alt: "Equipe reunida em volta da mesa de trabalho", wide: true },
];

/* Cópias necessárias para o loop: a animação desloca exatamente uma cópia. */
const COPIES = 3;

export default function Gallery() {
  return (
    <section aria-labelledby="gallery-title" className="py-20 md:py-28">
      <div className="mx-auto mb-12 flex max-w-5xl flex-col gap-4 px-6 md:flex-row md:items-end md:justify-between lg:px-10">
        <div className="max-w-xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Comunidade
          </p>
          <h2 id="gallery-title" className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Momentos que contam a nossa história
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
          Workshops, encontros presenciais e sessões em grupo. A mentoria
          também acontece fora da tela.
        </p>
      </div>

      <div className="flex flex-col gap-4 mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <Row images={TOP_ROW} animation="animate-marquee" />
        <Row images={BOTTOM_ROW} animation="animate-marquee-reverse" />
      </div>
    </section>
  );
}

function Row({ images, animation }: { images: GalleryImage[]; animation: string }) {
  const track = Array.from({ length: COPIES }, () => images).flat();

  return (
    <div className="overflow-hidden">
      <ul
        className={clsx(
          "flex w-max hover:[animation-play-state:paused] motion-reduce:animate-none",
          animation
        )}
      >
        {track.map(({ src, alt, wide }, index) => {
          const isDuplicate = index >= images.length;

          return (
            <li
              key={`${src}-${index}`}
              aria-hidden={isDuplicate || undefined}
              className="shrink-0 pr-4"
            >
              <figure
                className={clsx(
                  "group relative h-52 overflow-hidden rounded-2xl bg-line md:h-80",
                  wide ? "aspect-4/3" : "aspect-3/4"
                )}
              >
                <Image
                  src={src}
                  alt={isDuplicate ? "" : alt}
                  fill
                  sizes="(min-width: 768px) 427px, 280px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-linear-to-t from-ink/80 to-transparent p-4 pt-10 text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {alt}
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
