import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Mic, Sparkles, User, Brain, TrendingUp, Target, HelpCircle, MessageSquare, ShieldCheck, Database, Zap, Cpu } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const AIAssistant = ({ isOpen, onClose, initialQuery }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I am Arth AI. How can I help you with your finances today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (initialQuery && isOpen) {
            handleSend(initialQuery);
        }
    }, [initialQuery, isOpen]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async (query) => {
        const text = query || input;
        if (!text.trim()) return;

        const userMsg = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/ai/chat`, { message: text });
            setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to Gemini. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="ai-global-overlay">
            <div className="ai-panel">
                <div className="ai-header">
                    <div className="aih-left">
                        <div className="ai-icon-glow">
                            <Brain size={20} color="white" />
                        </div>
                        <div>
                            <h3>Arth AI</h3>
                            <span>GEMINI POWERED</span>
                        </div>
                    </div>
                    <button className="ai-close" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="ai-messages">
                    {messages.map((m, i) => (
                        <div key={i} className={`ai-bubble ${m.role}`}>
                            {m.content}
                        </div>
                    ))}
                    {loading && <div className="ai-bubble assistant loading">Thinking...</div>}
                    <div ref={chatEndRef} />
                </div>

                <div className="ai-input-footer">
                    <div className="ai-input-wrapper">
                        <input
                            type="text"
                            placeholder="Ask about goals, loans, or savings..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button className="ai-send-btn" onClick={() => handleSend()}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .ai-global-overlay {
                    position: fixed;
                    inset: 0;
                    background: transparent;
                    pointer-events: none;
                    z-index: 10000;
                    display: flex;
                    justify-content: flex-end;
                    align-items: flex-end;
                    padding: 30px;
                }

                .ai-panel {
                    width: 380px;
                    height: 550px;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                    border: 1px solid rgba(0,0,0,0.05);
                    border-radius: 24px;
                    overflow: hidden;
                    pointer-events: auto;
                    animation: slideUp 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
                }

                @keyframes slideUp { 
                    from { transform: translateY(100%) scale(0.9); opacity: 0; } 
                    to { transform: translateY(0) scale(1); opacity: 1; } 
                }

                .ai-header {
                    padding: 24px;
                    border-bottom: 1px solid #F1F5F9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: white;
                }

                .aih-left {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .ai-icon-glow {
                    background: linear-gradient(135deg, #0076F5, #7C3AED);
                    padding: 10px;
                    border-radius: 12px;
                    display: flex;
                    box-shadow: 0 8px 16px rgba(0, 118, 245, 0.3);
                }

                .aih-left h3 {
                    font-size: 16px;
                    font-weight: 800;
                    color: #0F172A;
                    margin: 0;
                }

                .aih-left span {
                    font-size: 10px;
                    font-weight: 700;
                    color: #64748B;
                    letter-spacing: 0.5px;
                }

                .ai-close {
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    color: #64748B;
                    padding: 8px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .ai-close:hover {
                    background: #F1F5F9;
                    color: #0F172A;
                }

                .ai-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    background: #FDFDFD;
                }

                .ai-bubble {
                    max-width: 85%;
                    padding: 14px 18px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 1.5;
                }

                .ai-bubble.assistant {
                    align-self: flex-start;
                    background: white;
                    color: #1E293B;
                    border: 1px solid #E2E8F0;
                    border-bottom-left-radius: 4px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }

                .ai-bubble.user {
                    align-self: flex-end;
                    background: #0076F5;
                    color: white;
                    border-bottom-right-radius: 4px;
                    box-shadow: 0 10px 15px -3px rgba(0, 118, 245, 0.2);
                }

                .ai-bubble.loading {
                    font-style: italic;
                    opacity: 0.7;
                }

                .ai-input-footer {
                    padding: 24px;
                    border-top: 1px solid #F1F5F9;
                    background: white;
                }

                .ai-input-wrapper {
                    display: flex;
                    align-items: center;
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 14px;
                    padding: 0 8px 0 16px;
                    height: 52px;
                    transition: all 0.2s;
                }

                .ai-input-wrapper:focus-within {
                    border-color: #0076F5;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(0, 118, 245, 0.1);
                }

                .ai-input-wrapper input {
                    flex: 1;
                    border: none;
                    background: transparent;
                    outline: none;
                    font-weight: 600;
                    font-size: 14px;
                    color: #1E293B;
                }

                .ai-send-btn {
                    background: #0076F5;
                    color: white;
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .ai-send-btn:hover {
                    background: #006ae0;
                    transform: scale(1.05);
                }
            `}} />
        </div>
    );
};

export default AIAssistant;
