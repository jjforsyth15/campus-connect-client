import ClubsUI from "@/components/clubs/ClubsUI";
import { CLUBS } from "@/components/clubs/clubs.data";

const SLUG_ALIASES: Record<string, string> = {
  "ieee-csun": "ieee",
  "swe-csun": "swe",
  "acm-csun": "acm",
};

export default function ClubPage({ params }: { params: { slug: string } }) {
  const rawSlug = params.slug;
  const slug = SLUG_ALIASES[rawSlug] ?? rawSlug;

  const club = CLUBS.find((c) => c.slug === slug);

  if (!club) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Club not found</h2>
        <p>Requested slug: {rawSlug}</p>
        <a href="/clubs">Back to clubs</a>
      </div>
    );
  }

  return <ClubsUI clubs={CLUBS} mode="club" club={club} />;
}
