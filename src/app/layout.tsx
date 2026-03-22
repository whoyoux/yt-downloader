import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { en } from "@/locales/en";

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const metadataBase = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: en.meta.title,
    template: `%s | ${en.meta.brandName}`,
  },
  description: en.meta.description,
  keywords: [...en.meta.keywords],
  applicationName: en.meta.brandName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: metadataBase,
    siteName: en.meta.brandName,
    title: en.meta.title,
    description: en.meta.description,
  },
  twitter: {
    card: "summary_large_image",
    title: en.meta.title,
    description: en.meta.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex pt-8 md:pt-16 justify-center">
        <TooltipProvider>
          {children}
          <Toaster richColors />
        </TooltipProvider>
      </body>
    </html>
  );
}
