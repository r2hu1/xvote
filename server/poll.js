"use server";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";

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

export const likePoll = async ({ pollId, userId }) => {
    if (!userId) return JSON.stringify({ success: false, error: "Unauthorized" });
    try {
        const pollsCollectionRef = collection(db, "polls");
        const pollRef = doc(pollsCollectionRef, pollId);
        const pollSnapshot = await getDoc(pollRef);
        if (!pollSnapshot.exists()) return JSON.stringify({ success: false, error: "Poll not found" });
        const pollData = pollSnapshot.data();
        const likes = pollData.likes ?? [];
        const newLikes = likes.includes(userId) ? likes.filter((id) => id !== userId) : [...likes, userId];
        await updateDoc(pollRef, { likes: newLikes });
        return JSON.stringify({ success: true });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};

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

export const getCommentsByPollId = async (pollId) => {
    try {
        if (!pollId) {
            return JSON.stringify({ success: false, error: "Invalid poll id" });
        }
        const pollsCollectionRef = collection(db, "polls");
        const pollRef = doc(pollsCollectionRef, pollId);
        const pollSnapshot = await getDoc(pollRef);

        if (!pollSnapshot.exists()) {
            return JSON.stringify({ success: false, error: "Poll not found" });
        }

        const pollData = pollSnapshot.data();
        let comments = pollData.comments || [];
        comments = comments.map((comment, index) => {
            return { id: comment.id || index.toString(), ...comment };
        });

        return JSON.stringify({ success: true, comments });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};

export const deleteComment = async ({ pollId, commentId }) => {
    if (!pollId || !commentId) {
        return JSON.stringify({ success: false, error: "Invalid pollId or commentId" });
    }
    try {
        const pollsCollectionRef = collection(db, "polls");
        const pollRef = doc(pollsCollectionRef, pollId);
        const pollSnapshot = await getDoc(pollRef);
        if (!pollSnapshot.exists()) {
            return JSON.stringify({ success: false, error: "Poll not found" });
        }
        const pollData = pollSnapshot.data();
        const comments = pollData.comments ?? [];
        const newComments = comments.filter((comment, index) => {
            const commentIdToCheck = comment.id ? comment.id : index.toString();
            return commentIdToCheck !== commentId;
        });
        await updateDoc(pollRef, { comments: newComments });
        return JSON.stringify({ success: true });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};

export const commentOnComment = async ({ pollId, parentCommentId, userId, username, comment }) => {
    if (!pollId || !parentCommentId || !userId || !comment) {
        return JSON.stringify({ success: false, error: "Missing required parameters" });
    }
    try {
        const pollsCollectionRef = collection(db, "polls");
        const pollRef = doc(pollsCollectionRef, pollId);
        const pollSnapshot = await getDoc(pollRef);
        if (!pollSnapshot.exists()) {
            return JSON.stringify({ success: false, error: "Poll not found" });
        }
        const pollData = pollSnapshot.data();
        const comments = pollData.comments || [];

        const targetIndex = comments.findIndex((c, index) => {
            const idToCheck = c.id ? c.id : index.toString();
            return idToCheck === parentCommentId;
        });

        if (targetIndex === -1) {
            return JSON.stringify({ success: false, error: "Parent comment not found" });
        }

        const reply = {
            id: Date.now().toString(),
            userId,
            username,
            comment,
            createdAt: new Date().toISOString()
        };

        const existingReplies = comments[targetIndex].replies || [];
        comments[targetIndex] = {
            ...comments[targetIndex],
            replies: [...existingReplies, reply]
        };

        await updateDoc(pollRef, { comments });

        return JSON.stringify({ success: true, reply });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};