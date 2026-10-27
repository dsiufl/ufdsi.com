import { formatDay } from "@/lib/symposia";
import { ImageResponse } from "next/og";
import { loadSymposium } from "./data";

export const revalidate = 300;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DSI Symposium, University of Florida";

// The card shown when a symposium link is shared: year, date and place on the
// site's night background.
export default async function Image({ params }: { params: Promise<{ year: string }> }) {
  const data = await loadSymposium((await params).year);
  const year = data?.year ?? (await params).year;
  const when = data?.date ? formatDay(data.date) : `Spring ${year}`;
  const where = data?.config.venue ? `${data.config.venue.name}, University of Florida` : "University of Florida, Gainesville";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#141b33",
          color: "#f6f1ea",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: "#ff5722" }}>
          UF DSI Research Symposium
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 150, fontWeight: 700, lineHeight: 0.95, letterSpacing: -6 }}>Symposium</div>
          <div style={{ display: "flex", fontSize: 150, fontWeight: 700, lineHeight: 0.95, letterSpacing: -6, color: "#8fa8ff" }}>
            {String(year)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 34, color: "rgba(246,241,234,0.78)" }}>
          <div style={{ display: "flex" }}>{when}</div>
          <div style={{ display: "flex" }}>{where}</div>
        </div>
      </div>
    ),
    size,
  );
}
