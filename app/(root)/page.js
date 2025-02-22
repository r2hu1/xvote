"use client";

import { AuthContext } from "@/components/auth-context";
import { getAllPolls } from "@/server/poll";
import { updatePollResult } from "@/server/poll";
import { likePoll } from "@/server/poll";
import { toast } from "sonner";
import Poll from "@/components/poll";
import { useContext, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [polls, setPolls] = useState([]);
  const [loadingPolls, setLoadingPolls] = useState({});
  const user = useContext(AuthContext);
  const [fetching, setFetching] = useState(false);

  const getPolls = async () => {
    setFetching(true);
    try {
      const req = await getAllPolls();
      const data = JSON.parse(req);
      if (data.success) {
        setPolls(data.polls);
      }
    } catch (e) {
      console.log(e);
    }
    finally {
      setFetching(false);
    }

  };

  const updatePollInState = (updatedPoll) => {
    setPolls((prev) =>
      prev.map((p) => (p.id === updatedPoll.id ? updatedPoll : p))
    );
  };

  const handlePollClick = async (pollId, optionIndex) => {
    if (!user?.user?.id) return toast.error("You must be signed in to vote!");
    console.log("Voting on poll", pollId, "option", optionIndex);
    setLoadingPolls((prev) => ({ ...prev, [pollId]: true }));
    try {
      const req = await updatePollResult({ pollId, optionIndex, userId: user.user.id });
      const data = JSON.parse(req);
      if (!data.success) {
        toast.error(data.error);
      } else if (data.poll) {
        updatePollInState(data.poll);
      } else {
        await getPolls();
      }
    } catch (e) {
      console.log(e.message);
      toast.error(e.message);
    }
    setLoadingPolls((prev) => ({ ...prev, [pollId]: false }));
  };

  const handleLikeClick = async (pollId) => {
    if (!user?.user?.id) return toast.error("You must be signed in to comment!");
    setLoadingPolls((prev) => ({ ...prev, [pollId]: true }));
    try {
      const req = await likePoll({ pollId, userId: user.user.id });
      const data = JSON.parse(req);
      if (!data.success) {
        toast.error(data.error);
      } else if (data.poll) {
        updatePollInState(data.poll);
      } else {
        await getPolls();
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
    setLoadingPolls((prev) => ({ ...prev, [pollId]: false }));
  };

  useEffect(() => {
    getPolls();
  }, []);

  if (fetching) {
    return (
      <main className="px-6 py-10 mb-10 md:px-20 lg:px-32">
        <div className="grid md:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-3 border border-border rounded">
              <div className="grid gap-1">
                <Skeleton className="h-5" />
                <div className="flex mt-3 items-center gap-2">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
              <div className="mt-8 grid gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          ))}
        </div>
      </main>
    )
  }
  return (
    <main className="px-6 py-10 mb-10 md:px-20 lg:px-32">
      <div className="grid md:grid-cols-2 gap-5">
        {polls.map((poll) => {
          const totalClicks = poll?.options?.filter(Boolean).reduce((acc, curr) => acc + curr.clicks, 0);
          const userVoteIndex = poll?.clicks?.find((click) => click.userId === user?.user?.id)?.optionIndex;
          return (
            <Poll
              key={poll.id}
              poll={poll}
              loading={loadingPolls[poll.id] || false}
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
