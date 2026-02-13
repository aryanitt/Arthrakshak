import React from 'react';

const GoalMilestones = ({ onViewGoals }) => {
  const goals = [
    { name: 'New Luxury Apartment', progress: 60, current: '45,00,000', target: '75,00,000', color: '#0076F5', icon: '🏠' },
    { name: 'Retirement Corpus', progress: 25, current: '2,50,00,000', target: '10,00,00,000', color: '#FF8A00', icon: '💰' },
  ];

  return (
    <div className="base-card goal-milestones">
      <div className="header flex-between" style={{ marginBottom: '24px' }}>
        <div className="title-stack">
          <h3>Goal Milestones</h3>
        </div>
        <button className="view-link" onClick={onViewGoals}>View All</button>
      </div>

      <div className="goals-list" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {goals.map((goal, index) => (
          <div key={index} className="goal-item">
            <div className="goal-header flex-between" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="goal-icon-box">{goal.icon}</div>
                <span className="goal-name">{goal.name}</span>
              </div>
              <span className="progress-pct">{goal.progress}%</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${goal.progress}%`, background: goal.color }}
              ></div>
            </div>

            <div className="progress-labels flex-between" style={{ marginTop: '8px' }}>
              <span className="current">₹{goal.current} saved</span>
              <span className="target">Goal: ₹{goal.target}</span>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .goal-milestones h3 {
          font-size: 18px;
          font-weight: 700;
        }
        .view-link {
          background: none;
          border: none;
          color: var(--primary-blue);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
        .goal-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .goal-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-main);
        }
        .progress-pct {
          font-size: 14px;
          font-weight: 800;
          color: var(--text-main);
        }
        .progress-track {
          height: 8px;
          background: #F1F5F9;
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.8s ease-out;
        }
        .progress-labels {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
        }
      `}} />
    </div >
  );
};

export default GoalMilestones;
