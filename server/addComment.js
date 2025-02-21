"use server";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

export const addComment = async ({ username, pollId, userId, comment }) => {
    if (!userId) return JSON.stringify({ success: false, error: 'Unauthorized' });
    try {
        const pollsCollectionRef = collection(db, 'polls');
        const pollRef = doc(pollsCollectionRef, pollId);
        const pollSnapshot = await getDoc(pollRef);

        if (!pollSnapshot.exists()) {
            return JSON.stringify({ success: false, error: 'Poll not found' });
        }

        const pollData = pollSnapshot.data();
        const comments = pollData.comments || [];
        const newComment = { username, userId, comment, createdAt: new Date().toISOString() };
        const updatedComments = [...comments, newComment];

        await updateDoc(pollRef, { comments: updatedComments });

        return JSON.stringify({ success: true, comment: newComment });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};

