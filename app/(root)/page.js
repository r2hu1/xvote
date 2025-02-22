"use client";

import { AuthContext } from "@/components/auth-context";
import { Button } from "@/components/ui/button";
import { getAllPolls } from "@/server/getAllPoll";
import { updatePollResult } from "@/server/updatePollResult";
import { likePoll } from "@/server/likePoll";
import { Heart, Loader2, MessageCircleMoreIcon } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Home() {
  const [polls, setPolls] = useState([]);
  const user = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const getPolls = async () => {
    try {
      const req = await getAllPolls();
      const data = JSON.parse(req);
      if (data.success) {
        setPolls(data.polls);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handlePollClick = async (pollId, optionIndex) => {
    if (!user?.user?.id) {
      toast.error("SignIn in to vote.");
      return;
    }
    setLoading(true);
    try {
      const req = await updatePollResult({ pollId, optionIndex, userId: user.user.id });
      const data = JSON.parse(req);
      if (!data.success) {
        toast.error(data.error);
      }
      getPolls();
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
    setLoading(false);
  };

  const handleLikeClick = async (pollId) => {
    if (!user?.user?.id) {
      toast.error("SignIn to like.");
      return;
    }
    try {
      const req = await likePoll({ pollId, userId: user.user.id });
      const data = JSON.parse(req);
      if (!data.success) {
        toast.error(data.error);
      }
      getPolls();
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  useEffect(() => {
    getPolls();
  }, []);

  return (
    <main className="px-6 py-10 mb-10 md:px-20 lg:px-32">
      <div className="grid gap-3 md:grid-cols-2">
        {polls.map((poll) => {
          const totalClicks = poll?.options.filter(Boolean).reduce((acc, curr) => acc + curr.clicks, 0);
          const userVoteIndex = poll?.clicks?.find((click) => click.userId === user?.user?.id)?.optionIndex;
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
                    variant={userVoteIndex === index ? "default" : "outline"}
                    key={index}
                    className="flex gap-2 items-center justify-between"
                  >
                    <p className="text-sm">{option.content}</p>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
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
                    <Heart className={cn("h-4 w-4", poll?.likes.includes(user?.user?.id) && "fill-rose-500")} />
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
        })}
      </div>
    </main>
  );
}
