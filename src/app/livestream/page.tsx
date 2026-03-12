"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthorize } from "@/lib/useAuthorize";
import { api } from "@/lib/axios";
import LivestreamViewer from "./LivestreamViewer";
import LivestreamHost from "./LivestreamHost";

interface Livestream {
  id: string;
  title: string;
  status: string;
  viewerCount: number;
  startedAt: string;
  endedAt: string | null;
  User: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
    userType: string;
  };
}

export default function LivestreamPage() {
  const { auth, user, token, loading } = useAuthorize();
  const [activeStreams, setActiveStreams] = useState<Livestream[]>([]);
  const [myStream, setMyStream] = useState<{
    livestream: Livestream;
    token: string;
    livekitUrl: string;
    roomName: string;
  } | null>(null);
  const [viewingStream, setViewingStream] = useState<{
    livestream: Livestream;
    token: string;
    livekitUrl: string;
    roomName: string;
  } | null>(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loadingStreams, setLoadingStreams] = useState(false);

  const fetchActiveStreams = useCallback(async () => {
    if (!token) return;
    setLoadingStreams(true);
    try {
      const res = await api.get("/api/v1/livestreams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActiveStreams(res.data.livestreams);
    } catch (err) {
      console.error("Failed to fetch streams:", err);
    } finally {
      setLoadingStreams(false);
    }
  }, [token]);

  useEffect(() => {
    if (auth && token) {
      fetchActiveStreams();
      const interval = setInterval(fetchActiveStreams, 10000);
      return () => clearInterval(interval);
    }
  }, [auth, token, fetchActiveStreams]);

  const handleGoLive = async () => {
    if (!title.trim()) {
      setError("Please enter a title for your livestream");
      return;
    }
    setError("");
    try {
      const res = await api.post(
        "/api/v1/livestreams",
        { title: title.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data.livestream;
      setMyStream({
        livestream: data,
        token: data.token,
        livekitUrl: data.livekitUrl,
        roomName: data.roomName,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to start livestream");
    }
  };

  const handleEndStream = async () => {
    if (!myStream) return;
    try {
      await api.patch(
        `/api/v1/livestreams/${myStream.livestream.id}/end`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyStream(null);
      fetchActiveStreams();
    } catch (err: any) {
      console.error("Failed to end stream:", err);
    }
  };

  const handleJoinStream = async (streamId: string) => {
    try {
      const res = await api.post(
        `/api/v1/livestreams/${streamId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data.livestream;
      setViewingStream({
        livestream: data,
        token: data.token,
        livekitUrl: data.livekitUrl,
        roomName: data.roomName,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to join livestream");
    }
  };

  const handleLeaveStream = () => {
    setViewingStream(null);
  };

  // ── Shared page wrapper ────────────────────────────────────────────────────
  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0007] via-[#190010] to-[#0F0007]">
      {children}
    </div>
  );

  if (loading) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="w-12 h-12 border-4 border-[#A80532] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 text-sm tracking-wide">Loading MatadorConnect Live…</p>
        </div>
      </Shell>
    );
  }

  if (!auth) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
          {/* LIVE icon */}
          <div className="w-20 h-20 rounded-full bg-[#A80532]/20 border border-[#A80532]/40 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#A80532]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none"/>
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Sign in to watch &amp; stream</h2>
            <p className="text-white/50 text-sm max-w-xs">You need to be logged in to access Matador Live streams.</p>
          </div>
          <a
            href="/access/login"
            className="px-8 py-3 rounded-full bg-[#A80532] hover:bg-[#8a0429] text-white font-semibold transition-colors shadow-lg shadow-[#A80532]/30"
          >
            Log In
          </a>
        </div>
      </Shell>
    );
  }

  if (myStream) {
    return (
      <Shell>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <LivestreamHost
            token={myStream.token}
            livekitUrl={myStream.livekitUrl}
            title={myStream.livestream.title}
            onEnd={handleEndStream}
          />
        </div>
      </Shell>
    );
  }

  if (viewingStream) {
    return (
      <Shell>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <LivestreamViewer
            token={viewingStream.token}
            livekitUrl={viewingStream.livekitUrl}
            title={viewingStream.livestream.title}
            hostName={`${viewingStream.livestream.User.firstName} ${viewingStream.livestream.User.lastName}`}
            onLeave={handleLeaveStream}
          />
        </div>
      </Shell>
    );
  }

  // ── Browse page (default) ─────────────────────────────────────────────────
  return (
    <Shell>
      {/* Top bar */}
      <header className="border-b border-white/10 backdrop-blur-md bg-black/20 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#A80532] font-black text-lg tracking-tight">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" opacity="0.2"/>
                <circle cx="12" cy="12" r="6" opacity="0.4"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              MatadorConnect
            </span>
            <span className="text-white/30 text-sm">/ Live</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A80532] animate-pulse" />
            <span className="text-white/60 text-xs font-medium uppercase tracking-widest">Matador Live</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Go Live card ───────────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm mb-10 p-6">
          {/* Subtle gradient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#A80532]/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A80532] shadow-[0_0_8px_#A80532]" />
              <h2 className="text-white font-bold text-xl">Go Live</h2>
            </div>
            <p className="text-white/40 text-sm mb-5">Share with your fellow Matadors in real time</p>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Give your stream a title…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGoLive()}
                maxLength={100}
                className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-[#A80532] focus:ring-1 focus:ring-[#A80532]/40 transition-all text-sm"
              />
              <button
                onClick={handleGoLive}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#A80532] hover:bg-[#8a0429] active:scale-95 text-white font-semibold text-sm whitespace-nowrap transition-all shadow-lg shadow-[#A80532]/30"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Go Live
              </button>
            </div>
            {error && (
              <p className="flex items-center gap-2 text-red-400 text-xs mt-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                {error}
              </p>
            )}
          </div>
        </div>

        {/* ── Active streams section ─────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-bold text-xl">Live Now</h2>
              <p className="text-white/40 text-sm mt-0.5">
                {activeStreams.length > 0
                  ? `${activeStreams.length} stream${activeStreams.length !== 1 ? "s" : ""} going on`
                  : "No streams yet"}
              </p>
            </div>
            <button
              onClick={fetchActiveStreams}
              disabled={loadingStreams}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm transition-all disabled:opacity-40"
            >
              <svg className={`w-3.5 h-3.5 ${loadingStreams ? "animate-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h5M20 20v-5h-5"/><path d="M4 9a9 9 0 0 1 15-6.7M20 15a9 9 0 0 1-15 6.7"/></svg>
              Refresh
            </button>
          </div>

          {loadingStreams ? (
            /* Skeleton cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-white/5 overflow-hidden animate-pulse">
                  <div className="aspect-video bg-white/5" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : activeStreams.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 border border-white/5 rounded-2xl bg-white/[0.02]">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M15 10l4.55-2.27A1 1 0 0 1 21 8.72v6.56a1 1 0 0 1-1.45.9L15 14M3 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white/40 font-medium">No streams live right now</p>
                <p className="text-white/20 text-sm mt-1">Be the first Matador to go live!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeStreams.map((stream) => {
                const isOwn = stream.User.id === (user as any)?.id;
                const initials = `${stream.User.firstName[0] ?? ""}${stream.User.lastName[0] ?? ""}`.toUpperCase();
                const elapsed = Math.floor((Date.now() - new Date(stream.startedAt).getTime()) / 60000);
                return (
                  <div
                    key={stream.id}
                    className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 overflow-hidden transition-all"
                  >
                    {/* Thumbnail placeholder */}
                    <div className="relative aspect-video bg-gradient-to-br from-[#1a0010] to-[#0a0005] flex items-center justify-center">
                      <svg className="w-12 h-12 text-white/10" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                        <rect x="2" y="7" width="20" height="15" rx="2"/>
                        <path d="M17 2l5 5-5 5"/>
                        <path d="M14 2H7"/>
                      </svg>
                      {/* LIVE badge */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-[#A80532] rounded-md px-2 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="text-white text-[10px] font-bold tracking-widest uppercase">Live</span>
                      </div>
                      {/* Viewer count badge */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-md px-2 py-0.5">
                        <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        <span className="text-white/80 text-[10px] font-medium">{stream.viewerCount}</span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4">
                      <h3 className="text-white font-semibold text-sm leading-snug mb-2 truncate">{stream.title}</h3>
                      <div className="flex items-center gap-2 mb-4">
                        {/* Avatar chip */}
                        <div className="w-5 h-5 rounded-full bg-[#A80532]/80 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
                          {initials}
                        </div>
                        <span className="text-white/50 text-xs truncate">
                          {stream.User.firstName} {stream.User.lastName}
                        </span>
                        <span className="text-white/20 text-xs ml-auto flex-shrink-0">{elapsed}m ago</span>
                      </div>
                      <button
                        onClick={() => !isOwn && handleJoinStream(stream.id)}
                        disabled={isOwn}
                        className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm transition-all ${
                          isOwn
                            ? "bg-white/10 text-white/30 cursor-default"
                            : "bg-[#A80532] hover:bg-[#8a0429] active:scale-95 shadow-md shadow-[#A80532]/20"
                        }`}
                      >
                        {isOwn ? "Your Stream" : "Watch Now"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </Shell>
  );
}