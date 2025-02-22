import Link from "next/link";
import Logo from "./logo";

export default function Footer() {
    return (
        <footer className="px-6 pb-5 mt-14 z-50 relative md:px-20 lg:px-32 bg-background">
            <div className="grid gap-2">
                <Logo />
                <p className="text-sm text-foreground/80">Open-source end-to-end encrypted anonymous polling app</p>
                <div className="flex items-center gap-2">
                    <Link href="https://github.com/r2hu1/xvote">Fork</Link>
                    <Link href="https://github.com/r2hu1/xvote">Star</Link>
                    <Link href="https://github.com/r2hu1/">Follow</Link>
                    <Link href="https://github.com/sponsors/r2hu1">Donate</Link>
                </div>
            </div>
        </footer>
    )
}