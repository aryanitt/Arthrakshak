import React from 'react';
import { MessageSquare, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

const AIAssistantStack = () => {
    return (
        <div className="ai-stack">
            <motion.button
                className="ai-btn chat-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <MessageSquare size={24} />
            </motion.button>

            <div className="wave-container">
                <motion.button
                    className="ai-btn voice-btn"
                    animate={{
                        boxShadow: ["0 0 0 0px rgba(31, 191, 117, 0.4)", "0 0 0 10px rgba(31, 191, 117, 0)"]
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 2
                    }}
                >
                    <Mic size={24} />
                </motion.button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .ai-stack {
          position: fixed;
          bottom: 100px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          z-index: 100;
        }
        .ai-btn {
          width: 56px;
          height: 56px;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          color: white;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }
        .chat-btn {
          background: var(--primary-navy);
          border: 1px solid var(--card-border);
        }
        .voice-btn {
          background: var(--primary-green);
        }
        .wave-container {
          position: relative;
        }
      `}} />
        </div>
    );
};

export default AIAssistantStack;
