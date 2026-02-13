import React from 'react';
import { MessageSquare, Mic } from 'lucide-react';

const FloatingAssistant = () => {
    return (
        <div className="floating-assistant-wrap">
            <div className="voice-mic-trigger">
                <Mic size={20} color="var(--text-secondary)" />
            </div>
            <button className="ask-ai-pill">
                <MessageSquare size={20} fill="currentColor" opacity={0.3} />
                <span>Ask Arthrakshak AI</span>
            </button>

            <style dangerouslySetInnerHTML={{
                __html: `
        .floating-assistant-wrap {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          align-items: center;
          gap: 16px;
          z-index: 1000;
        }
        .voice-mic-trigger {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          cursor: pointer;
          border: 1px solid var(--border-subtle);
        }
        .ask-ai-pill {
          background: #0084FF;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 40px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 15px;
          font-weight: 700;
          box-shadow: 0 10px 30px rgba(0, 132, 255, 0.4);
          cursor: pointer;
          transition: transform 0.2s;
        }
        .ask-ai-pill:hover {
          transform: translateY(-2px);
        }
      `}} />
        </div>
    );
};

export default FloatingAssistant;
