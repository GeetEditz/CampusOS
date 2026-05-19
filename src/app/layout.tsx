import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { AppContextProvider } from "@/context/AppContext";
import DashboardShell from "@/components/DashboardShell";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "CampusOS - AI College Opportunity Network",
  description: "Democratizing unadvertised student referrals and faculty tips with NVIDIA NIM AI Opportunity Engine.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-screen bg-black antialiased text-white">
        <AppContextProvider>
          <DashboardShell>{children}</DashboardShell>
          <Toaster />
        </AppContextProvider>
      </body>
    </html>
  );
}
