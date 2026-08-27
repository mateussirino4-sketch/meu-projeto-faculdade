import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { AppHeader, DemoBanner } from "@/components/layout";
import { RouteFooter } from "@/components/route-footer";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Portal Acordo Acadêmico",
    template: "%s | Portal Acordo Acadêmico",
  },
  description:
    "Aplicação acadêmica local com dados e transações exclusivamente fictícios.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={openSans.variable}>
      <body className="font-[var(--font-open-sans)] antialiased">
        <DemoBanner />
        <AppHeader />
        {children}
        <RouteFooter />
      </body>
    </html>
  );
}
