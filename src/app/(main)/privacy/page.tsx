import { Metadata } from "next";
import { PRIVACY_CONTACT_EMAIL, PRIVACY_EFFECTIVE_DATE } from "@/lib/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How UF DSI collects, uses, and stores information submitted through our website and forms.",
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">{title}</h2>
    <div className="space-y-3 text-base leading-relaxed text-body-color dark:text-body-color-dark">
      {children}
    </div>
  </section>
);

const PrivacyPage = () => {
  const mail = (
    <a href={`mailto:${PRIVACY_CONTACT_EMAIL}`} className="text-primary hover:underline">
      {PRIVACY_CONTACT_EMAIL}
    </a>
  );

  return (
    <div className="relative z-10 overflow-hidden bg-white dark:bg-gray-dark">
      <div className="container relative py-16 md:py-20 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-3 text-4xl font-bold text-black dark:text-white">Privacy Policy</h1>
          <p className="mb-12 text-sm text-body-color dark:text-body-color-dark">
            Effective {PRIVACY_EFFECTIVE_DATE}
          </p>

          <Section title="Who we are">
            <p>
              The Data Science and Informatics club at the University of Florida (&quot;UF DSI&quot;,
              &quot;we&quot;) is a registered student organization. This policy explains how we handle
              information you give us through this website, mainly event registration and sign-up forms.
            </p>
            <p>
              UF DSI is a student organization, not an office of the University of Florida, and this is
              not a UF policy. For how UF handles your information, see the{" "}
              <a
                href="https://privacy.ufl.edu/internet-privacy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                UF Internet Privacy Policy
              </a>
              .
            </p>
          </Section>

          <Section title="What we collect">
            <p>When you submit one of our forms, we collect:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Your name, email address, and (if the form asks) phone number</li>
              <li>
                Your answers to the form&apos;s questions, which can include things like your UF ID,
                year, major, dietary needs, emergency contact, or interests
              </li>
              <li>Any files you upload, such as a resume</li>
              <li>When you submitted, your registration status (confirmed, waitlisted, or cancelled), and
                the date you agreed to this policy</li>
            </ul>
            <p>
              While you fill out a form, your answers are saved in your own browser (local storage) so you
              don&apos;t lose progress. That copy stays on your device and is deleted when you submit.
            </p>
            <p>We don&apos;t use advertising trackers, and we don&apos;t collect information from forms you
              don&apos;t submit.</p>
          </Section>

          <Section title="How we use it">
            <ul className="list-disc space-y-2 pl-6">
              <li>To register you for events, manage capacity and waitlists, and check you in</li>
              <li>To email you about the event you signed up for, such as confirmations, waitlist updates,
                and cancellations</li>
              <li>To plan events and understand attendance, using totals rather than individual answers
                where we can</li>
              <li>For forms that collect resumes or similar files, to share them with the sponsors or
                partners named on that form, and only when the form says so</li>
            </ul>
          </Section>

          <Section title="Who can see it">
            <p>
              Only current UF DSI officers who manage events can see submissions, and only after signing
              in to our admin site. We do not sell your information or share it with advertisers.
            </p>
            <p>We use these service providers to run the site, and they store or process data for us:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li><strong>Supabase</strong>: the database and file storage that hold submissions and uploads</li>
              <li><strong>Vercel</strong>: website hosting</li>
              <li><strong>Brevo</strong>: sends registration emails, which means it receives your name and email address</li>
              <li><strong>Clerk</strong>: officer sign-in only; it does not receive form submissions</li>
            </ul>
            <p>
              We may also disclose information if UF or the law requires it, or to protect someone&apos;s
              safety (for example, giving an emergency contact to first responders at an event).
            </p>
          </Section>

          <Section title="How long we keep it">
            <p>
              We delete form submissions and uploaded files at the end of each academic year, by May 31.
              If you ask us to delete your information sooner, we will (see below).
            </p>
          </Section>

          <Section title="Your choices">
            <p>
              Email {mail} to ask for a copy of your information, correct it, cancel a registration, or
              have your submissions deleted. We&apos;ll respond within 30 days. If you&apos;re a UF student,
              you can also contact UF&apos;s Student Activities and Involvement office with concerns about a
              student organization.
            </p>
          </Section>

          <Section title="Security">
            <p>
              Submissions are stored in a database that the public can&apos;t read. Uploaded files are kept
              private and opened only through short-lived links by signed-in officers. Data is encrypted in
              transit (HTTPS). No system is perfectly secure, so please don&apos;t submit information a form
              doesn&apos;t ask for, such as Social Security or bank numbers.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              If we change this policy, we&apos;ll update the date above. Each submission records which
              version of the policy you agreed to.
            </p>
          </Section>

          <Section title="Contact">
            <p>Questions about this policy or your information: {mail}.</p>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
