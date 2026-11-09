<<<<<<< HEAD
import type { Metadata } from "next";
import "./globals.css";
import "../components/game-data.css";

export const metadata: Metadata = {
  title: "Flow Club | Play your way to freedom",
  description: "เกมเรียนรู้ Cash Flow กับเพื่อน 2–6 คน พร้อมคำอธิบายการคำนวณ ไทย / English",
  icons: {
    icon: [{url:"/flow-club-icon-32-v1.png",sizes:"32x32",type:"image/png"},{url:"/flow-club-icon-192-v1.png",sizes:"192x192",type:"image/png"}],
    shortcut: "/flow-club-icon-32-v1.png",
    apple: "/flow-club-icon-180-v1.png",
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
=======
import type { Metadata } from "next";
import "./globals.css";
import "../components/game-data.css";

export const metadata: Metadata = {
  title: "Flow Club | Play your way to freedom",
  description: "เกมเรียนรู้ Cash Flow กับเพื่อน 2–6 คน พร้อมคำอธิบายการคำนวณ ไทย / English",
  icons: {
    icon: [{url:"/flow-club-icon-32-v1.png",sizes:"32x32",type:"image/png"},{url:"/flow-club-icon-192-v1.png",sizes:"192x192",type:"image/png"}],
    shortcut: "/flow-club-icon-32-v1.png",
    apple: "/flow-club-icon-180-v1.png",
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
>>>>>>> 2a87eb6efabba48a79f591bded19c85af80edbf4
