import "node_modules/react-modal-video/css/modal-video.css";
import "@/styles/index.css";

import { Inter } from "next/font/google";
import { Metadata } from "next";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ufdsi.com"),
  title: {
    default:
      "UF DSI – Data Science & Informatics at the University of Florida",
    template: "%s | UF DSI",
  },
  description:
    "UF Data Science and Informatics (DSI) is a student organization at the University of Florida dedicated to data science, AI, machine learning, and research since 2015. Free workshops, networking events, and research opportunities for all UF students.",
  keywords: [
    "data science",
    "informatics",
    "University of Florida",
    "UF",
    "machine learning",
    "artificial intelligence",
    "student organization",
    "DSI",
    "Gainesville",
    "workshops",
    "HiPerGator",
  ],
  authors: [{ name: "UF Data Science and Informatics" }],
  creator: "UF Data Science and Informatics",
  publisher: "UF Data Science and Informatics",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ufdsi.com",
    siteName: "UF DSI",
    title:
      "UF DSI – Data Science & Informatics at the University of Florida",
    description:
      "UF Data Science and Informatics (DSI) is a student organization at the University of Florida dedicated to data science, AI, machine learning, and research since 2015.",
    images: [
      {
        url: "/images/hero/group-photo.png",
        width: 1200,
        height: 630,
        alt: "UF DSI — Data Science and Informatics student organization at the University of Florida",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "UF DSI – Data Science & Informatics at the University of Florida",
    description:
      "UF Data Science and Informatics (DSI) is a student organization at the University of Florida dedicated to data science, AI, machine learning, and research since 2015.",
    images: ["/images/hero/group-photo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UF Data Science and Informatics",
  alternateName: "UF DSI",
  url: "https://ufdsi.com",
  logo: "https://ufdsi.com/favicon.ico",
  description:
    "A student organization at the University of Florida dedicated to promoting data science education, research, and collaboration since 2015.",
  foundingDate: "2015",
  email: "dsiufl@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "432 Newell Drive, CISE Bldg E251",
    addressLocality: "Gainesville",
    addressRegion: "FL",
    postalCode: "32611",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.instagram.com/uf_dsi/",
    "https://www.linkedin.com/company/dsiufl/",
  ],
  parentOrganization: {
    "@type": "CollegeOrUniversity",
    name: "University of Florida",
    url: "https://www.ufl.edu",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: "https://ufdsi.com",
  name: "UF DSI – Data Science & Informatics",
  description:
    "Official website of the UF Data Science and Informatics student organization at the University of Florida.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={`bg-gray-50 dark:bg-gray-900 ${inter.className}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
