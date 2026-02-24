import SymposiumSchedule from "@/components/symposium/index";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DSI Symposium",
  description:
    "The UF DSI Annual Symposium brings together data science researchers, students, and industry professionals at the University of Florida for talks, networking, and collaboration.",
  alternates: {
    canonical: "https://ufdsi.com/symposium",
  },
  openGraph: {
    title: "DSI Symposium | UF DSI",
    description:
      "The UF DSI Annual Symposium brings together data science researchers, students, and industry professionals at the University of Florida.",
    url: "https://ufdsi.com/symposium",
  },
};

export default function SymposiumPage() {
  return <SymposiumSchedule />;
}
