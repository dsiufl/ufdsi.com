import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | UF DSI",
  description: "Learn more about the University of Florida Data Science and Informatics student organization",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 