import type { Metadata } from "next";
import Script from "next/script";
import "@fontsource-variable/inter";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "Dan Haight | Analytics Leader",
    template: "%s | Dan Haight",
  },
  description:
    "Analytics leader with technical depth in Python, SQL, and ML/AI. Building data-driven solutions that drive business impact.",
  keywords: [
    "analytics",
    "data science",
    "machine learning",
    "Python",
    "leadership",
  ],
  authors: [{ name: "Dan Haight" }],
  creator: "Dan Haight",
  openGraph: {
    title: "Dan Haight | Analytics Leader",
    description:
      "Analytics leader with technical depth in Python, SQL, and ML/AI.",
    url: "https://danalytics.info",
    siteName: "Dan Haight",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dan Haight | Analytics Leader",
    description:
      "Analytics leader with technical depth in Python, SQL, and ML/AI.",
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
    <html lang="en" suppressHydrationWarning>
      {process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL &&
        process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            defer
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <ThemeProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
