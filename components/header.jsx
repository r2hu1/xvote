"use client";
import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import Logo from "./logo";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "./auth-context";
import { signOut } from "@/server/user";

export default function Header() {
    const user = useContext(AuthContext);

    const handleLogout = () => {
        signOut();
        window.location.reload();
    };
    return (
        <header className="flex items-center justify-between px-6 md:px-20 lg:px-32 py-5">
            <Logo />
            {!user?.user?.id ? (
                <div className="flex items-center gap-2">
                    <Button className="h-9 px-4" asChild>
                        <Link href="/signin">SignIn</Link>
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Button className="h-9 px-4" asChild>
                        <Link href="/new">Create</Link>
                    </Button>
                    <Button size="icon" variant="outline" onClick={handleLogout}><LogOut className="h-4 w-4" /></Button>
                </div>
            )}
        </header>
    )
};
