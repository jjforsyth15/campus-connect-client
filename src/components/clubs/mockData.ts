// ═══════════════════════════════════════════════════════════════════════════════
// mockData.ts — ALL mock data for clubs hub and individual club pages
// ═══════════════════════════════════════════════════════════════════════════════
//
//    TO SWITCH TO SUPABASE — replace each section's export with a Supabase query.
//    See comments on each export block for the exact query to use.
//
// ═══════════════════════════════════════════════════════════════════════════════
import type { ClubMember, ClubPost, ClubEvent, ClubDetail } from "./clubs.data";

// ─── MEMBERS ──────────────────────────────────────────────────────────────────
// BACKEND: SELECT * FROM club_members WHERE club_id = :id ORDER BY role, joined_at
export const MOCK_MEMBERS: Record<string, ClubMember[]> = {
  "club-001": [
    { id: "m1", name: "Alex Rivera", role: "President", joinedAt: "2022-09-01", major: "Computer Science", avatar: "https://i.pravatar.cc/60?img=1" },
    { id: "m2", name: "Jordan Lee", role: "VP", joinedAt: "2022-09-10", major: "Electrical Engineering", avatar: "https://i.pravatar.cc/60?img=2" },
    { id: "m3", name: "Sam Chen", role: "Officer", joinedAt: "2023-01-15", major: "Mechanical Engineering", avatar: "https://i.pravatar.cc/60?img=3" },
    { id: "m4", name: "Taylor Nguyen", role: "Member", joinedAt: "2023-08-30", major: "Physics", avatar: "https://i.pravatar.cc/60?img=5" },
  ],
  "club-002": [
    { id: "m5", name: "Morgan Kim", role: "President", joinedAt: "2022-09-01", major: "CS", avatar: "https://i.pravatar.cc/60?img=6" },
    { id: "m6", name: "Casey Park", role: "VP", joinedAt: "2022-09-10", major: "Software Engineering", avatar: "https://i.pravatar.cc/60?img=7" },
    { id: "m7", name: "Drew Santos", role: "Officer", joinedAt: "2023-01-10", major: "CS", avatar: "https://i.pravatar.cc/60?img=8" },
    { id: "m8", name: "Riley Chen", role: "Member", joinedAt: "2023-09-01", major: "Computer Science", avatar: "https://i.pravatar.cc/60?img=10" },
  ],
  "club-003": [
    { id: "m9", name: "Riley Okonkwo", role: "President", joinedAt: "2022-09-01", major: "Electrical Engineering", avatar: "https://i.pravatar.cc/60?img=9" },
    { id: "m10", name: "Quinn Torres", role: "VP", joinedAt: "2022-09-15", major: "Computer Engineering", avatar: "https://i.pravatar.cc/60?img=11" },
  ],
  "club-004": [
    { id: "m11", name: "Skylar Pham", role: "President", joinedAt: "2022-09-01", major: "Game Design", avatar: "https://i.pravatar.cc/60?img=12" },
    { id: "m12", name: "Jamie Wu", role: "Officer", joinedAt: "2023-02-01", major: "Art", avatar: "https://i.pravatar.cc/60?img=13" },
    { id: "m13", name: "Bex Moore", role: "Member", joinedAt: "2024-01-10", major: "CS", avatar: "https://i.pravatar.cc/60?img=14" },
  ],
  "club-005": [
    { id: "m14", name: "Avery Johnson", role: "President", joinedAt: "2022-09-01", major: "Linguistics", avatar: "https://i.pravatar.cc/60?img=15" },
    { id: "m15", name: "Blake Morales", role: "VP", joinedAt: "2022-09-10", major: "Education", avatar: "https://i.pravatar.cc/60?img=16" },
  ],
  "club-006": [
    { id: "m16", name: "Cam Estrada", role: "President", joinedAt: "2022-09-01", major: "Kinesiology", avatar: "https://i.pravatar.cc/60?img=17" },
    { id: "m17", name: "Dana Ford", role: "VP", joinedAt: "2022-09-05", major: "Sports Science", avatar: "https://i.pravatar.cc/60?img=18" },
    { id: "m18", name: "Jesse Park", role: "Member", joinedAt: "2023-09-01", major: "PE", avatar: "https://i.pravatar.cc/60?img=19" },
  ],
  "club-007": [
    { id: "m19", name: "Ellis Grant", role: "President", joinedAt: "2022-09-01", major: "Mechanical Engineering", avatar: "https://i.pravatar.cc/60?img=20" },
    { id: "m20", name: "Finley Hayes", role: "Officer", joinedAt: "2023-01-10", major: "Aerospace Engineering", avatar: "https://i.pravatar.cc/60?img=21" },
  ],
  "club-008": [
    { id: "m21", name: "Gabi Santos", role: "President", joinedAt: "2022-09-01", major: "Sociology", avatar: "https://i.pravatar.cc/60?img=22" },
    { id: "m22", name: "Hana Cruz", role: "VP", joinedAt: "2022-09-10", major: "Political Science", avatar: "https://i.pravatar.cc/60?img=23" },
    { id: "m23", name: "Ivan Reyes", role: "Officer", joinedAt: "2023-02-01", major: "Business", avatar: "https://i.pravatar.cc/60?img=24" },
    { id: "m24", name: "Jasmine Lim", role: "Member", joinedAt: "2023-09-01", major: "Nursing", avatar: "https://i.pravatar.cc/60?img=25" },
  ],
  "club-009": [
    { id: "m25", name: "Jake Miller", role: "President", joinedAt: "2022-09-01", major: "Business Administration", avatar: "https://i.pravatar.cc/60?img=26" },
    { id: "m26", name: "Kyle Brooks", role: "VP", joinedAt: "2022-09-05", major: "Finance", avatar: "https://i.pravatar.cc/60?img=27" },
    { id: "m27", name: "Liam Park", role: "Member", joinedAt: "2023-09-01", major: "Accounting", avatar: "https://i.pravatar.cc/60?img=28" },
  ],
  "club-010": [
    { id: "m28", name: "Luna Clarke", role: "President", joinedAt: "2022-09-01", major: "English", avatar: "https://i.pravatar.cc/60?img=29" },
    { id: "m29", name: "Mia Flores", role: "Officer", joinedAt: "2023-01-15", major: "Creative Writing", avatar: "https://i.pravatar.cc/60?img=30" },
  ],
  "club-011": [
    { id: "m30", name: "Noah Carter", role: "President", joinedAt: "2022-09-01", major: "Marketing", avatar: "https://i.pravatar.cc/60?img=31" },
    { id: "m31", name: "Olivia Reed", role: "VP", joinedAt: "2022-09-10", major: "Entrepreneurship", avatar: "https://i.pravatar.cc/60?img=32" },
  ],
  "club-012": [
    { id: "m32", name: "Priya Nair", role: "President", joinedAt: "2022-09-01", major: "Psychology", avatar: "https://i.pravatar.cc/60?img=33" },
    { id: "m33", name: "Quinn Adams", role: "VP", joinedAt: "2022-09-05", major: "Sociology", avatar: "https://i.pravatar.cc/60?img=34" },
    { id: "m34", name: "Rose Kim", role: "Member", joinedAt: "2023-09-01", major: "Biology", avatar: "https://i.pravatar.cc/60?img=35" },
  ],
};

