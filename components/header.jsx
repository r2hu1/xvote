import { LogOut, Plus } from "lucide-react";
import { Button } from "./ui/button";
import Logo from "./logo";

export default function Header() {
    return (
        <header className="flex items-center justify-between px-6 md:px-20 lg:px-32 py-5">
            <Logo />
            <div className="flex items-center gap-2">
                <Button className="rounded h-9 px-4">Create</Button>
                <Button className="rounded h-9 w-9" size="icon" variant="outline"><LogOut className="h-3 w-3" /></Button>
            </div>
        </header>
    )
};