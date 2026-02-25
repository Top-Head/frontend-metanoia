import Image from "next/image";
import BrandLogo from "./brand-logo";


function LeftSection () {
    return (
        <>
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSJgGTInIgDd1y5TgXZLJo0-20Sk_6TPNdjP388AUGjTmIKbdJ53bLy-pHYosuQRECZdROGPsF3NWFZ0eNu7ecpTXmzYVpSFhNFF3Db9GeZx0lvtXP4Wphe_tKp91GMqD-1a0n1MDheItuLEnRMiI0-I-ff9lM4Jq564A2M1i5_232CgEIY1-n3CZj9x81foqajwrZOvK6XWxniquTPloHJYk5AP5cvtsGxWcMxz_ULxaj-jZI-hqLJsjxhSD-n6bKQKFkSkNO6-M"
                alt="Mentor and student discussing ideas"
                fill
                priority
                className="object-cover opacity-80"
                />

                <div className="absolute inset-0 bg-linear-to-t from-primary/60 to-transparent" />

                <div className="relative z-10 flex flex-col justify-end p-10 xl:p-14 text-white">
                <BrandLogo size="large" />
                <h1 className="text-3xl xl:text-4xl font-extrabold leading-tight mb-3 tracking-tight">
                    Ignite your potential with expert mentorship.
                </h1>
                <p className="text-base xl:text-lg font-light text-slate-100 max-w-md">
                    Join a community of lifelong learners and industry leaders dedicated
                    to growth and professional excellence.
                </p>
                </div>
            </div>
        </>
    )
}

export default LeftSection