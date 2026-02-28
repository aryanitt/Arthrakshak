import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';
import {
    Target, Plus, Home, Trash2, Edit2,
    Zap, Bot, TrendingUp, GraduationCap,
    Plane, Car, Landmark, Star, ShieldAlert,
    AlertTriangle, Lock, CheckCircle2, Circle,
    Mic, X, Flag, Calendar, Shield, Wallet,
    ArrowUpRight, Sparkles, ChevronRight, Download, Search, Pin
} from 'lucide-react';

import AiInsightsPanel from './AiInsightsPanel';

const API_BASE_URL = 'http://localhost:5000/api';

const fmt = (n) => Number(n || 0).toLocaleString('en-IN');
const fmtCr = (n) => {
    n = Number(n || 0);
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(0)}L`;
    return `₹${fmt(n)}`;
};

const getMonthsRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const months = (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());
    return Math.max(1, months);
};

const timeLeft = (targetDate) => {
    const months = getMonthsRemaining(targetDate);
    if (months >= 12) {
        const yrs = Math.floor(months / 12);
        const mo = months % 12;
        return mo > 0 ? `${yrs}y ${mo}m left` : `${yrs}yr left`;
    }
    return `${months}mo left`;
};

const CATEGORY_META = {
    'real-estate': { icon: Home, color: '#818CF8', gradient: 'linear-gradient(135deg,#6366F1,#818CF8)', label: 'Real Estate' },
    'lifestyle': { icon: Plane, color: '#FBB040', gradient: 'linear-gradient(135deg,#F59E0B,#FCD34D)', label: 'Lifestyle' },
    'education': { icon: GraduationCap, color: '#A78BFA', gradient: 'linear-gradient(135deg,#8B5CF6,#A78BFA)', label: 'Education' },
    'retirement': { icon: Landmark, color: '#34D399', gradient: 'linear-gradient(135deg,#10B981,#34D399)', label: 'Retirement' },
    'vehicle': { icon: Car, color: '#FB923C', gradient: 'linear-gradient(135deg,#F97316,#FB923C)', label: 'Vehicle' },
    'other': { icon: Star, color: '#60A5FA', gradient: 'linear-gradient(135deg,#0076F5,#60A5FA)', label: 'General' },
    'apartment': { icon: Home, color: '#818CF8', gradient: 'linear-gradient(135deg,#6366F1,#818CF8)', label: 'Real Estate' },
};

const getCatMeta = (cat) => CATEGORY_META[cat] || CATEGORY_META['other'];

// ── Donut Ring ────────────────────────────────────────────────────────────────
const DonutRing = ({ pct, size = 72, stroke = 7, color = '#0076F5' }) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
                strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
        </svg>
    );
};

// ── Health Ring ───────────────────────────────────────────────────────────────
const HealthRing = ({ score, color = "#FF4D4D" }) => {
    const r = 32; const stroke = 6; const size = 76;
    const circ = 2 * Math.PI * r;
    const offset = circ - (Math.min(100, score) / 100) * circ;
    return (
        <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width={size} height={size} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1E293B" strokeWidth={stroke} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
                    strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: 20, fontWeight: 800, color: color, zIndex: 1 }}>{score}</span>
        </div>
    );
};

// ── Income Allocation Ring ──────────────────────────────────────────────────
const IncomeAllocationRing = ({ pct, amount }) => {
    const r = 32; const stroke = 6; const size = 76;
    const circ = 2 * Math.PI * r;
    const offset = circ - (Math.min(100, pct) / 100) * circ;
    return (
        <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width={size} height={size} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} />
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#FBB040" strokeWidth={stroke}
                    strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
            </svg>
            <div style={{ zIndex: 1, textAlign: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#FBB040', display: 'block', lineHeight: 1 }}>{Math.round(pct)}%</span>
            </div>
        </div>
    );
};

// ── Modal Donut ───────────────────────────────────────────────────────────────
const ModalDonut = ({ pct }) => {
    const size = 130, stroke = 12, r = (size - stroke) / 2, circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 130, height: 130 }}>
            <svg width={130} height={130} style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                <circle cx={65} cy={65} r={r} fill="none" stroke="#EDF2F7" strokeWidth={stroke} />
                <circle cx={65} cy={65} r={r} fill="none" stroke="#0076F5" strokeWidth={stroke}
                    strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
            </svg>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>0%</div>
                <div style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', letterSpacing: 0.5 }}>INITIAL PHASE</div>
            </div>
        </div>
    );
};


// ── Main Component ────────────────────────────────────────────────────────────
const CategoryDistributionPie = ({ data }) => {
    const COLORS = ['#0076F5', '#10B981', '#FBB040', '#8B5CF6', '#EC4899', '#64748B'];

    return (
        <div style={{ width: 84, height: 84, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={28}
                        outerRadius={38}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="#fff"
                        strokeWidth={1.5}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <RechartsTooltip
                        contentStyle={{
                            fontSize: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            padding: '4px 8px'
                        }}
                        formatter={(value) => [`₹${value}`, 'Commitment']}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

const StrategicGoals = ({ onPayment, monthlyIncome = 0 }) => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [strategicMode, setStrategicMode] = useState(true);
    const [newGoal, setNewGoal] = useState({
        title: '', targetAmount: '500000', targetDate: '',
        priority: 'High Priority', category: 'Short Term (< 1 Year)',
        startDate: new Date().toISOString().split('T')[0],
    });
    const [paymentAmounts, setPaymentAmounts] = useState({});
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [payGoal, setPayGoal] = useState(null);
    const [payAmount, setPayAmount] = useState('');
    const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => { fetchGoals(); }, []);

    const fetchGoals = async () => {
        try { const res = await axios.get(`${API_BASE_URL}/goals`); setGoals(res.data); }
        catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleAddGoal = async (e) => {
        e.preventDefault();
        const catMap = {
            'Short Term (< 1 Year)': 'lifestyle', 'Medium Term (1-3 Years)': 'other',
            'Long Term (3+ Years)': 'real-estate', 'Education': 'education', 'Retirement': 'retirement',
        };
        try {
            const res = await axios.post(`${API_BASE_URL}/goals`, {
                title: newGoal.title, targetAmount: Number(newGoal.targetAmount),
                targetDate: newGoal.targetDate, startDate: newGoal.startDate,
                category: catMap[newGoal.category] || 'other',
            });
            setGoals([...goals, res.data]);
            setIsModalOpen(false);
            setNewGoal({
                title: '', targetAmount: '500000', targetDate: '', priority: 'High Priority',
                category: 'Short Term (< 1 Year)', startDate: new Date().toISOString().split('T')[0]
            });
        } catch (e) { alert(`Error: ${e.response?.data?.message || e.message}`); }
    };

    const [deletingId, setDeletingId] = useState(null);

    const handleDeleteGoal = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/goals/${id}`);
            setGoals(goals.filter(g => g._id !== id));
            setDeletingId(null);
        } catch (e) {
            console.error(e);
            alert("Failed to delete goal. Please try again.");
        }
    };

    const handleTogglePin = async (goal) => {
        try {
            const res = await axios.put(`${API_BASE_URL}/goals/${goal._id}/toggle-pin`);
            setGoals(goals.map(g => g._id === goal._id ? res.data : g));
        } catch (e) {
            alert(e.response?.data?.message || "Failed to toggle pin.");
        }
    };

    const handleExportReport = () => {
        const reportData = [];
        goals.forEach(goal => {
            const contributions = goal.contributions || [];
            contributions.forEach(c => {
                reportData.push({
                    'Goal Name': String(goal.title || 'Untitled'),
                    'Category': String(goal.category || 'General'),
                    'Payment Month': String(c.month || 'N/A'),
                    'Amount (₹)': Number(c.amount) || 0,
                    'Status': String(c.status || 'Paid'),
                    'Payment Date': c.paidAt ? new Date(c.paidAt).toLocaleDateString() : 'N/A',
                    'Exact Timestamp': c.paidAt ? new Date(c.paidAt).toLocaleTimeString() : 'N/A'
                });
            });
        });

        if (reportData.length === 0) {
            if (goals.length === 0) {
                alert("No goals found to export. Please create a goal first.");
                return;
            }
            // Fallback: Export general goals overview if no payments exist
            goals.forEach(goal => {
                reportData.push({
                    'Goal Name': String(goal.title || 'Untitled'),
                    'Category': String(goal.category || 'General'),
                    'Target Amount (₹)': Number(goal.targetAmount) || 0,
                    'Saved Amount (₹)': Number(goal.currentBalance) || 0,
                    'Status': String(goal.status || 'Active'),
                    'Start Date': goal.startDate ? new Date(goal.startDate).toLocaleDateString() : 'N/A',
                    'Target Date': goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'N/A'
                });
            });
        }

        try {
            const ws = XLSX.utils.json_to_sheet(reportData);
            const wscols = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 15 }, { wch: 15 }];
            ws['!cols'] = wscols;

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Goals Report");

            // Using a more robust download method
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

            const fileName = `Arth_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert("Report generated successfully! Please check your downloads folder.");
        } catch (err) {
            console.error("XLSX Export Error:", err);
            alert("Failed to generate report. Details logged to console.");
        }
    };

    const getRecommendedPayment = (goal) => {
        const months = getMonthsRemaining(goal.targetDate);
        const remaining = (Number(goal.targetAmount) || 0) - (Number(goal.currentBalance) || 0);
        return Math.ceil(remaining / Math.max(1, months));
    };

    const handleMarkAsPaid = async () => {
        if (!payGoal) return;
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const dateObj = new Date(payDate);
        const month = months[dateObj.getMonth()];
        const pay = Number(payAmount) || getRecommendedPayment(payGoal);
        try {
            const res = await axios.put(`${API_BASE_URL}/goals/${payGoal._id}/pay`, { amount: pay, month, date: payDate });
            setGoals(goals.map(g => g._id === payGoal._id ? res.data : g));
            if (onPayment) onPayment(pay);
            setIsPayModalOpen(false);
            setPayGoal(null);
        } catch (e) { alert(`Payment error: ${e.response?.data?.message || e.message}`); }
    };

    const openPayModal = (goal) => {
        setPayGoal(goal);
        setPayAmount(getRecommendedPayment(goal));
        setPayDate(new Date().toISOString().split('T')[0]);
        setIsPayModalOpen(true);
    };

    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => ((g.currentBalance / g.targetAmount) * 100) >= 100).length;
    const totalSaved = goals.reduce((a, g) => a + (Number(g.currentBalance) || 0), 0);
    const totalTarget = goals.reduce((a, g) => a + (Number(g.targetAmount) || 0), 0);
    const savingsPct = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;
    const totalMonthlyEMI = goals.reduce((a, g) => a + getRecommendedPayment(g), 0);
    const incomeUsedPct = (totalMonthlyEMI / monthlyIncome) * 100;

    const categoryDataMap = {};
    goals.forEach(g => {
        const cat = g.category || 'Other';
        const emi = getRecommendedPayment(g) || 1000;
        categoryDataMap[cat] = (categoryDataMap[cat] || 0) + emi;
    });

    const categoryData = Object.keys(categoryDataMap).map(key => ({
        name: key,
        value: categoryDataMap[key]
    })).sort((a, b) => b.value - a.value);

    // Dynamic Health Score logic based on income utilization
    let healthScore = 85;
    let healthStatus = "Excellent";
    let healthColor = "#10B981";

    if (totalGoals > 0) {
        if (incomeUsedPct < 30) {
            // Excellent range: 90 - 100
            healthScore = Math.max(90, Math.round(100 - (incomeUsedPct / 3)));
            healthStatus = "Excellent";
            healthColor = "#10B981";
        } else if (incomeUsedPct <= 60) {
            // Good range: 65 - 85
            healthScore = Math.round(85 - ((incomeUsedPct - 30) * 0.6));
            healthStatus = "Good";
            healthColor = "#FBB040";
        } else {
            // Critical range: 35 - 60
            healthScore = Math.max(30, Math.round(60 - ((incomeUsedPct - 60) * 0.8)));
            healthStatus = "Critical";
            healthColor = "#EF4444";
        }
    }

    const modalMonths = newGoal.targetDate ? Math.max(1, getMonthsRemaining(newGoal.targetDate)) : 20;
    const modalTarget = Number(newGoal.targetAmount) || 0;
    const modalMonthly = modalTarget > 0 ? Math.ceil(modalTarget / modalMonths) : 25000;
    const today = new Date();
    const addMonths = (n) => { const d = new Date(today); d.setMonth(d.getMonth() + n); return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }); };

    const filteredGoals = goals.filter(g =>
        g.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const suggestions = Array.from(new Set(goals.map(g => g.title))).filter(t =>
        t.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0
    ).slice(0, 5);

    return (
        <div className="sg-root">
            {/* ── Hero Banner ── */}
            <div className="sg-hero">
                <div className="sg-hero-bg">
                    <Shield className="sg-bg-icon sg-bg-shield" size={260} strokeWidth={0.8} />
                    <Target className="sg-bg-icon sg-bg-target" size={140} strokeWidth={0.8} />
                    <TrendingUp className="sg-bg-icon sg-bg-trend" size={90} strokeWidth={1} />
                </div>
                <div className="sg-hero-content">
                    <div className="sg-hero-left">
                        <div className="sg-hero-top">
                            <div className="sg-hero-badge"><Target size={13} /> Goal Management</div>
                        </div>
                        <h1 className="sg-hero-title">Your Financial Goals <span className="sg-emoji">🎯</span></h1>
                        <p className="sg-hero-sub">वित्तीय लक्ष्य • Track, manage and achieve your milestones</p>
                        <div className="sg-hero-stats">
                            <div className="sg-hero-stat">
                                <span className="sg-hs-val">{String(totalGoals).padStart(2, '0')}</span>
                                <span className="sg-hs-lbl">Active Goals</span>
                            </div>
                            <div className="sg-hero-stat-div" />
                            <div className="sg-hero-stat">
                                <span className="sg-hs-val sg-hs-green">{String(completedGoals).padStart(2, '0')}</span>
                                <span className="sg-hs-lbl">Completed</span>
                            </div>
                            <div className="sg-hero-stat-div" />
                            <div className="sg-hero-stat">
                                <span className="sg-hs-val">{fmtCr(totalSaved)}</span>
                                <span className="sg-hs-lbl">Total Saved</span>
                            </div>
                        </div>
                    </div>
                    <div className="sg-hero-right">
                        <button className="sg-create-hero-btn" onClick={() => setIsModalOpen(true)}>
                            <Plus size={16} strokeWidth={3} /> Create New Goal
                        </button>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'nowrap', justifyContent: 'flex-end', alignItems: 'stretch' }}>
                            {categoryData.length > 0 && (
                                <div className="sg-hero-ring-card dist">
                                    <div style={{ flexShrink: 0 }}>
                                        <CategoryDistributionPie data={categoryData} />
                                    </div>
                                    <div className="sg-dist-legend">
                                        <div className="sg-ring-label" style={{ marginBottom: '6px' }}>CATEGORIES</div>
                                        {categoryData.slice(0, 3).map((cat, i) => {
                                            const pct = totalMonthlyEMI > 0 ? Math.round((cat.value / totalMonthlyEMI) * 100) : 0;
                                            const colors = ['#0076F5', '#10B981', '#FBB040', '#8B5CF6', '#EC4899'];
                                            return (
                                                <div key={i} className="sg-dist-item">
                                                    <div className="sg-dist-dot" style={{ background: colors[i % colors.length] }} />
                                                    <span>{cat.name} {pct}%</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                            <div className="sg-hero-ring-card">
                                <IncomeAllocationRing pct={incomeUsedPct} amount={totalMonthlyEMI} />
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div className="sg-ring-label" style={{ marginBottom: '4px' }}>GOAL EMI / INCOME</div>
                                    <div className="sg-ring-status" style={{ color: '#FBB040' }}>₹{fmt(totalMonthlyEMI)}<span style={{ fontSize: 13, opacity: 0.9 }}>/mo</span></div>
                                </div>
                            </div>
                            <div className="sg-hero-ring-card">
                                <HealthRing score={healthScore} color={healthColor} />
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div className="sg-ring-label" style={{ marginBottom: '4px' }}>HEALTH SCORE</div>
                                    <div className="sg-ring-status" style={{ color: healthColor }}>{healthStatus}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Progress Bar ── */}
            <div className="sg-progress-banner">
                <div className="sg-pb-left">
                    <span className="sg-pb-label">SAVINGS PROGRESS</span>
                    <span className="sg-pb-val">{fmtCr(totalSaved)} <span className="sg-pb-of">/ {fmtCr(totalTarget)}</span></span>
                </div>
                <div className="sg-pb-track">
                    <div className="sg-pb-fill" style={{ width: `${savingsPct}%` }} />
                    <span className="sg-pb-pct">{savingsPct}%</span>
                </div>
            </div>


            {/* ── Body ── */}
            <div className="sg-body">
                {/* Goals Grid */}
                <div className="sg-goals-col">
                    <div className="sg-col-header">
                        <h2 className="sg-col-title">Active Goals <span className="sg-count-badge">{totalGoals}</span></h2>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {/* Search Bar */}
                            <div style={{ position: 'relative' }}>
                                <div className="sg-search-wrap">
                                    <Search size={14} color="#64748B" />
                                    <input
                                        type="text"
                                        placeholder="Search goals..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setShowSuggestions(true);
                                        }}
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    />
                                </div>
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="sg-suggestions">
                                        {suggestions.map((s, idx) => (
                                            <div key={idx} className="sg-suggestion-item" onClick={() => {
                                                setSearchQuery(s);
                                                setShowSuggestions(false);
                                            }}>
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button className="sg-report-btn" onClick={handleExportReport}>
                                <Download size={14} /> Report
                            </button>
                            <button className="sg-add-btn-sm" onClick={() => setIsModalOpen(true)}>
                                <Plus size={14} /> Add
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="sg-skeletons">
                            {[1, 2, 3].map(i => <div key={i} className="sg-skeleton" />)}
                        </div>
                    ) : filteredGoals.length === 0 ? (
                        <div className="sg-empty">
                            <Search size={52} color="#CBD5E1" />
                            <p>No goals matching "{searchQuery}"</p>
                        </div>
                    ) : (
                        <div className="sg-grid">
                            {filteredGoals.map(goal => {
                                const target = Number(goal.targetAmount) || 0;
                                const current = Number(goal.currentBalance) || 0;
                                const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
                                const meta = getCatMeta(goal.category);
                                const CatIcon = meta.icon;
                                const recPay = getRecommendedPayment(goal);
                                const ringColor = pct >= 80 ? '#10B981' : pct >= 40 ? '#60A5FA' : '#F59E0B';
                                let dueStr = '';
                                try { dueStr = new Date(goal.targetDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }); } catch { }
                                const isNear = pct >= 80;

                                return (
                                    <div key={goal._id} className={`sg-goal-card ${isNear ? 'sg-goal-card--near' : ''}`}>
                                        <div className="sgc-header">
                                            <div className="sgc-icon-wrap" style={{ background: meta.gradient }}>
                                                <CatIcon size={18} color="white" />
                                            </div>
                                            <div className="sgc-info">
                                                <h3 className="sgc-title">{goal.title || 'Untitled Goal'}</h3>
                                                <p className="sgc-meta">{meta.label} • Due {dueStr}</p>
                                            </div>
                                            <div className="sgc-actions">
                                                <button
                                                    className={`sgc-act-btn ${goal.pinned ? 'sgc-act-btn--pinned' : ''}`}
                                                    onClick={() => handleTogglePin(goal)}
                                                    title={goal.pinned ? "Unpin from Dashboard" : "Pin to Dashboard"}
                                                >
                                                    <Pin size={13} fill={goal.pinned ? "var(--primary-blue)" : "none"} />
                                                </button>
                                                {deletingId === goal._id ? (
                                                    <div style={{ display: 'flex', gap: 4 }}>
                                                        <button className="sgc-act-btn" onClick={() => handleDeleteGoal(goal._id)} style={{ color: '#EF4444', border: '1px solid #EF4444' }}>✓</button>
                                                        <button className="sgc-act-btn" onClick={() => setDeletingId(null)}>✕</button>
                                                    </div>
                                                ) : (
                                                    <button className="sgc-act-btn" onClick={() => setDeletingId(goal._id)} title="Delete">
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="sgc-body">
                                            <div className="sgc-ring-wrap">
                                                <DonutRing pct={pct} size={72} stroke={7} color={ringColor} />
                                                <div className="sgc-ring-center">
                                                    <span className="sgc-pct-val">{pct}%</span>
                                                </div>
                                            </div>
                                            <div className="sgc-amounts">
                                                <div className="sgc-saved">
                                                    <span className="sgc-saved-lbl">SAVED</span>
                                                    <span className="sgc-saved-val">₹{fmt(current)}</span>
                                                </div>
                                                <div className="sgc-target">
                                                    <span className="sgc-target-lbl">TARGET</span>
                                                    <span className="sgc-target-val">{fmtCr(target)}</span>
                                                </div>
                                                <div className="sgc-time">
                                                    <Calendar size={11} color="#94A3B8" />
                                                    <span>{timeLeft(goal.targetDate)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="sgc-progress-row">
                                            <div className="sgc-progress-track">
                                                <div className="sgc-progress-fill" style={{ width: `${pct}%`, background: ringColor }} />
                                            </div>
                                            <span className="sgc-status-tag" style={{ color: isNear ? '#10B981' : '#0076F5' }}>
                                                {isNear ? '🔥 Near Goal' : '+12% YoY'}
                                            </span>
                                        </div>

                                        <div className="sgc-pay-row">
                                            <button className="sgc-pay-btn" onClick={() => openPayModal(goal)}>
                                                Pay Now
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* AI Panel */}
                <AiInsightsPanel goals={filteredGoals} />
            </div>

            {/* ── Create Goal Modal ── */}
            {isModalOpen && (
                <div className="sg-overlay" onClick={e => e.target === e.currentTarget && setIsModalOpen(false)}>
                    <div className="sg-modal">
                        <div className="sg-modal-left">
                            <div className="sg-modal-hdr">
                                <div>
                                    <h2 className="sg-modal-title">Create New Goal</h2>
                                    <p className="sg-modal-sub">नया लक्ष्य निर्धारित करें • Step towards freedom.</p>
                                </div>
                                <button className="sg-modal-close" onClick={() => setIsModalOpen(false)}><X size={16} /></button>
                            </div>
                            <form onSubmit={handleAddGoal} className="sg-form">
                                <div className="sg-fg">
                                    <label className="sg-fl">GOAL NAME (लक्ष्य का नाम)</label>
                                    <input className="sg-fi" type="text" placeholder="e.g., European Summer Trip 2026" required
                                        value={newGoal.title} onChange={e => setNewGoal({ ...newGoal, title: e.target.value })} />
                                </div>
                                <div className="sg-form-row">
                                    <div className="sg-fg">
                                        <label className="sg-fl">TARGET AMOUNT</label>
                                        <div className="sg-prefix-wrap"><span className="sg-prefix">₹</span>
                                            <input className="sg-fi prefixed" type="number" placeholder="5,00,000" required
                                                value={newGoal.targetAmount} onChange={e => setNewGoal({ ...newGoal, targetAmount: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="sg-fg">
                                        <label className="sg-fl">DEADLINE</label>
                                        <input className="sg-fi" type="date" required value={newGoal.targetDate}
                                            onChange={e => setNewGoal({ ...newGoal, targetDate: e.target.value })} />
                                    </div>
                                </div>
                                <div className="sg-form-row">
                                    <div className="sg-fg">
                                        <label className="sg-fl">PRIORITY</label>
                                        <select className="sg-fi" value={newGoal.priority} onChange={e => setNewGoal({ ...newGoal, priority: e.target.value })}>
                                            <option>High Priority</option><option>Medium Priority</option><option>Low Priority</option>
                                        </select>
                                    </div>
                                    <div className="sg-fg">
                                        <label className="sg-fl">CATEGORY</label>
                                        <select className="sg-fi" value={newGoal.category} onChange={e => setNewGoal({ ...newGoal, category: e.target.value })}>
                                            <option>Short Term ({'<'} 1 Year)</option>
                                            <option>Medium Term (1-3 Years)</option>
                                            <option>Long Term (3+ Years)</option>
                                            <option>Education</option>
                                            <option>Retirement</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="sg-modal-submit"><Flag size={15} /> Establish Goal & Start Tracking</button>
                            </form>
                        </div>
                        <div className="sg-modal-right">
                            <h3 className="sg-proj-title">Live Projection</h3>
                            <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                                <ModalDonut pct={0} />
                            </div>
                            <div className="sg-monthly-card">
                                <div className="sg-mc-label">MONTHLY COMMITMENT</div>
                                <div className="sg-mc-val">₹{fmt(modalMonthly)}<span>/mo</span></div>
                                <div className="sg-mc-note"><TrendingUp size={11} /> Based on {modalMonths}-month deadline</div>
                            </div>
                            <div className="sg-miles-label">PROJECTED MILESTONES</div>
                            <div className="sg-milestones">
                                {[
                                    { title: `First ${fmtCr(modalTarget * 0.2)}`, date: addMonths(Math.round(modalMonths * 0.2)), active: true },
                                    { title: 'Halfway Mark', date: addMonths(Math.round(modalMonths * 0.5)), active: false },
                                    { title: 'Goal Achievement', date: newGoal.targetDate ? new Date(newGoal.targetDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—', active: false },
                                ].map((m, i) => (
                                    <div key={i} className="sg-mile">
                                        <div className={`sg-mile-dot ${m.active ? 'active' : ''}`} />
                                        {i < 2 && <div className="sg-mile-line" />}
                                        <div className="sg-mile-body">
                                            <div className="sg-mile-title">{m.title}</div>
                                            <div className="sg-mile-date">Est. {m.date}</div>
                                        </div>
                                        {m.active ? <CheckCircle2 size={12} color="#0076F5" /> : <Lock size={12} color="#CBD5E1" />}
                                    </div>
                                ))}
                            </div>
                            <div className="sg-ai-bubble-modal">
                                <div className="sg-abm-label">ARTHRAKSHAK AI</div>
                                <p>"I've calculated the inflation-adjusted target for your goal automatically."</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Payment Modal ── */}
            {isPayModalOpen && payGoal && (
                <div className="sg-overlay" onClick={e => e.target === e.currentTarget && setIsPayModalOpen(false)}>
                    <div className="sg-pay-modal">
                        <div className="sg-pm-left">
                            <h3 className="sg-pm-title">Scheduled Contribution</h3>
                            <p className="sg-pm-sub">Select date & adjust amount for {payGoal.title}</p>

                            <div className="sg-calendar-card">
                                <div className="sg-cal-header">
                                    <span className="sg-cal-month">{new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="sg-cal-grid">
                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                        <div key={d} className="sg-cal-day-head">{d}</div>
                                    ))}
                                    {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() }).map((_, i) => (
                                        <div key={`empty-${i}`} />
                                    ))}
                                    {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }).map((_, i) => {
                                        const day = i + 1;
                                        const dStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const isToday = day === new Date().getDate();
                                        const isSelected = payDate === dStr;
                                        return (
                                            <div key={day}
                                                className={`sg-cal-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                                                onClick={() => setPayDate(dStr)}>
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="sg-pm-right">
                            <div className="sg-pm-fg">
                                <label className="sg-pm-label">CONTRIBUTION AMOUNT</label>
                                <div className="sg-pm-input-wrap">
                                    <span>₹</span>
                                    <input
                                        type="number"
                                        value={payAmount}
                                        onChange={e => setPayAmount(e.target.value)}
                                        onFocus={e => e.target.select()}
                                        autoFocus
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p className="sg-pm-note">Recommended: ₹{fmt(getRecommendedPayment(payGoal))}</p>
                                    <button
                                        style={{ fontSize: '10px', background: 'none', border: 'none', color: '#0076F5', cursor: 'pointer', fontWeight: 700 }}
                                        onClick={() => setPayAmount(getRecommendedPayment(payGoal))}
                                    >
                                        Use Rec
                                    </button>
                                </div>
                            </div>
                            <div className="sg-pm-actions">
                                <button className="sg-pm-btn confirm" onClick={handleMarkAsPaid}>Confirm Payment</button>
                                <button className="sg-pm-btn cancel" onClick={() => setIsPayModalOpen(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .sg-root { padding:0; display:flex; flex-direction:column; gap:20px; font-family:'Manrope',sans-serif; color:#0F172A; }

                /* Hero */
                .sg-hero {
                    background: linear-gradient(120deg,#0057FF 0%,#0084FF 55%,#00D1FF 100%);
                    border-radius:24px; padding:36px 40px; color:white; position:relative; overflow:hidden;
                    box-shadow:0 20px 40px rgba(0,87,255,0.25);
                }
                /* Hero Banner */
                .sg-hero { background:linear-gradient(135deg,#0076F5 0%,#0057FF 100%); border-radius:28px; padding:24px 40px; color:white; position:relative; overflow:hidden; box-shadow:0 15px 35px rgba(0,118,245,0.2); margin-bottom:24px; }
                .sg-hero-bg { position:absolute; inset:0; pointer-events:none; z-index:0; }
                .sg-bg-icon { position:absolute; opacity:0.07; color:white; }
                .sg-bg-shield { right:-50px; bottom:-70px; transform:rotate(-10deg); }
                .sg-bg-target { top:20px; right:160px; opacity:0.05; transform:rotate(15deg); }
                .sg-bg-trend { bottom:30px; left:46%; opacity:0.04; }
                .sg-hero-content { display:grid; grid-template-columns:1fr auto; gap:32px; align-items:center; position:relative; z-index:2; }
                .sg-hero-badge { background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.2); border-radius:100px; padding:4px 10px; font-size:10px; font-weight:800; display:inline-flex; align-items:center; gap:6px; margin-bottom:12px; backdrop-filter:blur(4px); }
                .sg-hero-title { font-size:28px; font-weight:900; margin:0; letter-spacing:-0.02em; }
                .sg-hero-sub { font-size:13px; opacity:0.8; margin-top:6px; font-weight:600; display:flex; align-items:center; gap:6px; }

                .sg-hero-stats { display:flex; align-items:center; gap:32px; margin-top:24px; }
                .sg-hero-stat { display:flex; flex-direction:column; gap:2px; }
                .sg-hs-val { font-size:24px; font-weight:900; }
                .sg-hs-green { color:#A7F3D0; }
                .sg-hs-lbl { font-size:10px; font-weight:800; opacity:0.6; text-transform:uppercase; letter-spacing:0.5px; }
                .sg-hero-stat-div { width:1px; height:32px; background:rgba(255,255,255,0.2); }
                .sg-hero-right { display:flex; flex-direction:column; gap:8px; align-items:flex-end; }
                /* Pie Chart Card */
                .sg-pie-card { background:#0F172A; border-radius:22px; padding:24px 28px; border:1px solid #1E293B; box-shadow:0 8px 32px rgba(15,23,42,0.25); }
                .sg-pie-header { margin-bottom:20px; }
                .sg-pie-title { font-size:16px; font-weight:800; color:white; margin-bottom:4px; }
                .sg-pie-sub { font-size:12px; color:#64748B; font-weight:600; }
                .sg-pie-body { display:flex; align-items:center; gap:32px; flex-wrap:wrap; }
                .sg-pie-svg-wrap { flex-shrink:0; background:#060D1A; border-radius:50%; padding:4px; box-shadow:0 0 0 4px #1E293B; }
                .sg-pie-legend { flex:1; min-width:220px; display:flex; flex-direction:column; gap:8px; }
                .sg-pie-leg-item { display:flex; align-items:center; gap:10px; padding:8px 12px; background:#1E293B; border-radius:12px; border:1px solid #334155; }
                .sg-pie-leg-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
                .sg-pie-leg-info { flex:1; min-width:0; }
                .sg-pie-leg-name { display:block; font-size:12px; font-weight:700; color:white; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
                .sg-pie-leg-val { display:block; font-size:10px; color:#64748B; font-weight:600; margin-top:1px; }
                .sg-pie-leg-pct { font-size:13px; font-weight:800; flex-shrink:0; }
                .sg-pie-total-row { display:flex; justify-content:space-between; align-items:center; padding:10px 12px; border-top:1px solid #1E293B; margin-top:4px; font-size:12px; color:#64748B; font-weight:700; }
                .sg-pie-total-val { color:white; font-size:14px; font-weight:800; }

                .sg-create-hero-btn { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.3); color:white; border-radius:12px; padding:10px 20px; font-size:15px; font-weight:800; cursor:pointer; font-family:inherit; transition:all 0.2s; white-space:nowrap; margin-bottom:12px; }
                .sg-create-hero-btn:hover { background:rgba(255,255,255,0.25); transform:translateY(-1px); }
                .sg-hero-ring-card { display:flex; align-items:center; gap:16px; background:rgba(255,255,255,0.12); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.2); border-radius:14px; padding:16px 20px; color:rgba(255,255,255,0.9); }
                .sg-ring-label { font-size:10px; font-weight:800; color:rgba(255,255,255,0.9); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0px; }
                .sg-ring-status { font-size:20px; font-weight:800; line-height:1.2; letter-spacing:-0.02em; }

                /* Progress Banner */
                .sg-progress-banner { background:white; border-radius:18px; padding:18px 24px; border:1px solid #EDF2F7; box-shadow:0 4px 16px rgba(0,0,0,0.04); display:flex; align-items:center; gap:24px; flex-wrap:wrap; }
                .sg-pb-left { display:flex; flex-direction:column; gap:2px; min-width:160px; }
                .sg-pb-label { font-size:10px; font-weight:800; color:#94A3B8; letter-spacing:0.8px; text-transform:uppercase; }
                .sg-pb-val { font-size:18px; font-weight:800; color:#0F172A; }
                .sg-pb-of { font-size:13px; color:#94A3B8; font-weight:600; }
                .sg-pb-track { flex:1; height:10px; background:#F1F5F9; border-radius:10px; position:relative; overflow:visible; min-width:100px; }
                .sg-pb-fill { height:100%; border-radius:10px; background:linear-gradient(90deg,#0076F5,#00D1FF); transition:width 0.8s ease; }
                .sg-pb-pct { position:absolute; right:0; top:-20px; font-size:11px; font-weight:800; color:#0076F5; }

                .sg-dist-legend { display:flex; flex-direction:column; justify-content:center; gap:4px; margin-top:-2px; }
                .sg-dist-item { display:flex; align-items:center; gap:8px; font-size:13px; font-weight:800; color:white; }
                .sg-dist-dot { width:8px; height:8px; border-radius:50%; }

                /* Body */
                .sg-body { display:grid; grid-template-columns:1fr 296px; gap:20px; align-items:start; }
                .sg-search-wrap { display:flex; align-items:center; gap:8px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:6px 12px; width:220px; transition:all 0.2s; }
                .sg-search-wrap:focus-within { border-color:#0076F5; box-shadow:0 0 0 3px rgba(0,118,245,0.1); width:280px; }
                .sg-search-wrap input { border:none; background:none; outline:none; font-family:inherit; font-size:13px; font-weight:600; color:#1E293B; width:100%; }
                
                .sg-suggestions { position:absolute; top:calc(100% + 4px); right:0; width:220px; background:white; border:1px solid #E2E8F0; border-radius:10px; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1); z-index:50; overflow:hidden; }
                .sg-suggestion-item { padding:8px 12px; font-size:12px; font-weight:600; color:#475569; cursor:pointer; transition:background 0.2s; }
                .sg-suggestion-item:hover { background:#F1F5F9; color:#0076F5; }

                @media (max-width: 1200px) {
                    .sg-body { grid-template-columns: 1fr; }
                }

                /* Goals Col */
                .sg-col-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
                .sg-col-title { font-size:22px; font-weight:800; color:#0F172A; display:flex; align-items:center; gap:10px; }
                
                .sg-add-btn-sm { display:flex; align-items:center; gap:6px; background:linear-gradient(135deg,#0076F5,#0057FF); color:white; border:none; border-radius:10px; padding:7px 16px; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; transition:all 0.2s; box-shadow:0 4px 12px rgba(0,118,245,0.25); }
                .sg-add-btn-sm:hover { transform:translateY(-1px); box-shadow:0 6px 16px rgba(0,118,245,0.35); }
                
                .sg-report-btn { display:flex; align-items:center; gap:6px; background:rgba(255,255,255,0.8); backdrop-filter:blur(8px); color:#475569; border:1px solid #E2E8F0; border-radius:10px; padding:7px 16px; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; transition:all 0.2s; }
                .sg-report-btn:hover { background:white; border-color:#CBD5E1; color:#1E293B; transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,0.05); }

                .sg-count-badge { background:#EBF5FF; color:#0076F5; font-size:11px; font-weight:800; padding:2px 8px; border-radius:8px; }

                /* Grid */
                .sg-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:16px; }
                .sg-skeletons { display:grid; grid-template-columns:repeat(auto-fill,minmax(230px,1fr)); gap:16px; }
                .sg-skeleton { height:250px; background:linear-gradient(90deg,#F0F4F8 25%,#E2E8F0 50%,#F0F4F8 75%); background-size:200% 100%; animation:sg-shimmer 1.5s infinite; border-radius:20px; }
                @keyframes sg-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
                .sg-empty { display:flex; flex-direction:column; align-items:center; gap:16px; padding:60px 20px; text-align:center; color:#94A3B8; background:white; border-radius:20px; border:1px solid #EDF2F7; }

                /* Goal Card */
                .sg-goal-card { background:white; border-radius:20px; padding:18px; border:1px solid #F1F5F9; box-shadow:0 4px 16px rgba(0,0,0,0.04); display:flex; flex-direction:column; gap:12px; transition:all 0.25s; }
                .sg-goal-card:hover { box-shadow:0 12px 32px rgba(0,0,0,0.1); transform:translateY(-3px); border-color:#E2E8F0; }
                .sg-goal-card--near { border-color:#D1FAE5; box-shadow:0 4px 20px rgba(16,185,129,0.1); }

                .sgc-header { display:flex; align-items:center; gap:10px; }
                .sgc-icon-wrap { width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
                .sgc-info { flex:1; min-width:0; }
                .sgc-title { font-size:14px; font-weight:800; color:#0F172A; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin:0; }
                .sgc-meta { font-size:11px; color:#94A3B8; font-weight:600; margin-top:2px; }
                .sgc-actions { display:flex; gap:4px; }
                .sgc-act-btn { width:26px; height:26px; border:none; background:#F8FAFC; border-radius:8px; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#94A3B8; transition:all 0.2s; }
                .sgc-act-btn:hover { background:#FEF2F2; color:#EF4444; }
                .sgc-act-btn--pinned { background:#EBF5FF; color:#0076F5; }
                .sgc-act-btn--pinned:hover { background:#DBEAFE; color:#0066FF; }

                .sgc-body { display:flex; align-items:center; gap:12px; }
                .sgc-ring-wrap { position:relative; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
                .sgc-ring-center { position:absolute; display:flex; align-items:center; justify-content:center; }
                .sgc-pct-val { font-size:13px; font-weight:800; color:#0F172A; }
                .sgc-amounts { display:flex; flex-direction:column; gap:4px; flex:1; min-width:0; }
                .sgc-saved, .sgc-target { display:flex; flex-direction:column; gap:1px; }
                .sgc-saved-lbl, .sgc-target-lbl { font-size:9px; font-weight:800; color:#94A3B8; letter-spacing:0.5px; }
                .sgc-saved-val { font-size:16px; font-weight:800; color:#0F172A; }
                .sgc-target-val { font-size:12px; font-weight:700; color:#64748B; }
                .sgc-time { display:flex; align-items:center; gap:4px; font-size:11px; color:#94A3B8; font-weight:600; margin-top:2px; }

                .sgc-progress-row { display:flex; flex-direction:column; gap:6px; }
                .sgc-progress-track { height:4px; background:#F1F5F9; border-radius:5px; overflow:hidden; }
                .sgc-progress-fill { height:100%; border-radius:5px; transition:width 0.6s ease; }
                .sgc-status-tag { font-size:11px; font-weight:700; align-self:flex-start; margin-top: 2px; }

                .sgc-pay-row { display:flex; padding-top:14px; margin-top: auto; }
                .sgc-pay-btn { width: 100%; padding:10px 0; background:linear-gradient(135deg,#0076F5,#0057FF); color:white; border:none; border-radius:10px; font-size:12px; font-weight:800; cursor:pointer; font-family:inherit; transition:all 0.2s; white-space:nowrap; }
                .sgc-pay-btn:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(0,118,245,0.4); }

                /* AI Panel */
                .sg-ai-panel { background:#0F172A; border-radius:22px; padding:20px; display:flex; flex-direction:column; gap:14px; position:sticky; top:24px; color:white; box-shadow:0 8px 32px rgba(15,23,42,0.2); }
                .sg-ai-header { display:flex; align-items:center; justify-content:space-between; }
                .sg-ai-header-left { display:flex; align-items:center; gap:8px; font-size:15px; font-weight:800; }
                .sg-ai-badge { background:linear-gradient(135deg,#EF4444,#F97316); color:white; font-size:9px; font-weight:800; padding:3px 8px; border-radius:6px; letter-spacing:0.5px; animation:pulse-badge 2s infinite; }
                @keyframes pulse-badge{0%,100%{opacity:1}50%{opacity:0.6}}

                .sg-strategic-card { background:#1E293B; border-radius:14px; padding:14px; }
                .sg-sc-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
                .sg-sc-label { font-size:10px; font-weight:800; color:#64748B; letter-spacing:0.8px; }
                .sg-sc-desc { font-size:11px; color:#64748B; line-height:1.5; }

                .sg-toggle { width:44px; height:24px; background:#334155; border:none; border-radius:12px; cursor:pointer; position:relative; transition:background 0.2s; padding:0; }
                .sg-toggle.on { background:#0076F5; }
                .sg-toggle-knob { position:absolute; top:3px; left:3px; width:18px; height:18px; background:white; border-radius:50%; transition:left 0.2s; display:block; }
                .sg-toggle.on .sg-toggle-knob { left:23px; }

                .sg-ai-section { display:flex; flex-direction:column; gap:8px; }
                .sg-ai-sec-label { display:flex; align-items:center; gap:5px; font-size:9px; font-weight:800; color:#60A5FA; letter-spacing:1px; text-transform:uppercase; }
                .sg-ai-card { background:#1E293B; border-radius:12px; padding:12px; display:flex; gap:10px; border:1px solid #334155; }
                .sg-ai-card.alert { border-color:#78350F; background:#1C1208; }
                .sg-ai-card-icon { width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
                .sg-ai-card-icon.blue { background:rgba(96,165,250,0.15); }
                .sg-ai-card-icon.green { background:rgba(52,211,153,0.15); }
                .sg-ai-card-icon.amber { background:rgba(251,176,64,0.15); }
                .sg-ai-card-title { font-size:12px; font-weight:800; color:white; margin-bottom:4px; }
                .sg-ai-card-desc { font-size:11px; color:#64748B; line-height:1.5; }

                .sg-apply-btn { display:flex; align-items:center; justify-content:center; gap:6px; width:100%; background:linear-gradient(135deg,#059669,#10B981); color:white; border:none; border-radius:10px; padding:10px; font-size:11px; font-weight:800; letter-spacing:0.5px; cursor:pointer; font-family:inherit; transition:all 0.2s; }
                .sg-apply-btn:hover { transform:translateY(-1px); box-shadow:0 4px 12px rgba(16,185,129,0.4); }

                .sg-ask-ai-btn { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:11px; background:transparent; border:1.5px dashed #334155; border-radius:12px; color:#64748B; font-size:12px; font-weight:700; cursor:pointer; font-family:inherit; transition:all 0.2s; }
                .sg-ask-ai-btn:hover { border-color:#60A5FA; color:#60A5FA; background:rgba(96,165,250,0.05); }

                /* Modal */
                .sg-overlay { position:fixed; inset:0; background:rgba(15,23,42,0.7); backdrop-filter:blur(6px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:20px; }
                .sg-modal { background:white; border-radius:24px; width:100%; max-width:820px; display:grid; grid-template-columns:1fr 1fr; overflow:hidden; box-shadow:0 32px 80px rgba(0,0,0,0.3); animation:sg-slide-up 0.3s ease; }
                @keyframes sg-slide-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
                @media(max-width:680px){.sg-modal{grid-template-columns:1fr}.sg-modal-right{display:none}}

                .sg-modal-left { padding:32px; display:flex; flex-direction:column; gap:20px; }
                .sg-modal-hdr { display:flex; justify-content:space-between; align-items:flex-start; }
                .sg-modal-title { font-size:22px; font-weight:800; color:#0F172A; margin:0; }
                .sg-modal-sub { font-size:12px; color:#94A3B8; margin-top:4px; }
                .sg-modal-close { width:32px; height:32px; background:#F8FAFC; border:none; border-radius:10px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#64748B; transition:all 0.2s; }
                .sg-modal-close:hover { background:#FEF2F2; color:#EF4444; }

                /* Payment Modal */
                .sg-pay-modal { background:white; border-radius:24px; width:100%; max-width:650px; display:grid; grid-template-columns:1.2fr 1fr; overflow:hidden; box-shadow:0 32px 80px rgba(0,0,0,0.3); animation:sg-slide-up 0.3s ease; }
                .sg-pm-left { padding:24px; background:#F8FAFC; border-right:1px solid #EDF2F7; }
                .sg-pm-right { padding:24px; display:flex; flex-direction:column; justify-content:center; gap:20px; }
                .sg-pm-title { font-size:18px; font-weight:800; color:#0F172A; margin:0; }
                .sg-pm-sub { font-size:11px; color:#94A3B8; margin-top:4px; margin-bottom:16px; font-weight:600; }
                
                .sg-calendar-card { background:white; border-radius:16px; padding:16px; border:1px solid #E2E8F0; }
                .sg-cal-header { text-align:center; margin-bottom:12px; }
                .sg-cal-month { font-size:13px; font-weight:800; color:#0F172A; text-transform:uppercase; letter-spacing:0.5px; }
                .sg-cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; text-align:center; }
                .sg-cal-day-head { font-size:10px; font-weight:800; color:#94A3B8; padding:4px 0; }
                .sg-cal-day { font-size:12px; font-weight:700; color:#475569; padding:8px 0; border-radius:8px; cursor:pointer; transition:all 0.2s; }
                .sg-cal-day:hover { background:#F1F5F9; color:#0076F5; }
                .sg-cal-day.selected { background:#0076F5; color:white; }
                .sg-cal-day.today { border:1.5px solid #0076F5; color:#0076F5; }
                .sg-cal-day.selected.today { border-color:white; }

                .sg-pm-fg { display:flex; flex-direction:column; gap:8px; }
                .sg-pm-label { font-size:9px; font-weight:800; color:#94A3B8; letter-spacing:0.8px; }
                .sg-pm-input-wrap { display:flex; align-items:center; gap:8px; border:2px solid #E2E8F0; border-radius:12px; padding:8px 14px; transition:border-color 0.2s; }
                .sg-pm-input-wrap:focus-within { border-color:#0076F5; box-shadow:0 0 0 4px rgba(0,118,245,0.08); }
                .sg-pm-input-wrap span { font-weight:800; color:#94A3B8; }
                .sg-pm-input-wrap input { border:none; outline:none; font-size:18px; font-weight:800; color:#0F172A; width:100%; font-family:inherit; }
                .sg-pm-note { font-size:10px; color:#64748B; font-weight:600; }

                .sg-pm-actions { display:flex; flex-direction:column; gap:8px; }
                .sg-pm-btn { width:100%; padding:12px; border:none; border-radius:12px; font-size:13px; font-weight:800; cursor:pointer; transition:all 0.2s; font-family:inherit; }
                .sg-pm-btn.confirm { background:linear-gradient(135deg,#0076F5,#0057FF); color:white; box-shadow:0 4px 16px rgba(0,118,245,0.3); }
                .sg-pm-btn.confirm:hover { transform:translateY(-1px); box-shadow:0 8px 24px rgba(0,118,245,0.4); }
                .sg-pm-btn.cancel { background:#F1F5F9; color:#64748B; }
                .sg-pm-btn.cancel:hover { background:#E2E8F0; }

                .sg-form { display:flex; flex-direction:column; gap:14px; }
                .sg-form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
                .sg-fg { display:flex; flex-direction:column; gap:5px; }
                .sg-fl { font-size:10px; font-weight:800; color:#94A3B8; text-transform:uppercase; letter-spacing:0.8px; }
                .sg-fi { padding:11px 14px; border:1.5px solid #E2E8F0; border-radius:12px; font-size:14px; font-family:inherit; color:#0F172A; outline:none; background:white; transition:border-color 0.2s; width:100%; }
                .sg-fi:focus { border-color:#0076F5; box-shadow:0 0 0 3px rgba(0,118,245,0.08); }
                .sg-prefix-wrap { position:relative; }
                .sg-prefix { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#64748B; font-weight:700; font-size:14px; pointer-events:none; }
                .sg-fi.prefixed { padding-left:28px; }
                .sg-modal-submit { display:flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:14px; background:linear-gradient(135deg,#0076F5,#0057FF); color:white; border:none; border-radius:14px; font-size:14px; font-weight:800; cursor:pointer; font-family:inherit; transition:all 0.2s; box-shadow:0 4px 20px rgba(0,118,245,0.35); }
                .sg-modal-submit:hover { transform:translateY(-1px); box-shadow:0 8px 28px rgba(0,118,245,0.4); }

                .sg-modal-right { padding:28px; background:#F8FAFC; border-left:1px solid #EDF2F7; display:flex; flex-direction:column; gap:14px; }
                .sg-proj-title { font-size:16px; font-weight:800; color:#0F172A; margin:0; }
                .sg-monthly-card { background:white; border-radius:14px; padding:14px; border:1px solid #EDF2F7; }
                .sg-mc-label { font-size:9px; font-weight:800; color:#0076F5; letter-spacing:0.8px; margin-bottom:4px; }
                .sg-mc-val { font-size:20px; font-weight:800; color:#0F172A; }
                .sg-mc-val span { font-size:13px; font-weight:600; color:#94A3B8; }
                .sg-mc-note { font-size:11px; color:#94A3B8; font-weight:600; margin-top:4px; display:flex; align-items:center; gap:4px; }
                .sg-miles-label { font-size:9px; font-weight:800; color:#94A3B8; letter-spacing:0.8px; text-transform:uppercase; }
                .sg-milestones { display:flex; flex-direction:column; }
                .sg-mile { display:flex; align-items:flex-start; gap:10px; padding:8px 0; position:relative; }
                .sg-mile-dot { width:10px; height:10px; border-radius:50%; border:2px solid #CBD5E1; background:white; flex-shrink:0; margin-top:3px; }
                .sg-mile-dot.active { border-color:#0076F5; background:#0076F5; }
                .sg-mile-line { position:absolute; left:4px; top:18px; width:1px; height:calc(100% + 2px); background:#E2E8F0; }
                .sg-mile-body { flex:1; }
                .sg-mile-title { font-size:12px; font-weight:700; color:#0F172A; }
                .sg-mile-date { font-size:11px; color:#94A3B8; font-weight:600; margin-top:2px; }
                .sg-ai-bubble-modal { background:white; border-radius:14px; padding:12px 14px; border:1px solid #EDF2F7; box-shadow:0 4px 16px rgba(0,0,0,0.06); }
                .sg-abm-label { font-size:9px; font-weight:800; color:#0076F5; letter-spacing:0.8px; margin-bottom:5px; }
                .sg-ai-bubble-modal p { font-size:11px; color:#475569; line-height:1.5; margin:0; }
            `}</style>
        </div>
    );
};

export default StrategicGoals;
