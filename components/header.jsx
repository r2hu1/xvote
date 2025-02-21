"use client";
import { LogOut, Plus } from "lucide-react";
import { Button } from "./ui/button";
import Logo from "./logo";
import { signOut } from "@/server/signOut";
import CheckAuth from "./checkAuth";
import Link from "next/link";

export default function Header() {
    const handleLogout = () => {
        signOut();
        window.location.reload();
    }
    return (
        <header className="flex items-center justify-between px-6 md:px-20 lg:px-32 py-5">
            <Logo />
            <CheckAuth ifA={
                <div className="flex items-center gap-2">
                    <Button className="rounded h-9 px-4">Create</Button>
                    <Button onClick={handleLogout} className="rounded h-9 w-9" size="icon" variant="outline"><LogOut className="h-3 w-3" /></Button>
                </div>
            }>
                <div className="flex items-center gap-2">
                    <Button className="rounded h-9 px-4" asChild>
                        <Link href="/signin">SignIn</Link>
                    </Button>
                </div>
            </CheckAuth>
        </header>
    )
};