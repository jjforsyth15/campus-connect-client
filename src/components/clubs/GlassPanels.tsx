'use client';

import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Frosted glass panel with rounded corners.
 */
const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '' }) => {
  return (
    <div className={`glass-panel ${className}`}>
      {children}
      <style jsx>{`
        .glass-panel {
          position: relative;
          padding: 1.6rem 1.4rem;
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background:
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.14),
              rgba(255, 255, 255, 0.06)
            );
          backdrop-filter: blur(22px) saturate(160%);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.08),
            0 18px 55px rgba(0, 0, 0, 0.55);
          overflow: hidden;
          transition:
            box-shadow 0.25s ease,
            border-color 0.25s ease,
            transform 0.25s ease;
        }

        .glass-panel::before {
          content: '';
          position: absolute;
          inset: -40%;
          background:
            radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.40), transparent 55%),
            radial-gradient(circle at 85% 15%, rgba(255, 80, 110, 0.18), transparent 55%),
            radial-gradient(circle at 70% 85%, rgba(255, 140, 160, 0.12), transparent 60%);
          opacity: 0.55;
          pointer-events: none;
        }

        .glass-panel > * {
          position: relative;
          z-index: 1;
        }

        .glass-panel:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.88);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.16),
            0 24px 70px rgba(0, 0, 0, 0.65);
        }
      `}</style>
    </div>
  );
};

export default GlassPanel;
