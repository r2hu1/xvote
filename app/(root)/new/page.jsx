"use client";

import { AuthContext } from "@/components/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createPoll } from "@/server/poll";
import { Loader2, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const router = useRouter();
    const user = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user.user) {
            router.push("/");
        }
    }, [user, router]);

    const [options, setOptions] = useState(0);

    const addOption = () => {
        setOptions((prev) => (prev < 2 ? prev + 1 : prev));
    };

    const removeOption = () => {
        setOptions((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        setLoading(true);
        let title = e.target.title.value;
        let tags = e.target.tags.value.split(",");
        let optionsArray = [
            {
                content: e.target.option1.value,
                clicks: 0
            },
            {
                content: e.target.option2.value,
                clicks: 0
            },
            {
                content: options >= 1 && e.target.option3.value,
                clicks: 0
            },
            {
                content: options === 2 && e.target.option4.value,
                clicks: 0
            }
        ];

        let res = await createPoll({
            username: user.user.username,
            author: user.user.id,
            title,
            options: optionsArray,
            tags,
        });
        let data = JSON.parse(res);
        if (data.success) {
            toast.success("Poll published successfully!");
            router.push(`/poll/${data.id}`);
        } else {
            toast.error(data.error);
        }
        setLoading(false);
    };

    return (
        <main className="px-6 py-10 mb-10 md:px-20 lg:px-32">
            <div className="grid gap-2 max-w-md">
                <h1 className="text-lg font-medium">Drafting an Anonymous Poll</h1>
                <p className="text-foreground/80 text-sm">
                    It’s fully secure and anonymous. No one can see your real identity, so you can make a poll about anything you want!
                </p>
            </div>
            <div className="mt-10">
                <form onSubmit={handlePublish} className="grid gap-2 max-w-2sxl">
                    <Label htmlFor="title">Title</Label>
                    <Textarea required maxLength={100} name="title" id="title" placeholder="Who will win, McGregor or Ronaldo?" className="bg-background" />
                    <div className="flex items-center justify-between mt-3 mb-1">
                        <Label>Options</Label>
                        <div className="flex items-center gap-2">
                            {options < 2 && (
                                <Button className="!w-fit h-4 p-0" onClick={addOption} type="button">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            )}
                            {options > 0 && (
                                <Button className="!w-fit h-4 p-0" onClick={removeOption} type="button">
                                    <Minus className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="grid mb-3 gap-2 md:grid-cols-2">
                        <Input maxLength={50} name="option1" placeholder="Option 1" required />
                        <Input maxLength={50} name="option2" placeholder="Option 2" required />
                        <Input maxLength={50} name="option3" placeholder="Option 3" className={options >= 1 ? "block" : "hidden"} required={options >= 1} />
                        <Input maxLength={50} name="option4" placeholder="Option 4" className={options === 2 ? "block" : "hidden"} required={options === 2} />
                    </div>
                    <Label htmlFor="tags">Tags (optional)</Label>
                    <Input name="tags" id="tags" type="text" placeholder="Add tags separated by commas ," />
                    <Button type="submit" className="mt-3" disabled={loading}>{loading ? <Loader2 className="mr-2 animate-spin" /> : "Publish"}</Button>
                </form>
            </div>
        </main>
    );
}
