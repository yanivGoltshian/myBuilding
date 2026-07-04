import type { Metadata, Viewport } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "../components/ServiceWorkerRegister";

const assistant = Assistant({
  variable: "--font-app",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE = "https://my-building-seven.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "ועד — ניהול הבניין שלך",
    template: "%s · ועד",
  },
  description:
    "אפליקציית ניהול הבניין: תשלומי ועד, קריאות שירות, סקרים, אסיפות דיירים, שקיפות כספית וקהילה — הכל במקום אחד.",
  applicationName: "ועד",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ועד",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: SITE,
    siteName: "ועד",
    title: "ועד — ניהול הבניין שלך",
    description:
      "תשלומים, קריאות שירות, סקרים, אסיפות דיירים ושקיפות כספית — אפליקציה אחת לכל הדיירים.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d12" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} h-full`}>
      <body className="min-h-full antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
