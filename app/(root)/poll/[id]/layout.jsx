import { getPollById } from "@/server/poll"

export const generateMetadata = async ({ params }) => {
    const req = await getPollById(params.id);
    const data = JSON.parse(req);
    if (data.success) {
        return {
            title: data.poll.title,
            description: `An anonymous poll by ${data.poll.author}.`
        }
    }
    return {
        title: "Errors"
    }
}
export default function Layout({ children }) {
    return (
        <main>
            {children}
        </main>
    )
}