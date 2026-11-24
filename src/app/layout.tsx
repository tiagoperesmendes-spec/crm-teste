import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MODO • Agência de Comunicação & CRM de RP",
  description: "Plataforma executiva de assessoria de imprensa, gestão de pautas, cobertura mediática e análise de reputação da MODO.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="antialiased min-h-screen bg-[#EDE6DE] text-[#1A1A1A] font-sans selection:bg-[#E6C5CA] selection:text-[#6C1C37]">
        {children}
      </body>
    </html>
  );
}
