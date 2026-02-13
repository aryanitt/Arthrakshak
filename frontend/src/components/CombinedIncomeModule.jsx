import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Plus, TrendingUp, Briefcase, Landmark } from 'lucide-react';

const CombinedIncomeModule = () => {
  const [timePeriod, setTimePeriod] = useState('Month');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showPassiveForm, setShowPassiveForm] = useState(false);
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  // Dynamic Data Calculation
  const getFinancialData = (period) => {
    const monthly = { active: 85000, passive: 12400, expense: 18200 };
    let divisor = 1;
    if (period === 'Week') divisor = 4.3;
    if (period === 'Today') divisor = 30;

    return {
      active: Math.round(monthly.active / divisor),
      passive: Math.round(monthly.passive / divisor),
      expense: Math.round(monthly.expense / divisor)
    };
  };

  const periodData = getFinancialData(timePeriod);

  // Chart Data (Income + Expense)
  const chartData = [
    { name: 'Active Income', value: periodData.active, color: '#0084FF', icon: <Briefcase size={18} /> },
    { name: 'Passive Income', value: periodData.passive, color: '#19E680', icon: <Landmark size={18} /> },
    { name: 'Expenses', value: periodData.expense, color: '#FF4D4D', icon: <TrendingUp size={18} style={{ transform: 'rotate(180deg)' }} /> }
  ];

  const totalIncome = periodData.active + periodData.passive;
  const totalFlow = totalIncome + periodData.expense;

  return (
    <div className="base-card combined-income-module">
      <div className="module-header flex-between" style={{ marginBottom: '20px' }}>
        <div className="title-stack">
          <h3>Financial Overview</h3>
        </div>
        <div className="period-tabs">
          {['Today', 'Week', 'Month'].map((period) => (
            <button
              key={period}
              className={timePeriod === period ? 'active' : ''}
              onClick={() => setTimePeriod(period)}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="income-viz-grid">
        {/* Pie Chart Section */}
        <div className="pie-section">
          <div className="pie-wrapper">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-center-label">
              <span className="center-lbl">Total Flow</span>
              <span className="center-val">₹{totalFlow.toLocaleString()}</span>
            </div>
          </div>

          <div className="income-legend">
            {/* Active & Passive Row */}
            <div className="legend-multi-col">
              {chartData.slice(0, 2).map((item, index) => (
                <div key={index} className="legend-card compact">
                  <div className="legend-top">
                    <div className="legend-dot" style={{ background: item.color }}></div>
                    <span className="legend-name">{item.name}</span>
                  </div>
                  <div className="legend-middle">
                    <span className="legend-amount">₹{item.value.toLocaleString()}</span>
                  </div>
                  <div className="legend-bottom" style={{ color: item.color }}>
                    {Math.round((item.value / totalFlow) * 100)}%
                  </div>
                </div>
              ))}
            </div>

            {/* Expense Row */}
            <div className="legend-card">
              <div className="legend-left">
                <div className="legend-dot" style={{ background: chartData[2].color }}></div>
                <div className="legend-info">
                  <span className="legend-name">{chartData[2].name}</span>
                  <span className="legend-amount">₹{chartData[2].value.toLocaleString()}</span>
                </div>
              </div>
              <div className="legend-percentage" style={{ color: chartData[2].color }}>
                {Math.round((chartData[2].value / totalFlow) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Manual Entry Section */}
        <div className="entry-section">
          <div className="entry-card" onClick={() => { setShowExpenseForm(!showExpenseForm); setShowPassiveForm(false); }}>
            <div className="entry-icon-box" style={{ background: 'rgba(255, 77, 77, 0.1)' }}>
              <Plus size={20} color="#FF4D4D" />
            </div>
            <div className="entry-content">
              <h4>Add Expense</h4>
              <p>Record a new expense entry</p>
            </div>
          </div>

          {showExpenseForm && (
            <div className="quick-entry-form animate-form">
              <input type="number" placeholder="Amount (₹)" className="form-input" />
              <select
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ color: category ? 'var(--text-main)' : 'var(--text-muted)', appearance: 'none' }}
              >
                <option value="" disabled>Select Category</option>
                <option value="Food">Food & Dining</option>
                <option value="Travel">Travel & Transport</option>
                <option value="Bills">Bills & Utilities</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health & Fitness</option>
                <option value="Education">Education</option>
                <option value="Custom">Other... (Type Custom)</option>
              </select>

              {category === 'Custom' && (
                <input
                  type="text"
                  placeholder="Enter custom category"
                  className="form-input"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  autoFocus
                />
              )}
              <button className="submit-btn" style={{ background: '#FF4D4D' }}>Add Expense</button>
            </div>
          )}

          <div className="entry-card" onClick={() => { setShowPassiveForm(!showPassiveForm); setShowExpenseForm(false); }}>
            <div className="entry-icon-box" style={{ background: 'rgba(25, 230, 128, 0.1)' }}>
              <TrendingUp size={20} color="#19E680" />
            </div>
            <div className="entry-content">
              <h4>Add Passive Earning</h4>
              <p>Record dividend or interest</p>
            </div>
          </div>

          {showPassiveForm && (
            <div className="quick-entry-form animate-form">
              <input type="number" placeholder="Amount (₹)" className="form-input" />
              <input type="text" placeholder="Source" className="form-input" />
              <button className="submit-btn" style={{ background: '#19E680' }}>Add Earning</button>
            </div>
          )}

          {/* Quick Insights Card */}
          {!showExpenseForm && !showPassiveForm && (
            <div className="insights-card">
              <div className="insights-header">
                <h4>💡 Quick Insights</h4>
              </div>
              <div className="insight-row">
                <span className="insight-label">Net Income</span>
                <span className="insight-value positive">
                  {totalIncome - periodData.expense > 0 ? '+' : ''}
                  ₹{(totalIncome - periodData.expense).toLocaleString()}
                </span>
              </div>
              <div className="insight-row">
                <span className="insight-label">Active/Passive/Exp Ratio</span>
                <span className="insight-value">
                  {Math.round((periodData.active / totalIncome) * 100)}:
                  {Math.round((periodData.passive / totalIncome) * 100)}:
                  {Math.round((periodData.expense / totalIncome) * 100)}
                </span>
              </div>
              <div className="insight-row">
                <span className="insight-label">Avg Daily Income</span>
                <span className="insight-value">₹{Math.round(totalIncome / (timePeriod === 'Today' ? 1 : (timePeriod === 'Week' ? 7 : 30))).toLocaleString()}</span>
              </div>
              <div className="insight-tip">
                <span className="tip-icon">💰</span>
                <span className="tip-text">
                  {periodData.expense > periodData.passive
                    ? "Tip: Try to keep expenses lower than passive income."
                    : "Great! Your passive income covers your expenses."}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .combined-income-module {
          grid-column: 1 / -1;
        }
        .period-tabs {
          background: #F1F5F9;
          padding: 4px;
          border-radius: 10px;
          display: flex;
          gap: 4px;
        }
        .period-tabs button {
          border: none;
          background: none;
          padding: 6px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }
        .period-tabs button.active {
          background: white;
          color: var(--text-main);
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .income-viz-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }
        @media (max-width: 900px) {
          .income-viz-grid {
            grid-template-columns: 1fr;
          }
        }
        .pie-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .pie-wrapper {
          position: relative;
        }
        .pie-center-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }
        .center-lbl {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 4px;
        }
        .center-val {
          display: block;
          font-size: 22px;
          font-weight: 800;
          color: var(--text-main);
        }
        .income-legend {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .legend-multi-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .legend-card {
          background: var(--bg-app);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .legend-card.compact {
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }
        .legend-top {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .legend-middle .legend-amount {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-main);
        }
        .legend-bottom {
          font-size: 11px;
          font-weight: 600;
        }
        .legend-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .legend-info {
          display: flex;
          flex-direction: column;
        }
        .legend-name {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .legend-amount {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-main);
        }
        .legend-percentage {
          font-size: 18px;
          font-weight: 800;
        }
        .entry-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
          height: 100%;
        }
        .insights-card {
          margin-top: auto;
        }
        .entry-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: var(--bg-app);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s;
          border: 2px dashed var(--border-subtle);
        }
        .entry-card:hover {
          border-color: var(--primary-blue);
          background: var(--primary-light-blue);
        }
        .entry-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .entry-content h4 {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 2px;
        }
        .entry-content p {
          font-size: 11px;
          font-weight: 500;
          color: var(--text-muted);
        }
        .quick-entry-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
          background: var(--bg-app);
          border-radius: 16px;
          border: 1px solid var(--border-subtle);
        }
        .animate-form {
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .form-input {
          padding: 12px 16px;
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          font-family: var(--font-family);
          background: white;
          color: var(--text-main);
          transition: all 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 3px rgba(0, 132, 255, 0.1);
        }
        .submit-btn {
          padding: 12px;
          border: none;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        .submit-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .insights-card {
          background: var(--bg-app);
          border-radius: 14px;
          padding: 12px 16px;
          animation: slideDown 0.3s ease-out;
        }
        .insights-header h4 {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .insight-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        .insight-row:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }
        .insight-label {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .insight-value {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-main);
        }
        .insight-value.positive {
          color: #19E680;
        }
        .insight-tip {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
          padding: 8px 10px;
          background: rgba(0, 132, 255, 0.06);
          border-radius: 8px;
          border-left: 2px solid var(--primary-blue);
        }
        .tip-icon {
          font-size: 13px;
        }
        .tip-text {
          font-size: 9px;
          font-weight: 600;
          color: var(--text-secondary);
          line-height: 1.3;
        }
      `}} />
    </div>
  );
};

export default CombinedIncomeModule;
