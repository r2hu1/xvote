"use server"
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";

export async function getUser() {
    const token = cookies().get("token")?.value;
    if (!token) return null;
    console.log(verifyJWT(token));
    return verifyJWT(token);
}
