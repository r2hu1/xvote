"use server";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { decrypt, encrypt } from "@/lib/crypto";
import { generateJWT } from "@/lib/jwt";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";

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

export async function signOut() {
    cookies().set("token", "", { expires: new Date(0), path: "/" });
    return { success: true };
};

export async function getUser() {
    const token = cookies().get("token")?.value;
    if (!token) return null;
    return verifyJWT(token);
};