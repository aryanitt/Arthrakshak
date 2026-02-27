import React from 'react';
import {
    Zap,
    Brain,
    TrendingUp,
    ShieldAlert,
    Target,
    ArrowUpRight,
    BarChart3,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

const InsightsAI = () => {
    return (
        <div className="insights-ai-module">
            <div className="ai-hero">
                <div className="hero-content">
                    <span className="hero-eyebrow">Artificial Intelligence</span>
                    <h1>Arthrakshak AI</h1>
                    <p>Your personal financial strategist</p>
                </div>
                <div className="ai-status">
                    <div className="ai-orb"></div>
                    <span>Neural Engine Online</span>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="left-column">
                    <div className="base-card ai-health-score">
                        <div className="flex-between">
                            <h3>Financial Integrity Score</h3>
                            <button className="score-history-btn">History</button>
                        </div>
                        <div className="score-visual">
                            <div className="score-main">842</div>
                            <div className="score-tag">TOP 5% IN INDIA</div>
                        </div>
                        <div className="score-factors">
                            <div className="factor">
                                <CheckCircle2 size={16} color="var(--accent-green)" />
                                <span>Optimal EMI-to-Income Ratio</span>
                            </div>
                            <div className="factor">
                                <CheckCircle2 size={16} color="var(--accent-green)" />
                                <span>No suspicious credit activity</span>
                            </div>
                        </div>
                    </div>

                    <div className="base-card cashflow-forecast" style={{ marginTop: '24px' }}>
                        <div className="flex-between">
                            <h3>30-Day Cash Flow Forecast</h3>
                            <BarChart3 size={20} color="var(--primary-blue)" />
                        </div>
                        <div className="forecast-viz">
                            <div className="bar-lvl" style={{ height: '40%' }}> <span className="lbl">W1</span> </div>
                            <div className="bar-lvl" style={{ height: '60%' }}> <span className="lbl">W2</span> </div>
                            <div className="bar-lvl" style={{ height: '30%' }}> <span className="lbl">W3</span> </div>
                            <div className="bar-lvl" style={{ height: '80%' }}> <span className="lbl">W4</span> </div>
                        </div>
                        <div className="forecast-insight">
                            <ShieldAlert size={18} color="var(--accent-orange)" />
                            <p>Potential ₹12,000 deficit detected in Week 3 due to expected insurance premium.</p>
                        </div>
                    </div>
                </div>

                <div className="right-column">
                    <div className="base-card habit-detector">
                        <div className="flex-between">
                            <h3>Habit Detector</h3>
                            <Brain size={20} color="var(--accent-orange)" />
                        </div>
                        <div className="habit-list">
                            <div className="habit-item">
                                <div className="h-box warn">Binge</div>
                                <p>Weekend spending on Zomato is 4x higher than weekdays.</p>
                            </div>
                            <div className="habit-item">
                                <div className="h-box good">Save</div>
                                <p>You consistently save 12% of passive income. Great streak!</p>
                            </div>
                        </div>
                    </div>

                    <div className="base-card ai-chat-cta" style={{ marginTop: '20px', background: 'linear-gradient(135deg, #0076F5, #00D1FF)', color: 'white', border: 'none' }}>
                        <Sparkles size={24} style={{ marginBottom: '12px' }} />
                        <h4>Ask Arthrakshak AI</h4>
                        <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '20px' }}>Need advice on taxes or home loans? I'm here to help in Hindi or English.</p>
                        <button className="chat-ai-btn">Initialize Chatbot</button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .ai-hero { padding: 40px; background: white; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-radius: 0 0 40px 40px; }
                .ai-status { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 13px; color: var(--accent-green); }
                .ai-orb { width: 12px; height: 12px; background: var(--accent-green); border-radius: 100%; box-shadow: 0 0 10px var(--accent-green); animation: pulse-orb 2s infinite; }
                
                @keyframes pulse-orb {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }

                .ai-health-score { text-align: center; overflow: hidden; position: relative; }
                .score-visual { margin: 24px 0; }
                .score-main { font-size: 64px; font-weight: 800; line-height: 1; color: var(--text-main); }
                .score-tag { font-size: 12px; font-weight: 800; color: var(--primary-blue); margin-top: 8px; letter-spacing: 1px; }
                .score-factors { display: flex; flex-direction: column; gap: 10px; align-items: center; margin-top: 20px; border-top: 1px solid var(--border-subtle); padding-top: 20px; }
                .factor { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text-secondary); }

                .forecast-viz { display: flex; align-items: flex-end; justify-content: space-around; height: 120px; margin: 30px 0; border-bottom: 2px solid var(--border-subtle); }
                .bar-lvl { width: 40px; background: var(--primary-light-blue); border-radius: 8px 8px 0 0; position: relative; transition: 0.3s; }
                .bar-lvl:hover { background: var(--primary-blue); transform: scaleX(1.1); }
                .bar-lvl .lbl { position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 10px; font-weight: 700; color: var(--text-muted); }
                .forecast-insight { display: flex; gap: 12px; background: rgba(255, 138, 0, 0.05); padding: 12px; border-radius: 12px; margin-top: 20px; align-items: center; }
                .forecast-insight p { font-size: 12px; font-weight: 600; color: var(--text-secondary); }

                .habit-list { margin-top: 20px; display: flex; flex-direction: column; gap: 16px; }
                .habit-item { display: flex; gap: 12px; align-items: center; }
                .h-box { padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
                .h-box.warn { background: rgba(255, 77, 77, 0.1); color: var(--accent-red); }
                .h-box.good { background: rgba(25, 230, 128, 0.1); color: var(--accent-green); }
                .habit-item p { font-size: 12px; font-weight: 600; color: var(--text-secondary); }

                .chat-ai-btn { background: white; color: var(--primary-blue); border: none; width: 100%; padding: 12px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; }
                .chat-ai-btn:hover { background: #0F172A; color: white; }
            ` }} />
        </div>
    );
};

export default InsightsAI;
