import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://normalizeonline.com"),
  title: {
    default: "Normalize — Turn messy files into clean data",
    template: "%s | Normalize",
  },
  applicationName: "Normalize",
  creator: "Normalize",
  publisher: "Normalize",
};

export const viewport: Viewport = {
  themeColor: "#2596be",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
