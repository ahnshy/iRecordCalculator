import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "../components/ThemeRegistry";

export const metadata: Metadata = {
  title: "i Record Calculator [계산기] • Next.js",
  description: "iPhone-like calculator with persistent history",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
