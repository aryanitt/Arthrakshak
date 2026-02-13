import React from 'react';
import { Target, Flag, ChevronRight } from 'lucide-react';

const GoalsSection = () => {
    const goals = [
        { name: 'Dream Home', target: '50,00,000', saved: '12,50,000', pct: 25, color: '#FF7675' },
        { name: 'Tesla Model 3', target: '60,00,000', saved: '6,00,000', pct: 10, color: '#74B9FF' },
    ];

    return (
        <div className="goals-container">
            <div className="section-header">
                <h3 className="section-title">Pinned Goals</h3>
                <button className="view-all-goals">
                    View All <ChevronRight size={14} />
                </button>
            </div>

            <div className="goals-stack">
                {goals.map((goal, index) => (
                    <div key={index} className="glass-card goal-card">
                        <div className="goal-top">
                            <div className="goal-icon" style={{ background: goal.color + '20' }}>
                                <Target size={18} color={goal.color} />
                            </div>
                            <div className="goal-meta">
                                <span className="goal-name">{goal.name}</span>
                                <span className="goal-target">Target: ₹ {goal.target}</span>
                            </div>
                        </div>

                        <div className="progress-area">
                            <div className="progress-bg">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${goal.pct}%`, background: goal.color }}
                                >
                                    <div className="progress-glow" style={{ background: goal.color }}></div>
                                </div>
                            </div>
                            <div className="progress-stats">
                                <span className="saved-amt">₹ {goal.saved} saved</span>
                                <span className="pct-text">{goal.pct}%</span>
                            </div>
                        </div>

                        <div className="goal-milestones">
                            <Flag size={14} color="var(--text-dim)" />
                            <span className="milestone-text">Next milestone: ₹ 15L (Early Access)</span>
                        </div>
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .goals-container {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .section-title {
          font-size: 16px;
          font-weight: 600;
        }
        .view-all-goals {
          background: none;
          border: none;
          color: var(--secondary-blue);
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 2px;
          cursor: pointer;
        }
        .goals-stack {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .goal-card {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .goal-top {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }
        .goal-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .goal-meta {
          display: flex;
          flex-direction: column;
        }
        .goal-name {
          font-size: 16px;
          font-weight: 600;
        }
        .goal-target {
          font-size: 12px;
          color: var(--text-dim);
        }
        .progress-area {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .progress-bg {
          height: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 4px;
          position: relative;
          transition: width 1s ease-out;
        }
        .progress-glow {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: 20px;
          filter: blur(8px);
          opacity: 0.6;
        }
        .progress-stats {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
        }
        .saved-amt {
          color: var(--text-main);
          font-weight: 500;
        }
        .pct-text {
          color: var(--text-dim);
        }
        .goal-milestones {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding-top: var(--spacing-sm);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .milestone-text {
          font-size: 11px;
          color: var(--text-dim);
          font-style: italic;
        }
      `}} />
        </div>
    );
};

export default GoalsSection;
