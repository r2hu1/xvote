export default function RootLayout({ children }) {
    return (
        <main className="flex items-center justify-center px-6 h-full w-full py-20">
            {children}
        </main>
    )
}