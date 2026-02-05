"use client";
import React, {useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DarkVeil from "@/components/Homepage/DarkVeil"; 
import { Crimson_Text } from 'next/font/google';


const crimson = Crimson_Text({
  subsets: ['latin'],
  weight: ['700'], // or ['400','600','700'] if you want more weights

});

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes redGlowPulse {
      0% { box-shadow: 0 0 4px rgba(255,0,0,0.4); }
      50% { box-shadow: 0 0 14px rgba(255,0,0,0.9); }
      100% { box-shadow: 0 0 4px rgba(255,0,0,0.4); }
    }
  `;
  document.head.appendChild(style);
}

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      console.log("Stored user: ", user);
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
        textAlign: "center",
      }}
    >
      
      <DarkVeil />

      {/* 🔹 Overlay Text */}
      <h1
        style={{
          fontSize: "4rem",
          fontFamily: crimson.style.fontFamily,
          fontWeight: "bold",
          textShadow: "0 0 10px rgba(0,0,0,0.8)",
          marginBottom: "30px",
          zIndex: 2,
        }}
      >
        Welcome to Campus Connect
      </h1>

      {/* 🔹 Buttons */}
      <div style={{ display: "flex", gap: "20px", zIndex: 2 }}>
        <button
          onClick={() => router.push("/access/login")}
          style={{
            padding: "12px 36px",
            borderRadius: "10px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            border: "3px solid white",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(6px)",
            color: "white",
            transition: "all 0.35s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            e.currentTarget.style.backdropFilter = "blur(10px)";
            e.currentTarget.style.borderColor = "crimson";
            e.currentTarget.style.animation = "redGlowPulse 1.8s infinite ease-in-out"; 
          }}

          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.backdropFilter = "blur(6px)";
            e.currentTarget.style.borderColor = "white";
            e.currentTarget.style.animation = "none";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.background = "crimson";
            e.currentTarget.style.borderColor = "crimson";
            e.currentTarget.style.boxShadow = "0 0 12px white";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            e.currentTarget.style.borderColor = "white";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Login
        </button>

        <button
          onClick={() => router.push("/access/register")}
          style={{
            padding: "12px 36px",
            borderRadius: "10px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            border: "3px solid white",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(6px)",
            color: "white",
            transition: "all 0.35s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            e.currentTarget.style.backdropFilter = "blur(10px)";
            e.currentTarget.style.borderColor = "crimson";
            e.currentTarget.style.animation = "redGlowPulse 1.8s infinite ease-in-out"; 
          }}

          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.backdropFilter = "blur(6px)";
            e.currentTarget.style.borderColor = "white";
            e.currentTarget.style.animation = "none";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.background = "crimson";
            e.currentTarget.style.borderColor = "crimson";
            e.currentTarget.style.boxShadow = "0 0 12px white";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            e.currentTarget.style.borderColor = "white";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Register
        </button>
      </div>
    </main>
  );
}
