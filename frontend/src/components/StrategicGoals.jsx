import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Target, History, User, Info, Plus, Home,
    Palmtree, Check, X, Calculator, TrendingUp,
    Zap, Trash2, Calendar as CalendarIcon,
    ShieldCheck, Wallet, FileText, Download, Search
} from 'lucide-react';
import * as XLSX from 'xlsx';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

const StrategicGoals = ({ onPayment, monthlyIncome = 85000 }) => {
    const [goals, setGoals] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // Local search state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newGoal, setNewGoal] = useState({
        title: '',
        targetAmount: '',
        startDate: new Date().toISOString().split('T')[0],
        targetDate: '',
        category: 'apartment'
    });

    const [emiCalc, setEmiCalc] = useState({
        targetAmount: 2500000,
        interest: 8.5,
        tenure: 5
    });

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/goals`);
            setGoals(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching goals:', error);
            setLoading(false);
        }
    };

    const handleAddGoal = async (e) => {
        e.preventDefault();
        try {
            const goalToSave = {
                ...newGoal,
                targetAmount: Number(newGoal.targetAmount)
            };
            const response = await axios.post(`${API_BASE_URL}/goals`, goalToSave);
            setGoals([...goals, response.data]);
            setIsModalOpen(false);
            setNewGoal({ title: '', targetAmount: '', targetDate: '', category: 'apartment' });
            alert('Strategic Goal Architecture Created!');
        } catch (error) {
            console.error('Error adding goal:', error);
            alert(`Architecture Failure: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleDeleteGoal = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/goals/${id}`);
            setGoals(goals.filter(g => g._id !== id));
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    const getMonthsRemaining = (targetDate) => {
        const today = new Date();
        const target = new Date(targetDate);
        const months = (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());
        return Math.max(1, months);
    };

    const getTotalMonths = (startDate, targetDate) => {
        const start = new Date(startDate);
        const target = new Date(targetDate);
        const months = (target.getFullYear() - start.getFullYear()) * 12 + (target.getMonth() - start.getMonth());
        return Math.max(1, months);
    };

    const getRecommendedPayment = (goal) => {
        const totalMonths = getTotalMonths(goal.startDate || goal.createdAt, goal.targetDate);
        return Math.ceil(goal.targetAmount / totalMonths);
    };

    const handleMarkAsPaid = async (goal, customAmount, monthOverride) => {
        const today = new Date();
        const currentMonthIdx = today.getMonth();
        const currentYear = today.getFullYear();
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        const month = monthOverride || months[currentMonthIdx];
        const monthIdx = months.indexOf(month);

        // Validation: Cannot pay for future months or months before start date
        // Validation: Cannot pay for future months or months before start date
        // Robust Date Parsing (Avoid Timezone Shift)
        let startYear = currentYear, startMonthIdx = 0;
        if (goal.startDate) {
            const parts = goal.startDate.split('-');
            startYear = parseInt(parts[0]);
            startMonthIdx = parseInt(parts[1]) - 1; // 0-indexed
        }

        if (monthOverride) {
            if (monthIdx !== currentMonthIdx) {
                alert(`Constraint Violation: You can only inject funds for the current month (${months[currentMonthIdx]}).`);
                return;
            }
            if (currentYear < startYear || (currentYear === startYear && monthIdx < startMonthIdx)) {
                alert(`Constraint Violation: Cannot contribute before the Strategic Starting Date.`);
                return;
            }
        }

        const amount = Number(customAmount) || getRecommendedPayment(goal);
        const url = `${API_BASE_URL}/goals/${goal._id}/pay`;

        try {
            const response = await axios.put(url, { amount, month });
            setGoals(goals.map(g => g._id === goal._id ? response.data : g));
            if (onPayment) onPayment(amount);

            // Auto-close calendar and visual feedback
            toggleTracker(goal._id);
            alert(`Strategy synchronized! ${month} EMI contribution of ₹${amount.toLocaleString()} confirmed.`);
        } catch (error) {
            console.error('Payment failed:', error);
            alert(`Sync Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const [visibleTrackers, setVisibleTrackers] = useState({});
    const toggleTracker = (goalId) => setVisibleTrackers(prev => ({ ...prev, [goalId]: !prev[goalId] }));

    const [paymentAmounts, setPaymentAmounts] = useState({});
    const handleAmountChange = (goalId, val) => setPaymentAmounts({ ...paymentAmounts, [goalId]: val });

    const getCategoryIcon = (cat) => {
        switch (cat) {
            case 'apartment': return <Home size={24} />;
            case 'retirement': return <Palmtree size={24} />;
            default: return <Target size={24} />;
        }
    };

    const handleDownloadReport = () => {
        // Sheet 1: Overview
        const overviewData = goals.map(goal => ({
            'Goal Title': goal.title,
            'Category': goal.category.charAt(0).toUpperCase() + goal.category.slice(1),
            'Target Amount': goal.targetAmount,
            'Current Balance': goal.currentBalance,
            'Progress (%)': ((goal.currentBalance / goal.targetAmount) * 100).toFixed(2) + '%',
            'Start Date': new Date(goal.startDate).toLocaleDateString(),
            'Target Date': goal.targetDate
        }));

        // Sheet 2: Payment History
        const historyData = [];
        goals.forEach(goal => {
            if (goal.contributions && goal.contributions.length > 0) {
                goal.contributions.forEach(c => {
                    if (c.status === 'done') {
                        historyData.push({
                            'Goal Title': goal.title,
                            'Category': goal.category,
                            'Month': c.month,
                            'Amount Paid': c.amount,
                            'Payment Date': c.paidAt ? new Date(c.paidAt).toLocaleDateString() : 'N/A',
                            'Payment Time': c.paidAt ? new Date(c.paidAt).toLocaleTimeString() : 'N/A'
                        });
                    }
                });
            }
        });

        const workbook = XLSX.utils.book_new();

        const wsOverview = XLSX.utils.json_to_sheet(overviewData);
        XLSX.utils.book_append_sheet(workbook, wsOverview, 'Overview');

        if (historyData.length > 0) {
            const wsHistory = XLSX.utils.json_to_sheet(historyData);
            XLSX.utils.book_append_sheet(workbook, wsHistory, 'Payment History');
        }

        XLSX.writeFile(workbook, `Strategic_Goals_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    // Filter goals based on searchQuery
    const filteredGoals = Array.isArray(goals) ? goals.filter(g =>
        g.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const calculateEMI = () => {
        const P = emiCalc.targetAmount;
        const R = (emiCalc.interest / 12) / 100;
        const N = emiCalc.tenure * 12;
        const emiValue = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
        const totalPayment = emiValue * N;
        const totalInterestValue = totalPayment - P;
        return { emi: Math.round(emiValue || 0), totalInterest: Math.round(totalInterestValue || 0) };
    };

    const { emi, totalInterest } = calculateEMI();

    // Real-time calculations
    const totalMonthlyRecommended = goals.reduce((acc, g) => acc + getRecommendedPayment(g), 0);
    const totalSaved = goals.reduce((acc, g) => acc + (Number(g.currentBalance) || 0), 0);
    const totalTarget = goals.reduce((acc, g) => acc + (Number(g.targetAmount) || 0), 0);
    const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

    return (
        <div className="strategic-goals-container">
            <div className="dashboard-grid">
                {/* Left Column (Main Content) */}
                <div className="left-column">
                    <div className="hero-allocation-card">
                        <div className="hero-bg-pattern">
                            <ShieldCheck className="bg-icon shield" size={240} strokeWidth={1} />
                            <TrendingUp className="bg-icon trend" size={120} strokeWidth={1.5} />
                            <Wallet className="bg-icon wallet" size={80} strokeWidth={1.5} />
                        </div>

                        <div className="hero-main-content">
                            <div className="hero-header-row">
                                <div className="hero-label">
                                    <span>Strategic Allocation Summary</span>
                                    <TrendingUp size={18} className="eye-icon" />
                                </div>
                                <div className="premium-tag-v2">HEALTH: {overallProgress > 50 ? 'OPTIMAL' : 'PLANNING'}</div>
                            </div>
                            <div className="balance-fig">₹{totalMonthlyRecommended.toLocaleString()}.00</div>

                            {/* Health Indicators */}
                            <div className="health-indicators-row" style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                                <div className={`health-badge ${((totalMonthlyRecommended / monthlyIncome) * 100) < 20 ? 'safe' : ((totalMonthlyRecommended / monthlyIncome) * 100) < 40 ? 'moderate' : 'critical'}`}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        background: ((totalMonthlyRecommended / monthlyIncome) * 100) < 20 ? 'rgba(34, 197, 94, 0.2)' : ((totalMonthlyRecommended / monthlyIncome) * 100) < 40 ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: ((totalMonthlyRecommended / monthlyIncome) * 100) < 20 ? '#4ADE80' : ((totalMonthlyRecommended / monthlyIncome) * 100) < 40 ? '#FDE047' : '#FCA5A5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                    {((totalMonthlyRecommended / monthlyIncome) * 100) < 20 ? <Check size={12} /> : ((totalMonthlyRecommended / monthlyIncome) * 100) < 40 ? <Info size={12} /> : <X size={12} />}
                                    <span>
                                        {((totalMonthlyRecommended / monthlyIncome) * 100) < 20 ? 'SAFE ZONE' : ((totalMonthlyRecommended / monthlyIncome) * 100) < 40 ? 'MODERATE USE' : 'CRITICAL LOAD'}
                                    </span>
                                </div>
                                <div className="usage-stat" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                                    Using {((totalMonthlyRecommended / monthlyIncome) * 100).toFixed(1)}% of Income
                                </div>
                            </div>

                            <div className="hero-subs">
                                <div className="hero-sub-card">
                                    <span className="sub-label">Allocated Goals Progress</span>
                                    <div className="sub-value">
                                        <span className="val">{overallProgress}%</span>
                                        <span className={`pct-tag ${overallProgress > 70 ? 'green' : 'blue'}`}>
                                            {overallProgress > 70 ? 'Optimal' : 'Growing'}
                                        </span>
                                    </div>
                                    <div className="sub-detail">Total Target: ₹{totalTarget.toLocaleString()}</div>
                                </div>
                                <button className="hero-sub-card projection-trigger" onClick={() => alert('AI Projection Engine Initializing...')}>
                                    <span className="sub-label">Strategic Forecast</span>
                                    <div className="sub-value">
                                        <span className="val">Plan Ahead</span>
                                        <div className="p-icon-box-v2"><Zap size={18} /></div>
                                    </div>
                                    <div className="sub-detail">AI-Powered Forecasting</div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="strategic-actions-row">
                        <div className="insight-pill">
                            <Zap size={14} />
                            <span>AI INSIGHT: You are on track to hit 'House' 3 months early.</span>
                        </div>
                        <div className="action-group-v2">
                            <div className="local-search-wrapper">
                                <Search size={16} className="local-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search goals..."
                                    className="local-search-input"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="premium-secondary-btn" onClick={handleDownloadReport}>
                                <Download size={16} />
                                <span>Export Analysis</span>
                            </button>
                            <button className="new-goal-btn-premium" onClick={() => setIsModalOpen(true)}>
                                <div className="btn-icon-wrapper">
                                    <Plus size={20} strokeWidth={3} />
                                </div>
                                <span>New Goal</span>
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="base-card loading-state">
                            <div className="shimmer-card"></div>
                            <span>Synchronizing Strategic Vault...</span>
                        </div>
                    ) : (
                        <div className="goals-v2-grid">
                            {filteredGoals.map(goal => {
                                const target = Number(goal.targetAmount) || 0;
                                const current = Number(goal.currentBalance) || 0;
                                const progressPct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
                                const recPayment = getRecommendedPayment(goal) || 0;
                                const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                                const paidMonths = goal.payments?.map(p => p.month) || [];

                                return (
                                    <div key={goal._id} className="goal-item-card-v2">
                                        <div className="goal-card-header">
                                            <div className="goal-identity flex-between">
                                                <div className="flex-row items-center gap-12" style={{ display: 'flex', gap: '24px' }}>
                                                    <div className={`goal-icon-v2 ${goal.category}`}>
                                                        {getCategoryIcon(goal.category)}
                                                    </div>
                                                    <div className="goal-info">
                                                        <div className="goal-title-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <h3 style={{ margin: 0 }}>{goal.title || 'Untitled Goal'}</h3>
                                                            {progressPct > 70 && (
                                                                <div className="status-badge-v2 active">
                                                                    OPTIMAL
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="goal-meta-v2" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <button
                                                                className={`tracker-toggle-btn ${visibleTrackers[goal._id] ? 'active' : ''}`}
                                                                onClick={() => toggleTracker(goal._id)}
                                                                title="Toggle Monthly Strategy"
                                                            >
                                                                <CalendarIcon size={12} />
                                                            </button>
                                                            Mature on {goal.targetDate || 'TBD'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="pct-stack text-right" style={{ textAlign: 'right' }}>
                                                    <span className="data-value mini" style={{ color: 'var(--primary-blue)', display: 'block' }}>{progressPct}%</span>
                                                    <span className="data-label">FUNDED</span>
                                                </div>
                                            </div>
                                        </div>

                                        {visibleTrackers[goal._id] && (
                                            <div className="monthly-tracker-v2">
                                                {months.map((m, idx) => {
                                                    const today = new Date();
                                                    const currentMonthIdx = today.getMonth();
                                                    const currentYear = today.getFullYear();

                                                    // Robust Date Parsing (Avoid Timezone Shift)
                                                    let sYear = currentYear, sMonth = 0;
                                                    if (goal.startDate) {
                                                        const parts = goal.startDate.split('-');
                                                        sYear = parseInt(parts[0]);
                                                        sMonth = parseInt(parts[1]) - 1; // 0-indexed
                                                    }

                                                    // Use safe values for comparison
                                                    const isBeforeStart = (sYear === currentYear && idx < sMonth) || (sYear > currentYear);
                                                    const isNotCurrent = idx !== currentMonthIdx;
                                                    const isFutureYear = currentYear < sYear;
                                                    const isPaid = paidMonths.includes(m);

                                                    // Constraint: Only current month allowed, and must be >= start date
                                                    const isDisabled = isBeforeStart || isNotCurrent || isFutureYear;

                                                    let tooltip = `Inject ${m} Funds`;
                                                    if (isPaid) tooltip = 'EMI Paid';
                                                    else if (isBeforeStart) tooltip = 'Pre-Strategy Date';
                                                    else if (isNotCurrent) tooltip = 'Locked: Only Current Month';

                                                    return (
                                                        <div
                                                            key={m}
                                                            className={`month-box-v2 ${isPaid ? 'paid' : ''} ${isDisabled ? 'disabled' : ''}`}
                                                            onClick={() => !isDisabled && handleMarkAsPaid(goal, recPayment, m)}
                                                            title={tooltip}
                                                        >
                                                            {m}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <div className="goal-progress-box">
                                            <div className="progress-data flex-between" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div className="balance-stack">
                                                    <span className="data-label">CURRENT POOL</span>
                                                    <div className="data-value mini">₹{current.toLocaleString()}</div>
                                                </div>
                                                <div className="target-stack text-right" style={{ textAlign: 'right' }}>
                                                    <span className="data-label">ULTIMATE TARGET</span>
                                                    <div className="data-value mini">₹{target.toLocaleString()}</div>
                                                </div>
                                            </div>
                                            <div className="progress-track-v2" style={{ marginTop: '8px' }}>
                                                <div className="progress-fill-v2" style={{
                                                    width: `${progressPct}%`,
                                                    background: goal.category === 'retirement' ? 'linear-gradient(90deg, #FB923C, #f97316)' : 'linear-gradient(90deg, #0057FF, #00D1FF)'
                                                }}></div>
                                            </div>
                                        </div>

                                        <div className="goal-actions-v2" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div className="payment-input-group" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                                <input
                                                    type="number"
                                                    placeholder={`₹${recPayment.toLocaleString()}`}
                                                    value={paymentAmounts[goal._id] || ''}
                                                    onChange={(e) => handleAmountChange(goal._id, e.target.value)}
                                                />
                                                <button className="pay-btn-v2" onClick={() => handleMarkAsPaid(goal, paymentAmounts[goal._id])}>
                                                    <ShieldCheck size={16} />
                                                    <span>Inject Funds</span>
                                                </button>
                                            </div>
                                            <button className="delete-btn-v2 small" onClick={() => handleDeleteGoal(goal._id)} title="Retire Asset">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Column (Sidebar/Utilities) */}
                <div className="right-column">
                    <div className="base-card calculator-card-v2">
                        <div className="calc-header">
                            <div className="calc-icon"><Calculator size={18} /></div>
                            <div className="calc-title">
                                <h3>Future EMI Calculator</h3>
                                <p>Financial commitment estimation</p>
                            </div>
                        </div>

                        <div className="calc-form">
                            <div className="input-field">
                                <label>TARGET AMOUNT</label>
                                <input
                                    type="number"
                                    value={emiCalc.targetAmount}
                                    onChange={(e) => setEmiCalc({ ...emiCalc, targetAmount: Number(e.target.value) })}
                                />
                            </div>
                            <div className="input-row">
                                <div className="input-field">
                                    <label>INTEREST (%)</label>
                                    <input
                                        type="number"
                                        value={emiCalc.interest}
                                        onChange={(e) => setEmiCalc({ ...emiCalc, interest: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="input-field">
                                    <label>TENURE (YRS)</label>
                                    <input
                                        type="number"
                                        value={emiCalc.tenure}
                                        onChange={(e) => setEmiCalc({ ...emiCalc, tenure: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="emi-result-v2">
                                <span className="res-lbl">Estimated Monthly EMI</span>
                                <div className="res-val">₹{emi.toLocaleString()}</div>
                                <div className="res-detail">Total Interest: ₹{totalInterest.toLocaleString()}</div>
                            </div>

                            <button className="create-btn-v2" onClick={() => {
                                const targetYear = new Date().getFullYear() + emiCalc.tenure;
                                setNewGoal({
                                    title: `Goal for ₹${emiCalc.targetAmount.toLocaleString()}`,
                                    targetAmount: emiCalc.targetAmount,
                                    targetDate: `${targetYear}-01-01`,
                                    category: 'other'
                                });
                                setIsModalOpen(true);
                            }}>
                                <Plus size={16} />
                                <span>Create Goal from Result</span>
                            </button>
                        </div>
                    </div>

                    <div className="base-card recommendations-card-v2">
                        <div className="rec-header">
                            <Zap size={18} />
                            <h3>Recommended Actions</h3>
                        </div>
                        <div className="rec-list">
                            <div className="rec-item success">
                                <TrendingUp size={14} />
                                <p>Top-up 'Retirement' by ₹5k to hit target early.</p>
                            </div>
                            <div className="rec-item primary">
                                <Wallet size={14} />
                                <p>Use bonus to clear principal faster.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content-v2">
                        <div className="modal-header-v2">
                            <div className="modal-title-stack">
                                <h3>Architect Strategic Goal</h3>
                                <p>Initialize a new high-yield financial milestone</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddGoal} className="modal-form-v2">
                            <div className="form-section">
                                <div className="input-field">
                                    <label>GOAL DEFINITION</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Waterfront Penthouse"
                                        required
                                        value={newGoal.title}
                                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                    />
                                </div>
                                <div className="input-row">
                                    <div className="input-field">
                                        <label>STARTING CAPITAL DATE</label>
                                        <input
                                            type="date"
                                            required
                                            value={newGoal.startDate}
                                            onChange={(e) => setNewGoal({ ...newGoal, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>TARGET MATURITY DATE</label>
                                        <input
                                            type="date"
                                            required
                                            value={newGoal.targetDate}
                                            onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section highlight">
                                <div className="input-row">
                                    <div className="input-field">
                                        <label>TARGET VALUATION (₹)</label>
                                        <input
                                            type="number"
                                            placeholder="Capital Required"
                                            required
                                            value={newGoal.targetAmount}
                                            onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>STRATEGIC CATEGORY</label>
                                        <select
                                            value={['apartment', 'retirement', 'other'].includes(newGoal.category) ? newGoal.category : 'custom'}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === 'custom') {
                                                    setNewGoal({ ...newGoal, category: '' });
                                                } else {
                                                    setNewGoal({ ...newGoal, category: val });
                                                }
                                            }}
                                        >
                                            <option value="apartment">Apartment / Real Estate</option>
                                            <option value="retirement">Retirement Fund</option>
                                            <option value="other">Strategic Asset</option>
                                            <option value="custom">Custom (Type your own...)</option>
                                        </select>
                                        {(!['apartment', 'retirement', 'other'].includes(newGoal.category) || newGoal.category === '') && (
                                            <input
                                                type="text"
                                                placeholder="Enter custom category name..."
                                                value={newGoal.category}
                                                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                                                style={{ marginTop: '8px' }}
                                                autoFocus
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer-v2">
                                <button type="submit" className="modal-submit-btn">
                                    <Zap size={18} />
                                    <span>Initialize Goal Architecture</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .strategic-goals-container {
                    padding: 0;
                    color: var(--text-main);
                }
                .page-header {
                   margin-bottom: 24px;
                }
                .header-actions {
                    display: flex;
                    gap: 12px;
                }

                .premium-action-btn {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 20px;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: inherit;
                }

                .download-report {
                    background: white;
                    border: 2px solid var(--primary-blue);
                    color: var(--primary-blue);
                    box-shadow: 0 4px 15px rgba(0, 87, 255, 0.1);
                }
                .download-report:hover {
                    background: var(--primary-light-blue);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 87, 255, 0.15);
                }

                .history-toggle {
                    background: var(--text-main);
                    border: 2px solid var(--text-main);
                    color: white;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }
                .history-toggle:hover {
                    background: #000;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
                }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 24px;
                }

                /* Hero Allocation Card */
                .hero-allocation-card {
                    background: linear-gradient(120deg, #0057FF 0%, #0084FF 50%, #00D1FF 100%);
                    border-radius: 24px;
                    padding: 32px;
                    color: white;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0, 87, 255, 0.2);
                    margin-bottom: 24px;
                }
                .hero-bg-pattern {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    pointer-events: none;
                    z-index: 0;
                }
                .bg-icon {
                    position: absolute;
                    opacity: 0.08;
                    color: white;
                }
                .bg-icon.shield { right: -40px; bottom: -60px; transform: rotate(-15deg); }
                .bg-icon.trend { top: 10px; right: 140px; opacity: 0.05; transform: rotate(10deg); }
                .bg-icon.wallet { bottom: 20px; left: 40%; opacity: 0.04; transform: rotate(-10deg); }

                .hero-main-content { position: relative; z-index: 1; }
                .hero-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
                .hero-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; opacity: 0.9; }
                .premium-tag-v2 { font-size: 10px; font-weight: 800; background: rgba(25, 230, 128, 0.2); color: #CCFFEB; padding: 4px 10px; border-radius: 100px; }
                
                .balance-fig { font-size: 40px; font-weight: 800; letter-spacing: -1px; margin-bottom: 24px; }

                .hero-subs { display: flex; gap: 16px; }
                .hero-sub-card {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    padding: 16px;
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    text-align: left;
                    font-family: inherit;
                }
                .projection-trigger { cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.2s; }
                .projection-trigger:hover { background: rgba(255, 255, 255, 0.25); transform: translateY(-2px); }
                
                .sub-label { font-size: 10px; font-weight: 700; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px; }
                .sub-value { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
                .sub-value .val { font-size: 18px; font-weight: 800; }
                .pct-tag { font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 6px; }
                .pct-tag.green { background: rgba(25, 230, 128, 0.2); color: #CCFFEB; }
                .sub-detail { font-size: 10px; opacity: 0.7; font-weight: 600; }
                .p-icon-box-v2 { width: 28px; height: 28px; background: rgba(255, 255, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; }

                /* Strategic Actions Row */
                .strategic-actions-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    gap: 16px;
                }
                .insight-pill {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: #F1F5F9;
                    padding: 8px 16px;
                    border-radius: 100px;
                    font-size: 12px;
                    font-weight: 700;
                    color: #475569;
                    border: 1px solid #E2E8F0;
                }
                .insight-pill color: var(--primary-blue);
                .insight-pill span { opacity: 0.9; }

                .action-group-v2 {
                    display: flex;
                    gap: 12px;
                }

                .premium-secondary-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    height: 48px;
                    background: white;
                    color: var(--primary-blue);
                    border: 1.5px solid var(--primary-blue);
                    padding: 10px 18px;
                    border-radius: 14px;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 12px rgba(0, 87, 255, 0.08);
                    font-family: inherit;
                }
                .premium-secondary-btn:hover {
                    background: var(--primary-light-blue);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 87, 255, 0.12);
                }

                .new-goal-btn-premium {
                    background: #0F172A;
                    color: white;
                    border: none;
                    height: 48px;
                    padding: 0 24px 0 6px;
                    border-radius: 100px;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 8px 20px -4px rgba(15, 23, 42, 0.3);
                }
                .new-goal-btn-premium:hover {
                    transform: translateY(-2px) scale(1.02);
                    box-shadow: 0 12px 25px -4px rgba(15, 23, 42, 0.4);
                    background: #1E293B;
                }
                .btn-icon-wrapper {
                    width: 36px;
                    height: 36px;
                    background: rgba(255, 255, 255, 0.15);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .goals-v2-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                    margin-bottom: 24px;
                }

                @media (max-width: 1400px) {
                    .goals-v2-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .goal-item-card-v2 {
                    background: white;
                    border-radius: 24px;
                    padding: 32px;
                    border: 1px solid #F1F5F9;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .goal-item-card-v2:hover {
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
                    transform: translateY(-4px);
                    border-color: rgba(0, 118, 245, 0.3);
                }
                .goal-item-card-v2::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 4px;
                    background: linear-gradient(90deg, var(--primary-blue), #00D1FF);
                    opacity: 0.8;
                }
                .goal-item-card-v2:hover::before { height: 6px; }

                .goal-card-header {
                    margin-bottom: 24px;
                }
                .goal-icon-v2 {
                    width: 54px;
                    height: 54px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 16px;
                    transition: all 0.3s;
                }
                .goal-icon-v2.apartment { background: rgba(0, 87, 255, 0.1); color: var(--primary-blue); }
                .goal-icon-v2.retirement { background: rgba(251, 146, 60, 0.1); color: #FB923C; }
                .goal-icon-v2.other { background: rgba(148, 163, 184, 0.1); color: #64748B; }

                .goal-title-row h3 {
                    font-size: 20px;
                    font-weight: 800;
                    color: #0F172A;
                    letter-spacing: -0.5px;
                }
                .goal-meta-v2 {
                    font-size: 13px;
                    color: #64748B;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                /* Monthly Tracker Grid - Soft UI */
                .monthly-tracker-v2 {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    gap: 12px;
                    margin: 20px 0;
                    padding: 24px;
                    background: #FAFAFA;
                    border-radius: 20px;
                    /* Soft inner shadow or subtle border */
                    border: 1px solid rgba(0,0,0,0.03);
                    box-shadow: inset 0 2px 6px rgba(0,0,0,0.02);
                }
                .month-box-v2 {
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid #F1F5F9;
                    background: white;
                    color: #94A3B8;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .month-box-v2.paid {
                    background: var(--primary-blue);
                    color: white;
                    border-color: var(--primary-blue);
                    box-shadow: 0 4px 12px rgba(0, 87, 255, 0.25);
                    transform: translateY(-1px);
                }
                .month-box-v2:hover:not(.paid):not(.disabled) {
                    background: white;
                    border-color: var(--primary-blue);
                    color: var(--primary-blue);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 87, 255, 0.1);
                }
                .month-box-v2.disabled {
                    background: transparent;
                    color: #E2E8F0;
                    border-color: transparent;
                    box-shadow: none;
                    cursor: default;
                }

                .tracker-toggle-btn {
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    width: 22px;
                    height: 22px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #64748B;
                    padding: 0;
                }
                .tracker-toggle-btn:hover { background: white; border-color: var(--primary-blue); color: var(--primary-blue); }
                .tracker-toggle-btn.active { background: var(--primary-blue); border-color: var(--primary-blue); color: white; }

                .goal-progress-box {
                    margin-bottom: 24px;
                }
                .progress-data { margin-bottom: 12px; }
                .data-label { font-size: 10px; font-weight: 800; color: #94A3B8; letter-spacing: 0.5px; margin-bottom: 4px; display: block; }
                .data-value.mini { font-size: 18px; font-weight: 800; color: #1E293B; }

                .progress-track-v2 {
                    height: 8px;
                    background: #F1F5F9;
                    border-radius: 100px;
                    overflow: hidden;
                }
                .progress-fill-v2 {
                    height: 100%;
                    border-radius: 100px;
                    transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .goal-actions-v2 {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .local-search-wrapper {
                    position: relative;
                    width: 200px;
                    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .local-search-wrapper:focus-within {
                    width: 280px;
                }
                .local-search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94A3B8;
                    pointer-events: none;
                }
                .local-search-input {
                    width: 100%;
                    height: 48px;
                    padding: 0 10px 0 46px;
                    border-radius: 12px;
                    border: 1px solid #E2E8F0;
                    background: white;
                    color: #1E293B;
                    font-size: 13px;
                    font-weight: 600;
                    outline: none;
                    transition: all 0.2s;
                }
                .local-search-input:focus {
                    border-color: var(--primary-blue);
                    box-shadow: 0 0 0 3px rgba(0, 87, 255, 0.1);
                }
                .local-search-input::placeholder { color: #CBD5E1; }

                .payment-input-group {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 14px;
                    padding: 4px;
                    transition: all 0.2s;
                }
                .payment-input-group:focus-within {
                    border-color: var(--primary-blue);
                    background: white;
                    box-shadow: 0 0 0 4px rgba(0, 87, 255, 0.05);
                }
                .payment-input-group input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    padding: 10px 14px;
                    font-size: 14px;
                    font-weight: 700;
                    outline: none;
                }
                .pay-btn-v2 {
                    background: var(--primary-blue);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 800;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s;
                }
                .pay-btn-v2:hover { background: #000; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

                .delete-btn-v2.small {
                    width: 44px;
                    height: 44px;
                    background: white;
                    border: 1px solid #F1F5F9;
                    border-radius: 12px;
                    color: #EF4444;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .delete-btn-v2.small:hover { background: #FEF2F2; border-color: #FEE2E2; transform: scale(1.05); }

                /* Sidebar Utilities */
                .calculator-card-v2 { padding: 32px; border-radius: 28px; background: white; border: 1px solid #F1F5F9; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02); }
                .calc-header { display: flex; gap: 12px; margin-bottom: 24px; }
                .calc-icon { width: 40px; height: 40px; background: var(--primary-light-blue); color: var(--primary-blue); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .calc-title h3 { font-size: 15px; font-weight: 700; line-height: 1.2; }
                .calc-title p { font-size: 11px; color: var(--text-muted); font-weight: 600; }

                .input-field { margin-bottom: 16px; }
                .input-field label { font-size: 10px; font-weight: 800; color: var(--text-muted); margin-bottom: 6px; display: block; }
                .input-field input, .input-field select { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-subtle); background: var(--bg-app); font-weight: 700; font-size: 14px; outline: none; }
                .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

                .emi-result-v2 { background: var(--primary-blue); color: white; padding: 20px; border-radius: 16px; text-align: center; margin: 8px 0 16px 0; }
                .res-lbl { font-size: 11px; font-weight: 600; opacity: 0.8; }
                .res-val { font-size: 32px; font-weight: 800; margin: 4px 0; }
                .res-detail { font-size: 10px; font-weight: 700; opacity: 0.7; }

                .create-btn-v2 { width: 100%; padding: 12px; border-radius: 12px; background: var(--text-main); color: white; border: none; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
                .create-btn-v2:hover { background: #000; }

                .recommendations-card-v2 { margin-top: 24px; padding: 20px; }
                .rec-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; color: var(--text-main); }
                .rec-header h3 { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
                .rec-list { display: flex; flex-direction: column; gap: 12px; }
                .rec-item { display: flex; gap: 10px; padding: 12px; border-radius: 12px; font-size: 12px; font-weight: 600; line-height: 1.4; }
                .rec-item.success { background: #ECFDF5; color: #166534; }
                .rec-item.primary { background: var(--primary-light-blue); color: var(--primary-blue); }

                /* High-Fidelity Modal Design - Full Screen */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(8px);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                
                .modal-content-v2 { 
                    width: 100%;
                    max-width: 600px;
                    height: auto;
                    max-height: 90vh;
                    background: #F8FAFC;
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                    animation: modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes modalPop {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                .modal-header-v2 {
                    padding: 24px 32px;
                    background: white;
                    border-bottom: 1px solid #E2E8F0;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    border-radius: 24px 24px 0 0;
                }
                
                .modal-form-v2 {
                    padding: 32px;
                    max-width: 100%;
                    margin: 0 auto;
                    width: 100%;
                }
                .modal-title-stack h3 { font-size: 24px; font-weight: 800; color: #0F172A; letter-spacing: -0.8px; margin-bottom: 4px; }
                .modal-title-stack p { font-size: 13px; color: #64748B; font-weight: 600; }

                .form-section { margin-bottom: 24px; padding: 20px; border-radius: 20px; background: #F8FAFC; border: 1px solid #F1F5F9; }
                .form-section.highlight { background: rgba(0, 87, 255, 0.03); border-color: rgba(0, 87, 255, 0.1); }

                .modal-form-v2 .input-field label { font-size: 10px; font-weight: 800; color: #94A3B8; margin-bottom: 8px; display: block; letter-spacing: 0.5px; }
                .modal-form-v2 .input-field input, .modal-form-v2 .input-field select { 
                    background: white; 
                    border: 1px solid #E2E8F0; 
                    padding: 14px 18px; 
                    border-radius: 12px; 
                    font-size: 15px; 
                    font-weight: 700;
                    color: #1E293B;
                    transition: all 0.2s;
                }
                .modal-form-v2 .input-field input:focus { border-color: var(--primary-blue); box-shadow: 0 0 0 4px rgba(0, 87, 255, 0.08); outline: none; }

                .modal-footer-v2 { margin-top: 32px; }
                .modal-submit-btn { 
                    width: 100%; 
                    padding: 20px; 
                    background: var(--primary-blue); 
                    color: white; 
                    border: none; 
                    border-radius: 18px; 
                    font-size: 16px; 
                    font-weight: 800; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 10px 30px rgba(0, 87, 255, 0.2);
                }
                .modal-submit-btn:hover { background: #000; transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2); }

                .close-btn { 
                    background: #F1F5F9; 
                    border: none; 
                    width: 44px; height: 44px; 
                    border-radius: 14px; 
                    color: #64748B; 
                    display: flex; align-items: center; justify-content: center; 
                    cursor: pointer; transition: all 0.2s;
                }
                .close-btn:hover { background: #fee2e2; color: #ef4444; transform: rotate(90deg); }

                .yielding-info { cursor: help; }
                .loading-state { padding: 40px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px; color: var(--text-muted); font-weight: 700; }
                .shimmer-card { width: 100%; height: 200px; background: linear-gradient(90deg, #F8FAFC 25%, #F1F5F9 50%, #F8FAFC 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 20px; }
                @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

                `
            }} />
        </div>
    );
};

export default StrategicGoals;