// ─── POSTS ────────────────────────────────────────────────────────────────────
// BACKEND: SELECT * FROM club_posts WHERE club_id = :id ORDER BY created_at DESC
// Multiple members can post; leadership-only editing enforced via Supabase RLS
export const MOCK_POSTS: Record<string, ClubPost[]> = {
  "club-001": [
    { id: "p1", author: "Alex Rivera", authorAvatar: "https://i.pravatar.cc/40?img=1", content: "Our autonomous drone just won first place at the regional competition! 3 AM debugging sessions were worth it. This one's for the whole team! 🏆🤖", createdAt: "2025-02-18T14:00:00Z", likes: 42, liked: false, comments: [{ id: "c1", author: "Jordan Lee", text: "We earned this!! 🤖" }] },
    { id: "p2", author: "Sam Chen", authorAvatar: "https://i.pravatar.cc/40?img=3", content: "Reminder: ROS2 workshop this Thursday at 6PM! Bring your laptops. Building a nav stack from scratch — beginners 100% welcome 🙌", createdAt: "2025-02-15T09:30:00Z", likes: 18, liked: true, comments: [] },
  ],
  "club-002": [
    { id: "p3", author: "Morgan Kim", authorAvatar: "https://i.pravatar.cc/40?img=6", content: "Hack night recap: 24 people, 3 projects shipped in one night. Next hack night March 7th — put it on your calendar 🛠️", createdAt: "2025-02-20T11:00:00Z", likes: 31, liked: false, comments: [{ id: "c2", author: "Casey Park", text: "Best hack night yet!" }] },
    { id: "p4", author: "Drew Santos", authorAvatar: "https://i.pravatar.cc/40?img=8", content: "LeetCode sessions every Wednesday 7PM in JD 1601. Graph problems this month. Come grind 💻", createdAt: "2025-02-17T08:00:00Z", likes: 22, liked: false, comments: [] },
  ],
  "club-003": [
    { id: "p5", author: "Riley Okonkwo", authorAvatar: "https://i.pravatar.cc/40?img=9", content: "IEEEXtreme registration submitted! Fielding 3 teams this year. Practice starts next week — DM if you want a spot.", createdAt: "2025-02-19T13:00:00Z", likes: 27, liked: false, comments: [] },
  ],
  "club-004": [
    { id: "p6", author: "Skylar Pham", authorAvatar: "https://i.pravatar.cc/40?img=12", content: "Global Game Jam results — our team placed top 15% worldwide! Watch our 48-hour speedrun game at the link in bio 🎮", createdAt: "2025-02-21T16:00:00Z", likes: 55, liked: true, comments: [{ id: "c3", author: "Jamie Wu", text: "So proud of everyone 🙌" }] },
    { id: "p7", author: "Jamie Wu", authorAvatar: "https://i.pravatar.cc/40?img=13", content: "Spring Game Jam theme is: LOOP. Get your teams ready — kickoff is March 14th at 6PM. Solo entries welcome too!", createdAt: "2025-02-22T10:00:00Z", likes: 30, liked: false, comments: [] },
  ],
  "club-005": [
    { id: "p8", author: "Avery Johnson", authorAvatar: "https://i.pravatar.cc/40?img=15", content: "Sign circle this Friday at 5PM in the Student Union! Covering numbers, colors, and introductions. Perfect for day-one beginners 🤟", createdAt: "2025-02-18T10:00:00Z", likes: 19, liked: false, comments: [] },
  ],
  "club-006": [
    { id: "p9", author: "Cam Estrada", authorAvatar: "https://i.pravatar.cc/40?img=17", content: "Soccer bracket is LIVE for Spring Intramurals! 16 teams registered. Games start March 3rd. Schedule is on Discord ⚽", createdAt: "2025-02-22T09:00:00Z", likes: 44, liked: false, comments: [] },
  ],
  "club-007": [
    { id: "p10", author: "Ellis Grant", authorAvatar: "https://i.pravatar.cc/40?img=20", content: "Suspension geometry finalized 🔧 Aero package goes to the machine shop next week. On track for Formula SAE in May — crunch mode engaged!", createdAt: "2025-02-23T14:30:00Z", likes: 38, liked: false, comments: [{ id: "c4", author: "Finley Hayes", text: "Let's gooo! 🏎️" }] },
  ],
  "club-008": [
    { id: "p11", author: "Gabi Santos", authorAvatar: "https://i.pravatar.cc/40?img=22", content: "PCN rehearsals start this Sunday 🌺 All performers check call times in the group chat. Titas and lolos are already buying tickets lol", createdAt: "2025-02-20T18:00:00Z", likes: 61, liked: true, comments: [{ id: "c5", author: "Hana Cruz", text: "Can't wait!! 🇵🇭" }] },
    { id: "p12", author: "Ivan Reyes", authorAvatar: "https://i.pravatar.cc/40?img=24", content: "Kamayan Night is March 10th 🍚 Bring your appetite and your friends — there is always more than enough food.", createdAt: "2025-02-21T12:00:00Z", likes: 48, liked: false, comments: [] },
  ],
  "club-009": [
    { id: "p13", author: "Jake Miller", authorAvatar: "https://i.pravatar.cc/40?img=26", content: "Rush Week is officially HERE 🏛️ Come out to our mixer tonight at 7PM — food, games, meet the brotherhood. No pressure.", createdAt: "2025-02-21T12:00:00Z", likes: 29, liked: false, comments: [] },
  ],
  "club-010": [
    { id: "p14", author: "Luna Clarke", authorAvatar: "https://i.pravatar.cc/40?img=29", content: "Spring issue submissions OPEN ✍️ Fiction (under 3k words), poetry, creative nonfiction — due March 15. Submit via the link in bio.", createdAt: "2025-02-19T11:00:00Z", likes: 33, liked: false, comments: [{ id: "c6", author: "Mia Flores", text: "Finally submitting my short story!" }] },
  ],
  "club-011": [
    { id: "p15", author: "Noah Carter", authorAvatar: "https://i.pravatar.cc/40?img=31", content: "2nd place at the CSUN Case Competition! Judges loved our go-to-market strategy. On to regionals 📈", createdAt: "2025-02-22T15:00:00Z", likes: 47, liked: false, comments: [] },
  ],
  "club-012": [
    { id: "p16", author: "Priya Nair", authorAvatar: "https://i.pravatar.cc/40?img=33", content: "Sorority Recruitment starts next week! 💗 Open house Tuesday at 6PM — meet the sisters, hear about our philanthropy, ask anything.", createdAt: "2025-02-23T10:00:00Z", likes: 52, liked: false, comments: [{ id: "c7", author: "Quinn Adams", text: "So excited to meet everyone!" }] },
  ],
};

