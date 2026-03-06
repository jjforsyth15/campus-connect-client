"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "@/lib/axios";
import type { ID, Message, Note, Thread, User } from "@/types/messages";

// Map backend conversation to frontend Thread
function toThread(conv: any): Thread {
  return {
    id: conv.id,
    participantIds: conv.Participants.map((p: any) => p.userId),
    updatedAt: new Date(conv.updatedAt).getTime(),
    isRequest: false,
  };
}

// Map backend user participant to frontend User
function toUser(participant: any): User {
  const u = participant.User || participant;
  return {
    id: u.id,
    username: u.firstName?.toLowerCase() + (u.lastName ? u.lastName.toLowerCase() : ""),
    displayName: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
    avatarUrl: u.profilePicture || "",
    lastActiveAt: Date.now(),
  };
}

// Map backend message to frontend Message
function toMessage(msg: any): Message {
  return {
    id: msg.id,
    threadId: msg.conversationId,
    fromUserId: msg.senderId,
    text: msg.content || "",
    createdAt: new Date(msg.createdAt).getTime(),
    attachments: [],
    seenByUserIds: [],
  };
}

function getToken(): string | null {
  try { return localStorage.getItem("token"); } catch { return null; }
}

function getStoredUser(): any | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function useMessagesData() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [notes] = useState<Note[]>([]);
  const [messagesByThread, setMessagesByThread] = useState<Record<string, Message[]>>({});
  const [selectedThreadId, setSelectedThreadId] = useState<ID | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typingByThread, setTypingByThread] = useState<Record<string, string | null>>({});
  const socketRef = useRef<Socket | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const meIdRef = useRef<string>("");

  const storedUser = getStoredUser();
  const meId: ID = storedUser?.id || "";
  meIdRef.current = meId;

  const me: User = useMemo(() => ({
    id: meId,
    username: storedUser?.firstName?.toLowerCase() || "me",
    displayName: `${storedUser?.firstName || ""} ${storedUser?.lastName || ""}`.trim() || "You",
    avatarUrl: storedUser?.profilePicture || "",
    lastActiveAt: Date.now(),
  }), [meId, storedUser?.firstName, storedUser?.lastName, storedUser?.profilePicture]);

  const usersWithMe = useMemo(() => {
    if (users.some((u) => u.id === meId)) return users;
    return [me, ...users];
  }, [users, meId, me]);

  const allMessages = useMemo(() => Object.values(messagesByThread).flat(), [messagesByThread]);
  const threadMessages = useMemo(
    () => (selectedThreadId ? messagesByThread[selectedThreadId] ?? [] : []),
    [selectedThreadId, messagesByThread]
  );

  // Fetch conversations on mount
  const fetchConversations = useCallback(async () => {
    const token = getToken();
    if (!token) { setError("Not authenticated"); setLoading(false); return; }

    try {
      const res = await api.get("/api/v1/messages/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const convos: Thread[] = [];
      const userMap = new Map<ID, User>();

      for (const conv of res.data) {
        convos.push(toThread(conv));

        for (const p of conv.Participants) {
          if (p.userId !== meIdRef.current && !userMap.has(p.userId)) {
            userMap.set(p.userId, toUser(p));
          }
        }

        // Store the last message preview if it exists
        if (conv.Messages?.length > 0) {
          const msgs = conv.Messages.map(toMessage);
          setMessagesByThread((prev) => ({
            ...prev,
            [conv.id]: msgs,
          }));
        }
      }

      setThreads(convos);
      setUsers(Array.from(userMap.values()));
      setError(null);

      // After fetching, join all conversation rooms via socket
      // This ensures socket is in the right rooms even if it connected before fetch completed
      if (socketRef.current?.connected) {
        convos.forEach((conv) => {
          socketRef.current!.emit("conversation:join", { conversationId: conv.id });
        });
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (threadId: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await api.get(`/api/v1/messages/conversations/${threadId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const msgs = res.data.map(toMessage).reverse();
      setMessagesByThread((prev) => ({ ...prev, [threadId]: msgs }));
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  }, []);

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch messages and join socket room when selecting a thread
  useEffect(() => {
    if (selectedThreadId) {
      fetchMessages(selectedThreadId);
      // Join the socket room when opening a conversation
      if (socketRef.current?.connected) {
        socketRef.current.emit("conversation:join", { conversationId: selectedThreadId });
      }
    }
  }, [selectedThreadId, fetchMessages]);

  // Socket.io connection — runs once on mount
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000", {
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      // Re-join all conversation rooms on reconnect
      fetchConversations();
    });

    socket.on("message:new", (msg: any) => {
      const mapped = toMessage(msg);
      setMessagesByThread((prev) => {
        const existing = prev[mapped.threadId] ?? [];
        // Avoid duplicates in case REST and socket both add the message
        if (existing.some((m) => m.id === mapped.id)) return prev;
        return {
          ...prev,
          [mapped.threadId]: [...existing, mapped],
        };
      });
      // Bump thread to top
      setThreads((prev) =>
        prev.map((t) => (t.id === mapped.threadId ? { ...t, updatedAt: Date.now() } : t))
      );
    });

    socket.on("message:edited", (msg: any) => {
      const mapped = toMessage(msg);
      setMessagesByThread((prev) => ({
        ...prev,
        [mapped.threadId]: (prev[mapped.threadId] ?? []).map((m) =>
          m.id === mapped.id ? mapped : m
        ),
      }));
    });

    socket.on("message:deleted", (data: { messageId: string; conversationId: string }) => {
      setMessagesByThread((prev) => ({
        ...prev,
        [data.conversationId]: (prev[data.conversationId] ?? []).map((m) =>
          m.id === data.messageId ? { ...m, text: "" } : m
        ),
      }));
    });

    socket.on("message:reaction", (data: any) => {
      // Reactions are visible when re-fetching messages
      // Could add inline reaction state here later
    });

    socket.on("typing:indicator", (data: { conversationId: string; userId: string; isTyping: boolean }) => {
      // Update typing state for the conversation
      setTypingByThread((prev) => ({
        ...prev,
        [data.conversationId]: data.isTyping ? data.userId : null,
      }));
    });

    socket.on("message:read_receipt", (data: { conversationId: string; userId: string; messageId: string }) => {
      // Can wire this to seenByUserIds later
    });

    socket.on("connect_error", (err: Error) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Send message via socket (backend broadcasts message:new to all participants including sender)
  const onSend = useCallback(async (threadId: string, text: string, attachmentUrls?: string[]) => {
    if (!text.trim() || !socketRef.current?.connected) {
      // Fallback to REST if socket is not connected
      const token = getToken();
      if (!token) return;
      try {
        const res = await api.post(
          `/api/v1/messages/conversations/${threadId}/messages`,
          { content: text.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const mapped = toMessage(res.data);
        setMessagesByThread((prev) => ({
          ...prev,
          [threadId]: [...(prev[threadId] ?? []), mapped],
        }));
        setThreads((prev) =>
          prev.map((t) => (t.id === threadId ? { ...t, updatedAt: Date.now() } : t))
        );
      } catch (err) {
        console.error("Failed to send message via REST fallback:", err);
      }
      return;
    }

    // Send via socket — backend saves to DB and broadcasts message:new to all in room
    socketRef.current.emit("message:send", { conversationId: threadId, content: text.trim() });
  }, []);

  // Edit a message via socket (backend broadcasts message:edited to all participants)
  const onEditMessage = useCallback(async (messageId: string, newText: string) => {
    if (!newText.trim() || !socketRef.current) return;
    socketRef.current.emit("message:edit", { messageId, content: newText.trim() });
  }, []);

  // Delete a message via socket (backend broadcasts message:deleted to all participants)
  const onDeleteMessage = useCallback(async (messageId: string) => {
    if (!socketRef.current) return;
    socketRef.current.emit("message:delete", { messageId });
  }, []);

  // Debounced typing start - fires on each keystroke, auto-stops after 3s of no input
  const onTypingStart = useCallback((threadId: string) => {
    if (!socketRef.current) return;

    // Emit typing start
    socketRef.current.emit("typing:start", { conversationId: threadId });

    // Clear existing auto-stop timer
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

    // Auto-stop after 3 seconds of no typing
    typingTimerRef.current = setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit("typing:stop", { conversationId: threadId });
      }
    }, 3000);
  }, []);

  // Emit typing stop via socket (on blur or message send)
  const onTypingStop = useCallback((threadId: string) => {
    if (!socketRef.current) return;
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    socketRef.current.emit("typing:stop", { conversationId: threadId });
  }, []);

  // Notes are local-only for now (no backend support)
  const onUpdateNote = useCallback(async (text: string) => {
    // Could persist to backend later
  }, []);

  // Start a DM with a user
  const onPickUser = useCallback(async (userId: ID) => {
    if (userId === meIdRef.current) return;
    const token = getToken();
    if (!token) return;

    // Check if thread already exists
    const existing = threads.find(
      (t) => !t.isRequest && t.participantIds.includes(meIdRef.current) && t.participantIds.includes(userId)
    );
    if (existing) {
      setSelectedThreadId(existing.id);
      return;
    }

    try {
      const res = await api.post(
        "/api/v1/messages/conversations",
        { isGroup: false, participantIds: [userId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newThread = toThread(res.data);
      setThreads((prev) => [newThread, ...prev]);
      setSelectedThreadId(newThread.id);

      // Add the other user if not already in state
      for (const p of res.data.Participants) {
        if (p.userId !== meIdRef.current) {
          setUsers((prev) => {
            if (prev.some((u) => u.id === p.userId)) return prev;
            return [...prev, toUser(p)];
          });
        }
      }

      // Join the socket room for the new conversation
      if (socketRef.current?.connected) {
        socketRef.current.emit("conversation:join", { conversationId: newThread.id });
      }
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  }, [threads]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchConversations();
  }, [fetchConversations]);

  return {
    threads,
    usersWithMe,
    notes,
    allMessages,
    threadMessages,
    selectedThreadId,
    setSelectedThreadId,
    me,
    loading,
    error,
    onSend,
    onEditMessage,
    onDeleteMessage,
    onTypingStart,
    onTypingStop,
    typingByThread,
    onUpdateNote,
    onPickUser,
    refresh,
  };
}