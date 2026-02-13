import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';

const data = [
    { name: 'Food', value: 4500, color: '#FF7675' },
    { name: 'Housing', value: 12000, color: '#74B9FF' },
    { name: 'Travel', value: 3200, color: '#FDCB6E' },
    { name: 'Bills', value: 2100, color: '#55E6C1' },
    { name: 'Shopping', value: 5400, color: '#A29BFE' },
    { name: 'EMI', value: 8500, color: '#FF9F43' },
];

const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 8}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
        </g>
    );
};

const ExpenseDonutChart = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [filter, setFilter] = useState('Monthly');

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    const totalExpense = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="glass-card expense-card">
            <div className="card-header">
                <h3 className="card-title">Expenses (कुल खर्च)</h3>
                <div className="filters">
                    {['Weekly', 'Monthly', 'Yearly'].map((f) => (
                        <button
                            key={f}
                            className={`filter-btn ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                            paddingAngle={5}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="center-text">
                    <span className="center-label">Total Expense</span>
                    <span className="center-value">₹ {totalExpense.toLocaleString()}</span>
                </div>
            </div>

            <div className="expense-details">
                <div className="active-category">
                    <div className="cat-info">
                        <div className="cat-dot" style={{ background: data[activeIndex].color }}></div>
                        <span className="cat-name">{data[activeIndex].name}</span>
                    </div>
                    <div className="cat-stats">
                        <span className="cat-amt">₹ {data[activeIndex].value.toLocaleString()}</span>
                        <span className="cat-pct">
                            {((data[activeIndex].value / totalExpense) * 100).toFixed(1)}%
                        </span>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .expense-card {
          position: relative;
        }
        .filters {
          display: flex;
          gap: 4px;
          background: rgba(255, 255, 255, 0.05);
          padding: 2px;
          border-radius: 8px;
        }
        .filter-btn {
          background: none;
          border: none;
          color: var(--text-dim);
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-btn.active {
          background: var(--glass-bg);
          color: var(--text-main);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .chart-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .center-text {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          pointer-events: none;
        }
        .center-label {
          font-size: 11px;
          color: var(--text-dim);
          text-transform: uppercase;
        }
        .center-value {
          font-size: 18px;
          font-weight: 700;
        }
        .expense-details {
          margin-top: var(--spacing-sm);
        }
        .active-category {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
        }
        .cat-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }
        .cat-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .cat-name {
          font-size: 15px;
          font-weight: 500;
        }
        .cat-stats {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .cat-amt {
          font-size: 15px;
          font-weight: 700;
        }
        .cat-pct {
          font-size: 11px;
          color: var(--text-dim);
        }
      `}} />
        </div>
    );
};

export default ExpenseDonutChart;
