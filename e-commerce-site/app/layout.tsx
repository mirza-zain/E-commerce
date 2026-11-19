import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { MetaPixelTracker } from "./components/MetaPixelTracker";
import "./globals.css";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-SNV0D16RRY";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1029616366831887";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Zarb Store | Premium Fragrances",
    template: "%s | Zarb Store",
  },
  description: "Explore premium fragrances from Zarb Store. Find a signature scent for every occasion.",
  applicationName: "Zarb Store",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/images/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/images/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/images/favicon/site.webmanifest",
  keywords: ["premium fragrances", "perfume", "Zarb Store", "fragrance shop"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Zarb Store",
    title: "Zarb Store | Premium Fragrances",
    description: "Explore premium fragrances from Zarb Store. Find a signature scent for every occasion.",
    url: "/",
    images: [
      {
        url: "/images/icon2.png",
        width: 1200,
        height: 1200,
        alt: "Zarb Store premium fragrance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zarb Store | Premium Fragrances",
    description: "Explore premium fragrances from Zarb Store.",
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
      <head>
        {GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col font-[batica] bg-[#FAf8F5]">
          {children}
          {META_PIXEL_ID && (
            <>
              <Script id="meta-pixel" strategy="afterInteractive">
                {`
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${META_PIXEL_ID}');
                `}
              </Script>
              <noscript>
                <img
                  height="1"
                  width="1"
                  style={{ display: "none" }}
                  src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                  alt=""
                />
              </noscript>
              <Suspense fallback={null}>
                <MetaPixelTracker />
              </Suspense>
            </>
          )}
          <Analytics />
          <SpeedInsights />
      </body>
    </html>
  );
}
