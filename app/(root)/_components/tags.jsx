"use client";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";


export default function Tags({ tags }) {
    return (
        <div className="px-5 mt-5">
            <ScrollArea>
                <div className="flex gap-2 pb-4">
                    {tags.map((tag) => (
                        <Link href={`/#${tag}`} key={tag}>
                            <Badge variant="outline" className="h-7 px-4">{tag}</Badge>
                        </Link>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}