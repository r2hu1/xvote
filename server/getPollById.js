"use server";

import { db } from "@/lib/firebase";
import { collection, doc, getDoc } from "firebase/firestore";

export const getPollById = async (id) => {
    try {
        const pollsCollectionRef = collection(db, 'polls');
        const pollRef = doc(pollsCollectionRef, id);
        const poll = await getDoc(pollRef);
        if (poll.exists()) {
            return JSON.stringify({ success: true, poll: poll.data() });
        }
        return JSON.stringify({ success: false, error: 'Poll not found' });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};
