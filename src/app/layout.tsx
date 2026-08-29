import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foundry — Multi-agent counsel for SMEs",
  description:
    "A Next.js 15 multi-agent workspace that routes a founder ask through strategy, finance, market, growth, and ops specialists.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
