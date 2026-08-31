import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Tobiloba Olujimi — AI Systems Builder & Startup Founder",
  description:
    "Shipping automation, CRMs and AI systems for UK brands and product teams. Co-founder of Omniai.",
  keywords: [
    "AI automation",
    "React developer",
    "Next.js",
    "startup founder",
    "Tobiloba Olujimi",
    "Chatwoot",
    "customer support infrastructure",
  ],
  authors: [{ name: "Tobiloba Olujimi" }],
  openGraph: {
    title: "Tobiloba Olujimi — AI Systems Builder & Startup Founder",
    description:
      "Shipping automation, CRMs and AI systems for UK brands and product teams.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tobiloba Olujimi Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tobiloba Olujimi — AI Systems Builder",
    description: "Shipping automation, CRMs and AI systems for UK brands.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@100;200;300;400;500;600&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#080808] text-[#F0F0F0] overflow-x-hidden">
        <SmoothScroll>
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
