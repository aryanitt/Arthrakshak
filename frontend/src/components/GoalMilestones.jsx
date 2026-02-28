import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GoalMilestones = ({ onViewGoals }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPinnedGoals = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/goals');
        const pinned = res.data.filter(g => g.pinned).slice(0, 2);
        setGoals(pinned.map(g => ({
          name: g.title,
          progress: g.targetAmount > 0 ? Math.min(100, Math.round((g.currentBalance / g.targetAmount) * 100)) : 0,
          current: g.currentBalance.toLocaleString('en-IN'),
          target: g.targetAmount.toLocaleString('en-IN'),
          color: g.category === 'real-estate' ? '#818CF8' : g.category === 'lifestyle' ? '#FBB040' : '#0076F5',
          icon: g.category === 'real-estate' ? '🏠' : g.category === 'lifestyle' ? '✈️' : '🎯'
        })));
      } catch (err) {
        console.error("Error fetching pinned goals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPinnedGoals();
  }, []);

  return (
    <div className="base-card goal-milestones">
      <div className="header flex-between" style={{ marginBottom: '24px' }}>
        <div className="title-stack">
          <h3>Pinned Goals</h3>
        </div>
        <button className="view-link" onClick={onViewGoals}>View All</button>
      </div>

      <div className="goals-list" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>Loading treasury goals...</div>
        ) : goals.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>No goals pinned. Pin up to 2 goals in the Goals section.</div>
        ) : (
          goals.map((goal, index) => (
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
          ))
        )}
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
