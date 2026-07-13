import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const collapse = localFont({
  src: [
    { path: "../../public/fonts/Collapse-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/Collapse-Bold.woff2", weight: "700" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const courierPrime = localFont({
  src: [
    { path: "../../public/fonts/CourierPrime-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/CourierPrime-Italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/CourierPrime-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/CourierPrime-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-mono",
  display: "swap",
});

const rulesCompressed = localFont({
  src: [
    { path: "../../public/fonts/RulesCompressed-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/RulesCompressed-Medium.woff2", weight: "600" },
  ],
  variable: "--font-rules-compressed",
  display: "swap",
});

const rulesExpanded = localFont({
  src: [
    { path: "../../public/fonts/RulesExpanded-Regular.woff2", weight: "400" },
    { path: "../../public/fonts/RulesExpanded-Bold.woff2", weight: "700" },
  ],
  variable: "--font-rules-expanded",
  display: "swap",
});

const mondwest = localFont({
  src: [{ path: "../../public/fonts/Mondwest-Regular.woff2", weight: "400" }],
  variable: "--font-mondwest",
  display: "swap",
});

const sigurd = localFont({
  src: [{ path: "../../public/fonts/Sigurd-Variable.woff2", weight: "300 900" }],
  variable: "--font-display",
  display: "optional",
});

export const metadata: Metadata = {
  title: "Mayank Joshi | Portfolio",
  description: "Systems & machine learning engineer portfolio of Mayank Joshi",
  openGraph: {
    title: "Mayank Joshi — Systems & Machine Learning Engineer",
    description: "Systems & machine learning engineer portfolio",
    images: [{ url: "/seo/og-image.png", width: 1200, height: 692 }],
  },
  icons: {
    icon: "/seo/favicon.ico",
    apple: "/seo/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${collapse.variable} ${courierPrime.variable} ${rulesCompressed.variable} ${rulesExpanded.variable} ${mondwest.variable} ${sigurd.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
