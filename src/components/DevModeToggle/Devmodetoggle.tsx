"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { api } from "../../lib/axios";
import { PublicUser } from "@/types/profile";

// johnny's cred
const DEV_CREDENTIALS = {
  email: "test@my.csun.edu",
  password: "Johnnydepp123!",
};


export default function DevModeToggle() {
    //states
  const [devLoading, setDevLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [mounted, setMounted] = useState(false);

  // mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check localStorage on mount to sync state
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setIsLoggedIn(true);
        setUserName(`${user.firstName} ${user.lastName}`);
      } catch {
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleToggle = async () => {
    // logout functionality
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("Dev Mode: Logged out");
      window.location.href = "/login";
      return;
    }

    // Login
    setDevLoading(true);
    try {
      const response = await api.post<{ token: string; user: PublicUser }>(
        "/api/v1/users/login",
        DEV_CREDENTIALS
      );

      const user = response.data.user;
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("Dev Mode: Logged in as", user.email);
      window.location.href = "/dashboard";
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Dev login failed — check DEV_CREDENTIALS in DevModeToggle.tsx"
      );
      setDevLoading(false);
    }
  };

  // Don't render on server
  if (!mounted) return null;

  const buttonStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: isLoggedIn ? "#16a34a" : "#1e293b",
    color: "#ffffff",
    fontFamily: "system-ui, -apple-system, sans-serif",
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: devLoading ? "wait" : "pointer",
    zIndex: 2147483647,
    transition: "all 0.25s ease",
    opacity: devLoading ? 0.6 : 1,
    boxShadow: isLoggedIn
      ? "0 0 20px rgba(22, 163, 74, 0.4)"
      : "0 4px 12px rgba(0, 0, 0, 0.3)",
  };

  const dotStyle: React.CSSProperties = {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: isLoggedIn ? "#bbf7d0" : "#94a3b8",
    boxShadow: isLoggedIn ? "0 0 6px #bbf7d0" : "none",
    flexShrink: 0,
  };

  return createPortal(
    <button onClick={handleToggle} disabled={devLoading} style={buttonStyle}>
      <span style={dotStyle} />
      {devLoading
        ? "Logging in..."
        : isLoggedIn
          ? `DEV MODE — Logged in as ${userName}`
          : "Dev Mode"}
    </button>,
    document.body
  );
}