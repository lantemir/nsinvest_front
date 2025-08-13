import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/provider";
import ClientLayout from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://moo.kz"),
  title: {
    default: "moo.kz — Обучение IT профессиям",
    template: "%s — moo.kz",
  },
  description:
    "Онлайн-курсы по программированию, кибербезопасности, тестированию и другим IT-направлениям.",
  openGraph: {
    title: "moo.kz — Обучение IT профессиям",
    description:
      "Онлайн-курсы по программированию, кибербезопасности, тестированию и другим IT-направлениям.",
    url: "https://moo.kz",
    siteName: "moo.kz",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Обучение IT профессиям" }],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "moo.kz — Обучение IT профессиям",
    description:
      "Онлайн-курсы по программированию, кибербезопасности, тестированию и другим IT-направлениям.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <ClientLayout>{children}</ClientLayout>
        </StoreProvider>
      </body>
    </html>
  );
}