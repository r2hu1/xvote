"use client";

import { AuthContext } from "@/components/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { addComment, commentOnComment, deleteNestedComment } from "@/server/poll";
import { getCommentsByPollId } from "@/server/poll";
import { deleteComment, getPollById } from "@/server/poll";
import { likePoll } from "@/server/poll";
import { updatePollResult } from "@/server/poll";
import { Check, CornerRightDown, Heart, Loader2, MessageCircleMoreIcon, Trash } from "lucide-react";
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
    const [replyFormOpen, setReplyFormOpen] = useState({});

    const handlePollClick = async (pIndex) => {
        if (!user?.user?.id) return toast.error("You must be signed in to vote!");
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
        if (!user?.user?.id) return toast.error("You must be signed in to comment!");
        setLoading2(true);
        try {
            const req = await addComment({
                username: user.user.username,
                pollId: id,
                userId: user.user.id,
                comment: e.target.comment.value,
            });
            const data = JSON.parse(req);
            if (data.success) {
                getPoll();
                getComments();
                e.target.comment.value = "";
            } else {
                toast.error(data.error);
            }
        } catch (e) {
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
        } catch (e) {
            console.log(e);
            toast.error(e.message);
        }
    };

    const handleLikeClick = async (e) => {
        if (!user?.user?.id) return toast.error("You must be signed in to like!");

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

    const handleDeleteComment = async (comment) => {
        try {
            const req = await deleteComment({ pollId: id, commentId: comment.id });
            const data = JSON.parse(req);
            if (data.success) {
                getPoll();
                getComments();
            } else {
                toast.error(data.error);
            }
        } catch (e) {
            console.log(e);
            toast.error(e.message);
        }
    };

    const handleReplySubmit = async (e, commentId) => {
        e.preventDefault();
        const replyText = e.target.elements[`reply-${commentId}`].value;
        if (!replyText) return;
        try {
            const req = await commentOnComment({
                pollId: id,
                parentCommentId: commentId,
                userId: user.user.id,
                username: user.user.username,
                comment: replyText,
            });
            const data = JSON.parse(req);
            if (data.success) {
                getPoll();
                getComments();
                setReplyFormOpen((prev) => ({ ...prev, [commentId]: false }));
            } else {
                toast.error(data.error);
            }
        } catch (e) {
            console.log(e);
            toast.error(e.message);
        }
    };

    const handleDeleteNestedComment = async (commentId, nestedCommentId) => {
        try {
            const req = await deleteNestedComment({ pollId: id, parentCommentId: commentId, nestedCommentId, userId: user.user.id });
            const data = JSON.parse(req);
            if (data.success) {
                getPoll();
                getComments();
            } else {
                toast.error(data.error);
            }
        } catch (e) {
            console.log(e);
            toast.error(e.message);
        }
    };

    useEffect(() => {
        getPoll();
        getComments();
    }, []);

    const userVoteIndex = pollData?.clicks?.find((click) => click.userId === user?.user?.id)?.optionIndex;
    const totalClicks = pollData?.options?.filter(Boolean).reduce((acc, curr) => acc + curr.clicks, 0) || 0;

    return (
        <main className="py-10 mb-10 px-6 md:px-20 lg:px-32 md:grid grid-cols-2 gap-7 md:mt-10">
            <div>
                <div className="grid gap-1">
                    <h1 className="text-xl font-medium">{pollData?.title}</h1>
                    <div className="flex items-center gap-2">
                        <h1 className="text-sm text-foreground/80">
                            by{" "}
                            <Link className="text-foreground hover:underline" href={`/@${pollData?.author}`}>
                                {pollData?.username}
                            </Link>
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
                <div className="grid gap-2 mt-4">
                    {pollData?.options.filter(option => Boolean(option.content)).map((option, index) => (
                        <Button
                            disabled={loading}
                            onClick={() => handlePollClick(index)}
                            variant={"outline"}
                            key={index}
                            className="flex gap-2 items-center justify-between relative z-10 bg-none after:rounded after:h-full after:absolute after:bottom-0 after:left-0 after:-z-10 after:bg-secondary after:w-[var(--vote-width)]"
                            style={{ "--vote-width": `${pollData?.options.filter(Boolean).reduce((acc, curr) => acc + curr.clicks, 0) > 0 ? ((option.clicks / pollData?.options.filter(Boolean).reduce((acc, curr) => acc + curr.clicks, 0)) * 100) | 0 : 0}%` }}
                        >
                            <div className="flex items-center gap-2">
                                {userVoteIndex === index && <Check className="h-4 w-4" />}
                                <p className="text-sm">{option.content}</p>
                            </div>
                            {loading ? (
                                <Skeleton className="h-3 w-7" />
                            ) : (
                                <p className="text-sm opacity-80">
                                    {totalClicks > 0 ? ((option.clicks / totalClicks) * 100) | 0 : 0}%
                                </p>
                            )}
                        </Button>
                    ))}
                </div>
                <div className="flex items-center mt-3">
                    <div className="flex items-center gap-2">
                        <Button
                            className="h-8 px-3 rounded-full"
                            variant={pollData?.likes.includes(user?.user?.id) ? "default" : "outline"}
                            onClick={handleLikeClick}
                        >
                            <Heart className={cn("h-4 w-4", pollData?.likes.includes(user?.user?.id) && "fill-rose-500")} />
                            {pollData?.likes.length}
                        </Button>
                        <Button className="h-8 px-3 rounded-full" variant="outline">
                            <MessageCircleMoreIcon className="h-4 w-4" />
                            {pollData?.comments.length}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="mt-8 md:mt-0">
                <form onSubmit={handleComment} className="flex items-center gap-2">
                    <Input required placeholder="Add a comment" id="comment" name="comment" />
                    <Button disabled={loading2} type="submit">
                        {loading2 ? <Loader2 className="h-4 w-4 animate-spin" /> : "Comment"}
                    </Button>
                </form>
                <div className="mt-3 grid gap-2">
                    {comments
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((comment) => (
                            <div key={comment.id} className="grid gap-2 border border-border p-3 rounded">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="grid">
                                        <p className="text-sm">{comment.username}</p>
                                        <p className="text-xs text-foreground/80">
                                            {new Date(comment.createdAt).toLocaleString("default", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        {user?.user?.id === comment.userId && (
                                            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleDeleteComment(comment)}>
                                                <Trash className="h-2.5 w-2.5" />
                                            </Button>
                                        )}
                                        <Button variant="outline" size="sm" className="h-7 rounded-full" onClick={() => setReplyFormOpen((prev) => ({ ...prev, [comment.id]: !prev[comment.id] }))}>
                                            Reply
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-foreground">{comment.comment}</p>
                                {comment.replies && comment.replies.length > 0 && (
                                    <div className="mt-2 -mb-3">
                                        {comment.replies.map((reply) => (
                                            <div key={reply.id} className="mb-3 border-border border rounded p-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="grid mb-3">
                                                        <p className="text-sm font-semibold">{reply.username}</p>
                                                        <p className="text-xs text-foreground/80">
                                                            {new Date(reply.createdAt).toLocaleString("default", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </p>
                                                    </div>
                                                    {user?.user?.id === reply.userId && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => { handleDeleteNestedComment(comment.id, reply.id) }}
                                                            className="h-5 w-5"
                                                        >
                                                            <Trash className="h-2.5 w-2.5" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-sm text-foreground">{reply.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {replyFormOpen[comment.id] && (
                                    <form className="mt-2 flex gap-2" onSubmit={(e) => handleReplySubmit(e, comment.id)}>
                                        <Input required placeholder="Write a reply" name={`reply-${comment.id}`} />
                                        <Button type="submit" size="icon" className="min-w-10">
                                            <CornerRightDown className="h-4 w-4" />
                                        </Button>
                                    </form>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </main>
    );
}
