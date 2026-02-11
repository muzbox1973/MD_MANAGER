import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "마크다운 관리자 - MD Manager",
  description: "마크다운 및 텍스트 파일을 트리 구조로 관리하고 편집하는 한글 앱",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
