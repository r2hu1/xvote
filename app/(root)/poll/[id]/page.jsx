"use client";

import { AuthContext } from "@/components/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { addComment } from "@/server/addComment";
import { getCommentsByPollId } from "@/server/getCommentsByPollId";
import { getPollById } from "@/server/getPollById";
import { likePoll } from "@/server/likePoll";
import { updatePollResult } from "@/server/updatePollResult";
import { Heart, Loader2, MessageCircleMoreIcon } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page({ params }) {
    const id = params.id;
    const [pollData, setPollData] = useState(null);
    const [error, setError] = useState(null);
    const user = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [loading2, setLoading2] = useState(false);

    const handlePollClick = async (pIndex) => {
        setLoading(true);
        try {
            const req = await updatePollResult({ pollId: id, optionIndex: pIndex, userId: user.user.id });
            const data = JSON.parse(req);
            if (!data.success) {
                toast.error(data.error);
            }
            getPoll();
        } catch (e) {
            console.log(e);
            toast.error(e.message);
        }
        setLoading(false);
    };

    const getPoll = async () => {
        const req = await getPollById(id);
        const data = JSON.parse(req);
        if (data.success) {
            setPollData(data.poll);
        } else {
            setError(data.error);
            console.log(data.error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        setLoading2(true);
        try {
            const req = await addComment({ username: user.user.username, pollId: id, userId: user.user.id, comment: e.target.comment.value });
            const data = JSON.parse(req);
            if (data.success) {
                getPoll();
                getComments();
                e.target.comment.value = "";
            }
            else {
                toast.error(data.error);
            }
        }
        catch (e) {
            console.log(e);
            toast.error(e.message);
        }
        setLoading2(false);
    };

    const getComments = async () => {
        try {
            const req = await getCommentsByPollId(id);
            const data = JSON.parse(req);
            if (data.success) {
                setComments(data.comments);
            }
        }
        catch (e) {
            console.log(e);
            toast.error(e.message);
        }
    };

    const handleLikeClick = async (e) => {
        e.target.disabled = true;
        try {
            const req = await likePoll({ pollId: id, userId: user.user.id });
            const data = JSON.parse(req);
            if (!data.success) {
                toast.error(data.error);
            } else {
                getPoll();
            }
        } catch (e) {
            console.log(e);
            toast.error(e.message);
        }
        e.target.disabled = false;
    };

    useEffect(() => {
        getPoll();
        getComments();
    }, []);

    const userVoteIndex = pollData?.clicks?.find((click) => click.userId === user?.user?.id)?.optionIndex;

    return (
        <main className="py-10 mb-10 px-6 md:px-20 lg:px-32">
            <div>
                <h1 className="text-xl font-medium">{pollData?.title}</h1>
            </div>
            <div className="grid gap-2 mt-3">
                {pollData?.options.filter(Boolean).map((option, index) => (
                    <Button
                        disabled={loading}
                        onClick={() => handlePollClick(index)}
                        variant={userVoteIndex === index ? "default" : "outline"}
                        key={index}
                        className="flex gap-2 items-center justify-between"
                    >
                        <p className="text-sm">{option.content}</p>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <p className="text-sm opacity-80">
                            {(option.clicks / pollData?.options.filter(Boolean).reduce((acc, curr) => acc + curr.clicks, 0)) * 100 | 0}%
                        </p>}
                    </Button>
                ))}
            </div>
            <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                    <Button className="h-8 px-3 rounded-full"
                        variant={pollData?.likes.includes(user?.user?.id) ? "default" : "outline"}
                        onClick={handleLikeClick}
                    >
                        <Heart className={cn("h-4 w-4", pollData?.likes.includes(user?.user?.id) && "fill-rose-500")} />{pollData?.likes.length}
                    </Button>
                    <Button className="h-8 px-3 rounded-full" variant="outline">
                        <MessageCircleMoreIcon className="h-4 w-4" />{pollData?.comments.length}
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <h1 className="text-sm text-foreground/80">
                        by <Link className="text-foreground hover:underline" href={`/@${pollData?.author}`}>{pollData?.username}</Link>
                    </h1>
                    <p className="text-sm text-foreground/80">
                        {pollData?.created_at
                            ? new Date(pollData.created_at).toLocaleString("default", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : ""}
                    </p>
                </div>
            </div>
            <form onSubmit={handleComment} className="mt-8 flex items-center gap-2">
                <Input required placeholder="Add a comment" id="comment" name="comment" />
                <Button disabled={loading2} type="submit">{loading2 ? <Loader2 className="h-4 w-4 animate-spin" /> : "Comment"}</Button>
            </form>
            <div className="mt-3 grid gap-2">
                {comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((comment) => (
                    <div key={comment.id} className="grid gap-2 border border-border p-3 rounded">
                        <div className="flex items-center justify-between">
                            <p className="text-sm">{comment.username}</p>
                            <p className="text-xs text-foreground/80">{new Date(comment.createdAt).toLocaleString("default", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                        </div>
                        <p className="text-sm opacity-80">{comment.comment}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}
