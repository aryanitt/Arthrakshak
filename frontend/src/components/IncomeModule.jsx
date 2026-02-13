import React from 'react';
import { Briefcase, Landmark } from 'lucide-react';

const IncomeModule = ({ type }) => {
  const isPassive = type === 'passive';
  const data = isPassive
    ? { title: 'Passive Income', icon: <Landmark size={20} />, color: '#19E680', pct: 40, amt: '₹12,400', sub: 'Dividend & Interest', status: 'On track' }
    : { title: 'Active Income', icon: <Briefcase size={20} />, color: '#0084FF', pct: 75, amt: '₹85,000', sub: 'Earned this month', status: '+₹5,000 extra' };

  return (
    <div className="base-card income-module">
      <div className="module-header flex-between">
        <div className="title-stack">
          <h3>{data.title}</h3>
        </div>
        <div className="icon-wrap" style={{
          background: isPassive ? 'rgba(25, 230, 128, 0.1)' : 'rgba(0, 132, 255, 0.1)',
          color: data.color
        }}>
          {data.icon}
        </div>
      </div>

      <div className="gauge-container">
        <svg viewBox="0 0 100 100">
          <circle className="gauge-bg" cx="50" cy="50" r="40" />
          <circle
            className="gauge-fill"
            cx="50" cy="50" r="40"
            style={{
              stroke: data.color,
              strokeDasharray: `${(data.pct / 100) * 251.2} 251.2`
            }}
          />
        </svg>
        <div className="gauge-text">
          <span className="pct">{data.pct}%</span>
          <span className="lbl">TARGET</span>
        </div>
      </div>

      <div className="module-footer flex-between">
        <div className="stat-main">
          <span className="stat-lbl">{data.sub}</span>
          <span className="stat-val">{data.amt}</span>
        </div>
        <span className="status-badge" style={{ color: data.color }}>{data.status}</span>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .income-module {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .title-stack h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-main);
        }
        .title-stack span {
          font-size: 10px;
          color: var(--text-muted);
          font-weight: 500;
        }
        .icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gauge-container {
          position: relative;
          width: 140px;
          height: 140px;
          margin: 0 auto;
        }
        .gauge-container svg {
          transform: rotate(-90deg);
        }
        .gauge-bg {
          fill: none;
          stroke: #F1F5F9;
          stroke-width: 8;
        }
        .gauge-fill {
          fill: none;
          stroke-width: 8;
          stroke-linecap: round;
          transition: stroke-dasharray 0.5s ease;
        }
        .gauge-text {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .gauge-text .pct {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-main);
        }
        .gauge-text .lbl {
          font-size: 9px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 1px;
        }
        .stat-lbl {
          display: block;
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 600;
          margin-bottom: 4px;
        }
        .stat-val {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-main);
        }
        .status-badge {
          font-size: 11px;
          font-weight: 700;
        }
      `}} />
    </div>
  );
};

export default IncomeModule;
