import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with UF Data Science and Informatics. Reach out for partnership inquiries, workshop questions, sponsorship opportunities, or general information about DSI at the University of Florida.",
  alternates: {
    canonical: "https://ufdsi.com/contact",
  },
  openGraph: {
    title: "Contact Us | UF DSI",
    description:
      "Get in touch with UF Data Science and Informatics. Reach out for partnership inquiries, workshop questions, or sponsorship opportunities.",
    url: "https://ufdsi.com/contact",
  },
};

const ContactPage = () => {
  return (
    <>
      <div className="relative z-10 overflow-hidden bg-white">
        <div className="container relative py-16 md:py-20 lg:py-28">
          <Contact />
        </div>
      </div>
    </>
  );
};

export default ContactPage;
