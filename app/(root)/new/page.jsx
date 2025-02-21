"use client";

import { getUser } from "@/server/getUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const router = useRouter();
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            if (!user) {
                router.push("/");
            }
        };
        fetchUser();
    }, []);
    return (
        <main></main>
    )
}