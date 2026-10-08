import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Zarb Official | Premium Fragrances",
    template: "%s | Zarb Official",
  },
  description: "Explore premium fragrances from Zarb Official. Find a signature scent for every occasion.",
  applicationName: "Zarb Official",
  icons: {
    icon: [
      { url: "/images/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/images/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/images/favicon/favicon.ico",
    apple: "/images/favicon/favicon-96x96.png",
  },
  keywords: ["premium fragrances", "perfume", "Zarb Official", "fragrance shop"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Zarb Official",
    title: "Zarb Official | Premium Fragrances",
    description: "Explore premium fragrances from Zarb Official. Find a signature scent for every occasion.",
    url: "/",
    images: [
      {
        url: "/images/icon2.png",
        width: 1200,
        height: 1200,
        alt: "Zarb Official premium fragrance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zarb Official | Premium Fragrances",
    description: "Explore premium fragrances from Zarb Official.",
    images: ["/images/icon2.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[batica] bg-[#FAf8F5]">
          {children}
          <Analytics />
      </body>
    </html>
  );
}
