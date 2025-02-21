"use server";

import { db } from "@/lib/firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

export const updatePollResult = async ({ pollId, optionIndex, userId }) => {
    if (!userId) return JSON.stringify({ success: false, error: "Unauthorized" });

    try {
        const pollsCollectionRef = collection(db, "polls");
        const pollRef = doc(pollsCollectionRef, pollId);
        const pollSnapshot = await getDoc(pollRef);

        if (!pollSnapshot.exists()) {
            return JSON.stringify({ success: false, error: "Poll not found" });
        }

        const pollData = pollSnapshot.data();
        const userClickIndex = pollData.clicks?.findIndex((click) => click.userId === userId);
        const prevOptionIndex = userClickIndex !== -1 ? pollData.clicks[userClickIndex].optionIndex : null;

        let updatedOptions = [...pollData.options];

        if (prevOptionIndex !== null && prevOptionIndex !== optionIndex) {
            updatedOptions[prevOptionIndex].clicks = Math.max(0, updatedOptions[prevOptionIndex].clicks - 1);
        }

        updatedOptions[optionIndex].clicks = (updatedOptions[optionIndex].clicks || 0) + 1;

        const updatedClicks =
            prevOptionIndex !== null
                ? pollData.clicks.map((click) =>
                    click.userId === userId ? { userId, optionIndex } : click
                )
                : [...(pollData.clicks || []), { userId, optionIndex }];

        await updateDoc(pollRef, {
            options: updatedOptions,
            clicks: updatedClicks,
        });

        return JSON.stringify({ success: true });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};
