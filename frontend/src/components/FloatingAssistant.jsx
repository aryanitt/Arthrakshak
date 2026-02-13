import React from 'react';
import { Sparkles, Mic, MessageCircle } from 'lucide-react';

const FloatingAssistant = () => {
  return (
    <div className="ai-dock-container">
      <div className="ai-dock">
        {/* Voice Section */}
        <div className="voice-section">
          <button className="voice-btn">
            <Mic size={18} />
          </button>
        </div>

        <div className="dock-divider"></div>

        {/* AI Pill Section */}
        <button className="ai-trigger-pill">
          <div className="ai-orb">
            <Sparkles size={14} color="white" fill="white" />
            <div className="orb-glow"></div>
          </div>
          <span className="ai-text">Ask Arthrakshak AI</span>
          <div className="ai-msg-icon">
            <MessageCircle size={16} />
          </div>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .ai-dock-container {
          position: fixed;
          bottom: 32px;
          right: 32px;
          z-index: 1000;
          font-family: var(--font-family);
        }

        .ai-dock {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.5);
          padding: 8px;
          border-radius: 40px;
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.08),
            0 4px 8px rgba(0, 0, 0, 0.04),
            inset 0 0 0 1px rgba(255, 255, 255, 0.5);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .ai-dock:hover {
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.12),
            0 8px 16px rgba(0, 0, 0, 0.06);
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.85);
        }

        .voice-section {
          padding: 0 4px;
        }

        .voice-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .voice-btn:hover {
          background: var(--primary-light-blue);
          color: var(--primary-blue);
        }

        .dock-divider {
          width: 1px;
          height: 24px;
          background: rgba(0, 0, 0, 0.08);
          margin: 0 8px;
        }

        .ai-trigger-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #0084FF;
          padding: 6px 18px 6px 8px;
          border-radius: 30px;
          border: none;
          color: white;
          cursor: pointer;
          overflow: hidden;
          position: relative;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(0, 132, 255, 0.25);
        }

        .ai-trigger-pill:hover {
          background: #0076F5;
          box-shadow: 0 6px 18px rgba(0, 132, 255, 0.35);
        }

        .ai-orb {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #00D1FF 0%, #0084FF 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .orb-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: inherit;
          filter: blur(8px);
          opacity: 0.6;
          z-index: -1;
          animation: orb-pulse 2s infinite ease-in-out;
        }

        .ai-text {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.2px;
        }

        .ai-msg-icon {
          opacity: 0.6;
          display: flex;
          align-items: center;
        }

        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.4); opacity: 0.8; }
        }

        /* Subtle shimmer on the pill */
        .ai-trigger-pill::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 60%,
            transparent 100%
          );
          transform: rotate(-45deg);
          animation: shimmer 4s infinite linear;
          pointer-events: none;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(-45deg); }
          100% { transform: translateX(100%) rotate(-45deg); }
        }
      `}} />
    </div>
  );
};

export default FloatingAssistant;
