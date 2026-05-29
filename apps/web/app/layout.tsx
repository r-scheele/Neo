import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neo Web Dashboard",
  description: "Future desktop operations workspace for Neo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
