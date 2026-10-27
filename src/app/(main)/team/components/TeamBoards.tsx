import { Mail } from "lucide-react";

export interface TeamMember {
  name: string;
  role?: string;
  linkedin?: string;
  email?: string;
  image?: string;
}

export interface BoardGroup {
  title: string;
  members: TeamMember[];
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

// LinkedIn "in" mark with no background: Font Awesome Free 6.7.2 (linkedin-in),
// https://fontawesome.com, icons licensed CC BY 4.0.
const LinkedInMark = () => (
  <svg viewBox="0 0 448 512" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
  </svg>
);

const slug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <li className="site-member">
      <div className="site-member__frame">
        {member.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.image} alt="" loading="lazy" width={320} height={400} />
        ) : (
          <span className="site-member__blank" aria-hidden="true">{initials(member.name)}</span>
        )}
      </div>
      <h3 className="site-member__name">{member.name}</h3>
      {member.role && <p className="site-member__role">{member.role}</p>}
      {(member.email || member.linkedin) && (
        <div className="site-member__links">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="site-member__link"
              aria-label={`${member.name} on LinkedIn`}
            >
              <LinkedInMark />
            </a>
          )}
          {member.email && (
            <a href={`mailto:${member.email}`} className="site-member__link" aria-label={`Email ${member.name}`}>
              <Mail size={18} strokeWidth={1.75} aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </li>
  );
}

const people = (n: number) => `${n} ${n === 1 ? "person" : "people"}`;

export default function TeamBoards({ groups }: { groups: BoardGroup[] }) {
  if (groups.length === 0) {
    return (
      <section className="site-board" aria-label="Board members">
        <div className="site-wrap">
          <p className="site-board__empty">The current board could not be loaded. Try again in a moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="site-board" aria-label="Board members">
      <nav className="site-board__nav" aria-label="Teams">
        <div className="site-wrap">
          <ul>
            {groups.map((group) => (
              <li key={group.title}>
                <a href={`#${slug(group.title)}`}>
                  {/* The list already reads as teams; "Technology" is enough here. */}
                  {group.title.replace(/ Coordinators$/, "")}
                  <span>{group.members.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="site-wrap">
        {groups.map((group, i) => (
          <section key={group.title} id={slug(group.title)} className="site-board__group" aria-labelledby={`${slug(group.title)}-title`}>
            <h2 id={`${slug(group.title)}-title`} className="site-board__title">
              {group.title}
              <span>{people(group.members.length)}</span>
            </h2>
            <ul className={i === 0 ? "site-members site-members--lead" : "site-members"}>
              {group.members.map((member) => (
                <MemberCard key={member.name} member={member} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
