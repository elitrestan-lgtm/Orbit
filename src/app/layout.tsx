import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Orbit — professional network tracker",
  description:
    "Track mentors, peers, collaborators, advisors, and friends. Stay warm with nudges.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen bg-orbit-bg font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
