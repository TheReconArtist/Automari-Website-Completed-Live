import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import dynamic from "next/dynamic";

// Lazy load CircuitBackground for better initial load
const CircuitBackground = dynamic(() => import("@/components/CircuitBackground/CircuitBackground"), {
  ssr: false,
});

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Automari | AI Automation Agency for South Florida Businesses",
  description: "Custom AI agents for customer support, scheduling, and operations. Setup in 48 hours. Book a free consultation.",
  keywords: ["AI automation", "AI agency", "South Florida", "customer support AI", "scheduling automation", "business automation", "Miami", "Fort Lauderdale", "Palm Beach"],
  authors: [{ name: "Automari" }],
  creator: "Automari",
  publisher: "Automari",
  metadataBase: new URL('https://automari.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Automari | AI Automation Agency for South Florida Businesses",
    description: "Custom AI agents for customer support, scheduling, and operations. Setup in 48 hours. Book a free consultation.",
    url: 'https://automari.ai',
    siteName: 'Automari',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Automari - AI Automation Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Automari | AI Automation Agency",
    description: "Custom AI agents for customer support, scheduling, and operations. Setup in 48 hours.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

// JSON-LD Schema
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://automari.ai/#organization',
      name: 'Automari',
      url: 'https://automari.ai',
      logo: {
        '@type': 'ImageObject',
        url: 'https://automari.ai/automari-logo.png',
        width: 512,
        height: 512,
      },
      description: 'AI automation agency providing custom AI agents for businesses across South Florida.',
      email: 'contactautomari@gmail.com',
      telephone: '+1-561-201-4365',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Boca Raton',
        addressRegion: 'FL',
        addressCountry: 'US',
      },
      areaServed: [
        { '@type': 'City', name: 'Miami' },
        { '@type': 'City', name: 'Fort Lauderdale' },
        { '@type': 'City', name: 'Boca Raton' },
        { '@type': 'City', name: 'Palm Beach' },
        { '@type': 'City', name: 'Delray Beach' },
        { '@type': 'City', name: 'West Palm Beach' },
      ],
      sameAs: [
        'https://linkedin.com/company/automari',
      ],
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://automari.ai/#localbusiness',
      name: 'Automari',
      image: 'https://automari.ai/automari-logo.png',
      telephone: '+1-561-201-4365',
      email: 'contactautomari@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Boca Raton',
        addressRegion: 'FL',
        postalCode: '33432',
        addressCountry: 'US',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 26.3683,
        longitude: -80.1289,
      },
      url: 'https://automari.ai',
      priceRange: '$$$',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://automari.ai/#website',
      url: 'https://automari.ai',
      name: 'Automari',
      publisher: {
        '@id': 'https://automari.ai/#organization',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Resource hints for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} ${spaceGrotesk.variable}`}>
        <CircuitBackground intensity={0.18} speed={1.0} interactive={true} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
