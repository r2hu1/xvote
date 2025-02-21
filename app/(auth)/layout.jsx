export default function RootLayout({ children }) {
    return (
        <main className="flex items-center justify-center px-6 h-full w-full left-0 right-0 absolute">
            {children}
        </main>
    )
}