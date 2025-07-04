"use client";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import Logo from "./logo";

export default function Preloader() {
  useEffect(() => {
    setTimeout(() => {
      document.getElementById("preloader").style.display = "none";
    }, 2000);
  }, []);
  return (
    <div
      id="preloader"
      className="flex bg-background items-center justify-center h-full w-full absolute z-[99999] top-0 left-0 right-0"
    >
      <div>
        <Logo className="animate-pulse" />
      </div>
    </div>
  );
}
