"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export const getAllPolls = async () => {
    try {
        const pollsCollectionRef = collection(db, "polls");
        const pollsSnapshot = await getDocs(pollsCollectionRef);
        const polls = pollsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return JSON.stringify({ success: true, polls });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};
