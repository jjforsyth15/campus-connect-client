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
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <span className="text-red-400 text-sm font-semibold">
            🔴 LIVE · {viewerCount} viewer{viewerCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Video Area */}
      <div className="w-full aspect-video bg-gray-950 rounded-xl overflow-hidden flex items-center justify-center border border-gray-800">
        {screenTrack ? (
          <VideoTrack
            trackRef={screenTrack}
            className="w-full h-full object-contain"
          />
        ) : cameraTrack ? (
          <VideoTrack
            trackRef={cameraTrack}
            className="w-full h-full object-contain"
          />
        ) : (
          <p className="text-gray-500 text-center px-8">
            Share your screen or turn on your camera to start streaming
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        <button
          onClick={toggleScreenShare}
          className={`px-5 py-3 rounded-lg border font-medium transition-colors ${
            isScreenSharing
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
          }`}
        >
          🖥 {isScreenSharing ? "Stop Share" : "Share Screen"}
        </button>
        <button
          onClick={toggleCamera}
          className={`px-5 py-3 rounded-lg border font-medium transition-colors ${
            isCameraOn
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
          }`}
        >
          📷 {isCameraOn ? "Camera Off" : "Camera On"}
        </button>
        <button
          onClick={toggleMic}
          className={`px-5 py-3 rounded-lg border font-medium transition-colors ${
            isMicOn
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
          }`}
        >
          🎤 {isMicOn ? "Mute" : "Unmute"}
        </button>
        <button
          onClick={handleEnd}
          className="px-5 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
        >
          End Stream
        </button>
      </div>
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