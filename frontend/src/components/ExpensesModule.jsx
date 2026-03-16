import React, { useState, useMemo, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { TrendingUp, PlusCircle, ArrowUpRight, ArrowDownRight, Briefcase, Zap, PieChart as PieChartIcon, BarChart3, Clock, ArrowRight, Receipt, ShoppingBag, Home, Coffee, Car, Plus, Sparkles, Filter, ChevronRight, Calendar, Search, Trash2, Download, ExternalLink, Activity, Info, Save, MessageSquare, Mic, Shield, Wallet, Brain, Fingerprint, Lock, CheckCircle, RefreshCcw, Bell, Settings, Languages, HelpCircle, Users, Building2, Star, Flame, Sun, Moon, FileText, Tag, DollarSign, Scissors, ArrowDownLeft, RefreshCw, AlertTriangle, Target, X } from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

// ─── ENTITY DEFINITIONS ───
const ENTITIES = [
    { id: 'personal', label: 'Personal', icon: <Wallet size={16} />, color: '#0076F5' },
    { id: 'family', label: 'Family', icon: <Users size={16} />, color: '#7C3AED' },
    { id: 'business1', label: 'Business 1', icon: <Building2 size={16} />, color: '#059669' },
    { id: 'business2', label: 'Business 2', icon: <Briefcase size={16} />, color: '#D97706' },
    { id: 'freelancing', label: 'Freelancing', icon: <Star size={16} />, color: '#EC4899' },
    { id: 'rental', label: 'Rental', icon: <Home size={16} />, color: '#14B8A6' },
    { id: 'sidehustle', label: 'Side Hustle', icon: <Flame size={16} />, color: '#F97316' },
];

const CATEGORIES = ['Food', 'Transport', 'Utilities', 'Shopping', 'Health', 'Entertainment', 'Education', 'Rent', 'EMI', 'Subscriptions', 'Salary', 'Office', 'Marketing', 'Tax', 'Other'];
const PAYMENT_MODES = ['UPI', 'Cash', 'Card', 'Bank Transfer', 'Wallet'];

// ─── MOCK DATA GENERATOR ───
const generateEntityData = (entityId) => {
    const isBusiness = ['business1', 'business2', 'freelancing'].includes(entityId);
    const isFamily = entityId === 'family';
    const base = { personal: 85000, family: 145000, business1: 520000, business2: 280000, freelancing: 95000, rental: 45000, sidehustle: 32000 };
    const expRatio = { personal: 0.42, family: 0.55, business1: 0.68, business2: 0.72, freelancing: 0.38, rental: 0.25, sidehustle: 0.45 };
    const income = base[entityId] || 50000;
    const totalExpense = Math.round(income * (expRatio[entityId] || 0.5));
    const lastMonthExpense = Math.round(totalExpense * (0.85 + Math.random() * 0.3));
    const momChange = ((totalExpense - lastMonthExpense) / lastMonthExpense * 100).toFixed(1);

    const catBreakdown = [
        { name: isBusiness ? 'Operations' : 'Food', value: Math.round(totalExpense * 0.28), color: '#0076F5' },
        { name: isBusiness ? 'Salaries' : 'Transport', value: Math.round(totalExpense * 0.22), color: '#7C3AED' },
        { name: isBusiness ? 'Marketing' : 'Utilities', value: Math.round(totalExpense * 0.18), color: '#F97316' },
        { name: isBusiness ? 'Office' : 'Shopping', value: Math.round(totalExpense * 0.15), color: '#EC4899' },
        { name: isBusiness ? 'Tax' : 'Health', value: Math.round(totalExpense * 0.10), color: '#14B8A6' },
        { name: 'Other', value: Math.round(totalExpense * 0.07), color: '#64748B' },
    ];

    const activeIncome = Math.round(income * (isBusiness ? 0.85 : 0.7));
    const passiveIncome = income - activeIncome;
    const savingsRate = Math.round(((income - totalExpense) / income) * 100);
    const projected = Math.round(totalExpense * (1 + (Math.random() * 0.15 - 0.05)));
    const healthScore = savingsRate > 30 ? 'Excellent' : savingsRate > 15 ? 'Good' : savingsRate > 5 ? 'Fair' : 'At Risk';
    const healthColor = savingsRate > 30 ? '#22c55e' : savingsRate > 15 ? '#0076F5' : savingsRate > 5 ? '#F59E0B' : '#ef4444';
    const burnRate = isBusiness ? Math.round(totalExpense / 30) : 0;
    const runway = isBusiness ? Math.round((income - totalExpense) > 0 ? (income * 3) / totalExpense : 0) : 0;

    const transactions = [
        { id: 1, title: isBusiness ? 'Cloud Hosting' : 'Grocery Store', amount: Math.round(totalExpense * 0.08), category: catBreakdown[0].name, date: 'Today', mode: 'UPI', type: 'expense' },
        { id: 2, title: isBusiness ? 'Client Payment' : 'Salary Credit', amount: Math.round(income * 0.4), category: 'Income', date: 'Today', mode: 'Bank', type: 'income' },
        { id: 3, title: isBusiness ? 'Office Supplies' : 'Electricity Bill', amount: Math.round(totalExpense * 0.06), category: catBreakdown[2].name, date: 'Yesterday', mode: 'Card', type: 'expense' },
        { id: 4, title: isBusiness ? 'Software License' : 'Netflix', amount: Math.round(totalExpense * 0.03), category: 'Subscriptions', date: 'Yesterday', mode: 'Card', type: 'expense' },
        { id: 5, title: isBusiness ? 'Contractor Fee' : 'Petrol', amount: Math.round(totalExpense * 0.05), category: catBreakdown[1].name, date: '2 days ago', mode: 'Cash', type: 'expense' },
    ];

    const familyMembers = isFamily ? [
        { name: 'You', contribution: 55, amount: Math.round(totalExpense * 0.55) },
        { name: 'Spouse', contribution: 30, amount: Math.round(totalExpense * 0.30) },
        { name: 'Parent', contribution: 15, amount: Math.round(totalExpense * 0.15) },
    ] : [];

    return {
        income, activeIncome, passiveIncome, totalExpense, lastMonthExpense, momChange,
        catBreakdown, savingsRate, projected, healthScore, healthColor,
        burnRate, runway, transactions, familyMembers,
        dailyAvg: Math.round(totalExpense / 30),
        topCategory: catBreakdown[0].name,
        highestSingle: Math.round(totalExpense * 0.12),
        expGrowth: momChange,
        fiProgress: Math.min(Math.round((passiveIncome / totalExpense) * 100), 100),
        passiveRatio: Math.round((passiveIncome / income) * 100),
        isBusiness, isFamily,
        netProfit: isBusiness ? income - totalExpense : 0,
        expToRevRatio: isBusiness ? Math.round((totalExpense / income) * 100) : 0,
    };
};

const ExpensesModule = ({ onBack }) => {
    const [activeEntity, setActiveEntity] = useState('personal');
    const [showAddModal, setShowAddModal] = useState(false);
    const [entryTab, setEntryTab] = useState('manual');
    const [period, setPeriod] = useState('month');
    const [showSensitive, setShowSensitive] = useState(true);
    const [theme, setTheme] = useState('light');
    const isDark = theme === 'dark';
    const today = new Date();
    const localDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const [newExpense, setNewExpense] = useState({ amount: '', category: 'Food', date: localDateString, paymentMode: 'UPI', notes: '', tag: '', taxDeductible: false });
    const [expenses, setExpenses] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiLoading, setAiLoading] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([{ role: 'assistant', content: 'Hi! I am Arth AI. How can I help you with your expenses today?' }]);
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [editBudget, setEditBudget] = useState({ category: '', amount: '' });

    const [currentMsg, setCurrentMsg] = useState('');
    const [isListening, setIsListening] = useState(false);
    const chatEndRef = useRef(null);

    // ─── API CALLS ───
    const fetchData = async () => {
        setLoading(true);
        try {
            // Get local date string in YYYY-MM-DD format to fix timezone offsets
            const now = new Date();
            const clientDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

            const [expRes, sumRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/expenses?entity=${activeEntity}`),
                axios.get(`${API_BASE_URL}/expenses/summary/${activeEntity}?period=${period}&clientDate=${clientDate}`)
            ]);
            setExpenses(expRes.data);
            setSummary(sumRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        window.addEventListener('transactionAdded', fetchData);
        return () => window.removeEventListener('transactionAdded', fetchData);
    }, [activeEntity, period]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatMessages]);

    const openAddModal = () => {
        setNewExpense(prev => ({
            ...prev,
            date: new Date().toISOString().split('T')[0]
        }));
        setShowAddModal(true);
    };

    const handleAddExpense = async (e) => {
        if (e) e.preventDefault();
        if (!newExpense.amount || isNaN(newExpense.amount)) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/expenses`, { ...newExpense, entity: activeEntity });
            setShowAddModal(false);
            const todayReset = new Date();
            const localDateReset = `${todayReset.getFullYear()}-${String(todayReset.getMonth() + 1).padStart(2, '0')}-${String(todayReset.getDate()).padStart(2, '0')}`;
            setNewExpense({ amount: '', category: 'Food', date: localDateReset, paymentMode: 'UPI', notes: '', tag: '', taxDeductible: false });
            fetchData();


            // Dispatch event for global sync (Dashboard, Recent Transactions, etc.)
            window.dispatchEvent(new CustomEvent('transactionAdded'));
            console.log('Expense saved and event dispatched:', res.data);
        } catch (error) {
            console.error('Error adding expense:', error);
            const errMsg = error.response?.data?.message || error.message || 'Check your connection';
            alert(`Failed to save expense: ${errMsg}`);
        }
    };

    const handleSaveBudget = async (e) => {
        if (e) e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/budgets`, {
                category: editBudget.category,
                amount: Number(editBudget.amount),
                entity: activeEntity
            });
            setShowBudgetModal(false);
            fetchData();
        } catch (error) {
            console.error('Error saving budget:', error);
            alert('Failed to save budget settings.');
        }
    };


    const handleAiChat = async () => {
        if (!currentMsg.trim()) return;
        const userMsg = { role: 'user', content: currentMsg };
        setChatMessages(prev => [...prev, userMsg]);
        setCurrentMsg('');
        setAiLoading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/ai/chat`, {
                message: currentMsg,
                context: `The user is currently viewing the ${activeEntity} entity.`
            });
            setChatMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
        } catch (error) {
            setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting right now.' }]);
        } finally {
            setAiLoading(false);
        }
    };

    const startVoice = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Your browser does not support Speech Recognition.');
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = async (event) => {
            const text = event.results[0][0].transcript;
            setIsListening(false);
            setAiLoading(true);
            try {
                const res = await axios.post(`${API_BASE_URL}/ai/voice-parse`, { text });
                const parsed = res.data;
                if (parsed.amount) {
                    setNewExpense(prev => ({ ...prev, ...parsed }));
                    setShowAddModal(true);
                }
            } catch (error) {
                console.error('Voice parsing error:', error);
            } finally {
                setAiLoading(false);
            }
        };
        recognition.start();
    };

    const data = useMemo(() => {
        if (!summary) return generateEntityData(activeEntity);
        return {
            ...summary,
            income: summary.totalIncome || 0,
            transactions: summary.recentTransactions || [],
            healthColor: summary.savingsRate > 30 ? '#22c55e' : summary.savingsRate > 15 ? '#0076F5' : '#ef4444',
            healthScore: summary.savingsRate > 30 ? 'Excellent' : summary.savingsRate > 15 ? 'Good' : 'At Risk',
            isBusiness: ['business1', 'business2', 'freelancing'].includes(activeEntity),
            isFamily: activeEntity === 'family'
        };
    }, [summary, activeEntity]);

    const entity = ENTITIES.find(e => e.id === activeEntity);
    const utilizationPct = summary ? summary.utilizationPct : 0;
    const utilizationColor = utilizationPct > 80 ? '#ef4444' : utilizationPct > 50 ? '#F59E0B' : '#22c55e';


    return (
        <div className={`exp-root ${isDark ? 'exp-dark' : 'exp-light'}`}>
            <header className="exp-hero img-match">
                <div className="hero-top-row">
                    <div className="hero-top-left">
                        <div className="hero-badge-img">
                            <Activity size={12} style={{ opacity: 0.8 }} />
                            <span>Financial Control Center</span>
                            {loading && <span className="loading-dot"></span>}
                        </div>
                    </div>

                    <div className="hero-top-right">
                        <button className="theme-toggle-btn-img" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
                            {isDark ? <Sun size={14} /> : <Moon size={14} />}
                        </button>
                        <button className="voice-btn-img" onClick={startVoice}>
                            <Mic size={14} />
                            <span>Voice Entry</span>
                        </button>
                        <button className="add-btn-img" onClick={openAddModal}>
                            <Plus size={16} /> Add Expense
                        </button>
                    </div>
                </div>


                <div className="hero-bg-pattern">
                    {/* Glow orbs */}
                    <div className="glow-orb orb-1"></div>
                    <div className="glow-orb orb-2"></div>
                    <div className="glow-orb orb-3"></div>

                    {/* Premium SVG background design */}
                    <svg className="hero-svg-bg" viewBox="0 0 1000 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            {/* Dot grid pattern */}
                            <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                                <circle cx="1.5" cy="1.5" r="1.5" fill="rgba(255,255,255,0.12)" />
                            </pattern>
                            {/* Glowing chart line gradient */}
                            <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#0076F5" stopOpacity="0" />
                                <stop offset="30%" stopColor="#0076F5" stopOpacity="0.9" />
                                <stop offset="70%" stopColor="#22c55e" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                            </linearGradient>
                            {/* Area fill gradient below chart */}
                            <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#0076F5" stopOpacity="0.18" />
                                <stop offset="100%" stopColor="#0076F5" stopOpacity="0" />
                            </linearGradient>
                            {/* Glow filter for the chart line */}
                            <filter id="lineGlow" x="-20%" y="-200%" width="140%" height="500%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Dot grid */}
                        <rect width="1000" height="200" fill="url(#dots)" />

                        {/* Horizontal subtle grid lines */}
                        <line x1="0" y1="60" x2="1000" y2="60" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                        <line x1="0" y1="120" x2="1000" y2="120" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                        <line x1="0" y1="170" x2="1000" y2="170" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

                        {/* Area fill below chart curve */}
                        <path
                            d="M0,160 C80,140 160,100 260,80 S420,40 520,55 S680,90 780,60 S920,30 1000,45 L1000,200 L0,200 Z"
                            fill="url(#areaGrad)"
                        />

                        {/* Main glowing financial chart line */}
                        <path
                            d="M0,160 C80,140 160,100 260,80 S420,40 520,55 S680,90 780,60 S920,30 1000,45"
                            fill="none"
                            stroke="url(#chartGrad)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            filter="url(#lineGlow)"
                        />

                        {/* Decorative rings — right side */}
                        <circle cx="920" cy="100" r="70" fill="none" stroke="rgba(0,118,245,0.08)" strokeWidth="1.5" />
                        <circle cx="920" cy="100" r="45" fill="none" stroke="rgba(0,118,245,0.12)" strokeWidth="1" />
                        <circle cx="920" cy="100" r="20" fill="none" stroke="rgba(0,118,245,0.18)" strokeWidth="1" />

                        {/* Decorative rings — left side */}
                        <circle cx="80" cy="170" r="55" fill="none" stroke="rgba(34,197,94,0.07)" strokeWidth="1.5" />
                        <circle cx="80" cy="170" r="30" fill="none" stroke="rgba(34,197,94,0.10)" strokeWidth="1" />

                        {/* Data point dots on the chart */}
                        <circle cx="260" cy="80" r="4" fill="#0076F5" opacity="0.7" filter="url(#lineGlow)" />
                        <circle cx="520" cy="55" r="4" fill="#7C3AED" opacity="0.7" filter="url(#lineGlow)" />
                        <circle cx="780" cy="60" r="4" fill="#22c55e" opacity="0.7" filter="url(#lineGlow)" />
                    </svg>
                </div>


                {/* Horizontal Entity Pills */}
                <div className="entity-pills-img">
                    {ENTITIES.map(ent => (
                        <button
                            key={ent.id}
                            className={`entity-pill-img ${activeEntity === ent.id ? 'active' : ''}`}
                            onClick={() => setActiveEntity(ent.id)}
                        >
                            {ent.icon}
                            <span>{ent.label}</span>
                        </button>
                    ))}
                </div>

                {/* Stats Row + Period Toggle */}
                <div className="stats-and-period-row">
                    <div className="stats-row-img">
                        <div className="stat-col-img">
                            <label>INCOME (ACTIVE + PASSIVE)</label>
                            <div className="stat-val-blue">₹{(data.income || 0).toLocaleString()}</div>
                        </div>
                        <div className="stat-divider-img"></div>
                        <div className="stat-col-img">
                            <label>PASSIVE BALANCE</label>
                            <div className="stat-val-green">₹{(data.passiveIncome || 0).toLocaleString()}</div>
                        </div>
                        <div className="stat-divider-img"></div>
                        <div className="stat-col-img">
                            <label>TOTAL EXPENSES</label>
                            <div className="stat-val-red">₹{data.totalExpense.toLocaleString()}</div>
                        </div>
                        <div className="stat-divider-img"></div>
                        <div className="stat-col-img">
                            <label>SAVINGS RATE</label>
                            <div className="stat-val-green">{data.savingsRate}%</div>
                        </div>
                        <div className="stat-divider-img"></div>
                        <div className="stat-col-img">
                            <label>HEALTH SCORE</label>
                            <div className="stat-val-green" style={{ color: data.healthScore === 'At Risk' ? '#ef4444' : '#22c55e' }}>{data.healthScore}</div>
                        </div>
                    </div>
                    <div className="period-tabs-hero-exp">
                        {[{ id: 'day', label: 'Daily' }, { id: 'week', label: 'Weekly' }, { id: 'month', label: 'Monthly' }].map(p => (
                            <button
                                key={p.id}
                                className={period === p.id ? 'active' : ''}
                                onClick={() => setPeriod(p.id)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* ─── MAIN GRID ─── */}
            <div className="exp-grid">
                {/* LEFT COLUMN */}
                <main className="exp-main">

                    {/* AI Spending Intelligence */}
                    <section className="exp-section ai-intel">
                        <div className="section-header"><Brain size={18} className="icon-purple" /><h2>AI Spending Intelligence</h2></div>
                        <div className="intel-grid">
                            {/* Spending vs Income Ring */}
                            <div className="intel-card ring-card">
                                <div className="ring-wrap">
                                    <svg width="120" height="120" viewBox="0 0 120 120">
                                        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                        <circle cx="60" cy="60" r="52" fill="none" stroke={utilizationColor} strokeWidth="10"
                                            strokeDasharray={`${utilizationPct * 3.27} 327`} strokeLinecap="round"
                                            transform="rotate(-90 60 60)" style={{ transition: 'stroke-dasharray 1s ease' }} />
                                    </svg>
                                    <div className="ring-center">
                                        <span className="ring-pct" style={{ color: utilizationColor }}>{utilizationPct}%</span>
                                        <span className="ring-lbl">Spent</span>
                                    </div>
                                </div>
                                <div className="ring-info">
                                    <span className="ring-title">Income Utilization</span>
                                    <span className="ring-desc">{utilizationPct > 80 ? '⚠️ Overspending risk!' : utilizationPct > 50 ? '⚡ Monitor closely' : '✅ Healthy spending'}</span>
                                </div>
                            </div>

                            {/* MoM Comparison */}
                            <div className="intel-card">
                                <div className="intel-icon" style={{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}><TrendingUp size={20} /></div>
                                <span className="intel-label">Month-over-Month</span>
                                <span className={`intel-value ${parseFloat(data.momChange) > 0 ? 'red' : 'green'}`}>
                                    {parseFloat(data.momChange) > 0 ? '+' : ''}{data.momChange}%
                                </span>
                                <span className="intel-sub">{parseFloat(data.momChange) > 0 ? 'Spending increased' : 'Spending decreased'}</span>
                            </div>

                            {/* Projected End-of-Month */}
                            <div className="intel-card">
                                <div className="intel-icon" style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316' }}><Target size={20} /></div>
                                <span className="intel-label">Projected EOM</span>
                                <span className={`intel-value ${data.projected > data.income ? 'red' : 'green'}`}>₹{data.projected.toLocaleString()}</span>
                                <span className="intel-sub">{data.projected > data.income ? '⚠️ Exceeds income!' : '✅ Within budget'}</span>
                            </div>

                            {/* Financial Health */}
                            <div className="intel-card">
                                <div className="intel-icon" style={{ background: `${data.healthColor}15`, color: data.healthColor }}><Shield size={20} /></div>
                                <span className="intel-label">Financial Health</span>
                                <span className="intel-value" style={{ color: data.healthColor }}>{data.healthScore}</span>
                                <span className="intel-sub">Savings: {data.savingsRate}% | Daily Avg: ₹{data.dailyAvg.toLocaleString()}</span>
                            </div>
                        </div>
                    </section >

                    {/* Category Breakdown */}
                    < section className="exp-section" >
                        <div className="section-header"><PieChartIcon size={18} className="icon-blue" /><h2>Category Breakdown</h2></div>
                        <div className="cat-grid">
                            <div className="cat-chart-wrap">
                                <ResponsiveContainer width="100%" height={200}>
                                    <RechartsPieChart>
                                        <Pie data={data.catBreakdown} innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                                            {data.catBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                        </Pie>
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                                <div className="cat-center">
                                    <span className="cat-total">₹{data.totalExpense.toLocaleString()}</span>
                                    <span className="cat-lbl">Total</span>
                                </div>
                            </div>
                            <div className="cat-list">
                                {data.catBreakdown.map((cat, i) => (
                                    <div key={i} className="cat-item">
                                        <div className="cat-dot" style={{ background: cat.color }}></div>
                                        <span className="cat-name">{cat.name}</span>
                                        <span className="cat-amt">₹{cat.value.toLocaleString()}</span>
                                        <span className="cat-pct">{Math.round((cat.value / data.totalExpense) * 100)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section >

                    {/* Advanced Metrics */}
                    < section className="exp-section" >
                        <div className="section-header"><BarChart3 size={18} className="icon-gold" /><h2>Advanced Metrics</h2></div>
                        <div className="metrics-grid">
                            {[
                                { label: 'Expense-to-Income', value: `${utilizationPct}%`, color: utilizationColor },
                                { label: 'Expense Growth', value: `${data.expGrowth}%`, color: parseFloat(data.expGrowth) > 0 ? '#ef4444' : '#22c55e' },
                                { label: 'Daily Average', value: `₹${data.dailyAvg.toLocaleString()}`, color: '#0076F5' },
                                { label: 'Top Category', value: data.topCategory, color: '#7C3AED' },
                                { label: 'Highest Single', value: `₹${data.highestSingle.toLocaleString()}`, color: '#F97316' },
                                { label: 'Passive/Income', value: `${data.passiveRatio}%`, color: '#14B8A6' },
                            ].map((m, i) => (
                                <div key={i} className="metric-card">
                                    <span className="metric-lbl">{m.label}</span>
                                    <span className="metric-val" style={{ color: m.color }}>{m.value}</span>
                                </div>
                            ))}
                        </div>
                    </section >

                    {/* Passive Income Analysis */}
                    < section className="exp-section" >
                        <div className="section-header"><Zap size={18} className="icon-green" /><h2>Passive Income Analysis</h2></div>
                        <div className="passive-grid">
                            <div className="passive-card">
                                <span className="p-lbl">Passive vs Expense Ratio</span>
                                <div className="p-bar-track"><div className="p-bar-fill" style={{ width: `${Math.min(data.fiProgress, 100)}%`, background: 'linear-gradient(90deg, #0076F5, #22c55e)' }}></div></div>
                                <span className="p-val">{data.fiProgress}% covered by passive income</span>
                            </div>
                            <div className="passive-card">
                                <span className="p-lbl">Active Income Dependency</span>
                                <span className="p-big" style={{ color: '#F59E0B' }}>{100 - data.passiveRatio}%</span>
                            </div>
                            <div className="passive-card">
                                <span className="p-lbl">FI Progress</span>
                                <span className="p-big" style={{ color: '#22c55e' }}>{data.fiProgress}%</span>
                            </div>
                        </div>
                    </section >
                </main >

                {/* RIGHT COLUMN */}
                < aside className="exp-aside" >
                    {/* Recent Transactions */}
                    < section className="exp-section" >
                        <div className="section-header"><h2>Recent Transactions</h2><button className="view-all">View All</button></div>
                        <div className="tx-list">
                            {data.transactions.slice(0, 6).map(tx => {
                                const isIncome = tx.type.includes('income');
                                return (
                                    <div key={tx.id} className="tx-item">
                                        <div className={`tx-icon-wrap ${isIncome ? 'income' : 'expense'}`}>
                                            {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                                        </div>
                                        <div className="tx-info">
                                            <span className="tx-name">{tx.title}</span>
                                            <span className="tx-meta">{new Date(tx.date).toLocaleDateString()} • {tx.mode}</span>
                                        </div>
                                        <span className={`tx-amt ${isIncome ? 'income' : 'expense'}`}>
                                            {isIncome ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </section >

                    {/* Business-Specific */}
                    {
                        data.isBusiness && (
                            <section className="exp-section biz-section">
                                <div className="section-header"><Briefcase size={18} className="icon-green" /><h2>Business Metrics</h2></div>
                                <div className="biz-grid">
                                    <div className="biz-card"><span className="b-lbl">Net Profit</span><span className="b-val green">₹{data.netProfit.toLocaleString()}</span></div>
                                    <div className="biz-card"><span className="b-lbl">Exp/Rev Ratio</span><span className="b-val">{data.expToRevRatio}%</span></div>
                                    <div className="biz-card"><span className="b-lbl">Daily Burn</span><span className="b-val red">₹{data.burnRate.toLocaleString()}</span></div>
                                    <div className="biz-card"><span className="b-lbl">Runway</span><span className="b-val blue">{data.runway} months</span></div>
                                </div>
                            </section>
                        )
                    }

                    {/* Family-Specific */}
                    {
                        data.isFamily && (
                            <section className="exp-section fam-section">
                                <div className="section-header"><Users size={18} className="icon-purple" /><h2>Family Contributions</h2></div>
                                {data.familyMembers.map((m, i) => (
                                    <div key={i} className="fam-member">
                                        <div className="fam-info"><span className="fam-name">{m.name}</span><span className="fam-amt">₹{m.amount.toLocaleString()}</span></div>
                                        <div className="fam-bar-track"><div className="fam-bar-fill" style={{ width: `${m.contribution}%` }}></div></div>
                                        <span className="fam-pct">{m.contribution}%</span>
                                    </div>
                                ))}
                            </section>
                        )
                    }

                    {/* Smart Alerts */}
                    <section className="exp-section alerts-section">
                        <div className="section-header"><Bell size={18} className="icon-red" /><h2>Smart Alerts</h2></div>
                        <div className="alerts-list">
                            {utilizationPct > 70 && <div className="alert-item warning"><AlertTriangle size={14} /><span>Spending at {utilizationPct}% of income</span></div>}
                            {parseFloat(data.momChange) > 10 && <div className="alert-item danger"><TrendingUp size={14} /><span>Expenses up {data.momChange}% vs last month</span></div>}
                            {data.projected > data.income && <div className="alert-item danger"><Target size={14} /><span>Projected spend exceeds income!</span></div>}
                            <div className="alert-item info"><Clock size={14} /><span>EMI due in 5 days — ₹8,499</span></div>
                            <div className="alert-item info"><RefreshCw size={14} /><span>Netflix subscription renewing soon</span></div>
                        </div>
                    </section>

                    {/* Budget Performance */}
                    <section className="exp-section">
                        <div className="section-header"><Target size={18} className="icon-blue" /><h2>Budget Performance</h2></div>
                        {data.catBreakdown.slice(0, 4).map((cat, i) => {
                            const budget = cat.budget || Math.round(cat.value * 1.2);
                            const pct = Math.round((cat.value / budget) * 100);
                            return (
                                <div key={i} className="budget-item">
                                    <div className="budget-top">
                                        <span className="budget-name">{cat.name}</span>
                                        <div className="budget-actions">
                                            <span className="budget-pct" style={{ color: pct > 90 ? '#ef4444' : '#22c55e' }}>{pct}%</span>
                                            <button className="edit-budget-btn" onClick={() => { setEditBudget({ category: cat.name, amount: budget }); setShowBudgetModal(true); }}>
                                                <Settings size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="budget-bar"><div className="budget-fill" style={{ width: `${Math.min(pct, 100)}%`, background: pct > 90 ? '#ef4444' : cat.color }}></div></div>
                                    <div className="budget-vals"><span>₹{cat.value.toLocaleString()}</span><span>/ ₹{budget.toLocaleString()}</span></div>
                                </div>
                            );
                        })}
                    </section>

                    {/* Export */}
                    <section className="exp-section">
                        <div className="section-header"><Download size={18} /><h2>Export</h2></div>
                        <div className="export-btns">
                            <button className="export-btn"><FileText size={14} /> PDF Report</button>
                            <button className="export-btn"><Download size={14} /> CSV Export</button>
                        </div>
                    </section>
                </aside >
            </div >

            {/* ─── AI CHATBOX ─── */}
            < div className={`ai-chat-drawer ${showChat ? 'open' : ''}`}>
                <div className="chat-header">
                    <div className="ch-left"><Brain size={20} /> <span>Arth AI Assistant</span></div>
                    <button className="ch-close" onClick={() => setShowChat(false)}><X size={20} /></button>
                </div>
                <div className="chat-messages">
                    {chatMessages.map((m, i) => (
                        <div key={i} className={`chat-bubble ${m.role}`}>
                            {m.content}
                        </div>
                    ))}
                    {aiLoading && <div className="chat-bubble assistant loading">Thinking...</div>}
                    <div ref={chatEndRef} />
                </div>
                <div className="chat-input-wrap">
                    <input
                        type="text"
                        placeholder="Ask me something..."
                        value={currentMsg}
                        onChange={e => setCurrentMsg(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleAiChat()}
                    />
                    <button className="chat-send" onClick={handleAiChat} disabled={aiLoading}><ChevronRight size={20} /></button>
                </div>
            </div >



            {/* ─── VOICE OVERLAY ─── */}
            {
                isListening && (
                    <div className="voice-overlay">
                        <div className="voice-content">
                            <div className="voice-waves">
                                <span></span><span></span><span></span><span></span><span></span>
                            </div>
                            <h2>Listening...</h2>
                            <p>Speak your expense (e.g. "₹500 for lunch today")</p>
                            <button className="voice-stop" onClick={() => setIsListening(false)}><X size={16} /> Stop</button>
                        </div>
                    </div>
                )
            }

            {/* ─── ADD EXPENSE MODAL ─── */}
            {
                showAddModal && (
                    <div className="pm-overlay">
                        <div className="pm-card">
                            <div className="pm-header">
                                <div className="pm-header-content">
                                    <div className="pm-header-icon"><DollarSign size={24} /></div>
                                    <div className="pm-header-text">
                                        <span className="pm-header-sub">NEW ENTRY</span>
                                        <h2 className="pm-header-title">Add Expense</h2>
                                    </div>
                                </div>
                                <button className="pm-close" onClick={() => setShowAddModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="pm-body">
                                <div className="pm-tabs">
                                    {[{ id: 'manual', label: 'Manual', icon: <Plus size={14} /> },
                                    { id: 'recurring', label: 'Recurring', icon: <RefreshCw size={14} /> },
                                    { id: 'split', label: 'Split', icon: <Scissors size={14} /> }].map(t => (
                                        <button key={t.id} className={`pm-tab-btn ${entryTab === t.id ? 'active' : ''}`} onClick={() => setEntryTab(t.id)}>
                                            {t.icon}<span>{t.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="pm-form">
                                    <div className="pm-field full">
                                        <label>Amount</label>
                                        <div className="pm-input-wrap">
                                            <span className="pm-symbol">₹</span>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={newExpense.amount}
                                                onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div className="pm-field">
                                        <label>Category</label>
                                        <div className="pm-input-wrap">
                                            <select value={newExpense.category} onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}>
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                            <div className="pm-icon-right"><ChevronDown size={16} /></div>
                                        </div>
                                    </div>

                                    <div className="pm-field">
                                        <label>Payment Mode</label>
                                        <div className="pm-input-wrap">
                                            <select value={newExpense.paymentMode} onChange={e => setNewExpense({ ...newExpense, paymentMode: e.target.value })}>
                                                {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                            <div className="pm-icon-right"><ChevronDown size={16} /></div>
                                        </div>
                                    </div>

                                    <div className="pm-field">
                                        <label>Date (Auto-fetched)</label>
                                        <div className="pm-input-wrap readonly">
                                            <input
                                                type="date"
                                                value={newExpense.date}
                                                onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="pm-field">
                                        <label>Tag</label>
                                        <div className="pm-input-wrap">
                                            <input
                                                type="text"
                                                placeholder="e.g. Vacation"
                                                value={newExpense.tag}
                                                onChange={e => setNewExpense({ ...newExpense, tag: e.target.value })}
                                            />
                                            <div className="pm-icon-right"><Tag size={16} /></div>
                                        </div>
                                    </div>

                                    <div className="pm-field full">
                                        <label>Notes</label>
                                        <div className="pm-input-wrap">
                                            <textarea
                                                placeholder="Add a detailed note..."
                                                value={newExpense.notes}
                                                onChange={e => setNewExpense({ ...newExpense, notes: e.target.value })}
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                    {data.isBusiness && (
                                        <div className="pm-field full">
                                            <label className="toggle-label" style={{ userSelect: 'none' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={newExpense.taxDeductible}
                                                    onChange={e => setNewExpense({ ...newExpense, taxDeductible: e.target.checked })}
                                                />
                                                <span>Mark as Tax Deductible</span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div className="pm-footer">
                                    <button className="pm-btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                                    <button className="pm-btn-save" onClick={handleAddExpense}>
                                        <CheckCircle size={16} /> Save Expense
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* ─── BUDGET EDIT MODAL ─── */}
            {showBudgetModal && (
                <div className="e-modal-overlay">
                    <div className="e-modal-card">
                        <div className="e-modal-header">
                            <div className="em-title">
                                <Settings size={22} className="icon-blue" />
                                <div>
                                    <h3>Set Monthly Limit</h3>
                                    <p>Adjust budget for {editBudget.category}</p>
                                </div>
                            </div>
                            <button className="em-close" onClick={() => setShowBudgetModal(false)}><X size={20} /></button>
                        </div>

                        <div className="e-modal-body">
                            <div className="input-group full">
                                <label>Monthly Amount (₹)</label>
                                <div className="input-with-symbol">
                                    <span className="symbol">₹</span>
                                    <input
                                        type="number"
                                        value={editBudget.amount}
                                        onChange={e => setEditBudget({ ...editBudget, amount: e.target.value })}
                                        placeholder="Enter limit"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setShowBudgetModal(false)}>Cancel</button>
                            <button className="save-btn" onClick={handleSaveBudget}><CheckCircle size={16} /> Update Budget</button>
                        </div>
                    </div>
                </div>
            )}


            {/* ─── STYLES ─── */}
            <style dangerouslySetInnerHTML={{ __html: STYLES }} />
        </div >
    );
};

// ─── ALL STYLES ───
const STYLES = `
  /* ═══ THEME VARIABLES ═══ */
  .exp-light {
    --e-bg: #F6F9FF; --e-hero-bg: #0f172a; --e-card-bg: #FFFFFF; --e-card-inner: #F6F9FF;
    --e-text: #0F172A; --e-text-sec: #475569; --e-muted: #64748B;
    --e-border: rgba(0,0,0,0.08); --e-border-hover: rgba(0,0,0,0.15);
    --e-shadow: 0 4px 20px rgba(0,0,0,0.06); --e-shadow-hover: 0 10px 40px rgba(0,0,0,0.1);
    --e-pill-bg: rgba(255,255,255,0.05); --e-pill-border: rgba(255,255,255,0.1); --e-pill-text: #8a99af;
    --e-track-bg: #E2E8F0; --e-divider: rgba(255,255,255,0.08);
    --e-input-bg: #F8FAFC; --e-input-border: #E2E8F0; --e-input-text: #0F172A;
    --e-modal-bg: #FFFFFF; --e-modal-border: #E2E8F0;
    --e-orb-opacity: 0.15; --e-hero-border: rgba(255,255,255,0.1);
    --e-back-bg: rgba(255,255,255,0.05); --e-back-border: rgba(255,255,255,0.12); --e-back-color: white;
    --e-cancel-bg: #F1F5F9; --e-cancel-border: #E2E8F0; --e-cancel-color: #475569;
    --e-export-bg: #F1F5F9; --e-export-border: #E2E8F0; --e-export-color: #0F172A;
    --e-tab-bg: #F1F5F9; --e-tab-border: #E2E8F0; --e-tab-color: #64748B;
    --e-toggle-lbl: #475569;
  }
  .exp-dark {
    --e-bg: #060d19; --e-hero-bg: #0f172a; --e-card-bg: rgba(255,255,255,0.03); --e-card-inner: rgba(255,255,255,0.02);
    --e-text: #FFFFFF; --e-text-sec: #CBD5E1; --e-muted: #8A99AF;
    --e-border: rgba(255,255,255,0.1); --e-border-hover: rgba(255,255,255,0.18);
    --e-shadow: 0 4px 20px rgba(0,0,0,0.15); --e-shadow-hover: 0 10px 40px rgba(0,0,0,0.25);
    --e-pill-bg: rgba(255,255,255,0.05); --e-pill-border: rgba(255,255,255,0.1); --e-pill-text: #8a99af;
    --e-track-bg: rgba(255,255,255,0.05); --e-divider: rgba(255,255,255,0.08);
    --e-input-bg: rgba(255,255,255,0.03); --e-input-border: rgba(255,255,255,0.1); --e-input-text: #FFFFFF;
    --e-modal-bg: #0f172a; --e-modal-border: rgba(255,255,255,0.12);
    --e-orb-opacity: 0.15; --e-hero-border: rgba(255,255,255,0.1);
    --e-back-bg: rgba(255,255,255,0.05); --e-back-border: rgba(255,255,255,0.12); --e-back-color: white;
    --e-cancel-bg: rgba(255,255,255,0.05); --e-cancel-border: rgba(255,255,255,0.1); --e-cancel-color: white;
    --e-export-bg: rgba(255,255,255,0.05); --e-export-border: rgba(255,255,255,0.1); --e-export-color: white;
    --e-tab-bg: rgba(255,255,255,0.05); --e-tab-border: rgba(255,255,255,0.1); --e-tab-color: #8a99af;
    --e-toggle-lbl: #cbd5e1;
  }

  .exp-root { padding: 30px; min-height: 100vh; background: var(--e-bg); color: var(--e-text); font-family: 'Inter', 'Manrope', sans-serif; transition: background 0.4s, color 0.4s; position: relative; }

  /* Loading Screen */
  .loading-screen { position: fixed; inset: 0; background: #0f172a; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; color: white; z-index: 10000; }
  .spin { animation: spin 2s linear infinite; color: #0076F5; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  /* Hero Header Redesign - Dashboard Match */
  .exp-hero.img-match {
    background: #0f172a;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 28px;
    padding: 32px 40px;
    color: white;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 32px;
    box-shadow: 0 24px 50px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .hero-bg-pattern {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none;
    z-index: 0;
    background:
      radial-gradient(circle at 15% 50%, rgba(255, 255, 255, 0.04) 0%, transparent 50%),
      radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.04) 0%, transparent 50%);
  }

  /* Thematic floating watermark icons */
  .floating-icon { position: absolute; pointer-events: none; }

  /* Income icons — green tint, top-right quadrant */
  .icon-income-1 {
    top: -30px;
    right: 4%;
    color: #22c55e;
    opacity: 0.06;
    transform: rotate(10deg);
    filter: blur(0.5px);
  }
  .icon-income-2 {
    top: 24px;
    right: 22%;
    color: #22c55e;
    opacity: 0.10;
    transform: rotate(-5deg);
    filter: blur(0.5px);
  }

  /* Expense icons — red tint, bottom-left quadrant */
  .icon-expense-1 {
    bottom: -20px;
    left: 2%;
    color: #ef4444;
    opacity: 0.06;
    transform: rotate(-12deg);
    filter: blur(0.5px);
  }
  .icon-expense-2 {
    bottom: 20px;
    left: 20%;
    color: #ef4444;
    opacity: 0.10;
    transform: rotate(8deg);
    filter: blur(0.5px);
  }

  .glow-orb { position: absolute; border-radius: 50%; filter: blur(80px); transform: translateZ(0); pointer-events: none; }
  .orb-1 { top: -20%; left: -10%; width: 350px; height: 350px; background: #0057FF; opacity: 0.35; }
  .orb-2 { bottom: -30%; right: 5%; width: 450px; height: 450px; background: #00D1FF; opacity: 0.3; }
  .orb-3 { top: 40%; left: 40%; width: 200px; height: 200px; background: #7C3AED; opacity: 0.25; }

  .hero-top-row, .entity-pills-img, .stats-row-img { position: relative; z-index: 10; }
  
  .hero-top-row { display: flex; justify-content: space-between; align-items: center; }
  .hero-top-left { display: flex; justify-content: flex-start; align-items: center; gap: 16px; margin-bottom: 8px; }
  
  .hero-badge-img { display: flex; align-items: center; gap: 8px; background: rgba(0, 118, 245, 0.15); border: 1px solid rgba(0, 118, 245, 0.3); padding: 8px 16px; border-radius: 100px; font-size: 11px; font-weight: 700; color: #60A5FA; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(0, 118, 245, 0.1); }
  
  /* SVG background fill */
  .hero-svg-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; pointer-events: none; z-index: 1; opacity: 0.9; }

  /* Pulsing loading dot in badge */
  .loading-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 6px #22c55e;
    animation: livePulse 1.2s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes livePulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }

  .hero-top-right { display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-bottom: 8px; }
  .theme-toggle-btn-img { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.5); cursor: pointer; transition: all 0.2s; }
  .theme-toggle-btn-img:hover { background: rgba(255,255,255,0.08); color: white; border-color: rgba(255,255,255,0.1); }
  
  .voice-btn-img { display: flex; align-items: center; gap: 8px; background: rgba(88, 28, 135, 0.3); border: 1px solid rgba(139, 92, 246, 0.25); color: #c084fc; padding: 0 16px; height: 36px; border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(88, 28, 135, 0.15); }
  .voice-btn-img:hover { background: rgba(88, 28, 135, 0.5); border-color: rgba(139, 92, 246, 0.4); box-shadow: 0 4px 12px rgba(88, 28, 135, 0.3); }
  
  .add-btn-img { display: flex; align-items: center; gap: 8px; background: #0076F5; color: white; border: none; padding: 0 20px; height: 36px; border-radius: 10px; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0, 118, 245, 0.3); }
  .add-btn-img:hover { background: #0066ff; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0, 118, 245, 0.4); }
  
  .hero-title-area { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
  .hero-title-img { font-size: 38px; font-weight: 800; color: white; margin: 0; letter-spacing: -1px; line-height: 1.1; }
  .hero-subtitle-img { font-size: 15px; color: rgba(255, 255, 255, 0.6); margin: 0; font-weight: 500; letter-spacing: -0.2px; }
  
  .entity-pills-img { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 2px; }
  .entity-pill-img { display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); color: rgba(255, 255, 255, 0.6); padding: 8px 16px; border-radius: 100px; font-size: 11px; font-weight: 600; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; }
  .entity-pill-img:hover { background: rgba(255, 255, 255, 0.06); color: rgba(255,255,255,0.8); border-color: rgba(255, 255, 255, 0.1); }
  .entity-pill-img.active { background: #0076F5; border-color: #0076F5; color: white; }
  
  .stats-and-period-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; position: relative; z-index: 10; padding-top: 12px; }
  .stats-row-img { display: flex; align-items: center; gap: 32px; flex-wrap: wrap; }

  /* Period Tab Switcher */
  .period-tabs-hero-exp {
    background: rgba(0, 0, 0, 0.4);
    padding: 6px;
    border-radius: 14px;
    display: flex;
    gap: 4px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
  }
  .period-tabs-hero-exp button {
    border: none;
    background: none;
    padding: 7px 18px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.45);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    letter-spacing: 0.3px;
    white-space: nowrap;
  }
  .period-tabs-hero-exp button:hover {
    color: rgba(255, 255, 255, 0.85);
    background: rgba(255, 255, 255, 0.05);
  }
  .period-tabs-hero-exp button.active {
    background: #0076F5;
    color: white;
    box-shadow: 0 4px 12px rgba(0, 118, 245, 0.35), inset 0 1px 1px rgba(255,255,255,0.15);
  }
  .stat-col-img { display: flex; flex-direction: column; gap: 6px; }
  .stat-col-img label { font-size: 10px; font-weight: 700; color: rgba(255, 255, 255, 0.4); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
  .stat-val-green { font-size: 22px; font-weight: 700; color: #22c55e; letter-spacing: -0.5px; }
  .stat-val-red { font-size: 22px; font-weight: 700; color: #ef4444; letter-spacing: -0.5px; }
  .stat-val-blue { font-size: 22px; font-weight: 700; color: #60A5FA; letter-spacing: -0.5px; }
  .stat-divider-img { width: 1px; height: 32px; background: rgba(255, 255, 255, 0.08); margin: 0 4px; }

  /* AI Chat Drawer */
  .ai-chat-drawer { position: fixed; top: 0; right: -400px; width: 400px; height: 100vh; background: var(--e-modal-bg); border-left: 1px solid var(--e-modal-border); z-index: 3000; display: flex; flex-direction: column; transition: right 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28); box-shadow: -10px 0 50px rgba(0,0,0,0.2); }
  .ai-chat-drawer.open { right: 0; }
  .chat-header { background: linear-gradient(135deg, #7C3AED, #0076F5); padding: 24px; display: flex; justify-content: space-between; align-items: center; color: white; }
  .ch-left { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 16px; }
  .ch-close { background: rgba(255,255,255,0.1); border: none; color: white; padding: 6px; border-radius: 8px; cursor: pointer; }
  .chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
  .chat-bubble { max-width: 85%; padding: 12px 16px; border-radius: 18px; font-size: 14px; font-weight: 500; line-height: 1.5; }
  .chat-bubble.assistant { align-self: flex-start; background: var(--e-card-inner); border: 1px solid var(--e-border); color: var(--e-text-sec); border-bottom-left-radius: 4px; }
  .chat-bubble.user { align-self: flex-end; background: #0076F5; color: white; border-bottom-right-radius: 4px; }
  .chat-bubble.loading { opacity: 0.7; font-style: italic; }
  .chat-input-wrap { padding: 20px; border-top: 1px solid var(--e-border); display: flex; gap: 10px; }
  .chat-input-wrap input { flex: 1; background: var(--e-input-bg); border: 1.5px solid var(--e-input-border); padding: 12px 16px; border-radius: 12px; color: var(--e-input-text); font-weight: 600; outline: none; }
  .chat-send { width: 45px; height: 45px; border-radius: 12px; background: #0076F5; color: white; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
  .chat-send:hover { opacity: 0.9; transform: scale(1.05); }

  /* AI Chat Trigger */
  .ai-chat-trigger { position: fixed; bottom: 40px; right: 40px; width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #7C3AED, #0076F5); color: white; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2500; box-shadow: 0 10px 30px rgba(124, 58, 237, 0.4); transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); }
  .ai-chat-trigger:hover { transform: scale(1.1) rotate(10deg); }
  .pulse-ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid #7C3AED; animation: chatPulse 2s infinite; }
  @keyframes chatPulse { from { transform: scale(1); opacity: 1; } to { transform: scale(1.8); opacity: 0; } }

  /* Voice Overlay */
  .voice-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px); z-index: 5000; display: flex; align-items: center; justify-content: center; color: white; textAlign: center; }
  .voice-content { display: flex; flex-direction: column; align-items: center; gap: 24px; max-width: 400px; text-align: center; }
  .voice-waves { display: flex; gap: 8px; height: 60px; align-items: center; }
  .voice-waves span { width: 6px; height: 20px; background: #0076F5; border-radius: 10px; animation: voiceWave 1s infinite alternate; }
  .voice-waves span:nth-child(2) { animation-delay: 0.2s; height: 40px; background: #7C3AED; }
  .voice-waves span:nth-child(3) { animation-delay: 0.4s; height: 50px; background: #00D1FF; }
  .voice-waves span:nth-child(4) { animation-delay: 0.1s; height: 35px; background: #0076F5; }
  .voice-waves span:nth-child(5) { animation-delay: 0.3s; height: 25px; background: #7C3AED; }
  @keyframes voiceWave { from { height: 10px; opacity: 0.5; } to { height: 50px; opacity: 1; } }
  .voice-content h2 { font-size: 32px; font-weight: 900; margin: 0; }
  .voice-content p { color: #8a99af; font-size: 16px; font-weight: 500; }
  .voice-stop { margin-top: 20px; background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.2); color: white; padding: 12px 32px; border-radius: 100px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 10px; }
  .voice-stop:hover { background: #ef4444; border-color: #ef4444; }


  /* Main Grid */
  .exp-grid { display: grid; grid-template-columns: 1fr 380px; gap: 30px; }

  /* Generic Section */
  .exp-section { background: var(--e-card-bg); backdrop-filter: blur(25px); border: 1.5px solid var(--e-border); border-radius: 24px; padding: 24px; margin-bottom: 24px; transition: all 0.3s ease; box-shadow: var(--e-shadow); }
  .exp-section:hover { border-color: var(--e-border-hover); box-shadow: var(--e-shadow-hover); }
  .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .section-header h2 { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
  .view-all { background: none; border: none; color: #0076F5; font-weight: 700; font-size: 12px; cursor: pointer; margin-left: auto; }

  .icon-purple { color: #7C3AED; } .icon-blue { color: #0076F5; } .icon-green { color: #22c55e; } .icon-gold { color: #fbbf24; } .icon-red { color: #ef4444; }

  /* AI Intelligence Grid */
  .intel-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 16px; }
  .intel-card { background: var(--e-card-inner); border: 1px solid var(--e-border); border-radius: 18px; padding: 20px; display: flex; flex-direction: column; gap: 8px; transition: all 0.3s; }
  .intel-card:hover { border-color: var(--e-border-hover); }
  .ring-card { align-items: center; text-align: center; }
  .ring-wrap { position: relative; width: 120px; height: 120px; margin-bottom: 8px; }
  .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .ring-pct { font-size: 28px; font-weight: 900; }
  .ring-lbl { font-size: 10px; color: var(--e-muted); font-weight: 700; }
  .ring-title { font-size: 12px; font-weight: 700; color: var(--e-text-sec); }
  .ring-desc { font-size: 11px; color: var(--e-muted); }
  .intel-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .intel-label { font-size: 11px; font-weight: 700; color: var(--e-muted); text-transform: uppercase; }
  .intel-value { font-size: 24px; font-weight: 900; }
  .intel-value.red { color: #ef4444; } .intel-value.green { color: #22c55e; }
  .intel-sub { font-size: 11px; color: var(--e-muted); font-weight: 500; }

  /* Category Breakdown */
  .cat-grid { display: grid; grid-template-columns: 220px 1fr; gap: 24px; align-items: center; }
  .cat-chart-wrap { position: relative; }
  .cat-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .cat-total { font-size: 18px; font-weight: 900; }
  .cat-lbl { font-size: 10px; color: var(--e-muted); font-weight: 700; }
  .cat-list { display: flex; flex-direction: column; gap: 10px; }
  .cat-item { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; }
  .cat-dot { width: 10px; height: 10px; border-radius: 50%; }
  .cat-name { flex: 1; color: var(--e-text-sec); }
  .cat-amt { font-weight: 800; }
  .cat-pct { color: var(--e-muted); font-size: 11px; width: 30px; text-align: right; }

  /* Metrics Grid */
  .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .metric-card { background: var(--e-card-inner); border: 1px solid var(--e-border); border-radius: 16px; padding: 18px; }
  .metric-lbl { font-size: 11px; color: var(--e-muted); font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 6px; }
  .metric-val { font-size: 20px; font-weight: 800; }

  /* Passive Income */
  .passive-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 14px; }
  .passive-card { background: var(--e-card-inner); border: 1px solid var(--e-border); border-radius: 16px; padding: 18px; }
  .p-lbl { font-size: 11px; color: var(--e-muted); font-weight: 700; display: block; margin-bottom: 10px; }
  .p-bar-track { height: 8px; background: var(--e-track-bg); border-radius: 10px; overflow: hidden; margin-bottom: 8px; }
  .p-bar-fill { height: 100%; border-radius: 10px; transition: width 1s ease; }
  /* Empty replacement since old css is gone and we don't need these classes */

  /* Transactions */
  .tx-list { display: flex; flex-direction: column; gap: 10px; }
  .tx-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 14px; transition: all 0.2s; }
  .tx-item:hover { background: var(--e-card-inner); }
  .tx-icon-wrap { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .tx-icon-wrap.income { background: rgba(34,197,94,0.1); color: #22c55e; }
  .tx-icon-wrap.expense { background: rgba(239,68,68,0.1); color: #ef4444; }
  .tx-info { flex: 1; }
  .tx-name { display: block; font-size: 13px; font-weight: 700; }
  .tx-meta { font-size: 11px; color: var(--e-muted); }
  .tx-amt { font-size: 14px; font-weight: 800; }
  .tx-amt.income { color: #22c55e; }
  .tx-amt.expense { color: #ef4444; }

  /* Business */
  .biz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .biz-card { background: var(--e-card-inner); border: 1px solid var(--e-border); border-radius: 14px; padding: 16px; }
  .b-lbl { font-size: 10px; color: var(--e-muted); font-weight: 700; display: block; margin-bottom: 4px; text-transform: uppercase; }
  .b-val { font-size: 18px; font-weight: 800; }
  .b-val.green { color: #22c55e; } .b-val.red { color: #ef4444; } .b-val.blue { color: #0076F5; }

  /* Family */
  .fam-member { margin-bottom: 16px; }
  .fam-info { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .fam-name { font-size: 13px; font-weight: 700; }
  .fam-amt { font-size: 13px; font-weight: 800; }
  .fam-bar-track { height: 6px; background: var(--e-track-bg); border-radius: 10px; overflow: hidden; margin-bottom: 4px; }
  .fam-bar-fill { height: 100%; background: #7C3AED; border-radius: 10px; }
  .fam-pct { font-size: 11px; color: var(--e-muted); font-weight: 700; }

  /* Alerts */
  .alerts-list { display: flex; flex-direction: column; gap: 8px; }
  .alert-item { display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 600; padding: 12px; border-radius: 12px; }
  .alert-item.warning { background: rgba(245,158,11,0.08); color: #F59E0B; border: 1px solid rgba(245,158,11,0.15); }
  .alert-item.danger { background: rgba(239,68,68,0.08); color: #ef4444; border: 1px solid rgba(239,68,68,0.15); }
  .alert-item.info { background: rgba(0,118,245,0.08); color: #3B82F6; border: 1px solid rgba(0,118,245,0.1); }

  /* Budget */
  .budget-item { margin-bottom: 16px; }
  .budget-top { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 6px; }
  .budget-name { color: var(--e-text-sec); }
  .budget-bar { height: 6px; background: var(--e-track-bg); border-radius: 10px; overflow: hidden; margin-bottom: 4px; }
  .budget-fill { height: 100%; border-radius: 10px; transition: width 1s ease; }
  .budget-vals { display: flex; justify-content: space-between; font-size: 11px; color: var(--e-muted); font-weight: 600; }

  /* Export */
  .export-btns { display: flex; gap: 10px; }
  .export-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: var(--e-export-bg); border: 1.5px solid var(--e-export-border); color: var(--e-export-color); padding: 12px; border-radius: 12px; font-weight: 700; font-size: 12px; cursor: pointer; transition: all 0.2s; }
  .export-btn:hover { opacity: 0.8; }

  /* ─── PREMIUM MODAL REDESIGN ─── */
  .pm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: pmFadeIn 0.3s ease; }
  @keyframes pmFadeIn { from { opacity: 0; } to { opacity: 1; } }
  
  .pm-card { background: #FFFFFF; width: 100%; max-width: 520px; border-radius: 20px; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.4); animation: pmSlideUp 0.4s cubic-bezier(0.18,0.89,0.32,1.28); display: flex; flex-direction: column; }
  @keyframes pmSlideUp { from { transform: translateY(40px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
  
  /* Gradient Purple/Blue Header */
  .pm-header { background: linear-gradient(135deg, #3b82f6, #7c3aed); padding: 28px 32px; display: flex; justify-content: space-between; align-items: flex-start; position: relative; }
  .pm-header-content { display: flex; align-items: center; gap: 16px; }
  .pm-header-icon { color: white; display: flex; align-items: center; justify-content: center; }
  .pm-header-text { display: flex; flex-direction: column; gap: 2px; }
  .pm-header-sub { font-size: 10px; font-weight: 800; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 1px; }
  .pm-header-title { font-size: 22px; font-weight: 800; color: white; margin: 0; letter-spacing: -0.5px; }
  .pm-close { background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer; transition: 0.2s; padding: 4px; display: flex; align-items: center; justify-content: center; }
  .pm-close:hover { color: white; transform: rotate(90deg); }
  
  /* Modal Body */
  .pm-body { padding: 32px; background: #FFFFFF; color: #0F172A; display: flex; flex-direction: column; }
  
  /* Tabs Area */
  .pm-tabs { display: flex; gap: 0; margin-bottom: 24px; border: 1px solid #E2E8F0; border-radius: 6px; overflow: hidden; width: fit-content; }
  .pm-tab-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: #FFFFFF; border: none; border-right: 1px solid #E2E8F0; color: #475569; font-size: 13px; font-weight: 500; cursor: pointer; transition: 0.2s; }
  .pm-tab-btn:last-child { border-right: none; }
  .pm-tab-btn:hover { background: #F8FAFC; }
  .pm-tab-btn.active { background: #F1F5F9; color: #0F172A; font-weight: 600; }
  .pm-tab-btn svg { width: 14px; height: 14px; opacity: 0.7; }
  
  /* Clean Inputs Grid */
  .pm-form { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 16px; margin-bottom: 32px; }
  .pm-field { display: flex; flex-direction: column; gap: 6px; }
  .pm-field.full { grid-column: 1 / -1; }
  .pm-field label { font-size: 14px; font-weight: 400; color: #334155; }
  
  /* Input Wrapping Styles */
  .pm-input-wrap { display: flex; align-items: center; border: 1.5px solid #0F172A; border-radius: 6px; overflow: hidden; background: #FFFFFF; position: relative; }
  .pm-input-wrap.readonly { background: #F8FAFC; border-color: #E2E8F0; }
  .pm-input-wrap input, .pm-input-wrap select, .pm-input-wrap textarea { flex: 1; border: none; background: transparent; padding: 10px 12px; font-size: 15px; color: #0F172A; outline: none; font-family: inherit; width: 100%; box-sizing: border-box; }
  .pm-input-wrap textarea { resize: vertical; min-height: 44px; }
  
  /* Symbols and Icons inside inputs */
  .pm-symbol { padding: 0 0 0 12px; font-size: 16px; font-weight: 500; color: #0F172A; }
  .pm-icon-right { display: flex; align-items: center; justify-content: center; padding: 0 12px; color: #0F172A; pointer-events: none; }
  .pm-input-wrap select { appearance: none; padding-right: 40px; cursor: pointer; }
  .pm-input-wrap select + .pm-icon-right { position: absolute; right: 0; top: 0; bottom: 0; }
  
  /* Footer Buttons */
  .pm-footer { display: flex; align-items: center; justify-content: flex-start; gap: 12px; }
  .pm-btn-cancel { background: #FFFFFF; border: 1px solid #0F172A; color: #0F172A; padding: 10px 24px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: 0.2s; }
  .pm-btn-cancel:hover { background: #F8FAFC; }
  .pm-btn-save { display: flex; align-items: center; gap: 8px; background: transparent; border: 1px solid #0F172A; color: #0F172A; padding: 10px 24px; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; transition: 0.2s; }
  .pm-btn-save:hover { background: #0F172A; color: #FFFFFF; }


  /* Light-specific ring track */
  .exp-light .ring-wrap circle:first-child { stroke: #E2E8F0; }

  /* Responsive */
  @media (max-width: 1100px) { .exp-grid { grid-template-columns: 1fr; } .intel-grid { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 600px) { .exp-root { padding: 16px; } .exp-hero { padding: 24px; } .hero-top { flex-direction: column; gap: 16px; } .hero-stats { flex-wrap: wrap; gap: 20px; } .intel-grid { grid-template-columns: 1fr; } .cat-grid { grid-template-columns: 1fr; } .metrics-grid { grid-template-columns: 1fr 1fr; } .passive-grid { grid-template-columns: 1fr; } }

  /* Budget Edit Styles */
  .budget-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .budget-actions { display: flex; align-items: center; gap: 8px; }
  .edit-budget-btn { background: none; border: none; padding: 4px; color: rgba(0,0,0,0.2); cursor: pointer; transition: all 0.2s; border-radius: 4px; display: flex; align-items: center; justify-content: center; }
  .edit-budget-btn:hover { color: #0076F5; background: rgba(0,118,245,0.05); }
  .exp-dark .edit-budget-btn { color: rgba(255,255,255,0.2); }
  .exp-dark .edit-budget-btn:hover { color: #60A5FA; background: rgba(255,255,255,0.05); }
  
  .em-title { display: flex; align-items: center; gap: 12px; }
  .em-title h3 { margin: 0; font-size: 18px; font-weight: 800; }
  .em-title p { margin: 0; font-size: 13px; color: var(--e-muted); font-weight: 500; }
  .icon-blue { color: #0076F5; }
`;

export default ExpensesModule;
