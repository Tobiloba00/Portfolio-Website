import type { Metadata } from "next";
import { Bebas_Neue, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sub",
  display: "swap",
});

// TODO: swap for the final custom domain once one is live.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://portfolio-website-theta-kohl-xpfw4oztc5.vercel.app";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tobiloba Olujimi",
  url: siteUrl,
  jobTitle: "AI Systems Builder & Startup Founder",
  worksFor: {
    "@type": "Organization",
    name: "Omniai",
  },
  sameAs: [
    "https://github.com/Tobiloba00",
    "https://www.linkedin.com/in/tobiloba-olujimi",
    "https://x.com/JimiToby",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Tobiloba Olujimi — AI Systems Builder & Startup Founder",
  description:
    "AI automation and full-stack systems for growing businesses and startups. Co-founder of Omniai.",
  keywords: [
    "AI automation engineer",
    "AI systems builder",
    "full-stack developer",
    "Next.js developer",
    "React developer",
    "startup technical co-founder",
    "workflow automation",
    "AI agent development",
    "customer support automation",
    "Chatwoot",
    "mobile app developer",
    "Tobiloba Olujimi",
  ],
  authors: [{ name: "Tobiloba Olujimi" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tobiloba Olujimi — AI Systems Builder & Startup Founder",
    description:
      "AI automation and full-stack systems for growing businesses and startups.",
    type: "website",
    locale: "en_US",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tobiloba Olujimi — AI Systems Builder",
    description:
      "AI automation and full-stack systems for growing businesses and startups.",
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
      className={`${bebasNeue.variable} ${jetbrainsMono.variable} ${syne.variable}`}
    >
      <body className="antialiased bg-[#080808] text-[#F0F0F0] overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <SmoothScroll>
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
