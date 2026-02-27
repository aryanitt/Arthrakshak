import React, { useState } from 'react';
import {
    Sparkles,
    TrendingUp,
    Zap,
    AlertTriangle,
    CheckCircle2,
    Bot
} from 'lucide-react';

const AiInsightsPanel = ({ goals = [] }) => {
    const [strategicMode, setStrategicMode] = useState(true);

    // Calculate dynamic insights based on goals
    // Find goal closest to completion (highest progress pct)
    const highestProgressGoal = goals.length > 0
        ? goals.reduce((prev, current) => {
            const prevProgress = prev.targetAmount ? (prev.savedAmount / prev.targetAmount) : 0;
            const currentProgress = current.targetAmount ? (current.savedAmount / current.targetAmount) : 0;
            return (prevProgress > currentProgress) ? prev : current;
        })
        : null;

    // Hardcode some defaults if no goals exist
    const topGoalName = highestProgressGoal ? highestProgressGoal.title : "Emergency Fund";
    const earlyCompletionText = highestProgressGoal
        ? `Based on your savings rate, you'll reach '${topGoalName}' 2 months early.`
        : "You are on track to meet your baseline savings target early.";

    const handleAskAi = () => {
        // Trigger a visual bounce on the Floating Assistant
        const fab = document.querySelector('.ai-trigger-pill');
        if (fab) {
            fab.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            fab.style.transform = 'scale(1.1) translateY(-10px)';
            setTimeout(() => {
                fab.style.transform = '';
            }, 300);
        }
    };

    return (
        <div className="sg-ai-panel">
            <div className="sg-ai-header">
                <div className="sg-ai-header-left">
                    <Sparkles size={16} color="#60A5FA" />
                    <span>AI Insights</span>
                </div>
                <div className="sg-ai-badge">LIVE</div>
            </div>

            <div className="sg-strategic-card">
                <div className="sg-sc-row">
                    <span className="sg-sc-label">STRATEGIC MODE</span>
                    <button className={`sg-toggle ${strategicMode ? 'on' : ''}`} onClick={() => setStrategicMode(!strategicMode)}>
                        <span className="sg-toggle-knob" />
                    </button>
                </div>
                <p className="sg-sc-desc">Highlights risky goals and suggests reallocation from surplus buckets.</p>
            </div>

            <div className="sg-ai-section">
                <div className="sg-ai-sec-label"><TrendingUp size={11} /> PREDICTIONS</div>
                <div className="sg-ai-card">
                    <div className="sg-ai-card-icon blue"><TrendingUp size={13} color="#60A5FA" /></div>
                    <div>
                        <div className="sg-ai-card-title">{topGoalName}</div>
                        <div className="sg-ai-card-desc">{earlyCompletionText}</div>
                    </div>
                </div>
            </div>

            <div className="sg-ai-section">
                <div className="sg-ai-sec-label"><Zap size={11} /> BUDGET ADJUSTMENTS</div>
                <div className="sg-ai-card">
                    <div className="sg-ai-card-icon green"><Zap size={13} color="#34D399" /></div>
                    <div>
                        <div className="sg-ai-card-title">Optimize Utilities</div>
                        <div className="sg-ai-card-desc">Save ₹3,200/mo by switching providers; redirect to '{topGoalName}'.</div>
                    </div>
                </div>
                <button className="sg-apply-btn"><CheckCircle2 size={13} /> Apply Suggestion</button>
            </div>

            <div className="sg-ai-section">
                <div className="sg-ai-sec-label" style={{ color: '#FBB040' }}><AlertTriangle size={11} /> MARKET ALERT</div>
                <div className="sg-ai-card alert">
                    <div className="sg-ai-card-icon amber"><AlertTriangle size={13} color="#FBB040" /></div>
                    <div>
                        <div className="sg-ai-card-title">Education Inflation</div>
                        <div className="sg-ai-card-desc">US education costs rose 8%. Increase SIP by ₹5k/mo recommended.</div>
                    </div>
                </div>
            </div>

            <button className="sg-ask-ai-btn" onClick={handleAskAi}>
                <Bot size={14} /> Ask Arthrakshak AI
            </button>
        </div>
    );
};

export default AiInsightsPanel;
