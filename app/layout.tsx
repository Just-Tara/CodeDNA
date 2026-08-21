import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/TopNav";

export const metadata: Metadata = {
  title: "CodeDNA — Explore what makes software projects connected",
  description:
    "Discover the technologies, concepts, features, and people behind the code.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <TopNav />
        {children}
      </body>
    </html>
  );
}
