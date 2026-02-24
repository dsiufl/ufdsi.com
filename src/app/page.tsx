import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import CompaniesWorked from "@/components/CompaniesWorked";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UF DSI – Data Science & Informatics at the University of Florida",
  description:
    "Join the University of Florida's premier data science student organization. UF DSI offers free workshops, networking events, and research opportunities in data science, machine learning, and AI for all UF students since 2015.",
  alternates: {
    canonical: "https://ufdsi.com",
  },
  openGraph: {
    title: "UF DSI – Data Science & Informatics at the University of Florida",
    description:
      "Join the University of Florida's premier data science student organization. Free workshops, networking events, and research opportunities in data science, machine learning, and AI for all UF students.",
    url: "https://ufdsi.com",
  },
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Stats />
      <CompaniesWorked />
    </>
  );
}
