import type { Metadata } from "next";
import { BriefProvider } from "@/components/brief/brief-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SME Copilot — What to do next",
  description:
    "Tell Myanmar SME owners what matters, why it matters, and what they should do today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <BriefProvider>{children}</BriefProvider>
      </body>
    </html>
  );
}
