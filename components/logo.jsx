import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/">
            <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg bg-primary rounded text-primary-foreground w-8 h-8 flex items-center justify-center">X</h1>
                <h1 className="text-lg font-bold">Vote</h1>
            </div>
        </Link>
    )
}