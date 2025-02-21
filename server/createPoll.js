"use server";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";

export const createPoll = async ({ username, author, title, options, likes = [], tags = [], comments = [] }) => {
    if (!author) return JSON.stringify({ success: false, error: 'Unauthorized' });
    if (!options) return JSON.stringify({ success: false, error: 'No options provided' });
    if (options.length >= 5) return JSON.stringify({ success: false, error: 'Max 4 options' });
    if (!title) return JSON.stringify({ success: false, error: 'No title provided' });

    try {
        const authorCollectionRef = collection(db, 'authors');
        const authorDoc = await getDoc(doc(authorCollectionRef, author));
        if (!authorDoc.exists()) return JSON.stringify({ success: false, error: 'Invalid author' });
        author = authorDoc.id;

        const pollsCollectionRef = collection(db, 'polls');
        const pollRef = await addDoc(pollsCollectionRef, {
            username,
            author,
            title,
            options,
            option_count: options.length,
            likes,
            tags,
            comments,
            created_at: new Date().toLocaleString(),
        });
        const authorDocRef = doc(db, 'authors', author);
        const authorDocSnap = await getDoc(authorDocRef);
        const polls = authorDocSnap.data().polls ?? [];
        await updateDoc(authorDocRef, {
            polls: [...polls, pollRef.id]
        });

        return JSON.stringify({ success: true, id: pollRef.id });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};
