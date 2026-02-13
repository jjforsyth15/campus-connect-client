import type { ID, User, Thread, Message, Note } from "./types";

const now = Date.now();
const mins = (m: number) => now - m * 60_000;

export const ME_ID: ID = "me";

// DiceBear robot/icon avatars (not real people)
const dice = (seed: string) =>
  `https://api.dicebear.com/9.x/icons/svg?seed=${encodeURIComponent(
    seed
  )}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

export const users: User[] = [
  {
    id: ME_ID,
    username: "vramgh0",
    displayName: "Vram",
    avatarUrl: dice("vramgh0"), 
    lastActiveAt: mins(1),
  },
  { id: "u1", username: "Mark_S", displayName: "Mark", avatarUrl: dice("Mark"), lastActiveAt: mins(47) },
  { id: "u2", username: "SamSam", displayName: "Sam G", avatarUrl: dice("Sam"), lastActiveAt: mins(180) },
  { id: "u3", username: "Cathy00", displayName: "Cathy", avatarUrl: dice("Cathy"), lastActiveAt: mins(25) },
  { id: "u4", username: "user09288", displayName: "user", avatarUrl: dice("user"), lastActiveAt: mins(5) },
  { id: "u5", username: "jefff", displayName: "Jef", avatarUrl: dice("Jef"), lastActiveAt: mins(9) },
  { id: "u6", username: "Jack03", displayName: "Jack", avatarUrl: dice("Jack"), lastActiveAt: mins(65) },
];

export const notes: Note[] = [
  { id: "n_me", userId: ME_ID, text: "Grinding CampusConnect ", updatedAt: mins(12) },
  { id: "n1", userId: "u5", text: "Study group @ USU?", updatedAt: mins(40) },
  { id: "n2", userId: "u6", text: "Hack night 6pm ", updatedAt: mins(90) },
  { id: "n3", userId: "u4", text: "Anyone going gym?", updatedAt: mins(25) },
];

export const threads: Thread[] = [
  { id: "t1", participantIds: [ME_ID, "u1"], updatedAt: mins(47) },
  { id: "t2", participantIds: [ME_ID, "u2"], updatedAt: mins(180) },
  { id: "t3", participantIds: [ME_ID, "u3"], updatedAt: mins(25), isRequest: false },
  { id: "t_req1", participantIds: [ME_ID, "u4"], updatedAt: mins(5), isRequest: true },
];

export const messages: Message[] = [
  { id: "m1", threadId: "t1", fromUserId: "u1", text: "yo are you going to the meeting?", createdAt: mins(47) },
  { id: "m2", threadId: "t2", fromUserId: "u2", text: "Sent an attachment.", createdAt: mins(180) },
  { id: "m3", threadId: "t3", fromUserId: "u3", text: "Active 25m ago", createdAt: mins(25) },
  { id: "m4", threadId: "t1", fromUserId: ME_ID, text: "Got it — what’s the plan?", createdAt: mins(10), seenByUserIds: ["u1"] },
];
