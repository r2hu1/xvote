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
import { cn } from "@/lib/utils";
import { getUser } from "@/server/getUser";
import { signinUser } from "@/server/signinUser";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const [username, setUsername] = useState("");
    const [hash, setHash] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileSelect = (e) => {
        if (e.target.files.length == 0) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                setUsername(data.username);
                setHash(data.hash);
                setSelectedFile({ name: file.name, isValid: data.username && data.hash });
            }
            catch (err) {
                toast.error("Invalid hash file!");
                setSelectedFile(null);
                e.target.value = '';
            }
        }
    };

    const handleSignin = async (e) => {
        e.preventDefault();
        if (username == "" || hash == "") {
            toast.error("Please enter your username and hash");
            return;
        }
        setLoading(true);
        try {
            let res = await signinUser({ username, hash });
            let data = JSON.parse(res);
            if (data.success) {
                toast.success("Signed in successfully!");
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
        setSelectedFile(null);
        setLoading(false);
    };

    const router = useRouter();
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            if (user) {
                router.push("/");
            }
        };
        fetchUser();
    }, []);
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
                <h1 className="text-xl font-medium mt-2">Welcome Back</h1>
                <p className="text-base max-w-xs text-foreground/80 -mt-2.5">Signin to your anonymous account to continue.</p>
            </div>
            <div className="mt-5">
                <form onSubmit={handleSignin} className="grid gap-2">
                    <span className="text-sm font-normal text-foreground/80">Contiue with hash file</span>
                    <Label htmlFor="hashFile" className="mb-5 border-dashed rounded h-14 text-center flex items-center justify-center border-primary border">
                        <p className="text-sm font-normal text-foreground/80">{selectedFile?.name ? selectedFile?.name : "Click to select"}</p>
                    </Label>
                    <Input multiple={false} onChange={handleFileSelect} className="hidden" type="file" accept="json" id="hashFile" name="hashFile" />
                    {!selectedFile && (
                        <>
                            <Label htmlFor="username">Username</Label>
                            <Input onChange={(e) => { setUsername(e.target.value) }} value={username} onFocus={(e) => { e.target.placeholder = "" }} onBlur={(e) => { e.target.placeholder = "Anonymous-user-1" }} autoComplete="off" id="username" name="username" placeholder="Anonymous-user-1" />
                            <Label htmlFor="hash" className="mt-2">Hash</Label>
                            <Input type="password" onChange={(e) => { setHash(e.target.value) }} value={hash} onFocus={(e) => { e.target.placeholder = "" }} onBlur={(e) => { e.target.placeholder = "**********" }} autoComplete="off" id="hash" name="hash" placeholder="**********" />
                            <div>
                                <Popover>
                                    <PopoverTrigger>
                                        <p className="text-sm text-foreground/80 hover:underline">Forgot your account details?</p>
                                    </PopoverTrigger>
                                    <PopoverContent className="text-sm -mr-20">Its encrypted we can't help you with that. Maybe create a new account?!</PopoverContent>
                                </Popover>
                            </div>
                        </>
                    )}
                    <Button type="submit" className={cn("mt-2", selectedFile && "-mt-4")} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}</Button>
                    <p className="text-sm text-foreground/80 text-center">Don't have an account? <Link className="text-foreground underline" href="/signup">SignUp</Link></p>
                </form>
            </div>
        </main>
    )
}