import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Receipt, ArrowUpRight, ArrowDownRight, Search, Filter, ChevronRight, Activity, Zap, Brain, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config';

const TransactionHistory = ({ onViewAll }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
    window.addEventListener('transactionAdded', fetchTransactions);
    return () => window.removeEventListener('transactionAdded', fetchTransactions);
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/transactions`);
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
        <h3 className="recent-txns-title">RECENT TRANSACTIONS</h3>
        <button className="view-all-link" onClick={onViewAll}>View All</button>
      </div>

      <div className="txn-list">
        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
            No transactions yet.
          </div>
        ) : (
          transactions.slice(0, 6).map((txn) => (
            <div key={txn._id} className="txn-item" onClick={onViewAll} title="Click to view all transactions">
              <div className="txn-left">
                <div className="txn-icon" style={{ background: getBgColor(txn), color: getColor(txn) }}>
                  {getIcon(txn)}
                </div>
                <div className="txn-info">
                  <span className="txn-title">{txn.title}</span>
                  <span className="txn-date">{formatDate(txn.date)} • UPI</span>
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
        .transaction-history {
            padding: 24px 32px !important;
        }
        .recent-txns-title {
          font-size: 16px !important;
          font-weight: 800 !important;
          color: #0F172A !important;
          letter-spacing: 0.5px;
        }
        .view-all-link {
          background: none;
          border: none;
          color: #0076F5;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .view-all-link:hover {
          opacity: 0.7;
        }
        .txn-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .txn-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .txn-item:hover {
          transform: translateX(4px);
        }
        .txn-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .txn-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .txn-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .txn-title {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
          text-transform: capitalize;
        }
        .txn-date {
          font-size: 12px;
          font-weight: 600;
          color: #94A3B8;
        }
        .txn-amount {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.2px;
        }
        .txn-amount.credit {
          color: #19E680;
        }
        .txn-amount.debit {
          color: #FF4D4D;
        }
      `}} />
    </div>
  );
};

export default TransactionHistory;
