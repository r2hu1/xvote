import Header from "@/components/header";
import Menu from "@/components/menu";

export default function RootLayout({ children }) {
    return (
        <main>
            <Header />
            {children}
            <Menu />
        </main>
    )
}