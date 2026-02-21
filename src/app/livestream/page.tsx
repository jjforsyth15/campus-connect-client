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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-lg">Please log in to access livestreams.</p>
      </div>
    );
  }

  if (myStream) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <LivestreamHost
          token={myStream.token}
          livekitUrl={myStream.livekitUrl}
          title={myStream.livestream.title}
          onEnd={handleEndStream}
        />
      </div>
    );
  }

  if (viewingStream) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <LivestreamViewer
          token={viewingStream.token}
          livekitUrl={viewingStream.livekitUrl}
          title={viewingStream.livestream.title}
          hostName={`${viewingStream.livestream.User.firstName} ${viewingStream.livestream.User.lastName}`}
          onLeave={handleLeaveStream}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Livestreams</h1>

      {/* Go Live */}
      <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">Go Live</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter livestream title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="flex-1 px-4 py-3 rounded-lg bg-gray-950 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={handleGoLive}
            className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold whitespace-nowrap transition-colors"
          >
            🔴 Go Live
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {/* Active Streams */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Active Livestreams</h2>
          <button
            onClick={fetchActiveStreams}
            className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 text-sm transition-colors"
          >
            Refresh
          </button>
        </div>

        {loadingStreams ? (
          <p className="text-gray-500 text-center py-8">Loading streams...</p>
        ) : activeStreams.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No active livestreams right now. Be the first to go live!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeStreams.map((stream) => (
              <div
                key={stream.id}
                className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-red-500 font-bold text-xs tracking-wide">
                    ● LIVE
                  </span>
                  <span className="text-gray-400 text-sm">
                    👁 {stream.viewerCount} viewer{stream.viewerCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 truncate">
                  {stream.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {stream.User.firstName} {stream.User.lastName}
                </p>
                <p className="text-gray-600 text-xs mb-4">
                  Started {new Date(stream.startedAt).toLocaleTimeString()}
                </p>
                <button
                  onClick={() => handleJoinStream(stream.id)}
                  disabled={stream.User.id === (user as any)?.id}
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
                >
                  {stream.User.id === (user as any)?.id ? "Your Stream" : "Join Stream"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}