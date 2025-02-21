"use client";

import { AuthContext } from "@/components/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Page() {
    const router = useRouter();
    const user = useContext(AuthContext);

    useEffect(() => {
        if (!user.user) {
            router.push("/");
        }
    }, [user, router]);

    // options value here represents the number of extra options
    // 0 means only Option 1 and Option 2, 1 means Option 3 is shown, 2 means Option 3 and Option 4 are shown.
    const [options, setOptions] = useState(0);

    const addOption = () => {
        setOptions((prev) => (prev < 2 ? prev + 1 : prev));
    };

    const removeOption = () => {
        setOptions((prev) => (prev > 0 ? prev - 1 : prev));
    };

    return (
        <main className="px-6 py-10 mb-10">
            <div className="grid gap-2">
                <h1 className="text-lg font-medium">Drafting an Anonymous Poll</h1>
                <p className="text-foreground/80 text-sm">
                    It’s fully secure and anonymous. No one can see your real identity, so you can make a poll about anything you want!
                </p>
            </div>
            <div className="mt-10">
                <form className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" type="text" placeholder="Who will win, McGregor or Ronaldo?" className="bg-background" />
                    <Label htmlFor="content" className="mt-2">Description</Label>
                    <Textarea id="content" placeholder="What do you ..." className="bg-background" />
                    <Label className="mt-2">Options</Label>
                    <div className="grid mb-3 gap-2">
                        <Input placeholder="Option 1" required />
                        <Input placeholder="Option 2" required />
                        {/* Option 3 is shown when options >= 1 */}
                        <Input
                            placeholder="Option 3"
                            className={options >= 1 ? "block" : "hidden"}
                            required={options >= 1}
                        />
                        {/* Option 4 is shown when options === 2 */}
                        <Input
                            placeholder="Option 4"
                            className={options === 2 ? "block" : "hidden"}
                            required={options === 2}
                        />
                        <div className="flex items-center mt-1 justify-end gap-2">
                            {options < 2 && (
                                <Button className="!w-fit h-8 px-2 gap-2 rounded-full" onClick={addOption} type="button">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            )}
                            {options > 0 && (
                                <Button className="!w-fit h-8 px-2 gap-2 rounded-full" onClick={removeOption} type="button">
                                    <Minus className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                    <Button type="submit">Publish</Button>
                </form>
            </div>
        </main>
    );
}
