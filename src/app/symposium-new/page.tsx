import SymposiumNew from "@/components/symposium-new";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DSI Spring Symposium 2025",
  description:
    "Join the UF DSI Spring Symposium 2025—our annual event showcasing cutting-edge data science research and innovation at the University of Florida, with talks, posters, and networking.",
  alternates: {
    canonical: "https://ufdsi.com/symposium-new",
  },
  openGraph: {
    title: "DSI Spring Symposium 2025 | UF DSI",
    description:
      "Join the UF DSI Spring Symposium 2025—our annual event showcasing data science research and innovation at the University of Florida.",
    url: "https://ufdsi.com/symposium-new",
  },
};

const SymposiumNewPage = () => {
  return (
    <>
      <SymposiumNew />
    </>
  );
};

export default SymposiumNewPage;
