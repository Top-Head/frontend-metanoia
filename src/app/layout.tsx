import type { Metadata, Viewport } from "next";
import { Lexend, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-display",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Academia Metanoia — Mentoria com Especialistas",
    template: "%s | Academia Metanoia",
  },
  description:
    "Plataforma global de mentoria profissional. Conecte-se com especialistas em tecnologia, artes, psicologia e negócios.",
  applicationName: "Academia Metanoia",
  keywords: [
    "mentoria",
    "mentores",
    "aprendizado",
    "carreira",
    "tecnologia",
    "design",
  ],
  category: "education",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#136dec",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${lexend.variable} ${jakarta.variable} font-sans antialiased`}
      >
        {children}
        <Toaster
          position="top-center"
          toastOptions={{ duration: 4000 }}
        />
      </body>
    </html>
  );
}