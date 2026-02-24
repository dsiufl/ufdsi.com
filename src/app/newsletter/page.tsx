import { Metadata } from "next";
import NewsletterClient from "./NewsletterClient";

export const metadata: Metadata = {
  title: "DSI News",
  description:
    "Stay updated with the latest news, achievements, awards, and events from the UF Data Science and Informatics community at the University of Florida.",
  alternates: {
    canonical: "https://ufdsi.com/newsletter",
  },
  openGraph: {
    title: "DSI News | UF DSI",
    description:
      "Stay updated with the latest news, achievements, awards, and events from the UF Data Science and Informatics community.",
    url: "https://ufdsi.com/newsletter",
  },
};

export default function NewsletterPage() {
  return <NewsletterClient />;
}
