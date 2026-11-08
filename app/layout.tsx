import type { Metadata } from "next";
import "./globals.css";
import "../components/game-data.css";

export const metadata: Metadata = {
  title: "Flow Club | Play your way to freedom",
  description: "เกมเรียนรู้ Cash Flow กับเพื่อน 2–6 คน พร้อมคำอธิบายการคำนวณ ไทย / English",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">{children}</body>
    </html>
  );
}
