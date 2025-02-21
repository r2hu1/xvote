"use server";
import { encrypt } from "@/lib/crypto";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";

export const createUser = async ({ username, hash }) => {
    if (!username || !hash) return JSON.stringify({ success: false, error: 'No username or hash provided' });
    try {
        const authorCollectionRef = collection(db, 'authors');
        const q = query(authorCollectionRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) return JSON.stringify({ success: false, error: 'User already exists' });

        const encrHash = encrypt(hash);
        const userRef = await addDoc(collection(db, 'authors'), {
            username,
            hash: encrHash,
        });
        return JSON.stringify({ success: true, username: username, id: userRef.id });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};
