import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Neo | WhatsApp commerce operating system",
  description:
    "Neo helps African small businesses manage WhatsApp customers, orders, payments, and follow-ups in one calm workspace.",
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
