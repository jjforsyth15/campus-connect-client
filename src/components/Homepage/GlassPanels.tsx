'use client';

import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '' }) => {
  return (
    <div className={`glass-panel ${className}`}>
      {children}
      <style jsx>{`
        .glass-panel {
          position: relative;
          padding: 1.75rem 1.25rem;
          border-radius: 0;
          border: 3px solid rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(18px) saturate(160%);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.18),
            0 14px 30px rgba(0, 0, 0, 0.85);
          overflow: hidden;
          transition:
            box-shadow 0.25s ease,
            border-color 0.25s ease,
            background 0.25s ease,
            transform 0.25s ease;
        }

        .glass-panel::before {
          content: '';
          position: absolute;
          inset: -40%;
          background:
            radial-gradient(circle at 0 0, rgba(255, 255, 255, 0.4), transparent 55%),
            radial-gradient(circle at 100% 0, rgba(255, 255, 255, 0.2), transparent 55%);
          opacity: 0.4;
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .glass-panel > * {
          position: relative;
          z-index: 1;
        }

        .glass-panel:hover {
          border-color: #ffffff;
          background: rgba(121, 24, 29, 0.5);
          transform: translateY(-2px);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.55),
            0 0 30px rgba(255, 255, 255, 0.45),
            0 22px 60px rgba(0, 0, 0, 0.95);
          animation: borderGlow 1.2s ease-in-out infinite alternate;
        }

        @keyframes borderGlow {
          0% {
            box-shadow:
              0 0 0 1px rgba(255, 255, 255, 0.4),
              0 0 22px rgba(255, 255, 255, 0.35),
              0 18px 50px rgba(0, 0, 0, 0.9);
          }
          100% {
            box-shadow:
              0 0 0 1px rgba(255, 255, 255, 0.8),
              0 0 40px rgba(255, 255, 255, 0.7),
              0 24px 65px rgba(0, 0, 0, 1);
          }
        }
      `}</style>
    </div>
  );
};

export default GlassPanel;
