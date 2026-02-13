/*
 * ================================
 *  NOTES for BACKEND 
 * ================================
 *
 * This file defines the core data models used by the Messages page.
 * The frontend currently runs on mock data, but backend should return
 * objects that match these exact shapes.
 *
 * Assumptions:
 * - The logged-in user is identified server-side 
 * - All timestamps are epoch milliseconds.
 * - IDs are strings 
 *
 * Backend responsibilities:
 * - Return threads where the current user ({{username}}) is a participant.
 * - Return messages per thread (preferably paginated).
 * - Handle read receipts.
 * - Handle uploads and return permanent attachment URLs.
 * - Handle blocking, reporting, and note updates.
 *
 */

export type ID = string;

/*
 * User
 * ----
 * Represents a user in the messaging system.
 *
 * Backend must:
 * - Provide id, username, displayName
 * - Provide avatarUrl (stored image URL or CDN path)
 * - Provide lastActiveAt (epoch ms) for presence display
 *
 * lastActiveAt is used to render:
 * - "Active now"
 * - "Active 5m ago"
 * - etc.
 */
export type User = {
  id: ID;
  username: string;
  displayName: string;
  avatarUrl: string;     // permanent image URL
  lastActiveAt: number;  // epoch ms
};


/*
 * Note
 * ----
 * Short user status message shown in the NotesBar.
 *
 * Backend:
 * - Store one note per user 
 * - Return updatedAt for sorting (most recent first)
 * - Provide PUT /users/me/note endpoint
 */
export type Note = {
  id: ID;
  userId: ID;
  text: string;
  updatedAt: number;     // epoch ms
};


/*
 * Attachment
 * ----------
 * Represents a file, image, audio clip, or GIF sent in a message.
 *
 * 
 * - Frontend currently creates temporary object URLs for files.
 * - Backend hast to replace those with permanent URLs after upload.
 *
 */
export type Attachment = {
  id: ID;
  type: "image" | "file" | "audio";
  name: string;
  url: string;           // hast to be permanent storage URL (S3/CDN/etc.)
  size?: number;
};


/*
 * Message
 * -------
 * Represents a single message inside a thread.
 *
 * Backend:
 * - Return messages sorted by createdAt ASC
 * - Include attachments (if any)
 * - Support read receipts
 *
 */
export type Message = {
  id: ID;
  threadId: ID;
  fromUserId: ID;
  text: string;
  createdAt: number;      // epoch ms
  attachments?: Attachment[];
  seenByUserIds?: ID[];   // optional, depending on read strategy
};


/**
 * Thread
 * ------
 * Represents a conversation between two or more users.
 *
 * Backend:
 * - Return only threads where {{username}} is included in participantIds
 * - Include updatedAt (used for sorting thread list)
 * - Include isRequest flag (used for "Message Requests" tab)
 *
 */
export type Thread = {
  id: ID;
  participantIds: ID[];
  isRequest?: boolean;    // true = message request
  updatedAt: number;      // epoch ms (used for sorting)
};
