import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Supabase Tasks",
  description: "Next.js + Supabase + GitHub Actions + Vercel"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}