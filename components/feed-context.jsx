"use client";

import { getAllPolls } from "@/server/poll";
import { getUser } from "@/server/user";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";

export const FeedContext = createContext(null);

export const FeedProvider = ({ children }) => {
  const [polls, setPolls] = useState([]);
  const { user } = useAuth();

  const getPolls = async () => {
    try {
      const req = await getAllPolls();
      const data = JSON.parse(req);
      if (data.success) {
        setPolls(data.polls);
        console.log(data.polls);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getPolls();
  }, []);

  return (
    <FeedContext.Provider
      value={{
        polls,
        setPolls,
        getPolls,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => useContext(FeedContext);