// ─── EVENTS ───────────────────────────────────────────────────────────────────
// BACKEND: SELECT * FROM club_events WHERE club_id = :id ORDER BY date ASC
export const MOCK_EVENTS: Record<string, ClubEvent[]> = {
  "club-001": [
    { id: "e1", title: "Intro to ROS2 Workshop", description: "Hands-on coverage of Robot Operating System 2. Perfect for beginners.", date: "2025-03-06", time: "6:00 PM", location: "Engineering Building, Room 204", rsvpCount: 31, rsvped: false },
    { id: "e2", title: "Spring Robotics Showcase", description: "Show off your semester projects! Open to the public.", date: "2025-04-12", time: "2:00 PM", location: "Main Quad", rsvpCount: 67, rsvped: true },
  ],
  "club-002": [
    { id: "e3", title: "Hack Night #8", description: "All-night building session. Pick a project, find a team, ship something.", date: "2025-03-07", time: "7:00 PM", location: "JD 1601", rsvpCount: 40, rsvped: false },
    { id: "e4", title: "Industry Speaker: Google SWE", description: "A senior engineer from Google on life on the job and how to land it.", date: "2025-03-20", time: "6:30 PM", location: "Oviatt Library, Room 18", rsvpCount: 85, rsvped: false },
  ],
  "club-003": [
    { id: "e5", title: "PCB Design Workshop", description: "Design and order your first PCB. KiCad tutorial included.", date: "2025-03-05", time: "5:00 PM", location: "Engineering Annex 110", rsvpCount: 22, rsvped: false },
    { id: "e6", title: "IEEEXtreme Practice", description: "Competitive programming practice for IEEEXtreme 24-hour hackathon.", date: "2025-03-12", time: "4:00 PM", location: "Jacaranda Hall 2703", rsvpCount: 18, rsvped: false },
  ],
  "club-004": [
    { id: "e7", title: "Spring Game Jam 2025", description: "48-hour solo or team jam. Theme: LOOP. Judged on creativity and polish.", date: "2025-03-14", time: "6:00 PM", location: "Jacaranda Hall 2502", rsvpCount: 60, rsvped: true },
  ],
  "club-005": [
    { id: "e8", title: "Deaf Culture Movie Night", description: "Watching CODA followed by open discussion. Subtitles provided.", date: "2025-03-08", time: "7:00 PM", location: "Student Union Theater", rsvpCount: 35, rsvped: false },
  ],
  "club-006": [
    { id: "e9", title: "Spring Intramural Soccer Kickoff", description: "Opening day of spring soccer. 16 teams, single elimination.", date: "2025-03-03", time: "4:00 PM", location: "Matador Soccer Field", rsvpCount: 120, rsvped: false },
    { id: "e10", title: "3v3 Basketball Tournament", description: "Sign up as a team or solo. Winner takes the trophy.", date: "2025-03-22", time: "1:00 PM", location: "Rec Center Gym B", rsvpCount: 48, rsvped: false },
  ],
  "club-007": [
    { id: "e11", title: "Formula SAE Technical Review", description: "Full systems review before competition. Open to all members.", date: "2025-03-15", time: "10:00 AM", location: "Engineering Complex Parking", rsvpCount: 18, rsvped: false },
  ],
  "club-008": [
    { id: "e12", title: "Pilipino Cultural Night 2025", description: "Annual showcase celebrating Filipino heritage through dance, music, and storytelling.", date: "2025-04-05", time: "7:00 PM", location: "VPAC Main Stage", rsvpCount: 200, rsvped: true },
    { id: "e13", title: "Kamayan Night", description: "Traditional Filipino feast — eat with your hands! Always more than enough food.", date: "2025-03-10", time: "6:00 PM", location: "Student Union Northridge Room", rsvpCount: 55, rsvped: false },
  ],
  "club-009": [
    { id: "e14", title: "Rush Week Mixer", description: "Meet the brotherhood, enjoy food and games, no commitment needed.", date: "2025-03-04", time: "7:00 PM", location: "Chapter House", rsvpCount: 45, rsvped: false },
    { id: "e15", title: "Philanthropy 5K Run", description: "Annual charity 5K. All proceeds to autism awareness programs.", date: "2025-03-29", time: "8:00 AM", location: "Botanic Garden Trail", rsvpCount: 90, rsvped: false },
  ],
  "club-010": [
    { id: "e16", title: "Open Mic Night: Spring Edition", description: "Share poems, short fiction, or creative nonfiction in a welcoming setting.", date: "2025-03-13", time: "7:00 PM", location: "Oasis Wellness Center", rsvpCount: 40, rsvped: false },
  ],
  "club-011": [
    { id: "e17", title: "Startup Pitch Night", description: "10 student startups pitch to a panel of local investors and founders.", date: "2025-03-18", time: "6:00 PM", location: "Bookstein Hall Auditorium", rsvpCount: 75, rsvped: false },
  ],
  "club-012": [
    { id: "e18", title: "Sorority Open House", description: "Meet sisters, learn about our philanthropy projects, ask anything.", date: "2025-03-04", time: "6:00 PM", location: "SRC Room 201", rsvpCount: 60, rsvped: false },
    { id: "e19", title: "Spring Philanthropy Gala", description: "Annual fundraiser supporting women's shelters in the San Fernando Valley.", date: "2025-04-19", time: "7:00 PM", location: "Sheraton Grand Los Angeles", rsvpCount: 110, rsvped: false },
  ],
};

