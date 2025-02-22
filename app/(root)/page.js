"use client";

import { AuthContext } from "@/components/auth-context";
import { Button } from "@/components/ui/button";
import { getAllPolls } from "@/server/poll";
import { updatePollResult } from "@/server/poll";
import { likePoll } from "@/server/poll";
import { Heart, Loader2, MessageCircleMoreIcon } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Poll from "@/components/poll";

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
            <Poll
              key={poll.id}
              poll={poll}
              loading={loading}
              totalClicks={totalClicks}
              userVoteIndex={userVoteIndex}
              handlePollClick={handlePollClick}
              handleLikeClick={handleLikeClick}
              user={user}
            />
          );
        })}
      </div>
    </main>
  );
}
