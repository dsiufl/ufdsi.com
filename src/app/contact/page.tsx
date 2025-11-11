import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Us",
};

const ContactPage = () => {
  return (
    <>
      <div className="relative z-10 overflow-hidden bg-white ">
        <div className="container relative py-16 md:py-20 lg:py-28">
          <Contact />
        </div>
      </div>
    </>
  );
};

export default ContactPage;
