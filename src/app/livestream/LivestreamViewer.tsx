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
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-gray-400 text-sm mt-1">
            Hosted by {hostName} · {viewerCount} viewer
            {viewerCount !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={handleLeave}
          className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors"
        >
          Leave
        </button>
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
            Waiting for host to share their screen or camera...
          </p>
        )}
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