import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { RoomsProvider } from "@/context/RoomsContext"; // Import RoomsProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatHub - Simple Text Communication",
  description: "A simple, fast, and secure text communication platform",
  icons: {
    icon: '/chathub-logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-m3-background antialiased`}
      >
        <RoomsProvider>
          {children}
        </RoomsProvider>
      </body>
    </html>
  );
}
