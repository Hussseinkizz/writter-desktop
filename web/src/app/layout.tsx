import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Writter Desktop - Minimalistic Markdown Editor",
  description: "The fully offline-first desktop minimalistic markdown editor for your notes and thoughts. Free and open source. Available for Windows, macOS, and Linux.",
  keywords: [
    "markdown editor",
    "note taking",
    "desktop app",
    "offline editor",
    "open source",
    "minimalistic",
    "writing app",
    "text editor",
    "local-first"
  ],
  authors: [{ name: "Hussein Kizz", url: "https://github.com/Hussseinkizz" }],
  creator: "Hussein Kizz",
  publisher: "Hussein Kizz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Writter Desktop - Minimalistic Markdown Editor",
    description: "The fully offline-first desktop minimalistic markdown editor for your notes and thoughts. Free and open source.",
    siteName: "Writter Desktop",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Writter Desktop - Minimalistic Markdown Editor",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Writter Desktop - Minimalistic Markdown Editor",
    description: "The fully offline-first desktop minimalistic markdown editor for your notes and thoughts. Free and open source.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-zinc-900 text-white">
        {children}
      </body>
    </html>
  );
}
