import { Metadata } from "next";
import WorkshopsClient from "./WorkshopsClient";

export const metadata: Metadata = {
  title: "Workshops & Training",
  description:
    "Explore UF DSI's hands-on workshops in data science, machine learning, Python, R, SQL, PyTorch, CNNs, and more—free for all University of Florida students. Past workshop materials available on GitHub.",
  alternates: {
    canonical: "https://ufdsi.com/workshops-list",
  },
  openGraph: {
    title: "Workshops & Training | UF DSI",
    description:
      "Hands-on workshops in data science, machine learning, Python, R, SQL, PyTorch, and more—free for all University of Florida students.",
    url: "https://ufdsi.com/workshops-list",
  },
};

export default function WorkshopsPage() {
  return <WorkshopsClient />;
}
