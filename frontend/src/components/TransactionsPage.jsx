import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowUpRight, ArrowDownLeft, Coffee, ShoppingCart, Home, Briefcase, Landmark, TrendingUp, Download, Calendar, Filter } from 'lucide-react';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [period, setPeriod] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');

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
            console.error('Error fetching transactions:', e);
        }
    };

    const getIcon = (txn) => {
        if (txn.type === 'active-income') return <Briefcase size={18} />;
        if (txn.type === 'passive-income') return <Landmark size={18} />;
        const cat = txn.category?.toLowerCase() || '';
        if (cat.includes('food')) return <Coffee size={18} />;
        if (cat.includes('shop')) return <ShoppingCart size={18} />;
        if (cat.includes('rent') || cat.includes('bill')) return <Home size={18} />;
        return <TrendingUp size={18} style={{ transform: 'rotate(180deg)' }} />;
    };

    const getColor = (txn) => {
        if (txn.type === 'active-income') return '#19E680';
        if (txn.type === 'passive-income') return '#0084FF';
        return '#FF4D4D';
    };

    const getBg = (txn) => {
        if (txn.type === 'active-income') return 'rgba(25,230,128,0.1)';
        if (txn.type === 'passive-income') return 'rgba(0,132,255,0.1)';
        return 'rgba(255,77,77,0.1)';
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        if (d.toDateString() === now.toDateString()) return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    // Filter by period
    const filtered = transactions.filter(t => {
        const d = new Date(t.date);
        const now = new Date();
        if (period === 'Daily') return d.toDateString() === now.toDateString();
        if (period === 'Weekly') {
            const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
            return d >= weekAgo;
        }
        if (period === 'Monthly') {
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }
        return true;
    }).filter(t => {
        if (typeFilter === 'Income') return t.type !== 'expense';
        if (typeFilter === 'Expense') return t.type === 'expense';
        return true;
    });

    const totalIncome = filtered.filter(t => t.type !== 'expense').reduce((s, t) => s + t.amount, 0);
    const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const netFlow = totalIncome - totalExpense;

    // Download CSV
    const downloadCSV = () => {
        const headers = ['Date', 'Title', 'Category', 'Type', 'Amount (₹)'];
        const rows = filtered.map(t => [
            new Date(t.date).toLocaleDateString('en-IN'),
            t.title, t.category || '-',
            t.type === 'expense' ? 'Expense' : t.type === 'passive-income' ? 'Passive Income' : 'Active Income',
            t.type === 'expense' ? `-${t.amount}` : `+${t.amount}`
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${period}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="txn-page">
            {/* Header */}
            <div className="txn-page-header">
                <div>
                    <h1>Transaction History</h1>
                    <p>Complete record of all your financial activity</p>
                </div>
                <button className="download-btn" onClick={downloadCSV}>
                    <Download size={16} />
                    Download Report
                </button>
            </div>

            {/* Summary Cards */}
            <div className="txn-summary-row">
                <div className="txn-summary-card green">
                    <span className="sc-label">Total Income</span>
                    <span className="sc-value">+₹{totalIncome.toLocaleString()}</span>
                </div>
                <div className="txn-summary-card red">
                    <span className="sc-label">Total Expenses</span>
                    <span className="sc-value">-₹{totalExpense.toLocaleString()}</span>
                </div>
                <div className={`txn-summary-card ${netFlow >= 0 ? 'blue' : 'red'}`}>
                    <span className="sc-label">Net Flow</span>
                    <span className="sc-value">{netFlow >= 0 ? '+' : ''}₹{netFlow.toLocaleString()}</span>
                </div>
                <div className="txn-summary-card grey">
                    <span className="sc-label">Transactions</span>
                    <span className="sc-value">{filtered.length}</span>
                </div>
            </div>

            {/* Filters */}
            <div className="txn-filters base-card">
                <div className="filter-group">
                    <Calendar size={15} />
                    <span className="filter-label">Period</span>
                    {['All', 'Daily', 'Weekly', 'Monthly'].map(p => (
                        <button key={p} className={period === p ? 'filter-btn active' : 'filter-btn'} onClick={() => setPeriod(p)}>{p}</button>
                    ))}
                </div>
                <div className="filter-group">
                    <Filter size={15} />
                    <span className="filter-label">Type</span>
                    {['All', 'Income', 'Expense'].map(t => (
                        <button key={t} className={typeFilter === t ? 'filter-btn active' : 'filter-btn'} onClick={() => setTypeFilter(t)}>{t}</button>
                    ))}
                </div>
            </div>

            {/* Transaction List */}
            <div className="base-card txn-full-list">
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                        <Calendar size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                        <p style={{ fontWeight: 600 }}>No transactions for this period.</p>
                        <p style={{ fontSize: '12px', opacity: 0.7 }}>Try changing the filter or add transactions from the Dashboard.</p>
                    </div>
                ) : filtered.map(txn => (
                    <div key={txn._id} className="txn-full-item">
                        <div className="txn-left">
                            <div className="txn-icon" style={{ background: getBg(txn), color: getColor(txn) }}>
                                {getIcon(txn)}
                            </div>
                            <div className="txn-info">
                                <span className="txn-title">{txn.title}</span>
                                <span className="txn-date">{formatDate(txn.date)}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span className="txn-cat-tag" style={{ background: getBg(txn), color: getColor(txn) }}>
                                {txn.category || (txn.type === 'expense' ? 'Expense' : txn.type === 'passive-income' ? 'Passive' : 'Active')}
                            </span>
                            <span className={`txn-amount ${txn.type === 'expense' ? 'debit' : 'credit'}`}>
                                {txn.type === 'expense' ? '-' : '+'}₹{txn.amount.toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .txn-page { padding: 0 0 40px; }
        .txn-page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
        .txn-page-header h1 { font-size: 28px; font-weight: 800; color: var(--text-main); margin-bottom: 4px; }
        .txn-page-header p { font-size: 13px; color: var(--text-muted); font-weight: 500; }
        .download-btn { display: flex; align-items: center; gap: 8px; background: var(--primary-blue); color: white; border: none; padding: 12px 20px; border-radius: 14px; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .download-btn:hover { background: #005ce6; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,87,255,0.25); }
        .txn-summary-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
        .txn-summary-card { background: white; border-radius: 16px; padding: 20px; border: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 6px; }
        .txn-summary-card.green { border-left: 4px solid #19E680; }
        .txn-summary-card.red { border-left: 4px solid #FF4D4D; }
        .txn-summary-card.blue { border-left: 4px solid #0076F5; }
        .txn-summary-card.grey { border-left: 4px solid #94A3B8; }
        .sc-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
        .sc-value { font-size: 22px; font-weight: 800; color: var(--text-main); }
        .txn-filters { display: flex; gap: 28px; align-items: center; flex-wrap: wrap; margin-bottom: 20px; padding: 16px 20px; }
        .filter-group { display: flex; align-items: center; gap: 8px; }
        .filter-label { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-right: 4px; }
        .filter-btn { border: 1px solid var(--border-subtle); background: var(--bg-app); padding: 5px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; color: var(--text-secondary); cursor: pointer; transition: all 0.15s; }
        .filter-btn.active { background: var(--primary-blue); color: white; border-color: var(--primary-blue); }
        .filter-btn:hover:not(.active) { border-color: var(--primary-blue); color: var(--primary-blue); }
        .txn-full-list { display: flex; flex-direction: column; gap: 0; padding: 0; overflow: hidden; }
        .txn-full-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid var(--border-subtle); transition: background 0.15s; }
        .txn-full-item:last-child { border-bottom: none; }
        .txn-full-item:hover { background: var(--bg-app); }
        .txn-cat-tag { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: capitalize; }
        .txn-left { display: flex; align-items: center; gap: 14px; }
        .txn-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .txn-info { display: flex; flex-direction: column; }
        .txn-title { font-size: 14px; font-weight: 600; color: var(--text-main); }
        .txn-date { font-size: 11px; font-weight: 500; color: var(--text-muted); }
        .txn-amount { font-size: 15px; font-weight: 800; }
        .txn-amount.credit { color: #19E680; }
        .txn-amount.debit { color: #FF4D4D; }
        @media (max-width: 768px) {
          .txn-summary-row { grid-template-columns: 1fr 1fr; }
          .txn-filters { flex-direction: column; align-items: flex-start; }
        }
      `}} />
        </div>
    );
};

export default TransactionsPage;
