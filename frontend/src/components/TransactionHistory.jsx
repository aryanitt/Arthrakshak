import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Coffee, ShoppingCart, Home, Briefcase } from 'lucide-react';

const TransactionHistory = () => {
  const transactions = [
    { id: 1, title: 'Netflix Subscription', date: 'Today, 10:30 AM', amount: '-499', type: 'debit', icon: <div className="txn-icon" style={{ background: 'rgba(255, 77, 77, 0.1)', color: '#FF4D4D' }}>N</div> },
    { id: 2, title: 'Salary Credited', date: 'Yesterday, 6:00 PM', amount: '+85,000', type: 'credit', icon: <div className="txn-icon" style={{ background: 'rgba(25, 230, 128, 0.1)', color: '#19E680' }}><Briefcase size={18} /></div> },
    { id: 3, title: 'Grocery Payment', date: '12 Feb, 8:15 PM', amount: '-2,450', type: 'debit', icon: <div className="txn-icon" style={{ background: 'rgba(0, 132, 255, 0.1)', color: '#0084FF' }}><ShoppingCart size={18} /></div> },
    { id: 4, title: 'Starbucks Coffee', date: '12 Feb, 5:40 PM', amount: '-350', type: 'debit', icon: <div className="txn-icon" style={{ background: 'rgba(255, 138, 0, 0.1)', color: '#FF8A00' }}><Coffee size={18} /></div> },
    { id: 5, title: 'Rent Payment', date: '01 Feb, 9:00 AM', amount: '-18,000', type: 'debit', icon: <div className="txn-icon" style={{ background: 'rgba(100, 116, 139, 0.1)', color: '#64748B' }}><Home size={18} /></div> },
    { id: 6, title: 'Amazon Shopping', date: '30 Jan, 2:15 PM', amount: '-1,299', type: 'debit', icon: <div className="txn-icon" style={{ background: 'rgba(255, 138, 0, 0.1)', color: '#FF8A00' }}><ShoppingCart size={18} /></div> },
  ];

  return (
    <div className="base-card transaction-history">
      <div className="header flex-between" style={{ marginBottom: '20px' }}>
        <h3>Transaction History</h3>
        <button className="view-link">View All</button>
      </div>

      <div className="txn-list">
        {transactions.slice(0, 6).map((txn) => (
          <div key={txn.id} className="txn-item">
            <div className="txn-left">
              {txn.icon}
              <div className="txn-info">
                <span className="txn-title">{txn.title}</span>
                <span className="txn-date">{txn.date}</span>
              </div>
            </div>
            <div className={`txn-amount ${txn.type}`}>
              {txn.amount}
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .transaction-history h3 {
          font-size: 18px;
          font-weight: 700;
        }
        .txn-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .txn-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid var(--border-subtle);
        }
        .txn-item:last-child {
          border-bottom: none;
        }
        .txn-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .txn-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
        }
        .txn-info {
          display: flex;
          flex-direction: column;
        }
        .txn-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-main);
        }
        .txn-date {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-muted);
        }
        .txn-amount {
          font-size: 14px;
          font-weight: 700;
        }
        .txn-amount.credit {
          color: var(--accent-green);
        }
        .txn-amount.debit {
          color: var(--accent-red);
          font-weight: 800;
        }
        .view-link {
          background: none;
          border: none;
          color: var(--primary-blue);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
      `}} />
    </div>
  );
};

export default TransactionHistory;
