export type ID = string;

export type User = {
  id: ID;
  username: string;
  displayName: string;
  avatarUrl: string;     // user avatar (NOT company logo)
  lastActiveAt: number;  // epoch ms
};

export type Note = {
  id: ID;
  userId: ID;
  text: string;
  updatedAt: number;     // epoch ms
};

export type Attachment = {
  id: ID;
  type: "image" | "file" | "audio";
  name: string;
  url: string;           // object URL (files) or remote URL (gifs)
  size?: number;
};

export type Message = {
  id: ID;
  threadId: ID;
  fromUserId: ID;
  text: string;
  createdAt: number;
  attachments?: Attachment[];
  seenByUserIds?: ID[];
};

export type Thread = {
  id: ID;
  participantIds: ID[];
  isRequest?: boolean;
  updatedAt: number;
};
