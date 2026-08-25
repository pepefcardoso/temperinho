import '@/lib/env';
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import Script from 'next/script';
import * as Sentry from '@sentry/nextjs';
import AdSenseLoader from '@/components/marketing/AdSenseLoader';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'),
  title: {
    default: 'Temperinho | Culinária Inclusiva',
    template: '%s | Temperinho',
  },
  description: "Descubra receitas deliciosas para todos os gostos e restrições.",
  other: {
    ...Sentry.getTraceData(),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <Script
          id="cookieyes"
          type="text/javascript"
          src="https://cdn-cookieyes.com/client_data/482e3ab6588d9ec52fc08147/script.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable,
        playfair.variable
      )}>
        <AdSenseLoader clientId={process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT || ''} />

        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:px-4 focus:py-2 focus:bg-card focus:border focus:rounded-lg">
          Pular para o conteúdo principal
        </a>

        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster richColors position="top-right" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}