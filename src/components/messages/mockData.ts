import type { Message, Note, Thread, User } from "@/types/messages";
import { ME_ID } from "./constants";

const now = Date.now();
const mins = (m: number) => now - m * 60_000;
const avatar = (seed: string) =>
  `https://api.dicebear.com/9.x/icons/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

export const mockUsers: User[] = [
  { id: ME_ID, username: "Student1", displayName: "Student1", avatarUrl: avatar("me"), lastActiveAt: mins(1) },
  { id: "u1", username: "Student2", displayName: "Student2", avatarUrl: avatar("s2"), lastActiveAt: mins(47) },
  { id: "u2", username: "Student3", displayName: "Student3", avatarUrl: avatar("s3"), lastActiveAt: mins(180) },
  { id: "u3", username: "Student4", displayName: "Student4", avatarUrl: avatar("s4"), lastActiveAt: mins(25) },
  { id: "u4", username: "Student5", displayName: "Student5", avatarUrl: avatar("s5"), lastActiveAt: mins(5) },
];

export const mockThreads: Thread[] = [
  { id: "t1", participantIds: [ME_ID, "u1"], updatedAt: mins(10) },
  { id: "t2", participantIds: [ME_ID, "u2"], updatedAt: mins(180) },
  { id: "t3", participantIds: [ME_ID, "u3"], updatedAt: mins(25), isRequest: false },
  { id: "t4", participantIds: [ME_ID, "u4"], updatedAt: mins(2), isRequest: true },
];

export const mockNotes: Note[] = [
  { id: "n_me", userId: ME_ID, text: "Grinding CampusConnect", updatedAt: mins(12) },
  { id: "n1", userId: "u2", text: "Study group @ USU?", updatedAt: mins(40) },
  { id: "n2", userId: "u3", text: "Hack night 6pm", updatedAt: mins(90) },
  { id: "n3", userId: "u4", text: "Anyone going gym?", updatedAt: mins(25) },
];

export const mockMessages: Message[] = [
  { id: "m1", threadId: "t1", fromUserId: "u1", text: "Hey, are you going to the meeting?", createdAt: mins(47) },
  { id: "m2", threadId: "t1", fromUserId: ME_ID, text: "Yeah, what's the plan?", createdAt: mins(10), seenByUserIds: ["u1"] },
  { id: "m3", threadId: "t2", fromUserId: "u2", text: "Sent you an attachment.", createdAt: mins(180) },
  { id: "m4", threadId: "t3", fromUserId: "u3", text: "Wanna study later?", createdAt: mins(25) },
  { id: "m5", threadId: "t4", fromUserId: "u4", text: "Hey, can we connect?", createdAt: mins(2) },
];

export const mockMessagesByThread: Record<string, Message[]> = {
  t1: mockMessages.filter((m) => m.threadId === "t1").sort((a, b) => a.createdAt - b.createdAt),
  t2: mockMessages.filter((m) => m.threadId === "t2").sort((a, b) => a.createdAt - b.createdAt),
  t3: mockMessages.filter((m) => m.threadId === "t3").sort((a, b) => a.createdAt - b.createdAt),
  t4: mockMessages.filter((m) => m.threadId === "t4").sort((a, b) => a.createdAt - b.createdAt),
};
