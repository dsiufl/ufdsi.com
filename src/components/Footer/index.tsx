import { symposiumHref } from "@/lib/symposia";
import Image from "next/image";
import Link from "next/link";
import { DISCORD_URL, socials } from "../site/links";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-wrap">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo/hd-transparent-dsi-logo.png"
                alt="UF DSI home"
                width={100}
                height={56}
              />
            </Link>
            <address>
              Artificial Intelligence and Informatics Research Institute
              <br />
              432 Newell Drive, CISE Bldg E251
              <br />
              Gainesville, Florida 32611-5585
            </address>
          </div>

          <nav aria-label="Organization">
            <p className="site-label">Organization</p>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/team">Team</Link></li>
              <li><Link href="/newsletter">News</Link></li>
              <li><Link href="/sponsors">Sponsors</Link></li>
            </ul>
          </nav>

          <nav aria-label="Programs">
            <p className="site-label">Programs</p>
            <ul>
              <li><Link href="/workshops-list">Workshops</Link></li>
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href={symposiumHref()}>Symposium</Link></li>
            </ul>
          </nav>

          <nav aria-label="Connect">
            <p className="site-label">Connect</p>
            <ul>
              <li><a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">Discord</a></li>
              {socials.map((social) => (
                <li key={social.name}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer">{social.name}</a>
                </li>
              ))}
              <li><a href="mailto:dsiufl@gmail.com">dsiufl@gmail.com</a></li>
            </ul>
          </nav>
        </div>

        <div className="site-footer__base">
          <span>© {new Date().getFullYear()} UF Data Science and Informatics · <Link href="/privacy">Privacy</Link></span>
          <span>Across from Marston Science Library, on the side of the CSE Building</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
