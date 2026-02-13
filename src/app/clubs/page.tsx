import ClubsUI from "./ClubsUI";
import { CLUBS } from "./clubs.data";

export default function ClubsPage() {
  return <ClubsUI clubs={CLUBS} mode="hub" />;
}