import { Footer } from "./_components/Footer";
import { FormFields } from "./_components/FormFields";
import { Header } from "./_components/Header";
import { LeftBanner } from "./_components/LeftBanner";
import { MobileLogo } from "./_components/MobileLogo";
import { SocialButtons } from "./_components/SocialButtons";

export default function LoginForm() {
  return (
    <main className="bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex min-h-screen w-full">
        <LeftBanner />

        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 bg-background-light dark:bg-background-dark">
          <div className="w-full max-w-[480px]">
            <MobileLogo />
            <Header />
            <form className="space-y-6">
              <FormFields />
              <button
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                type="submit"
              >
                <span>Ir para a Dashbaord</span>
              </button>
            </form>
            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-background-dark dark:border-background-light" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background-light dark:bg-background-dark px-4 text-background-dark dark:text-background-light font-medium uppercase tracking-wider">
                  Ou continue com
                </span>
              </div>
            </div>
            <SocialButtons />
            <Footer />
          </div>
        </div>
      </div>
    </main>
  )
}