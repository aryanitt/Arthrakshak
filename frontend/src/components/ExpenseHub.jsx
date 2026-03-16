import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Coffee, ShoppingCart, Home, TrendingUp, Activity, Smartphone, Car, Utensils } from 'lucide-react';

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

const CATEGORY_Icons = {
  'Food': <Utensils size={18} />,
  'Bills': <Smartphone size={18} />,
  'Travel': <Car size={18} />,
  'Shopping': <ShoppingCart size={18} />,
  'Home': <Home size={18} />,
  'Entertainment': <Activity size={18} />,
  'Health': <Activity size={18} />,
  'Other': <TrendingUp size={18} style={{ transform: 'rotate(180deg)' }} />,
};

const getColor = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS['Other'];
const getIcon = (cat) => CATEGORY_Icons[cat] || CATEGORY_Icons['Other'];

const ExpenseHub = ({ onViewAll }) => {
  const [timePeriod, setTimePeriod] = useState('Day');
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/transactions`);
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

  // Recent Expenses (Top 6)
  const recentExpenses = transactions
    .filter(t => t.type === 'expense')
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  // Group by category for chart
  const grouped = {};
  filtered.forEach(t => {
    const cat = t.category || 'Other';
    grouped[cat] = (grouped[cat] || 0) + t.amount;
  });

  const chartData = Object.entries(grouped)
    .map(([name, value]) => ({ name, value, color: getColor(name) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { day: '2-digit', month: 'short' });
  };

  return (
    <div className="base-card expense-hub">
      <div className="hub-header flex-between">
        <div className="title-stack">
          <h3>Expense Distribution</h3>
        </div>
        <div className="hub-top-right">
          <button className="view-all-link" onClick={onViewAll}>View All</button>
        </div>
      </div>

      <div className="hub-period-selector">
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
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={chartData.length > 0 ? chartData : [{ name: 'No Data', value: 1, color: '#E2E8F0' }]}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
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

      {chartData.length > 0 && (
        <div className="expense-legend">
          {chartData.map((item, index) => (
            <div key={index} className="legend-item">
              <div className="dot" style={{ background: item.color }}></div>
              <div className="item-info">
                <span className="name">{item.name}</span>
                <span className="pct">₹{item.value.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}


      <style dangerouslySetInnerHTML={{
        __html: `
        .expense-hub {
            padding: 24px 32px !important;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .expense-hub h3 {
            font-size: 16px;
            font-weight: 800;
            color: #0F172A;
            margin: 0;
        }
        .view-all-link {
          background: none;
          border: none;
          color: #0076F5;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }
        .hub-period-selector {
            display: flex;
            justify-content: center;
        }
        .period-tabs-eh {
          background: #F1F5F9;
          padding: 4px;
          border-radius: 12px;
          display: flex;
          gap: 4px;
        }
        .period-tabs-eh button {
          border: none;
          background: none;
          padding: 6px 16px;
          border-radius: 9px;
          font-size: 11px;
          font-weight: 700;
          color: #94A3B8;
          cursor: pointer;
          transition: all 0.2s;
        }
        .period-tabs-eh button.active {
          background: white;
          color: #0F172A;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .chart-area { position: relative; }
        .donut-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; }
        .donut-center .lbl { font-size: 10px; font-weight: 600; color: #94A3B8; text-transform: uppercase; }
        .donut-center .val { font-size: 18px; font-weight: 800; color: #0F172A; }
        
        .expense-legend { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 8px; }
        .legend-item { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: #F8FAFC; border-radius: 14px; border: 1px solid #F1F5F9; }
        .legend-item .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .legend-item .item-info { display: flex; flex-direction: column; }
        .legend-item .name { font-size: 10px; font-weight: 700; color: #94A3B8; text-transform: uppercase; }
        .legend-item .pct { font-size: 13px; font-weight: 800; color: #0F172A; }

      `}} />
    </div>
  );
};

export default ExpenseHub;
