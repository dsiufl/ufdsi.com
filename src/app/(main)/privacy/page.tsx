import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | UF DSI",
  description: "What information UF Data Science and Informatics collects, why, and what you can do about it.",
};

const CONTACT_EMAIL = "dsiufl@gmail.com";
const EFFECTIVE_DATE = "October 27, 2026";

const services = [
  {
    name: "Supabase",
    href: "https://supabase.com/privacy",
    use: "Stores form submissions, uploaded files and site content, and signs officers in.",
  },
  {
    name: "Brevo",
    href: "https://www.brevo.com/legal/privacypolicy/",
    use: "Sends registration, waitlist and cancellation emails. It receives your name, email and the event title.",
  },
  {
    name: "Google Forms",
    href: "https://policies.google.com/privacy",
    use: "Collects newsletter sign-ups.",
  },
  {
    name: "UF LISTSERV",
    href: "https://privacy.ufl.edu/",
    use: "Delivers the newsletter. The University of Florida runs it.",
  },
];

export default function PrivacyPage() {
  return (
    <main>
      <section className="site-intro" aria-labelledby="privacy-title">
        <div className="site-wrap site-hero__copy" style={{ maxWidth: "calc(760px + var(--pad) * 2)" }}>
          <p className="site-label">Legal</p>
          <h1 id="privacy-title" className="site-h1">
            Privacy policy.
          </h1>
          <p className="site-lede">
            UF Data Science and Informatics (&ldquo;DSI&rdquo;, &ldquo;we&rdquo;) is a student organization at
            the University of Florida. This page explains what we collect on ufdsi.com, why we collect it and
            what you can ask us to do with it.
          </p>
          <p className="site-body">Effective {EFFECTIVE_DATE}.</p>

          <h2 className="site-h3">Browsing the site</h2>
          <p className="site-body">
            You can read ufdsi.com without an account. We do not run analytics, advertising or tracking
            scripts, and we do not set cookies for visitors. Our hosting provider keeps standard server logs,
            such as IP addresses and the pages requested, to operate and secure the site.
          </p>

          <h2 className="site-h3">Event registration and other forms</h2>
          <p className="site-body">
            When you fill out one of our forms, we collect your name and email address, plus whatever else
            that form asks for. Depending on the event, that can include your phone number, UF ID, an
            emergency contact, answers to questions, uploaded files such as a résumé, and your agreement to a
            waiver.
          </p>
          <p className="site-body">
            While you fill out a form, your browser saves a draft of your answers in its local storage so you
            do not lose your progress. The draft stays on your device and is cleared when you submit.
          </p>
          <p className="site-body">
            We use this information to run the event: confirming your spot, managing the waitlist, emailing
            you about changes, checking you in and contacting someone in an emergency. If a form will share
            your details with a partner, for example a sponsor collecting résumés, the form will say so
            before you submit.
          </p>

          <h2 className="site-h3">Newsletter</h2>
          <p className="site-body">
            If you sign up for our newsletter, we add your email address to our mailing list, which UF hosts.
            You can leave at any time from the <Link href="/unsubscribe">unsubscribe page</Link>.
          </p>

          <h2 className="site-h3">Emailing us</h2>
          <p className="site-body">
            If you email us, we keep the message and your address so we can reply.
          </p>

          <h2 className="site-h3">Who can see your information</h2>
          <p className="site-body">
            Only current DSI officers who need it to run an event can see form submissions. We do not sell or
            rent your information to anyone. We use these services to run the site, and each handles your
            data under its own privacy policy:
          </p>
          <ul className="site-body" style={{ listStyle: "disc", paddingLeft: "1.25em" }}>
            {services.map((service) => (
              <li key={service.name}>
                <a href={service.href} target="_blank" rel="noopener noreferrer">
                  {service.name}
                </a>
                : {service.use}
              </li>
            ))}
          </ul>
          <p className="site-body">
            We may also share information if the law, a court order or University of Florida policy requires
            it.
          </p>

          <h2 className="site-h3">Links to other sites</h2>
          <p className="site-body">
            We link to Discord, Instagram, LinkedIn, YouTube and other sites. Their own privacy policies apply
            once you leave ufdsi.com.
          </p>

          <h2 className="site-h3">How long we keep it</h2>
          <p className="site-body">
            We keep form submissions for as long as we need them to run the event and keep basic attendance
            records for the organization. You can ask us to delete yours sooner.
          </p>

          <h2 className="site-h3">Security</h2>
          <p className="site-body">
            Submissions and uploaded files are stored in access-controlled databases and storage, and only
            signed-in officers can reach them. No system is perfectly secure, so please do not send us
            information a form does not ask for.
          </p>

          <h2 className="site-h3">Your choices</h2>
          <p className="site-body">
            You can ask us to show you, correct or delete the information we hold about you, or to cancel a
            registration. Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}?subject=Privacy%20request`}>{CONTACT_EMAIL}</a> with the
            subject &ldquo;Privacy request&rdquo; and we will respond within 30 days.
          </p>

          <h2 className="site-h3">Children</h2>
          <p className="site-body">
            Our site and events are for university students and professionals. We do not knowingly collect
            information from children under 13. If you believe a child has sent us information, email us and
            we will delete it.
          </p>

          <h2 className="site-h3">Changes to this policy</h2>
          <p className="site-body">
            If we change this policy, we will update it here and change the effective date at the top.
          </p>

          <h2 className="site-h3">Contact</h2>
          <p className="site-body">
            Questions about this policy go to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>, or by mail to UF Data Science and
            Informatics, Artificial Intelligence and Informatics Research Institute, 432 Newell Drive, CISE
            Bldg E251, Gainesville, Florida 32611-5585.
          </p>
        </div>
      </section>
    </main>
  );
}
