import SymposiumNew from "@/components/symposium-new";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Symposium - UF DSI",
  description: "DSI's annual spring symposium.",
};

const SymposiumNewPage = () => {
  return (
    <>
      <SymposiumNew />
    </>
  );
};

export default SymposiumNewPage;
