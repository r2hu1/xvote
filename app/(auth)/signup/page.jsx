"use client";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { createUser } from "@/server/createUser";
import { ChevronLeft, Copy, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const [username, setUsername] = useState("");
    const [hash, setHash] = useState("");
    const [loading, setLoading] = useState(false);

    const createHash = (e) => {
        setUsername(e.slice(0, 10));
        if (e == "") return setHash("");
        let uArr = e.split("");
        let chars = "abcdefghijklmnopqrstuvwxyz".split("");
        let num = "1234567890".split("");
        let symbl = "!@#$%^&*".split("");
        let h = "";
        for (let i = 0; i < 10; i++) {
            let char = chars[Math.floor(Math.random() * chars.length)];
            let numm = num[Math.floor(Math.random() * num.length)];
            let sym = symbl[Math.floor(Math.random() * symbl.length)];
            uArr.splice(Math.floor(Math.random() * uArr.length), 0, char);
            uArr.splice(Math.floor(Math.random() * uArr.length), 0, numm);
            uArr.splice(Math.floor(Math.random() * uArr.length), 0, sym);
            h = uArr.join("");
        }
        setHash(h);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (username == "" || hash == "") {
            toast.error("Please enter your username and hash");
            return;
        }
        setLoading(true);
        try {
            let res = await createUser({ username, hash });
            let data = JSON.parse(res);
            if (data.success) {
                downloadHash();
                toast.success("Signed up successfully!");
            }
            else {
                toast.error(data.error);
            }
        }
        catch (e) {
            toast.error(e.message);
        };
        setUsername("");
        setHash("");
        setLoading(false);
    };

    const downloadHash = () => {
        if (username == "" || hash == "") {
            toast.error("Please enter your username and hash");
            return;
        }
        try {
            const data = JSON.stringify({
                username: username,
                hash: hash,
                downloadedAt: new Date().toLocaleString()
            });
            const file = new Blob([data], { type: "application/json" });
            const fileURL = URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = fileURL;
            link.download = `${username}-hash.json`;
            link.click();
            toast.success("Hash downloaded successfully!");
            navigator.clipboard.writeText(hash);
        }
        catch (e) {
            toast.error("Something went wrong");
        }
    };

    return (
        <main>
            <div className="grid gap-3">
                <div className="flex items-center justify-between">
                    <Logo />
                    <Button title="back to homepage" variant="outline" size="icon" className="h-8 w-8" asChild>
                        <Link href="/">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                <h1 className="text-xl font-medium mt-2">Nice to see you</h1>
                <p className="text-base max-w-xs text-foreground/80 -mt-2.5">Create a anonymous account to continue using xvote.</p>
            </div>
            <div className="mt-10">
                <form onSubmit={handleSignup} className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input minLength="5" maxLength="10" onChange={(e) => { createHash(e.target.value) }} value={username} onFocus={(e) => { e.target.placeholder = "" }} onBlur={(e) => { e.target.placeholder = "Anonymous-user-1" }} autoComplete="off" id="username" name="username" placeholder="Anonymous-user-1" />
                    <Label htmlFor="hash" className="mt-2">Hash</Label>
                    <div className="flex items-center gap-2">
                        <Input readOnly value={hash} id="hash" name="hash" placeholder="**********" />
                        <Button onClick={downloadHash} type="button" size="icon" className="min-w-10" disabled={hash == "" || username.length < 5}><Save className="h-4 w-4" /></Button>
                    </div>
                    <div>
                        <Popover>
                            <PopoverTrigger>
                                <p className="text-sm text-foreground/80 hover:underline">What is hash?</p>
                            </PopoverTrigger>
                            <PopoverContent className="text-sm -mr-20">An encrypted digital password created and linked with your username. It will be only shown once, Make sure to copy and store it safely.</PopoverContent>
                        </Popover>
                    </div>
                    <Button disabled={loading} type="submit" className="mt-2">{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}</Button>
                </form>
            </div>
        </main>
    )
}