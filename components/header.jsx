"use client";
import { BellDot, ExternalLink, LogOut, Plus } from "lucide-react";
import { Button } from "./ui/button";
import Logo from "./logo";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { signOut } from "@/server/user";
import {
    Credenza,
    CredenzaBody,
    CredenzaClose,
    CredenzaContent,
    CredenzaDescription,
    CredenzaFooter,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from "@/components/ui/credenza";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

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
                    <Credenza>
                        <CredenzaTrigger asChild>
                            <Button size="icon" className="h-9 w-9" variant="outline"><BellDot className="h-4 w-4" /></Button>
                        </CredenzaTrigger>
                        <CredenzaContent>
                            <CredenzaHeader>
                                <CredenzaTitle>Notifications</CredenzaTitle>
                                <CredenzaDescription>
                                    Activity notifications and more.
                                </CredenzaDescription>
                            </CredenzaHeader>
                            <ScrollArea className="mb-4">
                                <CredenzaBody className="min-h-32 max-h-[340px]">
                                    <div className="grid gap-4 max-h-[340px]">
                                        {Array.from({ length: 20 }).map((_, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <p className="text-foreground/80"><span className="text-foreground">User1</span> commented on your poll</p>
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                        ))}
                                    </div>
                                </CredenzaBody>
                            </ScrollArea>
                        </CredenzaContent>
                    </Credenza>
                </div>
            )}
        </header>
    )
};
