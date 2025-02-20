"use server";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

export const updatePoll = async ({ id, author, content, options }) => {
    if (!author) return JSON.stringify({ success: false, error: 'Unauthorized' });
    try {
        const authorCollectionRef = collection(db, 'authors');
        const authorDoc = await getDoc(doc(authorCollectionRef, author));
        if (!authorDoc.exists()) return JSON.stringify({ success: false, error: 'Invalid author' });

        const pollsCollectionRef = collection(db, 'polls');
        const pollRef = doc(pollsCollectionRef, id);
        const poll = await getDoc(pollRef);
        if (poll.exists() && poll.data().author === author) {
            await updateDoc(pollRef, {
                content,
                options,
                option_count: options.length,
            });
            return JSON.stringify({ success: true });
        }
        return JSON.stringify({ success: false, error: 'Unauthorized' });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};
