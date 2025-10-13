import ScrollUp from "@/components/Common/ScrollUp";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UF DSI",
  description: "University of Florida Data Science and Informatics Club",
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <Features />
    </>
  );
}
