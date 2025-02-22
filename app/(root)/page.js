import Feed from "./_components/feed";
import Tags from "./_components/tags";

export default function Page() {
  const tagS = [
    "politics",
    "sports",
    "entertainment",
    "business",
    "tech",
    "science",
    "health",
  ];
  return (
    <main>
      {/* <Tags tags={tagS} /> */}
      <Feed />
    </main>
  )
}