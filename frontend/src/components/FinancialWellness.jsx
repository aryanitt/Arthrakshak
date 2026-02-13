import React from 'react';
import { Target, Shield, Zap, TrendingUp } from 'lucide-react';

const FinancialWellness = () => {
    const metrics = [
        { label: 'Savings Rate', value: '28%', status: 'Excellent', color: '#19E680', icon: <Target size={16} /> },
        { label: 'Debt Ratio', value: '12%', status: 'Healthy', color: '#0084FF', icon: <Shield size={16} /> },
        { label: 'Emergency Fund', value: '4.5mo', status: 'Good', color: '#FF8A00', icon: <Zap size={16} /> },
    ];

    return (
        <div className="base-card wellness-card">
            <div className="wellness-header flex-between">
                <div className="title-stack">
                    <h3>Wealth Wellness Score</h3>
                    <span className="subtitle">AI-powered financial health analysis</span>
                </div>
                <div className="score-badge">
                    <span className="score-num">78</span>
                    <span className="score-total">/100</span>
                </div>
            </div>

            <div className="wellness-main">
                <div className="wellness-grid">
                    {metrics.map((m, i) => (
                        <div key={i} className="metric-box">
                            <div className="metric-top">
                                <div className="icon-circle" style={{ background: `${m.color}15`, color: m.color }}>
                                    {m.icon}
                                </div>
                                <span className="metric-label">{m.label}</span>
                            </div>
                            <div className="metric-bottom">
                                <span className="metric-value">{m.value}</span>
                                <span className="metric-status" style={{ color: m.color }}>{m.status}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="wellness-tip">
                    <div className="tip-icon">💡</div>
                    <p className="tip-text">
                        Increase your <strong>Passive Earning</strong> by 5% to reach "Pro" status next month.
                    </p>
                    <TrendingUp size={16} className="tip-arrow" />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .wellness-card {
          background: linear-gradient(180deg, #FFFFFF 0%, #FAFCFF 100%);
        }
        .wellness-header {
          margin-bottom: 24px;
        }
        .wellness-card h3 {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-main);
        }
        .subtitle {
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
        }
        .score-badge {
          background: var(--primary-light-blue);
          padding: 8px 16px;
          border-radius: 14px;
          display: flex;
          align-items: baseline;
          gap: 2px;
        }
        .score-num {
          font-size: 20px;
          font-weight: 800;
          color: var(--primary-blue);
        }
        .score-total {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
        }
        .wellness-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        .metric-box {
          background: white;
          border: 1px solid var(--border-subtle);
          padding: 12px;
          border-radius: 16px;
          transition: transform 0.2s;
        }
        .metric-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .metric-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .icon-circle {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .metric-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
        }
        .metric-bottom {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .metric-value {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-main);
        }
        .metric-status {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .wellness-tip {
          background: #F8FAFC;
          padding: 14px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-left: 4px solid var(--primary-blue);
        }
        .tip-icon {
          font-size: 18px;
        }
        .tip-text {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
          flex: 1;
        }
        .tip-arrow {
          color: var(--primary-blue);
          opacity: 0.5;
        }
      `}} />
        </div>
    );
};

export default FinancialWellness;
