"use client";

import { AuthContext } from "@/components/auth-context";
import { getAllPolls } from "@/server/poll";
import { updatePollResult } from "@/server/poll";
import { likePoll } from "@/server/poll";
import { toast } from "sonner";
import Poll from "@/components/poll";
import { useContext, useEffect, useState } from "react";

export default function Home() {
  const [polls, setPolls] = useState([]);
  const [loadingPolls, setLoadingPolls] = useState({});
  const user = useContext(AuthContext);

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
