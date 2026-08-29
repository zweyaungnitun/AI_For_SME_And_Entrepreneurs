import type { Metadata } from "next";
import { BriefProvider } from "@/components/brief/brief-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SME Copilot — Financial decisions, operations, this week",
  description:
    "A practical AI partner for Myanmar SMEs and entrepreneurs: financial decisions, everyday management, and growth this week. Helps organize numbers for a discussion.",
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
