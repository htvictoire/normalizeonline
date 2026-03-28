import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Header from "./components/header";
import Footer from "./components/footer";
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
  description:
    "Upload a CSV, Excel, or JSON file. Normalize samples your data, suggests how to interpret it, and lets you confirm and adjust every column. You decide the output format — CSV, JSON, or Parquet.",
  keywords: [
    "data normalization",
    "CSV cleaner",
    "Excel to Parquet",
    "JSON normalization",
    "data pipeline",
    "schema inference",
    "data quality",
    "tabular data",
    "data transformation",
    "ETL tool",
  ],
  creator: "Normalize",
  publisher: "Normalize",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    siteName: "Normalize",
    title: "Normalize — Turn messy files into clean data",
    description:
      "Upload a CSV, Excel, or JSON file. Normalize suggests how to interpret your data — you confirm, adjust per column, choose your output format, and download.",
    url: "https://normalizeonline.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Normalize — Turn messy files into clean data",
    description:
      "Upload a CSV, Excel, or JSON file. Normalize suggests how to interpret your data — you confirm, adjust, and export as CSV, JSON, or Parquet.",
    creator: "@htvictoire",
  },
  alternates: {
    canonical: "https://normalizeonline.com",
  },
};

export const viewport: Viewport = {
  themeColor: "#2596be",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
