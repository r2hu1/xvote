import Link from "next/link";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Check, Heart, MessageCircleMoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Poll({ poll, loading, userVoteIndex, totalClicks, handlePollClick, handleLikeClick, user }) {
    return (
        <div key={poll.id} className="mb-8 border-border border p-4 rounded">
            <Link className="text-xl font-medium" href={`/poll/${poll.id}`}>
                {poll?.title}
            </Link>
            <div className="flex items-center gap-2 mt-1">
                <h1 className="text-sm text-foreground/80">
                    by{" "}
                    <Link className="text-foreground hover:underline" href={`/@${poll?.username}`}>
                        {poll?.username}
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
            <div className="grid gap-2 mt-3">
                {poll?.options.filter(Boolean).map((option, index) => (
                    <Button
                        disabled={loading}
                        onClick={() => handlePollClick(poll.id, index)}
                        variant={"outline"}
                        key={index}
                        className="flex gap-2 items-center justify-between relative z-10 bg-none after:rounded after:h-full after:absolute after:bottom-0 after:left-0 after:-z-10 after:bg-secondary after:w-[var(--vote-width)]"
                        style={{ "--vote-width": `${totalClicks > 0 ? (1, ((option.clicks / totalClicks) * 100) | 0) : 0}%` }}
                    >
                        <div className="flex items-center gap-2">
                            {userVoteIndex === index && <Check className="h-4 w-4" />}
                            <p className="text-sm">{option.content}</p>
                        </div>
                        {loading ? (
                            <Skeleton className="h-3 w-5" />
                        ) : (
                            <p className="text-sm opacity-80">
                                {totalClicks > 0 ? ((option.clicks / totalClicks) * 100) | 0 : 0}%
                            </p>
                        )}
                    </Button>
                ))}
            </div>
            <div className="flex items-center justify-end mt-3">
                <div className="flex items-center gap-2">
                    <Button
                        className="h-8 px-3 rounded-full"
                        variant={poll?.likes.includes(user?.user?.id) ? "default" : "outline"}
                        onClick={() => handleLikeClick(poll.id)}
                    >
                        <Heart
                            className={cn("h-4 w-4", poll?.likes.includes(user?.user?.id) && "fill-rose-500")}
                        />
                        {poll?.likes.length}
                    </Button>
                    <Button className="h-8 px-3 rounded-full" variant="outline" asChild>
                        <Link href={`/poll/${poll.id}`}>
                            <MessageCircleMoreIcon className="h-4 w-4" />
                            {poll?.comments.length}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );

}
