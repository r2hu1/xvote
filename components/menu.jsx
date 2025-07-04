"use client";

import { Home, Loader2, RefreshCcw, Search, User } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "./auth-context";
import { cn } from "@/lib/utils";
import { LogIn } from "lucide-react";

export default function Menu() {
  const page = usePathname();
  const user = useContext(AuthContext);
  return (
    <div className="fixed z-[9999] bottom-4 left-0 right-0">
      <div className="bg-background overflow-hidden border border-border p-2 rounded-full shadow-md w-fit flex mx-auto gap-1.5">
        <Button
          className={cn(
            "rounded-2xl group transition",
            page == "/" && "bg-secondary",
          )}
          variant="ghost"
          asChild
        >
          <Link href="/" className="flex items-center justify-center">
            <Home className="h-6 w-6" />
            {page == "/" ? (
              <span>Feed</span>
            ) : (
              <span className="w-0 invisible opacity-0 group-hover:opacity-100 group-hover:w-full group-hover:visible transition-[opacity,visibility] overflow-hidden">
                Feed
              </span>
            )}
          </Link>
        </Button>
        {user?.user?.id ? (
          <Button
            className={cn(
              "rounded-2xl group transition",
              page == `/@${user.user.username}` && "bg-secondary",
            )}
            variant="ghost"
            asChild
          >
            <Link
              href={`/@${user.user.username}`}
              className="flex items-center justify-center"
            >
              <User className="h-6 w-6" />
              {page == `/@${user.user.username}` ? (
                <span>Profile</span>
              ) : (
                <span className="w-0 invisible opacity-0 group-hover:opacity-100 group-hover:w-full group-hover:visible transition-[opacity,visibility] overflow-hidden">
                  Profile
                </span>
              )}
            </Link>
          </Button>
        ) : (
          <Button
            className={cn(
              "rounded-2xl group transition",
              page == `/signin` && "bg-secondary",
            )}
            asChild
            size="icon"
          >
            <Link href={`/signin`} className="flex items-center justify-center">
              <LogIn className="h-6 w-6" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
