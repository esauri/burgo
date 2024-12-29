import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { type ReactNode } from "react";
import "./globals.css";

const geistSans = Geist({
  display: "swap",
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Burgo",
  description: "Custom built hamburgers",
};

type Props = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: Props) {
  return (
    <html className={geistSans.variable} dir="ltr" lang="en">
      <body>{children}</body>
    </html>
  );
}
