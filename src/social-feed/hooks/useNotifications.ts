// =============================================================================
// hooks/useNotifications.ts
// Manages the notification panel.
// Uses mock data until the backend notifications endpoint is wired up.
// =============================================================================

import { useState, useCallback } from "react";
import type { AppNotification, NotifFilter } from "../types/feed.types";

// Mock data — replace with real API call when endpoint is ready
const MOCK_NOTIFS: AppNotification[] = [
  {
    id: "n1",
    type: "like",
    fromUser: { id: "u1", firstName: "Sara", lastName: "Hussein", profilePicture: null, userType: "student" },
    postPreview: "AI Resume Generator is live…",
    timeAgo: "2m",
    read: false,
  },
  {
    id: "n2",
    type: "comment",
    fromUser: { id: "u2", firstName: "Justin", lastName: "Ayson", profilePicture: null, userType: "student" },
    postPreview: "AR campus map is scanning…",
    timeAgo: "15m",
    read: false,
  },
  {
    id: "n3",
    type: "follow",
    fromUser: { id: "u3", firstName: "Joseph", lastName: "Forsyth", profilePicture: null, userType: "student" },
    timeAgo: "1h",
    read: false,
  },
  {
    id: "n4",
    type: "repost",
    fromUser: { id: "u4", firstName: "Elijah", lastName: "Cortez", profilePicture: null, userType: "student" },
    postPreview: "SRC schedule feature…",
    timeAgo: "3h",
    read: true,
  },
  {
    id: "n5",
    type: "mention",
    fromUser: { id: "u5", firstName: "Ivan", lastName: "Juarez", profilePicture: null, userType: "student" },
    postPreview: "Hey @sarah check this out…",
    timeAgo: "5h",
    read: true,
  },
];

interface UseNotificationsReturn {
  notifications: AppNotification[];
  unreadCount: number;
  filter: NotifFilter;
  setFilter: (f: NotifFilter) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFS);
  const [filter, setFilter] = useState<NotifFilter>("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  return { notifications, unreadCount, filter, setFilter, markAllRead, markRead };
}
