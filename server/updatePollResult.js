"use server"

import { db } from "@/lib/firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

export const updatePollResult = async ({ pollId, optionIndex, userId }) => {
    if (!userId) return JSON.stringify({ success: false, error: 'Unauthorized' });
    try {
        const authorCollectionRef = collection(db, 'authors');
        const authorDoc = await getDoc(doc(authorCollectionRef, userId));
        if (!authorDoc.exists()) return JSON.stringify({ success: false, error: 'Invalid author' });

        const pollsCollectionRef = collection(db, 'polls');
        const pollRef = doc(pollsCollectionRef, pollId);
        const poll = await getDoc(pollRef);
        if (poll.exists()) {
            const pollData = poll.data();
            const newClicks = pollData.options.map((option, index) =>
                index === optionIndex ? option.clicks + 1 : option.clicks
            );
            await updateDoc(pollRef, { options: pollData.options.map((option, index) => ({ ...option, clicks: newClicks[index] })) });
            return JSON.stringify({ success: true });
        }
        return JSON.stringify({ success: false, error: 'Poll not found' });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};
