"use client"

import { Home, Loader2, RefreshCcw, Search, User } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"

export default function Menu() {
    return (
        <div className="fixed z-10 bottom-4 left-4 right-4 flex items-center justify-center">
            <div className="bg-background overflow-hidden border border-border rounded w-fit flex">
                <Button className="rounded-none" variant="ghost" asChild>
                    <Link href="/">
                        <Home className="h-4 w-4" />
                    </Link>
                </Button>
                <Button className="rounded-none" variant="ghost" asChild>
                    <Link href="/">
                        <Search className="h-4 w-4" />
                    </Link>
                </Button>
                <Button className="rounded-none" variant="ghost" asChild>
                    <Link href="/">
                        <User className="h-4 w-4" />
                    </Link>
                </Button>
                <Button className="rounded-none" variant="ghost" asChild>
                    <Link href="/">
                        <RefreshCcw className="h-4 w-4" />
                    </Link>
                </Button>
            </div>
        </div>
    )
}