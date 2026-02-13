import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Lightbulb } from 'lucide-react';

const data = [
    { name: 'Active', value: 2400 },
    { name: 'Passive', value: 680 },
];

const COLORS = ['#3A8DFF', '#1FBF75'];

const IncomeAnalyticsCard = () => {
    return (
        <div className="glass-card income-card">
            <div className="card-header">
                <h3 className="card-title">Daily Analytics (दैनिक विश्लेषण)</h3>
                <span className="date-badge">Today (आज)</span>
            </div>

            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={data} layout="vertical" margin={{ left: -20, right: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-dim)', fontSize: 12 }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="income-values">
                <div className="income-item">
                    <span className="income-label">Active</span>
                    <span className="income-amt" style={{ color: COLORS[0] }}>₹ 2,400</span>
                </div>
                <div className="income-item">
                    <span className="income-label">Passive</span>
                    <span className="income-amt" style={{ color: COLORS[1] }}>₹ 680</span>
                </div>
            </div>

            <div className="ai-insight">
                <div className="insight-icon">
                    <Lightbulb size={16} color="var(--primary-green)" />
                </div>
                <p className="insight-text">
                    Your passive income covered <strong>22%</strong> of today’s spending.
                </p>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .income-card {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .card-title {
          font-size: 16px;
          font-weight: 600;
        }
        .date-badge {
          font-size: 12px;
          color: var(--text-dim);
          background: rgba(255, 255, 255, 0.05);
          padding: 2px 8px;
          border-radius: 10px;
        }
        .chart-wrapper {
          margin: 10px 0;
        }
        .income-values {
          display: flex;
          justify-content: space-around;
          background: rgba(255, 255, 255, 0.02);
          padding: var(--spacing-sm);
          border-radius: var(--radius-sm);
        }
        .income-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .income-label {
          font-size: 10px;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .income-amt {
          font-size: 14px;
          font-weight: 700;
        }
        .ai-insight {
          display: flex;
          gap: var(--spacing-sm);
          padding: var(--spacing-md);
          background: rgba(31, 191, 117, 0.08);
          border-radius: var(--radius-md);
          align-items: flex-start;
        }
        .insight-icon {
          padding-top: 2px;
        }
        .insight-text {
          font-size: 13px;
          color: var(--text-dim);
          line-height: 1.4;
        }
        .insight-text strong {
          color: var(--text-main);
        }
      `}} />
        </div>
    );
};

export default IncomeAnalyticsCard;
