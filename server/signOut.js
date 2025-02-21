"use server";

import { cookies } from "next/headers";

export async function signOut() {
    cookies().set("token", "", { expires: new Date(0), path: "/" });
    return { success: true };
}
