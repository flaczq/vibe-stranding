import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vibe Stranding | Learn AI-Powered Development",
  description: "Join the growing community of Vibe Stranding. Fully free to playground, enjoy, and learn the future of AI through interactive challenges.",
  keywords: ["vibe coding", "AI coding", "learn programming", "coding challenges", "gamified learning"],
};

import { SessionProvider } from "@/components/providers/SessionProvider";
import { InteractiveBackground } from "@/components/ui/InteractiveBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <AuthProvider>
            <InteractiveBackground />
            {children}
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
