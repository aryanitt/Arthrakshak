import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const CATEGORY_COLORS = {
  'Food': '#FF4D4D',
  'Bills': '#0076F5',
  'Travel': '#FF8A00',
  'Shopping': '#A855F7',
  'Entertainment': '#19E680',
  'Health': '#F59E0B',
  'Education': '#06B6D4',
  'Other': '#94A3B8',
};

const getColor = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS['Other'];

const ExpenseHub = () => {
  const [timePeriod, setTimePeriod] = useState('Day');
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(res.data);
    } catch (e) {
      console.error('Error fetching transactions for ExpenseHub:', e);
    }
  };

  useEffect(() => {
    fetchTransactions();
    window.addEventListener('transactionAdded', fetchTransactions);
    return () => window.removeEventListener('transactionAdded', fetchTransactions);
  }, []);

  // Filter expenses by time period
  const getFilteredExpenses = () => {
    const now = new Date();
    return transactions.filter(t => {
      if (t.type !== 'expense') return false;
      const d = new Date(t.date);
      if (timePeriod === 'Day') {
        return d.toDateString() === now.toDateString();
      } else if (timePeriod === 'Week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo;
      } else {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return d >= startOfMonth;
      }
    });
  };

  const filtered = getFilteredExpenses();
  const totalExpense = filtered.reduce((sum, t) => sum + t.amount, 0);

  // Group by category
  const grouped = {};
  filtered.forEach(t => {
    const cat = t.category || 'Other';
    grouped[cat] = (grouped[cat] || 0) + t.amount;
  });

  const chartData = Object.entries(grouped)
    .map(([name, value]) => ({ name, value, color: getColor(name) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  return (
    <div className="base-card expense-hub">
      <div className="hub-header flex-between">
        <div className="title-stack">
          <h3>Expense Hub</h3>
        </div>
        <div className="period-tabs-eh">
          {['Day', 'Week', 'Month'].map(p => (
            <button
              key={p}
              className={timePeriod === p ? 'active' : ''}
              onClick={() => setTimePeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-area">
        <div className="donut-wrap">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={chartData.length > 0 ? chartData : [{ name: 'No Data', value: 1, color: '#E2E8F0' }]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {(chartData.length > 0 ? chartData : [{ color: '#E2E8F0' }]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-center">
            <span className="lbl">Total</span>
            <span className="val">₹{totalExpense.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="expense-legend">
          {chartData.map((item, index) => (
            <div key={index} className="legend-item">
              <div className="dot" style={{ background: item.color }}></div>
              <div className="item-info">
                <span className="name">{item.name}</span>
                <span className="pct">₹{item.value.toLocaleString()} ({totalExpense > 0 ? Math.round((item.value / totalExpense) * 100) : 0}%)</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '16px', background: 'var(--bg-app)', borderRadius: '12px' }}>
          No expenses recorded for this period yet.<br />
          <span style={{ fontSize: '11px', opacity: 0.7 }}>Add expenses from the Financial Overview card.</span>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .expense-hub { display: flex; flex-direction: column; gap: 24px; }
        .period-tabs-eh { background: #F1F5F9; padding: 4px; border-radius: 10px; display: flex; gap: 4px; }
        .period-tabs-eh button { border: none; background: none; padding: 4px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
        .period-tabs-eh button.active { background: white; color: var(--text-main); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .chart-area { position: relative; }
        .donut-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; }
        .donut-center .lbl { font-size: 11px; font-weight: 600; color: var(--text-muted); }
        .donut-center .val { font-size: 18px; font-weight: 800; color: var(--text-main); }
        .expense-legend { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .legend-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--bg-app); border-radius: 12px; }
        .legend-item .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .legend-item .item-info { display: flex; flex-direction: column; }
        .legend-item .name { font-size: 11px; font-weight: 600; color: var(--text-muted); }
        .legend-item .pct { font-size: 12px; font-weight: 700; color: var(--text-main); }
      `}} />
    </div>
  );
};

export default ExpenseHub;
