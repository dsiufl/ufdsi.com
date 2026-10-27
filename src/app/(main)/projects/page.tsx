import ClosingCTA from "@/components/site/ClosingCTA";
import Reveal from "@/components/site/Reveal";
import { DISCORD_URL } from "@/components/site/links";
import { createPublicClient } from "@/lib/supabase/public";
import { Project } from "@/types/db";
import { Metadata } from "next";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects | UF DSI",
  description:
    "Student-driven data science and AI projects at the University of Florida.",
};

const faq = [
  {
    q: "What are DSI projects?",
    a: "Student-led projects in data science and AI. They are a way to build real skills for research and industry, and project teams can get access to the HiPerGator supercomputer.",
  },
  {
    q: "Who can join?",
    a: "Anyone who meets the project lead's requirements. Those are usually light, since projects are meant for learning.",
  },
  {
    q: "How do I get involved?",
    a: "Pick a project below and contact its lead.",
  },
];

export default async function ProjectsPage() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at");
  if (error) throw new Error(`Projects: ${error.message}`);
  const projects = (data ?? []) as Project[];

  return (
    <main>
      <section className="site-intro" aria-labelledby="projects-title">
        <div className="site-wrap">
          <p className="site-label">Projects</p>
          <h1
            id="projects-title"
            className="site-h1"
            style={{ maxWidth: "16ch" }}
          >
            Build something real.
          </h1>
          <p className="site-lede">
            Student-driven research and engineering projects in data science and
            AI. Each one has a lead and room for more people.
          </p>
        </div>
      </section>

      <section
        className="site-section site-section--tight"
        aria-labelledby="current-title"
      >
        <div className="site-wrap">
          <Reveal className="site-head">
            <h2 id="current-title" className="site-h2 site-h2--small">
              This year&rsquo;s projects.
            </h2>
          </Reveal>
          <Reveal>
            {projects.length > 0 ? (
              <ul className="site-rows">
                {projects.map((project, i) => (
                  <li key={project.id} className="site-row">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="site-row__inner site-row__inner--index"
                    >
                      <span className="site-row__meta">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <h3 className="site-h3">{project.title}</h3>
                        <p>{project.description?.trim()}</p>
                        {project.lead && (
                          <span className="site-row__lead">
                            Led by {project.lead}
                          </span>
                        )}
                      </span>
                      <span className="site-row__action">
                        Code{" "}
                        <span className="site-arrow" aria-hidden="true">
                          →
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="site-empty">
                This year&rsquo;s projects will be listed here soon.
              </p>
            )}
          </Reveal>
        </div>
      </section>

      <section
        className="site-section site-section--tight"
        aria-labelledby="faq-title"
      >
        <div className="site-wrap">
          <div style={{ maxWidth: 820 }}>
            <Reveal className="site-head">
              <h2 id="faq-title" className="site-h2 site-h2--small">
                Questions.
              </h2>
            </Reveal>
            <Reveal>
              <div className="site-faq">
                {faq.map((item) => (
                  <details key={item.q}>
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
              <p className="site-body" style={{ marginTop: 24 }}>
                Still unsure?{" "}
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
                  Ask in the Discord
                </a>
                .
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <ClosingCTA />
    </main>
  );
}
