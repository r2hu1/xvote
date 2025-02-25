export const generateMetadata = async ({ params }) => {
    return {
        title: `${decodeURIComponent(params.id)}`,
        description: `Anonymous user ${decodeURIComponent(params.id)}'s profile on xvote`
    }
}
export default function Layout({ children }) {
    return (
        <main>
            {children}
        </main>
    )
}