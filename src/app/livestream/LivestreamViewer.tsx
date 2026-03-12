"use client";

import React, { useEffect, useState } from "react";
import {
  LiveKitRoom,
  VideoTrack,
  useTracks,
  useRoomContext,
} from "@livekit/components-react";
import { Track, RoomEvent } from "livekit-client";

interface LivestreamViewerProps {
  token: string;
  livekitUrl: string;
  title: string;
  hostName: string;
  onLeave: () => void;
}

function ViewerDisplay({
  title,
  hostName,
  onLeave,
}: {
  title: string;
  hostName: string;
  onLeave: () => void;
}) {
  const room = useRoomContext();
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    const updateViewers = () => {
      const count = Math.max(0, room.numParticipants - 1);
      setViewerCount(count);
    };

    updateViewers();
    room.on(RoomEvent.ParticipantConnected, updateViewers);
    room.on(RoomEvent.ParticipantDisconnected, updateViewers);

    return () => {
      room.off(RoomEvent.ParticipantConnected, updateViewers);
      room.off(RoomEvent.ParticipantDisconnected, updateViewers);
    };
  }, [room]);

  const tracks = useTracks([Track.Source.ScreenShare, Track.Source.Camera]);
  const screenTrack = tracks.find(
    (t) => t.source === Track.Source.ScreenShare && !t.participant.isLocal
  );
  const cameraTrack = tracks.find(
    (t) => t.source === Track.Source.Camera && !t.participant.isLocal
  );

  const handleLeave = () => {
    room.disconnect();
    onLeave();
  };

  return (
    <div className="w-full select-none">

      {/* ── Header bar ────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-5 gap-4">
        <div className="min-w-0">
          <h2 className="text-white font-bold text-2xl leading-tight truncate">{title}</h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="flex items-center gap-1.5 bg-[#A80532] rounded-md px-2.5 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-white text-[11px] font-bold tracking-widest uppercase">Live</span>
            </span>
            <span className="flex items-center gap-1.5 text-white/50 text-sm">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {viewerCount} viewer{viewerCount !== 1 ? "s" : ""}
            </span>
            <span className="text-white/30">·</span>
            <span className="text-white/40 text-sm">
              <span className="text-white/30">Hosted by </span>
              {hostName}
            </span>
          </div>
        </div>

        {/* Leave button */}
        <button
          onClick={handleLeave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-white/70 hover:text-white font-semibold text-sm transition-all border border-white/10 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Leave
        </button>
      </div>

      {/* ── Video area ─────────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
        {screenTrack ? (
          <VideoTrack trackRef={screenTrack} className="w-full h-full object-contain" />
        ) : cameraTrack ? (
          <VideoTrack trackRef={cameraTrack} className="w-full h-full object-contain" />
        ) : (
          /* Waiting for host state */
          <div className="flex flex-col items-center gap-5">
            {/* Pulsing ring animation */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-[#A80532]/10 border border-[#A80532]/20 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#A80532]/20 border border-[#A80532]/40 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#A80532] animate-pulse" />
                </div>
              </div>
              {/* Ping rings */}
              <div className="absolute inset-0 rounded-full border border-[#A80532]/20 animate-ping" />
            </div>
            <div className="text-center">
              <p className="text-white/50 font-medium">Waiting for host</p>
              <p className="text-white/25 text-sm mt-1">
                {hostName} will share their screen soon…
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Host info strip ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mt-4 px-1">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#A80532]/60 border border-[#A80532]/40 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">
            {hostName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-white/80 text-sm font-semibold truncate">{hostName}</p>
          <p className="text-white/30 text-xs">Streaming · Matador Live</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-white/30 text-xs">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          {viewerCount} watching
        </div>
      </div>
    </div>
  );
}

export default function LivestreamViewer({
  token,
  livekitUrl,
  title,
  hostName,
  onLeave,
}: LivestreamViewerProps) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={livekitUrl}
      connect={true}
      video={false}
      audio={false}
    >
      <ViewerDisplay title={title} hostName={hostName} onLeave={onLeave} />
    </LiveKitRoom>
  );
}