// src/app/Clubs/preview/page.tsx
export default function ClubsPreviewPage() {
  const mockClub = {
    id: "mock-123",
    name: "Mock Club Name",
    description: "This is a placeholder preview to test layout.",
    meetingTime: "Wednesdays 6 PM",
    location: "Room 101",
    members: 42,
  };

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Club Preview</h1>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <h2 style={{ margin: 0 }}>{mockClub.name}</h2>
        <p style={{ marginTop: 8 }}>{mockClub.description}</p>

        <ul>
          <li><b>ID:</b> {mockClub.id}</li>
          <li><b>Meeting:</b> {mockClub.meetingTime}</li>
          <li><b>Location:</b> {mockClub.location}</li>
          <li><b>Members:</b> {mockClub.members}</li>
        </ul>
      </div>
    </main>
  );
}