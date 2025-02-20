"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function Home() {
  return (
    <main>
      <Header />
      <div className="border-black border-2 hover:border-black/80 mt-10 mx-10">
        <div className="p-2 border-black border-b-2">
          <h1 className="text-base font-medium">Posted by AnonmousUser18</h1>
          <p className="text-sm">on <span className="text-foreground/80">10/10/2023 - 10:00 AM</span></p>
        </div>
        <div className="py-5 px-3">
          <h1 className="text-lg font-medium">Will india win the 2025 worldcup?</h1>
          <div className="grid gap-3 mt-3">
            <div className="flex items-center px-4 py-3 bg-secondary justify-between">
              <h1>Yes</h1>
            </div>
            <div className="flex items-center px-4 py-3 bg-secondary justify-between">
              <h1>No</h1>
            </div>
            <div className="flex items-center px-4 py-3 bg-secondary justify-between">
              <h1>Probably</h1>
            </div>
            <div className="flex items-center px-4 py-3 bg-secondary justify-between">
              <h1>Idk</h1>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 h-10 px-3">
          <Heart className="h-4 w-4" />
          <h1 className="text-sm text-foreground/80">100 votes</h1>
        </div>
      </div>
    </main>
  );
}
