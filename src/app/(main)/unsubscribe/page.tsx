import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsubscribe | UF DSI",
  description: "Unsubscribe from the DSI newsletter.",
};

const LISTSERV_URL = "https://lists.ufl.edu/cgi-bin/wa?SUBED1=AIIRIDSI&A=1";

export default function UnsubscribePage() {
  return (
    <main>
      <section className="site-intro" aria-labelledby="unsub-title">
        <div className="site-wrap site-hero__copy" style={{ maxWidth: "calc(760px + var(--pad) * 2)" }}>
          <p className="site-label">Newsletter</p>
          <h1 id="unsub-title" className="site-h1">
            Unsubscribe.
          </h1>
          <p className="site-lede">
            Sorry to see you go. Any of these three ways works, and you never need to give a reason.
          </p>

          <ol className="site-steps" style={{ gridTemplateColumns: "minmax(0, 1fr)", marginTop: 40 }}>
            <li className="site-step">
              <span className="site-step__num" aria-hidden="true">1.</span>
              <h2 className="site-step__title">Use the list page</h2>
              <p>
                This link only works on UF Wi-Fi or the UF VPN.
              </p>
              <a href={LISTSERV_URL} target="_blank" rel="noopener noreferrer">
                Unsubscribe from the DSI newsletter <span className="site-arrow" aria-hidden="true">→</span>
              </a>
            </li>
            <li className="site-step">
              <span className="site-step__num" aria-hidden="true">2.</span>
              <h2 className="site-step__title">Email the list server</h2>
              <p>
                Send an email to listserv@lists.ufl.edu whose only text is &ldquo;UNSUBSCRIBE AIIRIDSI&rdquo;. No
                subject line is needed.
              </p>
              <a href="mailto:listserv@lists.ufl.edu?body=UNSUBSCRIBE%20AIIRIDSI">
                Open the email <span className="site-arrow" aria-hidden="true">→</span>
              </a>
            </li>
            <li className="site-step">
              <span className="site-step__num" aria-hidden="true">3.</span>
              <h2 className="site-step__title">Ask us</h2>
              <p>
                Still stuck? Email us with the subject &ldquo;UNSUBSCRIBE&rdquo; and we will remove you by hand.
              </p>
              <a href="mailto:dsiufl@gmail.com?subject=UNSUBSCRIBE">
                Email dsiufl@gmail.com <span className="site-arrow" aria-hidden="true">→</span>
              </a>
            </li>
          </ol>
        </div>
      </section>
    </main>
  );
}
