import Header from "@/components/header";

export default function RootLayout({ children }) {
    return (
        <main>
            <Header />
            {children}
        </main>
    )
}