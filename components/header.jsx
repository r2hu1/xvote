"use client";
import { LogOut, Plus } from "lucide-react";
import { Button } from "./ui/button";
import Logo from "./logo";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "./auth-context";
import { signOut } from "@/server/signOut";

export default function Header() {
    const user = useContext(AuthContext);

    const handleLogout = () => {
        signOut();
        window.location.reload();
    }
    return (
        <header className="flex items-center justify-between px-6 md:px-20 lg:px-32 py-5">
            <Logo />
            {!user.user ? (
                <div className="flex items-center gap-2">
                    <Button className="rounded h-9 px-4" asChild>
                        <Link href="/signin">SignIn</Link>
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Button className="rounded h-9 px-4" asChild>
                        <Link href="/new">Create</Link>
                    </Button>
                    <Button onClick={handleLogout} className="rounded h-9 w-9" size="icon" variant="outline"><LogOut className="h-3 w-3" /></Button>
                </div>
            )}
        </header>
    )
};
