import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  weight: "100 900",
  variable: "--font-sans-loaded",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-mono-loaded",
  display: "swap",
  fallback: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
});

export const metadata: Metadata = {
  title: "CodeBeat_ - 코딩 타자연습",
  description: "코드를 치며 형태를 익히는 코딩 타자연습 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${jetBrainsMono.variable} h-full`}>
      <body className="h-full">
        {children}
      </body>
    </html>
  );
}
