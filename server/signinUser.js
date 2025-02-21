"use server";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { decrypt, encrypt } from "@/lib/crypto";
import { generateJWT } from "@/lib/jwt";
import { cookies } from "next/headers";

export const signinUser = async ({ username, hash }) => {
    if (!username || !hash) return JSON.stringify({ success: false, error: 'No username or hash provided' });
    try {
        const authorCollectionRef = collection(db, 'authors');
        const q = query(authorCollectionRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return JSON.stringify({ success: false, error: 'User not found' });
        if (!querySnapshot.empty) {
            const authorDoc = querySnapshot.docs[0];
            if (hash == decrypt(authorDoc.data().hash)) {
                const token = generateJWT({ username: username, id: authorDoc.id });
                cookies().set("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    path: "/",
                });
                return JSON.stringify({ success: true, id: authorDoc.id, username: username });
            }
            return JSON.stringify({ success: false, error: 'Wrong hash' });
        }
        return JSON.stringify({ success: false, error: 'User not found' });
    } catch (e) {
        return JSON.stringify({ success: false, error: e.message });
    }
};
