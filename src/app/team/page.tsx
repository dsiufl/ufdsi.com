import { Metadata } from "next";
import TeamClient from "./TeamClient";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the UF Data Science and Informatics executive board and team members who lead workshops, networking events, and initiatives at the University of Florida. View boards from 2015 to present.",
  alternates: {
    canonical: "https://ufdsi.com/team",
  },
  openGraph: {
    title: "Our Team | UF DSI",
    description:
      "Meet the UF DSI executive board and team members who lead data science workshops, networking events, and initiatives at the University of Florida.",
    url: "https://ufdsi.com/team",
  },
};

export default function TeamPage() {
  return <TeamClient />;
}
