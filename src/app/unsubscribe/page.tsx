import ScrollUp from "@/components/Common/ScrollUp";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unsubscribe from DSI Newsletter",
  description: "Unsubscribe from the UF Data Science and Informatics newsletter.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnsubscribePage() {
  return (
    <section>
      <h1 className="flex justify-center">Unsubscribe</h1>
      <div className="flex justify-center">
        <div className="flex flex-col py-5 text-center gap-5">
          <div className="flex flex-col items-center max-w-[800px]">
            <p>We're sorry to see you go. Please click the link below to unsubscribe from The DSI Newsletter. <strong>Note that this link will only work if you are connected on UF wifi or are using the UF VPN.</strong></p>
            <a className="button" href="https://lists.ufl.edu/cgi-bin/wa?SUBED1=AIIRIDSI&A=1">Unsubscribe from DSI Newsletter</a>
          </div>
          <div className="w-full h-[1px] bg-gray-400 m-4"> </div>
          <div className="flex flex-col items-center gap-8 max-w-[800px]">
            <div>
              <h3>Having trouble unsubscribing?</h3>
              <p className="mb-0">If the link does not work, compose an email to <a className="link" href="mailto:listserv@lists.ufl.edu">listserv@lists.ufl.edu</a> with the only message being "UNSUBSCRIBE AIIRIDSI". No subject line or reason to unsubscribe is required.</p>
            </div>
            <a className="button" href="mailto:listserv@lists.ufl.edu?body=UNSUBSCRIBE AIIRIDSI">Unsubscribe via Email</a>
            <div className="w-full h-[1px] bg-gray-400 m-4"> </div>
            <p className="text-gray-400 dark:text-gray-700">If you have any continued difficulties, please email <a className="link" href="mailto:dsiufl@gmail.com">dsiufl@gmail.com</a> with the subject line "UNSUBSCRIBE" and we will manually unsubscribe you from the DSI Newsletter. You are not required to provide a reason for unsubscribing.</p>
          </div>
          <p></p>
        </div>
      </div>
    </section>
  );
}
