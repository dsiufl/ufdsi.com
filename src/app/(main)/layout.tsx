import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewHeader from "@/components/NewHeader";

export default function Layout({children}) {
    return (
        <div className="flex flex-col min-h-screen">
            <NewHeader />
             {children}
            <Footer />
        </div>
    )
}