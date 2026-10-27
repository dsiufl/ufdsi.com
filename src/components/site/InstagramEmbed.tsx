import Script from "next/script";

const PROFILE_URL = "https://www.instagram.com/uf_dsi/";

// Instagram's embed.js replaces the blockquote with the live profile card.
// The blockquote content is what shows until it loads, or if it is blocked.
const InstagramEmbed = () => (
  <div aria-label="DSI on Instagram">
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={`${PROFILE_URL}?utm_source=ig_embed&utm_campaign=loading`}
      data-instgrm-version="14"
      style={{
        background: "#FFF",
        border: 0,
        borderRadius: 3,
        boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
        margin: "1px 1px 1px 0",
        maxWidth: 540,
        minWidth: 326,
        padding: 0,
        width: "calc(100% - 2px)",
      }}
    >
      <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
        UF Data Science &amp; Informatics (@uf_dsi) on Instagram
      </a>
    </blockquote>
    <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
  </div>
);

export default InstagramEmbed;
