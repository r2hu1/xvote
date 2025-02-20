import { Button } from "./ui/button";

export default function Header() {
    return (
        <header className="flex items-center justify-between px-6 md:px-20 lg:px-32 py-5">
            <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg bg-black rounded text-white w-8 h-8 flex items-center justify-center">X</h1>
                <h1 className="text-lg font-bold">Vote</h1>
            </div>
            <div>
                <Button variant="primary">Create</Button>
            </div>
        </header>
    )
};