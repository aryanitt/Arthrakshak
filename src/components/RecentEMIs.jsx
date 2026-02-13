import React from 'react';
import { Car, Home, Info } from 'lucide-react';

const RecentEMIs = () => {
  return (
    <div className="base-card recent-emis">
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div className="title-stack">
          <h3>Recent EMIs</h3>
        </div>
        <Info size={18} color="var(--accent-orange)" />
      </div>

      <div className="emi-card-stack">
        <div className="emi-alert-item">
          <div className="flex-between">
            <div className="emi-icon-box">
              <Car size={24} color="#FF8A00" />
            </div>
            <div className="emi-labels">
              <span className="name">Car Loan EMI</span>
              <span className="due">Due in 3 days • 15 Oct</span>
            </div>
            <div className="emi-amt-stack">
              <span className="amt">₹24,500</span>
              <span className="badge upcoming">UPCOMING</span>
            </div>
          </div>

          <div className="ai-insight-box">
            <span className="ai-tag">ARTHRAKSHAK AI</span>
            <p>"You can save ₹4,000 more this month by optimizing utilities."</p>
          </div>
        </div>

        <div className="emi-alert-item opacity-dim">
          <div className="flex-between">
            <div className="emi-icon-box">
              <Home size={24} color="var(--primary-blue)" />
            </div>
            <div className="emi-labels">
              <span className="name">Home Loan EMI</span>
              <span className="due">Due in 12 days</span>
            </div>
            <div className="emi-amt-stack">
              <span className="amt">₹65,000</span>
              <span className="badge waiting">WAITING</span>
            </div>
          </div>
        </div>

        <button className="add-emi-btn">+ ADD NEW EMI / RECURRING</button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .recent-emis {
          position: relative;
        }
        .emi-card-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .emi-alert-item {
          background: #F8FAFC;
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          padding: 20px;
          transition: all 0.3s;
        }
        .opacity-dim {
          opacity: 0.6;
        }
        .emi-icon-box {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .emi-labels {
          flex: 1;
          margin-left: 16px;
          display: flex;
          flex-direction: column;
        }
        .emi-labels .name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-main);
        }
        .emi-labels .due {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
        }
        .emi-amt-stack {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        .emi-amt-stack .amt {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-main);
        }
        .badge {
          font-size: 9px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 6px;
        }
        .badge.upcoming {
          background: #FFE4CC;
          color: #FF8A00;
        }
        .badge.waiting {
          background: #EBF5FF;
          color: var(--primary-blue);
        }
        .ai-insight-box {
          margin-top: 16px;
          background: white;
          border: 1px solid var(--primary-light-blue);
          border-radius: 16px;
          padding: 12px 16px;
          position: relative;
          box-shadow: 0 4px 15px rgba(0, 118, 245, 0.08);
        }
        .ai-tag {
          font-size: 9px;
          font-weight: 800;
          color: var(--primary-blue);
          display: block;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }
        .ai-insight-box p {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .add-emi-btn {
          margin-top: 10px;
          background: none;
          border: 1px dashed var(--border-subtle);
          color: var(--text-dim);
          padding: 14px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .add-emi-btn:hover {
          color: var(--primary-blue);
          border-color: var(--primary-blue);
          background: var(--primary-light-blue);
        }
      `}} />
    </div>
  );
};

export default RecentEMIs;
