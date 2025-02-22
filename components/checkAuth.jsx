"use client";

import { getUser } from "@/server/user";
import { useEffect, useState } from "react";

export default function CheckAuth({ ifA, children }) {
    const [authenticated, setAuthenticated] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            if (user) {
                setAuthenticated(true);
            }
        };
        fetchUser();
    }, []);
    if (authenticated) return ifA;
    return children;
}