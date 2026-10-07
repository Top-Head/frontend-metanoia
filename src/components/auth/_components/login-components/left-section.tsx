import Image from "next/image";
import logoMetanoia from "@/assets/logo.png";

export default function LeftSection() {
  return (
    <div className="relative hidden overflow-hidden bg-slate-900 lg:flex lg:w-1/2">
      <Image
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSJgGTInIgDd1y5TgXZLJo0-20Sk_6TPNdjP388AUGjTmIKbdJ53bLy-pHYosuQRECZdROGPsF3NWFZ0eNu7ecpTXmzYVpSFhNFF3Db9GeZx0lvtXP4Wphe_tKp91GMqD-1a0n1MDheItuLEnRMiI0-I-ff9lM4Jq564A2M1i5_232CgEIY1-n3CZj9x81foqajwrZOvK6XWxniquTPloHJYk5AP5cvtsGxWcMxz_ULxaj-jZI-hqLJsjxhSD-n6bKQKFkSkNO6-M"
        alt="Mentor e estudante discutindo ideias"
        fill
        priority
        sizes="50vw"
        className="object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />

      <div className="relative z-10 flex flex-col justify-end p-10 text-white xl:p-14">
        <Image
          src={logoMetanoia}
          alt="logo"
          width={100}
          height={100}
        />
        <h1 className="mb-3 mt-6 max-w-md text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
          Desperte seu potencial com mentoria de especialistas.
        </h1>
        <p className="max-w-md text-base font-light text-slate-100 xl:text-lg">
          Entre em uma comunidade de aprendizes e líderes da indústria
          dedicados ao crescimento e à excelência profissional.
        </p>
      </div>
    </div>
  );
}