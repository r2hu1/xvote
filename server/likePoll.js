"use server";

import { db } from "@/lib/firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

export const likePoll = async ({ pollId, userId }) => {
    if (!userId) return JSON.stringify({ success: false, error: "Unauthorized" });
    try {
        const pollsCollectionRef = collection(db, "polls");
        const pollRef = doc(pollsCollectionRef, pollId);
        const pollSnapshot = await getDoc(pollRef);
        if (!pollSnapshot.exists()) return JSON.stringify({ success: false, error: "Poll not found" });
        const pollData = pollSnapshot.data();
        const likes = pollData.likes ?? [];
        const newLikes = likes.includes(userId) ? likes.filter((id) => id !== userId) : [...likes, userId];
        await updateDoc(pollRef, { likes: newLikes });
        return JSON.stringify({ success: true });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};
