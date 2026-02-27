import React, { useState } from 'react';
import {
    Receipt,
    Mic,
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    Filter,
    PieChart,
    Calendar,
    ChevronRight,
    Search
} from 'lucide-react';

const ExpensesModule = () => {
    const [activeTab, setActiveTab] = useState('daily');

    const transactions = [
        { id: 1, title: 'Vegetables (Local Market)', category: 'Food', amount: 450, type: 'expense', time: '10:30 AM', method: 'Cash' },
        { id: 2, title: 'Passive Income (Affiliate)', category: 'Income', amount: 1200, type: 'income', time: '12:15 PM', method: 'Bank' },
        { id: 3, title: 'Electricity Bill', category: 'Utilities', amount: 2100, type: 'expense', time: 'Yesterday', method: 'UPI' },
        { id: 4, title: 'Petrol', category: 'Transport', amount: 500, type: 'expense', time: 'Yesterday', method: 'Card' }
    ];

    return (
        <div className="expenses-module">
            {/* Header / Voice Input */}
            <div className="expenses-hero">
                <div className="hero-content">
                    <span className="hero-eyebrow">Digital Ledger</span>
                    <h1>Expense Hub</h1>
                    <p>Track your cash flow with AI precision</p>
                </div>
                <div className="voice-input-cta">
                    <div className="mic-ring">
                        <Mic size={32} className="mic-icon" />
                    </div>
                    <span>Tap to Speak Expense</span>
                    <p>(Hindi & English Supported)</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="left-column">
                    {/* Summary Cards */}
                    <div className="summary-cards-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                        <div className="base-card summary-card income">
                            <div className="card-lbl">Monthly Income</div>
                            <div className="card-val">₹85,000</div>
                            <div className="card-trend positive">
                                <ArrowUpRight size={14} /> 12% vs last month
                            </div>
                        </div>
                        <div className="base-card summary-card expense">
                            <div className="card-lbl">Monthly Spends</div>
                            <div className="card-val">₹32,450</div>
                            <div className="card-trend negative">
                                <ArrowDownLeft size={14} /> 5% vs last month
                            </div>
                        </div>
                    </div>

                    {/* Transaction List */}
                    <div className="base-card transactions-card">
                        <div className="card-header-row flex-between" style={{ marginBottom: '20px' }}>
                            <h3>Recent Transactions</h3>
                            <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
                                <button className="icon-btn-v2"><Search size={16} /></button>
                                <button className="icon-btn-v2"><Filter size={16} /></button>
                            </div>
                        </div>

                        <div className="transaction-list">
                            {transactions.map(tx => (
                                <div key={tx.id} className="tx-item">
                                    <div className={`tx-icon ${tx.type}`}>
                                        {tx.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                                    </div>
                                    <div className="tx-info">
                                        <h4>{tx.title}</h4>
                                        <span>{tx.category} • {tx.time}</span>
                                    </div>
                                    <div className="tx-amount-v2">
                                        <div className={`amt ${tx.type}`}>
                                            {tx.type === 'income' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                                        </div>
                                        <span className="method">{tx.method}</span>
                                    </div>
                                    <ChevronRight size={18} className="tx-arrow" />
                                </div>
                            ))}
                        </div>

                        <button className="view-all-btn">View All History</button>
                    </div>
                </div>

                <div className="right-column">
                    <div className="base-card analytics-card">
                        <h3>Spend Analytics</h3>
                        <div className="chart-placeholder">
                            <PieChart size={120} strokeWidth={1} color="var(--primary-blue)" />
                            <div className="chart-info">
                                <strong>Top Category</strong>
                                <span>Household (45%)</span>
                            </div>
                        </div>
                        <div className="category-stats">
                            <div className="cat-stat">
                                <div className="bar-info flex-between">
                                    <span>Food & Drinks</span>
                                    <span>24%</span>
                                </div>
                                <div className="progress-bar-v2"><div className="fill" style={{ width: '24%', background: 'var(--accent-orange)' }}></div></div>
                            </div>
                            <div className="cat-stat">
                                <div className="bar-info flex-between">
                                    <span>Transport</span>
                                    <span>18%</span>
                                </div>
                                <div className="progress-bar-v2"><div className="fill" style={{ width: '18%', background: 'var(--primary-blue)' }}></div></div>
                            </div>
                        </div>
                    </div>

                    <div className="base-card ai-suggestion-card" style={{ marginTop: '20px', background: 'var(--primary-light-blue)', border: 'none' }}>
                        <div className="ai-icon-v2"><Zap size={20} /></div>
                        <h4>AI Saving Tip</h4>
                        <p>You spent 15% more on dining this week. Switching to home-cooked meals could save you ₹4,500/month.</p>
                        <button className="ai-action-btn">Track Meal Budget</button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .expenses-hero { padding: 40px; background: white; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-radius: 0 0 40px 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
                .hero-content h1 { font-size: 32px; font-weight: 800; color: var(--text-main); margin: 4px 0; }
                .hero-eyebrow { font-size: 12px; font-weight: 800; color: var(--primary-blue); text-transform: uppercase; letter-spacing: 1px; }
                .hero-content p { color: var(--text-muted); font-weight: 600; }
                
                .voice-input-cta { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; transition: all 0.3s; }
                .voice-input-cta:hover { transform: scale(1.05); }
                .mic-ring { width: 64px; height: 64px; background: var(--primary-blue); color: white; border-radius: 100%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(0, 118, 245, 0.3); animation: pulse-blue 2s infinite; }
                .voice-input-cta span { font-weight: 800; font-size: 14px; color: var(--text-main); }
                .voice-input-cta p { font-size: 11px; color: var(--text-muted); font-weight: 600; }

                @keyframes pulse-blue {
                    0% { box-shadow: 0 0 0 0 rgba(0, 118, 245, 0.4); }
                    70% { box-shadow: 0 0 0 15px rgba(0, 118, 245, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(0, 118, 245, 0); }
                }

                .summary-card.income { border-left: 4px solid var(--accent-green); }
                .summary-card.expense { border-left: 4px solid var(--accent-red); }
                .card-lbl { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; }
                .card-val { font-size: 24px; font-weight: 800; color: var(--text-main); }
                .card-trend { font-size: 12px; font-weight: 700; display: flex; align-items: center; gap: 4px; margin-top: 4px; }
                .card-trend.positive { color: var(--accent-green); }
                .card-trend.negative { color: var(--accent-red); }

                .tx-item { display: flex; align-items: center; padding: 16px; border-radius: 16px; transition: all 0.2s; cursor: pointer; gap: 16px; position: relative; border: 1px solid transparent; }
                .tx-item:hover { background: var(--bg-app); border-color: var(--border-subtle); }
                .tx-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
                .tx-icon.income { background: rgba(25, 230, 128, 0.1); color: var(--accent-green); }
                .tx-icon.expense { background: rgba(255, 77, 77, 0.1); color: var(--accent-red); }
                .tx-info { flex: 1; }
                .tx-info h4 { font-size: 15px; font-weight: 700; color: var(--text-main); margin-bottom: 2px; }
                .tx-info span { font-size: 12px; color: var(--text-muted); font-weight: 600; }
                .tx-amount-v2 { text-align: right; margin-right: 12px; }
                .tx-amount-v2 .amt { font-size: 16px; font-weight: 800; }
                .tx-amount-v2 .amt.income { color: var(--accent-green); }
                .tx-amount-v2 .amt.expense { color: var(--text-main); }
                .tx-amount-v2 .method { font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
                .tx-arrow { color: #CBD5E1; }

                .view-all-btn { width: 100%; padding: 14px; margin-top: 20px; background: var(--bg-app); border: 1px solid var(--border-subtle); border-radius: 12px; font-weight: 700; color: var(--primary-blue); cursor: pointer; transition: all 0.2s; }
                .view-all-btn:hover { background: var(--primary-light-blue); }

                .chart-placeholder { padding: 30px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
                .chart-info { text-align: center; }
                .chart-info strong { display: block; font-size: 14px; }
                .chart-info span { font-size: 12px; color: var(--text-muted); }

                .progress-bar-v2 { height: 6px; background: var(--border-subtle); border-radius: 10px; overflow: hidden; margin: 6px 0 16px 0; }
                .progress-bar-v2 .fill { height: 100%; border-radius: 10px; }

                .icon-btn-v2 { width: 36px; height: 36px; border-radius: 10px; border: 1px solid var(--border-subtle); background: white; color: var(--text-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
                .icon-btn-v2:hover { background: var(--bg-app); color: var(--primary-blue); }
            `}} />
        </div>
    );
};

export default ExpensesModule;
