import type { Logo } from "@/lib/symposia";
import Image from "next/image";

export default function LogoTiles({ logos }: { logos: Logo[] }) {
  return (
    <ul className="site-tiles">
      {logos.map((logo) => {
        const tile = (
          <span className="site-tile" style={logo.bg ? { background: logo.bg } : undefined}>
            {/* The caption names the logo, so the image itself is decorative. */}
            <Image src={logo.logo} alt="" width={360} height={240} sizes="(min-width: 992px) 240px, 45vw" />
          </span>
        );
        return (
          <li key={logo.name}>
            <figure>
              {logo.href ? (
                <a href={logo.href} target="_blank" rel="noopener noreferrer" aria-label={logo.name}>
                  {tile}
                </a>
              ) : (
                tile
              )}
              <figcaption>{logo.name}</figcaption>
            </figure>
          </li>
        );
      })}
    </ul>
  );
}
