"use client";

import React from "react";

const RED = "#A80532";

/**
 * LoadingState – shown while fetching threads/messages from API.
 */
export function LoadingState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        minHeight: "60vh",
        padding: "2rem",
      }}
    >
      <div
        className="animate-spin"
        style={{
          width: "48px",
          height: "48px",
          border: `4px solid rgba(168, 5, 50, 0.1)`,
          borderTop: `4px solid ${RED}`,
          borderRadius: "50%",
        }}
      />
      <p style={{ color: "#6B7280", fontSize: "1rem", fontWeight: 500 }}>
        Loading messages...
      </p>
    </div>
  );
}

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

/**
 * ErrorState – shown when API request fails.
 */
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "2rem auto",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "rgba(220, 38, 38, 0.05)",
          border: "2px solid rgba(220, 38, 38, 0.2)",
          borderRadius: 12,
          padding: "2rem",
          display: "inline-block",
        }}
      >
        <h3
          style={{
            color: "#DC2626",
            marginBottom: "0.5rem",
            fontSize: "1.25rem",
            fontWeight: 700,
          }}
        >
          Failed to load messages
        </h3>
        <p style={{ color: "#6B7280", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
          {error}
        </p>
        <button
          type="button"
          onClick={onRetry}
          style={{
            background: RED,
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}

/**
 * EmptyState – no threads yet; backend will provide data when ready.
 */
export function EmptyState() {
  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "2rem auto",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "rgba(168, 5, 50, 0.02)",
          border: "2px dashed rgba(168, 5, 50, 0.2)",
          borderRadius: 12,
          padding: "3rem 2rem",
          display: "inline-block",
        }}
      >
        <p style={{ color: "#374151", marginBottom: "0.5rem", fontSize: "1.125rem", fontWeight: 600 }}>
          No conversations yet
        </p>
        <p style={{ color: "#6B7280", fontSize: "0.95rem" }}>
          Start a new message or wait for the backend to be connected.
        </p>
      </div>
    </div>
  );
}
