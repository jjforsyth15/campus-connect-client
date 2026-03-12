"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  LiveKitRoom,
  VideoTrack,
  useTracks,
  useLocalParticipant,
  useRoomContext,
} from "@livekit/components-react";
import { Track, RoomEvent } from "livekit-client";

interface LivestreamHostProps {
  token: string;
  livekitUrl: string;
  title: string;
  onEnd: () => void;
}

function HostControls({ title, onEnd }: { title: string; onEnd: () => void }) {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
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

  const toggleScreenShare = useCallback(async () => {
    try {
      await localParticipant.setScreenShareEnabled(!isScreenSharing);
      setIsScreenSharing(!isScreenSharing);
    } catch (err) {
      console.error("Screen share error:", err);
    }
  }, [localParticipant, isScreenSharing]);

  const toggleCamera = useCallback(async () => {
    try {
      await localParticipant.setCameraEnabled(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    } catch (err) {
      console.error("Camera error:", err);
    }
  }, [localParticipant, isCameraOn]);

  const toggleMic = useCallback(async () => {
    try {
      await localParticipant.setMicrophoneEnabled(!isMicOn);
      setIsMicOn(!isMicOn);
    } catch (err) {
      console.error("Mic error:", err);
    }
  }, [localParticipant, isMicOn]);

  const handleEnd = useCallback(() => {
    room.disconnect();
    onEnd();
  }, [room, onEnd]);

  const tracks = useTracks([Track.Source.ScreenShare, Track.Source.Camera]);
  const screenTrack = tracks.find(
    (t) => t.source === Track.Source.ScreenShare && t.participant.isLocal
  );
  const cameraTrack = tracks.find(
    (t) => t.source === Track.Source.Camera && t.participant.isLocal
  );

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
          </div>
        </div>

        {/* End stream button */}
        <button
          onClick={handleEnd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-700/80 hover:bg-red-600 active:scale-95 text-white font-semibold text-sm transition-all border border-red-500/30 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
          End Stream
        </button>
      </div>

      {/* ── Video area ─────────────────────────────────────────────────────── */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center mb-5">
        {screenTrack ? (
          <VideoTrack trackRef={screenTrack} className="w-full h-full object-contain" />
        ) : cameraTrack ? (
          <VideoTrack trackRef={cameraTrack} className="w-full h-full object-contain" />
        ) : (
          /* Waiting state */
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="2" y="7" width="15" height="13" rx="2"/>
                <path d="M17 9.5l4-2.5v10l-4-2.5"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-white/40 font-medium">Your stream is live</p>
              <p className="text-white/25 text-sm mt-1">Use the controls below to share your screen or camera</p>
            </div>
          </div>
        )}

        {/* PiP camera overlay when screen sharing */}
        {screenTrack && cameraTrack && (
          <div className="absolute bottom-3 right-3 w-36 aspect-video rounded-xl overflow-hidden border-2 border-white/20 shadow-xl">
            <VideoTrack trackRef={cameraTrack} className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* ── Controls bar ───────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Screen Share */}
        <button
          onClick={toggleScreenShare}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium text-sm transition-all border ${
            isScreenSharing
              ? "bg-[#A80532] border-[#A80532]/60 text-white shadow-lg shadow-[#A80532]/25"
              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
          </svg>
          {isScreenSharing ? "Stop Sharing" : "Share Screen"}
        </button>

        {/* Camera */}
        <button
          onClick={toggleCamera}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium text-sm transition-all border ${
            isCameraOn
              ? "bg-[#A80532] border-[#A80532]/60 text-white shadow-lg shadow-[#A80532]/25"
              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>
          </svg>
          {isCameraOn ? "Camera Off" : "Camera On"}
        </button>

        {/* Microphone */}
        <button
          onClick={toggleMic}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium text-sm transition-all border ${
            isMicOn
              ? "bg-[#A80532] border-[#A80532]/60 text-white shadow-lg shadow-[#A80532]/25"
              : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            {isMicOn ? (
              <>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
              </>
            ) : (
              <>
                <line x1="1" y1="1" x2="23" y2="23"/>
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23M12 19v4M8 23h8"/>
              </>
            )}
          </svg>
          {isMicOn ? "Mute" : "Unmute"}
        </button>
      </div>

      {/* ── Tips row ───────────────────────────────────────────────────────── */}
      <p className="text-center text-white/20 text-xs mt-5">
        Active controls are highlighted in red · Click End Stream when you&apos;re done
      </p>
    </div>
  );
}

export default function LivestreamHost({
  token,
  livekitUrl,
  title,
  onEnd,
}: LivestreamHostProps) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={livekitUrl}
      connect={true}
      video={false}
      audio={false}
    >
      <HostControls title={title} onEnd={onEnd} />
    </LiveKitRoom>
  );
}