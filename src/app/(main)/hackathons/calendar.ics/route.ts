import { hackathons, toIcs } from "@/lib/hackathons";

export const revalidate = 3600;

export function GET() {
  return new Response(toIcs(hackathons), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="ufdsi-hackathons.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
