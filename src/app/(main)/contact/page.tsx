import { DISCORD_URL, socials } from "@/components/site/links";
import { SPONSOR_EMAIL } from "@/lib/sponsorship";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | UF DSI",
  description: "Get in touch with UF Data Science and Informatics.",
};

const channels = [
  { name: "Email", handle: SPONSOR_EMAIL, href: `mailto:${SPONSOR_EMAIL}` },
  { name: "Discord", handle: "Join the server", href: DISCORD_URL },
  ...socials,
];

export default function ContactPage() {
  return (
    <main>
      <section className="site-intro" aria-labelledby="contact-title">
        <div className="site-wrap site-split">
          <div className="site-hero__copy">
            <p className="site-label">Contact</p>
            <h1 id="contact-title" className="site-h1">
              Get in touch.
            </h1>
            <p className="site-lede">
              Questions about data science, our events or getting involved? Email is best for anything
              formal. The Discord is fastest for everything else.
            </p>
            <p className="site-body">
              Companies interested in sponsoring can see the <Link href="/sponsors">sponsorship tiers</Link>.
            </p>
          </div>
          <ul className="site-links">
            {channels.map((channel) => (
              <li key={channel.name}>
                <a
                  href={channel.href}
                  {...(channel.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                >
                  <span>{channel.name}</span>
                  <span>{channel.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
