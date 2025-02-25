import Link from "next/link";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Check, Heart, MessageCircleMoreIcon, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const handleShare = (title, id) => {
    try {
        window.navigator.share({
            title: title,
            text: title,
            url: `${window.location.origin}/poll/${id}`,
        });
    }
    catch (e) {
        toast.error("Copied link to clipboard!");
        navigator.clipboard.writeText(`${window.location.origin}/poll/${id}`);
    }
}
export default function Poll({ poll, loading, userVoteIndex, handlePollClick, handleLikeClick, user, titleClassName }) {
    const options = Array.isArray(poll?.options) ? poll.options.filter(Boolean) : [];
    const totalClicks = options.reduce((acc, curr) => acc + (curr.clicks || 0), 0);

    return (
        <div className="masonry-item sm:border-border sm:border sm:p-4 sm:rounded-md sm:!h-fit border-b pb-6">
            <Link className={cn("text-xl font-medium", titleClassName)} href={`/poll/${poll.id}`}>
                {poll?.title}
            </Link>
            <div className="flex items-center gap-2 mt-1">
                <h1 className="text-sm text-foreground/80">
                    by{" "}
                    <Link className="text-foreground hover:underline" href={`/@${poll?.username}`}>
                        @{poll?.username}
                    </Link>
                </h1>
                <p className="text-sm text-foreground/80">
                    {poll?.created_at
                        ? new Date(poll.created_at).toLocaleString("default", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : ""}
                </p>
            </div>
            <div className="grid gap-2 mt-5">
                {options.filter(option => Boolean(option.content)).map((option, index) => {
                    const percent = totalClicks > 0 ? Math.floor((option.clicks / totalClicks) * 100) : 0;
                    return (
                        <Button
                            disabled={loading}
                            onClick={() => handlePollClick(poll.id, index)}
                            variant="outline"
                            key={index}
                            className="flex gap-2 items-center justify-between relative z-10 bg-none after:rounded-md after:h-full after:absolute after:bottom-0 after:left-0 after:-z-10 after:bg-secondary after:w-[var(--vote-width)]"
                            style={{
                                "--vote-width": `${totalClicks > 0 ? Math.max(1, percent) : 0}%`,
                            }}
                        >
                            <div className="flex items-center gap-2">
                                {userVoteIndex === index && <Check className="h-4 w-4" />}
                                <p className="text-sm">{option.content}</p>
                            </div>
                            {loading ? (
                                <Skeleton className="h-3 w-5" />
                            ) : (
                                <p className="text-sm opacity-80">{percent}%</p>
                            )}
                        </Button>
                    );
                })}
            </div>
            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                    <Button
                        className="h-8 px-3 rounded-full"
                        variant={"outline"}
                        onClick={() => handleLikeClick(poll.id)}
                    >
                        <Heart className={cn("h-4 w-4", poll?.likes?.includes(user?.user?.id) && "fill-primary")} />
                        {poll?.likes?.length || 0}
                    </Button>
                    <Button className="h-8 px-3 rounded-full" variant="outline" asChild>
                        <Link href={`/poll/${poll.id}`}>
                            <MessageCircleMoreIcon className="h-4 w-4" />
                            {poll?.comments?.length || 0}
                        </Link>
                    </Button>
                </div>
                <div>
                    <Button onClick={() => { handleShare(poll.title, poll.id) }} className="h-8 px-3 rounded-full gap-2" variant="outline">Share <Share2 className="h-3 w-3" /></Button>
                </div>
            </div>
        </div>
    );
}
