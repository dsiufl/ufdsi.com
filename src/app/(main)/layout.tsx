import "@/styles/site.css";

import Footer from "@/components/Footer";
import NewHeader from "@/components/NewHeader";
import { Metadata } from "next";

// Absolute base for canonical links and share images.
export const metadata: Metadata = {
  metadataBase: new URL("https://ufdsi.com"),
};

export default function Layout({children}) {
    return (
        <div className="site flex flex-col min-h-screen">
            <NewHeader />
             {children}
            <Footer />
        </div>
    )
}
