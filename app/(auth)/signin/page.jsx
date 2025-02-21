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
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
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
            <div className="mt-10">
                <form className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input autocomplete="off" id="username" name="username" placeholder="Anonymous-user-1" />
                    <Label htmlFor="hash" className="mt-2">Hash</Label>
                    <Input autocomplete="off" id="hash" name="hash" placeholder="*******" />
                    <div>
                        <Popover>
                            <PopoverTrigger>
                                <p className="text-sm text-foreground/80 hover:underline">Forgot your account details?</p>
                            </PopoverTrigger>
                            <PopoverContent className="text-sm -mr-20">Its encrypted we can't help you with that. Maybe create a new account?!</PopoverContent>
                        </Popover>
                    </div>
                    <Button type="submit" className="mt-2">Continue</Button>
                </form>
            </div>
        </main>
    )
}