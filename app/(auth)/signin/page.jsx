"use client";

import { AuthContext } from "@/components/auth-context";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { signinUser } from "@/server/user";
import { ChevronLeft, FileJson, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const [username, setUsername] = useState("");
    const [hash, setHash] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const router = useRouter();

    const handleFileSelect = (e) => {
        if (e.target.files.length == 0) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async (e) => {
            try {
                setLoading2(true);
                const data = JSON.parse(e.target.result);
                let username = data.username;
                let hash = data.hash;
                setSelectedFile({ name: file.name, isValid: data.username && data.hash });
                let res = await signinUser({ username, hash });
                let resData = JSON.parse(res);
                if (resData.success) {
                    toast.success("Signed in successfully!");
                    router.push("/");
                }
                else {
                    toast.error(resData.error);
                }
            }
            catch (err) {
                toast.error("Invalid hash file!");
                setSelectedFile(null);
                e.target.value = '';
            }
            setLoading2(false);
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
                router.push("/");
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

    const user = useContext(AuthContext);
    useEffect(() => {
        if (user.user) {
            router.push("/");
        }
    }, [user]);
    return (
        <main className="w-full max-w-md">
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
                <p className="text-base max-w-xs text-foreground/80 -mt-2.5">Signin to your anonymous account to continue.
                    Don't have an account? <Link className="text-foreground underline" href="/signup">SignUp</Link></p>
            </div>
            <div className="mt-10">
                <form onSubmit={handleSignin} className="grid gap-2">
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
                    <Button type="submit" className="mt-2" disabled={loading || loading2}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}</Button>
                </form>
                <div className="mt-5 grid gap-4">
                    <p className="text-sm text-center text-foreground/80">Or</p>
                    <Button asChild variant={loading2 ? "outline" : "secondary"} disabled={loading2 || loading}>
                        <Label htmlFor="hashFile" className="flex items-center justify-center gap-2">{loading2 ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileJson className="h-4 w-4" />} {loading2 ? "" : "Continue with hash file"}</Label>
                    </Button>
                    <Input multiple={false} onChange={handleFileSelect} className="hidden" type="file" accept=".json" id="hashFile" name="hashFile" />
                </div>
            </div>
        </main>
    )
}