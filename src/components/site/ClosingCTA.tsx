import { DISCORD_URL, socials } from "./links";

export default function ClosingCTA() {
  return (
    <section className="site-closing" aria-labelledby="closing-title">
      <div className="site-wrap site-closing__grid">
        <div>
          <h2 id="closing-title" className="site-h2">
            Join DSI.
          </h2>
          <p className="site-lede">
            Workshop announcements, project teams and everything else start in
            the Discord. Any major, any year.
          </p>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="site-btn site-btn--primary"
          >
            Join the Discord <span className="site-arrow" aria-hidden="true">→</span>
          </a>
        </div>
        <ul className="site-closing__links">
          {socials.map((social) => (
            <li key={social.name}>
              <a href={social.href} target="_blank" rel="noopener noreferrer">
                <span>{social.name}</span>
                <span>{social.handle}</span>
              </a>
            </li>
          ))}
          <li>
            <a href="mailto:dsiufl@gmail.com">
              <span>Email</span>
              <span>dsiufl@gmail.com</span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
