import ScrollUp from "@/components/Common/ScrollUp";
import ClosingCTA from "@/components/site/ClosingCTA";
import { DISCORD_URL } from "@/components/site/links";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import TeamBoards, { BoardGroup } from "./components/TeamBoards";

export const metadata: Metadata = {
  title: "Our Team | UF DSI",
  description: "Meet the dedicated team members of the UF Data Science and Informatics student organization",
};

// board.year is the spring year of the school year: 2027 is the 2026-27 board.
const CURRENT_YEAR = 2027;

// Executive board in the order they appear, matched on the role text.
const execOrder: RegExp[] = [
  /^(co-)?president/i,
  /internal|vice|\bvp\b/i,
  /treasurer/i,
  /workshop/i,
  /networking/i,
  /secretary/i,
  /project/i,
  /research/i,
];
const execRank = (role: string) => {
  const index = execOrder.findIndex((pattern) => pattern.test(role));
  return index === -1 ? execOrder.length : index;
};

// Coordinator teams in the order they appear on the page; any other role follows.
const coordinatorOrder = [
  "Technology",
  "Workshop",
  "Marketing",
  "Sponsorship",
  "Networking",
  "Event",
  "Hackathon",
  "Research",
];

const TeamPage = async () => {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { data } = await supabase
    .from("board")
    .select()
    .eq("year", CURRENT_YEAR)
    .order("created_at");
  const board = data ?? [];

  const toMember = (row: any, showRole: boolean) => ({
    name: row.name,
    role: showRole ? row.role : undefined,
    linkedin: row.linkedin,
    // Not a board column yet; shows the mail icon once one is added.
    email: row.email,
    image: row.headshot,
  });

  const groups: BoardGroup[] = [];
  // sort is stable, so people sharing a role (the co-presidents) keep their database order
  const execs = board.filter((row) => row.exec).sort((a, b) => execRank(a.role) - execRank(b.role));
  if (execs.length > 0) {
    groups.push({ title: "Executive Board", members: execs.map((row) => toMember(row, true)) });
  }

  const rank = (role: string) => {
    const index = coordinatorOrder.findIndex((team) => role.startsWith(team));
    return index === -1 ? coordinatorOrder.length : index;
  };
  const roles = Array.from(new Set(board.filter((row) => !row.exec).map((row) => row.role as string)));
  for (const role of roles.sort((a, b) => rank(a) - rank(b))) {
    groups.push({
      title: `${role}s`,
      members: board.filter((row) => !row.exec && row.role === role).map((row) => toMember(row, false)),
    });
  }

  return (
    <main>
      <ScrollUp />

      <section className="site-hero" aria-labelledby="team-title">
        <div className="site-wrap site-hero__grid site-hero__grid--center">
          <div className="site-hero__copy">
            <p className="site-label">The team</p>
            <h1 id="team-title" className="site-h1" style={{ maxWidth: "16ch" }}>
              Run by students, for students.
            </h1>
            <p className="site-lede">
              {board.length > 0
                ? `${board.length} students run DSI this year: an executive board and ${groups.filter((g) => g.title !== "Executive Board").length} coordinator teams behind every workshop, project and symposium.`
                : "An executive board and coordinator teams run every workshop, project and symposium."}
            </p>
            <div className="site-hero__actions">
              <a href="#executive-board" className="site-btn site-btn--primary">
                Meet the board <span className="site-arrow" aria-hidden="true">↓</span>
              </a>
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="site-btn site-btn--ghost">
                Join the Discord
              </a>
            </div>
          </div>
          <figure className="site-plate">
            <div className="site-plate__frame site-plate__frame--wide">
              <Image
                src="/images/symposium-26/filler/6.jpg"
                alt="About twenty DSI organizers with name badges standing in a hallway beside a DSI Spring Symposium 2025 banner"
                width={1200}
                height={675}
                sizes="(min-width: 992px) 48vw, 100vw"
                priority
              />
            </div>
          </figure>
        </div>
      </section>

      <TeamBoards groups={groups} />

      <ClosingCTA />
    </main>
  );
};

export default TeamPage;
