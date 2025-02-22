"use client";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function Preloader() {
    useEffect(() => {
        setTimeout(() => {
            document.getElementById("preloader").style.display = "none";
        }, 2000);
    }, [])
    return (
        <div id="preloader" className="flex bg-background items-center justify-center h-full w-full absolute z-50 top-0 left-0 right-0">
            <Loader2 className="animate-spin h-5 w-5" />
        </div>
    )
}