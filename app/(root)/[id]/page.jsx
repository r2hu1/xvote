export default function Page({ params }) {
    return (
        <main>
            <h1>{decodeURIComponent(params.id)}</h1>
        </main>
    )
}