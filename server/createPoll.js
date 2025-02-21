"use server";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

export const createPoll = async ({ author, title, content, options, likes = [], tags = [] }) => {
    if (!author) return JSON.stringify({ success: false, error: 'Unauthorized' });
    if (!options) return JSON.stringify({ success: false, error: 'No options provided' });
    if (options.length <= 5) return JSON.stringify({ success: false, error: 'Max 4 options' });
    if (!title) return JSON.stringify({ success: false, error: 'No title provided' });

    try {
        const authorCollectionRef = collection(db, 'authors');
        const authorDoc = await getDoc(doc(authorCollectionRef, author));
        if (!authorDoc.exists()) return JSON.stringify({ success: false, error: 'Invalid author' });
        author = authorDoc.id;

        const pollsCollectionRef = collection(db, 'polls');
        const pollRef = await addDoc(pollsCollectionRef, {
            author,
            title,
            content,
            options,
            option_count: options.length,
            likes,
            tags,
            created_at: new Date().toLocaleString(),
        });

        const createAuthorHist = await addDoc(authorCollectionRef, {
            pollId: pollRef.id,
            created_at: new Date().toLocaleString(),
        });

        return JSON.stringify({ success: true, id: pollRef.id });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};
