import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';

const EMIAlertWidget = () => {
    const emis = [
        { name: 'HDFC Home Loan', amount: '24,500', dueDate: '2 days left', stress: 'High', color: 'var(--alert-red)' },
        { name: 'ICICI Personal Loan', amount: '5,200', dueDate: '12 days left', stress: 'Low', color: 'var(--alert-orange)' },
    ];

    return (
        <div className="glass-card emi-card">
            <div className="card-header">
                <h3 className="card-title">EMI Alerts (किस्त अलर्ट)</h3>
                <button className="view-all">View All (सब देखें)</button>
            </div>

            <div className="emi-list">
                {emis.map((emi, index) => (
                    <div key={index} className="emi-item" style={{ borderColor: emi.color }}>
                        <div className="emi-info">
                            <div className="emi-main">
                                <span className="emi-name">{emi.name}</span>
                                <span className="emi-amt">₹ {emi.amount}</span>
                            </div>
                            <div className="emi-status">
                                <span className="due-tag" style={{ color: emi.color }}>{emi.dueDate}</span>
                                <div className="stress-indicator">
                                    <AlertCircle size={12} color={emi.color} />
                                    <span style={{ color: emi.color }}>{emi.stress} Stress</span>
                                </div>
                            </div>
                        </div>
                        <button className="pay-now-btn" style={{ background: emi.color }}>
                            Pay Now
                        </button>
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .emi-card {
          border-left: 4px solid var(--alert-red);
        }
        .view-all {
          background: none;
          border: none;
          color: var(--secondary-blue);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }
        .emi-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          margin-top: var(--spacing-md);
        }
        .emi-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md);
          background: rgba(255, 255, 255, 0.02);
          border-radius: var(--radius-md);
          border: 1px solid transparent;
          transition: transform 0.2s;
        }
        .emi-item:hover {
          transform: scale(1.02);
        }
        .emi-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .emi-main {
          display: flex;
          flex-direction: column;
        }
        .emi-name {
          font-size: 14px;
          color: var(--text-dim);
        }
        .emi-amt {
          font-size: 18px;
          font-weight: 700;
        }
        .emi-status {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .due-tag {
          font-size: 12px;
          font-weight: 600;
        }
        .stress-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 500;
        }
        .pay-now-btn {
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
      `}} />
        </div>
    );
};

export default EMIAlertWidget;
