import { db } from "@/lib/firebase";
import { collection, doc, getDoc } from "firebase/firestore";

export const getCommentsByPollId = async (pollId) => {
    try {
        const pollsCollectionRef = collection(db, 'polls');
        const pollRef = doc(pollsCollectionRef, pollId);
        const pollSnapshot = await getDoc(pollRef);

        if (!pollSnapshot.exists()) {
            return JSON.stringify({ success: false, error: 'Poll not found' });
        }

        const pollData = pollSnapshot.data();
        const comments = pollData.comments || [];

        return JSON.stringify({ success: true, comments });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};

