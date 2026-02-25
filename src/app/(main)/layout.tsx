import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewHeader from "@/components/NewHeader";

export default function Layout({children}) {
    return (
        <>
            <NewHeader />
             {children}
            <Footer />
        </>
    )
}