// ─── CLUB DETAILS (full profile data) ─────────────────────────────────────────
// BACKEND: SELECT * FROM clubs WHERE id = :id  (full row, used in ClubProfilePage)
export const MOCK_CLUB_DETAILS: Record<string, ClubDetail> = {
  "club-001": { id: "club-001", name: "Robotics & AI Society", tagline: "Building the future, one bot at a time.", description: "We are a community of passionate engineers, designers, and visionaries dedicated to exploring the frontiers of robotics and AI. From weekly workshops to national competitions, we push the limits of what machines can do.", introMessage: "👋 Welcome to the Robotics & AI Society!\n\nWe meet every Thursday at 6 PM in the Engineering Building, Room 204. Whether you're a seasoned coder or just curious about robots — you belong here.\n\nJoin our Discord to stay in the loop!", logoUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop", bannerUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1280&h=320&fit=crop", accentColor: "#D22030", discordUrl: "https://discord.gg/example", memberCount: 84, category: "STEM", founded: "2019" },
  "club-002": { id: "club-002", name: "ACM", tagline: "Build. Ship. Connect.", description: "CSUN's ACM chapter is where developers, designers, and data scientists come together to build projects, prep for careers, and support each other through the CS grind.", introMessage: "👋 Welcome to ACM at CSUN!\n\nHack nights, LeetCode sessions, industry talks, and project teams every semester.\n\nCheck our Discord for weekly announcements!", logoUrl: "https://images.unsplash.com/photo-1526378722445-930c0d1b8cc5?w=200&h=200&fit=crop", bannerUrl: "https://images.unsplash.com/photo-1522252234503-e356532cafd5?w=1280&h=320&fit=crop", accentColor: "#1565C0", discordUrl: "https://discord.gg/example", memberCount: 120, category: "STEM", founded: "2010" },
  "club-003": { id: "club-003", name: "IEEE Student Branch", tagline: "Hands-on engineering.", description: "The IEEE Student Branch brings electrical and computer engineering students together through projects, competitions, PCB workshops, and industry speaker events.", introMessage: "⚡ Welcome to IEEE at CSUN!\n\nMeetings every Tuesday at 5PM in the Engineering Annex.\n\nJoin our Discord for project updates and workshop announcements!", logoUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop", bannerUrl: "https://images.unsplash.com/photo-1555617981-dac3880eac6b?w=1280&h=320&fit=crop", accentColor: "#00629B", discordUrl: "https://discord.gg/example", memberCount: 65, category: "STEM", founded: "2005" },
  "club-004": { id: "club-004", name: "Game Dev Club", tagline: "Make games with friends.", description: "We're a crew of developers, artists, and designers who make games — from 48-hour jams to full semester projects. All engines, all skill levels.", introMessage: "🎮 Welcome to Game Dev Club!\n\nWe meet every Wednesday at 6PM in Jacaranda Hall. Unity, Godot, Unreal — all welcome.\n\nJam season is always open. Let's build something weird.", logoUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=200&fit=crop", bannerUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbe0?w=1280&h=320&fit=crop", accentColor: "#7C3AED", discordUrl: "https://discord.gg/example", memberCount: 78, category: "Arts", founded: "2016" },
  "club-005": { id: "club-005", name: "ASL Club", tagline: "Connect through sign language.", description: "ASL Club welcomes hearing and Deaf students to learn American Sign Language together, celebrate Deaf culture, and build an inclusive campus community.", introMessage: "🤟 Welcome to ASL Club!\n\nSign circles every Friday at 5PM in the Student Union. No experience necessary.\n\nWe partner with the campus Deaf community for events and cultural celebrations.", logoUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop", bannerUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1280&h=320&fit=crop", accentColor: "#059669", memberCount: 45, category: "Cultural", founded: "2014" },
  "club-006": { id: "club-006", name: "Matadors Sports Club", tagline: "Compete. Train. Win.", description: "Organizing campus-wide intramural leagues for soccer, basketball, volleyball, flag football, and more. Competitive and recreational divisions for every skill level.", introMessage: "⚽ Welcome to Matadors Sports Club!\n\nSign up as a team or solo — we'll find a spot for you. Leagues run every semester with playoffs and trophies.\n\nCheck Discord for schedules and game updates.", logoUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop", bannerUrl: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1280&h=320&fit=crop", accentColor: "#DC2626", discordUrl: "https://discord.gg/example", memberCount: 200, category: "Sports", founded: "2008" },
  "club-007": { id: "club-007", name: "Matadors Racing", tagline: "Zero to sixty. Build it yourself.", description: "Students design, fabricate, and race a formula-style EV from scratch each year. Every subsystem — chassis, drivetrain, suspension, aero — is student-built for Formula SAE.", introMessage: "🏎️ Welcome to Matadors Racing!\n\nAlways looking for mechanical, electrical, and software engineers. No experience required.\n\nPit opens every Saturday at 9AM. Come see the car.", logoUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop", bannerUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1280&h=320&fit=crop", accentColor: "#B45309", discordUrl: "https://discord.gg/example", memberCount: 52, category: "STEM", founded: "2013" },
  "club-008": { id: "club-008", name: "Filipino American Student Association", tagline: "Pride. Heritage. Community.", description: "FASA is a home for Filipino and Filipino American students at CSUN — celebrating culture through Pilipino Cultural Night, community service, scholarships, and year-round events.", introMessage: "🌺 Welcome to FASA!\n\nWhether you're Filipino, Filipino American, or just love the culture — you belong here. We are more than a club; we're a family.\n\nGeneral meetings every other Thursday. Kamayan nights always have food.", logoUrl: "https://images.unsplash.com/photo-1537944434965-cf4679d1a598?w=200&h=200&fit=crop", bannerUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1280&h=320&fit=crop", accentColor: "#2563EB", discordUrl: "https://discord.gg/example", memberCount: 150, category: "Cultural", founded: "1973" },
  "club-009": { id: "club-009", name: "Alpha Epsilon Pi", tagline: "Brotherhood. Leadership. Service.", description: "AEPi is a fraternity rooted in Jewish values but open to all — developing leaders through brotherhood, national philanthropy supporting autism awareness, and professional development.", introMessage: "🏛️ Welcome to Alpha Epsilon Pi!\n\nRush Week events run throughout the first two weeks of each semester. Come to any event — no commitment, just meet the brotherhood.\n\nDM us on Instagram @aepi_csun.", logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&h=200&fit=crop", bannerUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1280&h=320&fit=crop", accentColor: "#1D4ED8", memberCount: 35, category: "Fraternity", founded: "2001" },
  "club-010": { id: "club-010", name: "Creative Writing Society", tagline: "Words that move the world.", description: "A workshop-based community for writers at every level. Peer critique workshops, open mic nights, and an annual literary magazine (The Northridge Review) featuring student work.", introMessage: "✍️ Welcome to the Creative Writing Society!\n\nWorkshops every other Thursday at 6PM. We do peer critique in small groups — supportive, honest, constructive.\n\nSubmit to the Spring Issue by March 15.", logoUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&h=200&fit=crop", bannerUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1280&h=320&fit=crop", accentColor: "#7C3AED", memberCount: 58, category: "Literature", founded: "2011" },
  "club-011": { id: "club-011", name: "Marketing & Entrepreneurship Club", tagline: "Build brands. Launch ideas.", description: "MEC trains the next generation of marketers and founders through case competitions, pitch nights, brand workshops, and mentorship from LA-based entrepreneurs.", introMessage: "📈 Welcome to MEC!\n\nMeetings every Tuesday at 6PM in Bookstein Hall. Bring ideas, ambition, and a willingness to pitch.\n\nCase competition season runs January through April. Startup Pitch Night is March 18.", logoUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=200&fit=crop", bannerUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1280&h=320&fit=crop", accentColor: "#059669", discordUrl: "https://discord.gg/example", memberCount: 95, category: "Business", founded: "2015" },
  "club-012": { id: "club-012", name: "Delta Phi Lambda", tagline: "Sisterhood. Service. Culture.", description: "Delta Phi Lambda is a multicultural sorority rooted in Asian American interests, dedicated to community service, academic excellence, and lifelong sisterhood.", introMessage: "💗 Welcome to Delta Phi Lambda!\n\nRecruitment is every spring — come to our open house and meet the sisters.\n\nWe do community service, cultural events, and lift each other through college and beyond. Follow us @dplcsun.", logoUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=200&fit=crop", bannerUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1280&h=320&fit=crop", accentColor: "#DB2777", memberCount: 42, category: "Sorority", founded: "2003" },
};
