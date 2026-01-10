import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mayank Joshi | ML Developer",
  description: "ML Developer specializing in Neural Machine Translation, Generative AI, and Computer Vision. Open to work.",
  openGraph: {
    type: "website",
    title: "Mayank Joshi | ML Developer",
    description: "ML Developer specializing in Neural Machine Translation, Generative AI, and Computer Vision.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mayank Joshi | ML Developer",
    description: "ML Developer specializing in Neural Machine Translation, Generative AI, and Computer Vision.",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧠</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        {children}
      </body>
    </html>
  );
}