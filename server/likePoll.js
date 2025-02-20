"use server";

import { db } from "@/lib/firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

export const likePoll = async ({ pollId, userId }) => {
    if (!userId) return JSON.stringify({ success: false, error: 'Unauthorized' });
    try {
        const pollsCollectionRef = collection(db, 'polls');
        const pollRef = doc(pollsCollectionRef, pollId);
        const poll = await getDoc(pollRef);
        if (poll.exists()) {
            const pollData = poll.data();
            const likes = pollData.likes ?? [];
            const newLikes = likes.includes(userId) ? likes.filter(id => id !== userId) : [...likes, userId];
            await updateDoc(pollRef, { likes: newLikes });
            return JSON.stringify({ success: true });
        }
        return JSON.stringify({ success: false, error: 'Poll not found' });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};
