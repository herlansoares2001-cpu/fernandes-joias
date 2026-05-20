import { Suspense } from "react";
import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "../components/CustomCursor";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export const metadata: Metadata = {
  title: "Fernandes Joias | Editorial Dark Luxury",
  description: "Acervo de alta joalharia com estética de luxo clássico, lapidações puras e atendimento sob medida.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#070707] text-[#EDE6D6] font-sans antialiased selection:bg-[#C9A84C] selection:text-[#070707] min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Global Film Grain Noise Overlay */}
        <div className="noise-overlay" />
        
        {/* Custom Follow-Along Cursor */}
        <CustomCursor />
        
        <Suspense fallback={<div className="h-28 bg-transparent" />}>
          <Header />
        </Suspense>
        
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
