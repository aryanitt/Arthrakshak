import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpRight, ArrowDownLeft, Coffee, ShoppingCart, Home, Briefcase, Landmark, TrendingUp } from 'lucide-react';

const TransactionHistory = ({ onViewAll }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
    window.addEventListener('transactionAdded', fetchTransactions);
    return () => window.removeEventListener('transactionAdded', fetchTransactions);
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(res.data);
    } catch (e) {
      console.error("Error fetching transactions:", e);
    }
  };

  const getIcon = (txn) => {
    if (txn.type === 'active-income') return <Briefcase size={18} />;
    if (txn.type === 'passive-income') return <Landmark size={18} />;
    const cat = txn.category?.toLowerCase() || '';
    if (cat.includes('food')) return <Coffee size={18} />;
    if (cat.includes('shop') || cat.includes('amazon')) return <ShoppingCart size={18} />;
    if (cat.includes('rent') || cat.includes('bill')) return <Home size={18} />;
    return <TrendingUp size={18} style={{ transform: 'rotate(180deg)' }} />;
  };

  const getColor = (txn) => {
    if (txn.type === 'active-income') return '#19E680';
    if (txn.type === 'passive-income') return '#0084FF';
    return '#FF4D4D';
  };

  const getBgColor = (txn) => {
    if (txn.type === 'active-income') return 'rgba(25, 230, 128, 0.1)';
    if (txn.type === 'passive-income') return 'rgba(0, 132, 255, 0.1)';
    return 'rgba(255, 77, 77, 0.1)';
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return d.toLocaleDateString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="base-card transaction-history">
      <div className="header flex-between" style={{ marginBottom: '20px' }}>
        <h3>Transaction History</h3>
        <button className="view-link" onClick={onViewAll}>View All →</button>
      </div>

      <div className="txn-list">
        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
            No transactions yet.
          </div>
        ) : (
          transactions.slice(0, 7).map((txn) => (
            <div key={txn._id} className="txn-item">
              <div className="txn-left">
                <div className="txn-icon" style={{ background: getBgColor(txn), color: getColor(txn) }}>
                  {getIcon(txn)}
                </div>
                <div className="txn-info">
                  <span className="txn-title">{txn.title}</span>
                  <span className="txn-date">{formatDate(txn.date)}</span>
                </div>
              </div>
              <div className={`txn-amount ${txn.type === 'expense' ? 'debit' : 'credit'}`}>
                {txn.type === 'expense' ? '-' : '+'}₹{txn.amount.toLocaleString()}
              </div>
            </div>
          ))
        )}
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
