import "@/styles/site.css";

import Footer from "@/components/Footer";
import NewHeader from "@/components/NewHeader";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found | UF DSI" };

export default function NotFound() {
  return (
    <div className="site flex flex-col min-h-screen">
      <NewHeader />
      <main style={{ flex: 1 }}>
        <section className="site-intro" aria-labelledby="nf-title">
          <div className="site-wrap site-hero__copy">
            <p className="site-label">404</p>
            <h1 id="nf-title" className="site-h1" style={{ maxWidth: "14ch" }}>
              This page does not exist.
            </h1>
            <p className="site-lede">It may have moved, or the link may have a typo.</p>
            <div className="site-hero__actions">
              <Link href="/" className="site-btn site-btn--primary">
                Go to the home page <span className="site-arrow" aria-hidden="true">→</span>
              </Link>
              <Link href="/workshops-list" className="site-btn site-btn--ghost">
                See workshops
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
