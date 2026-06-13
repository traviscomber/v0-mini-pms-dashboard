import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const SITE_URL = 'https://www.yagan.app'
const SITE_NAME = 'Yagán'
const TITLE = 'Yagán | Facility Core System'
const DESCRIPTION =
  'Yagán is a multi-vertical facility core system for hospitality, administration, field operations, and infrastructure in one integrated control tower. Powered by AI agents for intelligent operations coordination.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    'facility management', 'core system', 'hospitality management', 'operations platform',
    'hotel operations software', 'property management', 'FMS software',
    'integrated operations', 'business operations', 'facility coordination',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'en': `${SITE_URL}/en`,
      'es': `${SITE_URL}/es`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'es_ES',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Yagán — Facility Core System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
    creator: '@yagan_app',
    site: '@yagan_app',
  },
  generator: 'Yagán',
  applicationName: SITE_NAME,
  referrer: 'origin-when-cross-origin',
  category: 'Facility Management Software',
  icons: {
    icon: [
      { url: '/yagan-logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/yagan-logo.png', sizes: '64x64', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/yagan-logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#0a0a12' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  width: 'device-width',
  initialScale: 1,
}

/* ─── JSON-LD structured data — GEO / LLMO / rich results ─── */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#software`,
      name: 'N3uralia',
      url: SITE_URL,
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'Property Management System',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Request access for pricing',
      },
      description: DESCRIPTION,
      featureList: [
        'AI-powered revenue management',
        'Automated housekeeping coordination',
        'Guest messaging automation',
        'OTA channel integration (Booking.com, Expedia)',
        'Real-time operations dashboard',
        'Specialist AI agent stack',
        'Audit trail and full traceability',
        'Upsell automation',
        'Chief of Staff orchestrator agent',
        'Revenue Strategist agent',
        'Operations Commander agent',
        'Guest Concierge agent',
        'Integrations Engineer agent',
        'Trust Auditor agent',
      ],
      audience: {
        '@type': 'Audience',
        audienceType: 'Hotel operators, revenue managers, boutique hotel owners, apartment managers',
      },
      inLanguage: ['en', 'es'],
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#org`,
      name: 'N3uralia',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.svg`,
        width: 32,
        height: 32,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'hola@n3uralia.com',
        contactType: 'customer support',
        availableLanguage: ['English', 'Spanish'],
      },
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DESCRIPTION,
      publisher: { '@id': `${SITE_URL}/#org` },
      inLanguage: ['en', 'es'],
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is N3uralia?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'N3uralia is an agentic hotel property management system (PMS) that uses specialist AI agents to automate revenue management, operations, guest messaging, and OTA integrations.',
          },
        },
        {
          '@type': 'Question',
          name: 'What types of hotels can use N3uralia?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'N3uralia is designed for boutique hotels, regional hotel chains, hostels, B&Bs, and apartment complexes. It is suitable for independent revenue managers and hotel operations directors.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does N3uralia integrate with Booking.com and Expedia?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The Integrations Engineer agent handles channel connectivity including Booking.com, Expedia, and other OTAs, keeping inventory and rates in sync automatically.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does N3uralia improve hotel revenue?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Revenue Strategist agent monitors demand signals, projects occupancy, and surfaces pricing recommendations and upsell opportunities in real time, helping hotels increase their average daily rate (ADR).',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué es N3uralia?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'N3uralia es un PMS hotelero agentivo que usa agentes de inteligencia artificial especializados para automatizar revenue management, operaciones, mensajeria con huespedes e integraciones con OTAs como Booking.com y Expedia.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Para qué tipo de hoteles es N3uralia?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'N3uralia es ideal para hoteles boutique independientes, cadenas hoteleras regionales, hostales, B&B y complejos de apartamentos. Tambien es util para revenue managers independientes y directores de operaciones.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark bg-background`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
