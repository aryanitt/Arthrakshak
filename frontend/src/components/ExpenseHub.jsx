import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Utilities', value: 40, color: '#0076F5' },
  { name: 'Investments', value: 25, color: '#19E680' },
  { name: 'Leisure', value: 15, color: '#FF8A00' },
  { name: 'Food', value: 20, color: '#FF4D4D' },
];

const ExpenseHub = () => {
  return (
    <div className="base-card expense-hub">
      <div className="hub-header flex-between">
        <div className="title-stack">
          <h3>Expense Hub</h3>
        </div>
        <div className="period-tabs">
          <button className="active">Day</button>
          <button>Week</button>
          <button>Month</button>
        </div>
      </div>

      <div className="chart-area">
        <div className="donut-wrap">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-center">
            <span className="lbl">Total</span>
            <span className="val">₹18,200</span>
          </div>
        </div>
      </div>

      <div className="expense-legend">
        {data.map((item, index) => (
          <div key={index} className="legend-item">
            <div className="dot" style={{ background: item.color }}></div>
            <div className="item-info">
              <span className="name">{item.name}</span>
              <span className="pct">{item.value}%</span>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .expense-hub {
          display: flex;
          flex-direction: column;
          gap: 24px;
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
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
        }
        .period-tabs button.active {
          background: white;
          color: var(--text-main);
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .chart-area {
          position: relative;
        }
        .donut-center {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .donut-center .lbl {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
        }
        .donut-center .val {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-main);
        }
        .expense-legend {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: var(--bg-app);
          border-radius: 12px;
        }
        .legend-item .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .legend-item .item-info {
          display: flex;
          flex-direction: column;
        }
        .legend-item .name {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
        }
        .legend-item .pct {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-main);
        }
      `}} />
    </div>
  );
};

export default ExpenseHub;
