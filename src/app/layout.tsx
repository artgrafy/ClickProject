import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClickBlog - AI 자동화 블로그 빌더",
  description: "당신의 아이디어를 수익형 블로그로 자동 변환하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-base-100 flex flex-col`}
      >
        <Navigation />
        <main className="flex-grow pt-16 pb-20 lg:pb-0">
          {children}
        </main>
      </body>
    </html>
  );
}
