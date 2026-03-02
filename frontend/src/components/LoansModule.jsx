import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CreditCard, ShieldCheck, CheckCircle2, Clock,
    TrendingUp, Calendar, DollarSign, Plus, X,
    ArrowUpRight, ArrowDownRight, Info, AlertTriangle, Shield, Zap
} from 'lucide-react';

const LoansModule = ({ onPayment, balance }) => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 12, minutes: 30 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calculator states
    const [prepayAmount, setPrepayAmount] = useState(5000);
    const [calcAmount, setCalcAmount] = useState(1000000);
    const [calcRate, setCalcRate] = useState(8.5);
    const [calcTenure, setCalcTenure] = useState(120);

    const [newLoan, setNewLoan] = useState({
        type: 'Home Loan',
        lender: '',
        totalAmount: '',
        outstandingBalance: '',
        interestRate: '',
        emi: '',
        tenureTotal: '',
        tenureLeft: '',
        completionMonth: new Date().getMonth() + 1,
        completionYear: new Date().getFullYear() + 5,
        color: '#0076F5'
    });

    const MONTHLY_INCOME = 150000;

    useEffect(() => {
        fetchLoans();
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes } = prev;
                if (minutes > 0) minutes--;
                else if (hours > 0) { hours--; minutes = 59; }
                else if (days > 0) { days--; hours = 23; minutes = 59; }
                return { days, hours, minutes };
            });
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const fetchLoans = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/loans');
            setLoans(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const totalOutstanding = loans.reduce((acc, curr) => acc + curr.outstandingBalance, 0);
    const totalEmi = loans.reduce((acc, curr) => acc + curr.emi, 0);
    const dtiRatio = Math.round((totalEmi / MONTHLY_INCOME) * 100);

    const handleAddLoan = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...newLoan,
                totalAmount: Number(newLoan.totalAmount),
                outstandingBalance: Number(newLoan.outstandingBalance),
                emi: Number(newLoan.emi),
                tenureTotal: Number(newLoan.tenureTotal),
                tenureLeft: Number(newLoan.tenureLeft)
            };
            await axios.post('http://localhost:5000/api/loans', payload);
            setIsModalOpen(false);
            fetchLoans();
            setNewLoan({
                type: 'Home Loan',
                lender: '', totalAmount: '', outstandingBalance: '',
                interestRate: '', emi: '', tenureTotal: '', tenureLeft: '',
                completionMonth: new Date().getMonth() + 1,
                completionYear: new Date().getFullYear() + 5,
                color: '#0076F5'
            });
        } catch (err) {
            console.error('Error adding loan:', err);
        }
    };

    const tenureReduced = Math.floor(prepayAmount / 2500);
    const interestSaved = prepayAmount * 16;

    if (loading) return <div style={{ padding: '80px', textAlign: 'center', color: '#8a99af' }}>Loading...</div>;

    return (
        <div className="loans-premium-root">
            {/* --- Hero Header --- */}
            <header className="loans-hero">
                <div className="hero-bg-pattern">
                    <div className="glow-orb orb-1"></div>
                    <div className="glow-orb orb-2"></div>
                    <div className="glow-orb orb-3"></div>
                </div>

                <div className="hero-top">
                    <div className="hero-info">
                        <div className="hero-badge">
                            <span className="badge-dot" style={{ backgroundColor: dtiRatio > 35 ? '#ef4444' : '#22c55e' }}></span>
                            DEBT HEALTH: {dtiRatio > 35 ? 'CRITICAL' : dtiRatio > 25 ? 'STRESSED' : 'OPTIMAL'}
                        </div>
                        <h1 className="hero-label">Total Outstanding</h1>
                        <div className="hero-amount">₹{totalOutstanding.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="hero-countdown">
                        <span className="lbl">NEXT EMI DUE IN</span>
                        <div className="timer">
                            {String(timeLeft.days).padStart(2, '0')}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m
                        </div>
                    </div>
                </div>

                <div className="hero-stats">
                    <div className="h-stat">
                        <span className="lbl">Monthly Burn (EMI)</span>
                        <div className="val">₹{totalEmi.toLocaleString('en-IN')}</div>
                        <span className="sub">25% of Monthly Income</span>
                    </div>
                    <div className="divider"></div>
                    <div className="h-stat">
                        <span className="lbl">Debt Health Indicator</span>
                        <div className="val" style={{ color: dtiRatio > 35 ? '#ef4444' : '#22c55e' }}>
                            {dtiRatio < 35 ? 'Sustainable' : 'High Risk'}
                        </div>
                        <span className="sub">DSR ratio: {dtiRatio}% (Target: &lt; 35%)</span>
                    </div>
                </div>
            </header>

            <div className="loans-grid">
                {/* --- Left Column --- */}
                <main className="loans-main">
                    {/* Active Portfolios */}
                    <div className="section-wrap">
                        <div className="section-header">
                            <h2>Active Loan Portfolios</h2>
                            <div className="header-actions">
                                <button className="add-btn" onClick={() => setIsModalOpen(true)}>
                                    <Plus size={16} /> Add Loan Account
                                </button>
                                <button className="view-all">View All</button>
                            </div>
                        </div>
                        <div className="portfolio-grid">
                            {loans.slice(0, 2).map((loan, idx) => {
                                const progress = ((loan.totalAmount - loan.outstandingBalance) / loan.totalAmount) * 100;
                                const color = idx === 0 ? '#0076F5' : '#7C3AED';
                                return (
                                    <div key={loan._id} className="portfolio-card glassy">
                                        <div className="card-top">
                                            <div className="bank-info">
                                                <span className="bank-lbl">HDFC BANK</span>
                                                <h3>{loan.type}</h3>
                                                <div className="rate-badge">{loan.interestRate}% Interest</div>
                                            </div>
                                            <div className="progress-gauge">
                                                <svg width="60" height="60" viewBox="0 0 60 60">
                                                    <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                                                    <circle
                                                        cx="30" cy="30" r="26" fill="none" stroke={color} strokeWidth="4"
                                                        strokeDasharray={`${progress * 1.63} 163`} strokeLinecap="round"
                                                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                                    />
                                                </svg>
                                                <span className="pct">{Math.round(progress)}%</span>
                                            </div>
                                        </div>
                                        <div className="card-mid">
                                            <div className="stat">
                                                <span className="lbl">Principal Balance</span>
                                                <span className="val">₹{loan.outstandingBalance.toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="stat align-right">
                                                <span className="lbl">Monthly EMI</span>
                                                <span className="val primary">₹{loan.emi.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                        <button className="manage-btn">Manage Portfolio</button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stress Analyzer */}
                    <div className="section-wrap">
                        <div className="analyzer-card glassy">
                            <div className="card-header">
                                <ShieldCheck size={20} className="icon-gold" />
                                <h3>Stress Analyzer & Simulator</h3>
                            </div>
                            <div className="analyzer-body">
                                <div className="gauge-wrap">
                                    <div className="big-gauge">
                                        <svg width="140" height="140" viewBox="0 0 140 140">
                                            <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                            <circle
                                                cx="70" cy="70" r="60" fill="none"
                                                stroke={dtiRatio > 35 ? '#ef4444' : '#22c55e'}
                                                strokeWidth="10" strokeDasharray={`${dtiRatio * 3.77} 377`}
                                                strokeLinecap="round"
                                                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                            />
                                        </svg>
                                        <div className="gauge-text">
                                            <span className="pct">{dtiRatio}%</span>
                                            <span className="lbl">DTI RATIO</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="analyzer-details">
                                    <div className="health-note">
                                        <Info size={14} />
                                        <span>Your debt capacity allows for an additional EMI of up to ₹65,000.</span>
                                    </div>
                                    <div className="simulator-box">
                                        <span className="sim-lbl">PREPAYMENT SIMULATOR</span>
                                        <div className="sim-input-row">
                                            <span className="curr">₹</span>
                                            <input
                                                type="number" value={prepayAmount}
                                                onChange={e => setPrepayAmount(e.target.value)}
                                            />
                                        </div>
                                        <div className="sim-results">
                                            <div className="res"><CheckCircle2 size={12} className="green" /> Tenure Reduced: <strong>{tenureReduced} Months</strong></div>
                                            <div className="res"><CheckCircle2 size={12} className="green" /> Interest Saved: <strong>₹{interestSaved.toLocaleString('en-IN')}</strong></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* --- Right Column --- */}
                <aside className="loans-aside">
                    {/* EMI Audit Trail */}
                    <div className="section-wrap">
                        <div className="aside-card glassy">
                            <h3>EMI Audit Trail</h3>
                            <div className="audit-list">
                                {[
                                    { name: 'Mortgage EMI (HDFC)', amount: 72400, type: 'Pay Now', color: '#0076F5' },
                                    { name: 'Auto-debit (Car)', amount: 15000, type: 'Scheduled', color: '#22c55e' },
                                    { name: 'Personal Loan (SBI)', amount: 28500, type: 'Manual', color: '#8a99af' }
                                ].map((item, idx) => (
                                    <div key={idx} className="audit-item">
                                        <div className="item-left">
                                            <span className="dot" style={{ backgroundColor: item.color }}></span>
                                            <div className="info">
                                                <span className="name">{item.name}</span>
                                                <span className="type">{item.type}</span>
                                            </div>
                                        </div>
                                        <div className="item-right">
                                            <span className="amt">₹{item.amount.toLocaleString('en-IN')}</span>
                                            {idx === 0 && <button className="mini-pay-btn">Pay Now</button>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Interest Analytics */}
                    <div className="section-wrap">
                        <div className="aside-card glassy">
                            <div className="card-header">
                                <TrendingUp size={18} className="icon-blue" />
                                <h3>Interest Analytics</h3>
                            </div>
                            <div className="interest-gauge-wrap">
                                <svg width="180" height="180" viewBox="0 0 180 180">
                                    <circle cx="90" cy="90" r="75" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="15" />
                                    <circle
                                        cx="90" cy="90" r="75" fill="none" stroke="#0076F5" strokeWidth="15"
                                        strokeDasharray="280 471" strokeLinecap="round"
                                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                    />
                                    <circle
                                        cx="90" cy="90" r="75" fill="none" stroke="#ef4444" strokeWidth="15"
                                        strokeDasharray="120 471" strokeDashoffset="-280" strokeLinecap="round"
                                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                    />
                                </svg>
                                <div className="gauge-center">
                                    <span className="val">₹11.04L</span>
                                    <span className="lbl">TOTAL PAID</span>
                                </div>
                            </div>
                            <div className="interest-breakdown">
                                <div className="b-item">
                                    <span className="dot blue"></span>
                                    <span className="txt">Principal Paid (60%)</span>
                                    <span className="val">₹6.6L</span>
                                </div>
                                <div className="b-item">
                                    <span className="dot red"></span>
                                    <span className="txt">Interest Paid (40%)</span>
                                    <span className="val red">₹4.4L</span>
                                </div>
                            </div>
                            <p className="insights-note">At current burn, you will pay ₹2.94L as future interest.</p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* --- Modals --- */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content-glassy">
                        <header className="modal-header-premium">
                            <div className="h-left">
                                <div className="icon-box"><ShieldCheck size={20} /></div>
                                <div>
                                    <span className="subtitle">LOAN MANAGEMENT</span>
                                    <h2>Add New Loan Account</h2>
                                </div>
                            </div>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </header>

                        <form className="modal-form" onSubmit={handleAddLoan}>
                            <div className="form-section">
                                <label className="section-title">LENDER DETAILS</label>
                                <div className="form-row">
                                    <div className="input-group">
                                        <label>LENDER / BANK</label>
                                        <input type="text" placeholder="e.g. HDFC Bank" required value={newLoan.lender} onChange={e => setNewLoan({ ...newLoan, lender: e.target.value })} />
                                    </div>
                                    <div className="input-group">
                                        <label>INTEREST RATE (%)</label>
                                        <input type="number" step="0.1" placeholder="8.5" required value={newLoan.interestRate} onChange={e => setNewLoan({ ...newLoan, interestRate: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="input-group">
                                    <label>TOTAL LOAN AMOUNT</label>
                                    <div className="input-with-symbol">
                                        <span className="symbol">₹</span>
                                        <input type="number" placeholder="10,00,000" required value={newLoan.totalAmount} onChange={e => setNewLoan({ ...newLoan, totalAmount: e.target.value })} />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label>MONTHLY EMI</label>
                                    <div className="input-with-symbol">
                                        <span className="symbol green">₹</span>
                                        <input type="number" placeholder="25,000" required value={newLoan.emi} onChange={e => setNewLoan({ ...newLoan, emi: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="loan-type-selector">
                                <label className="section-title">LOAN CATEGORY</label>
                                <div className="pills">
                                    {['Home Loan', 'Car Loan', 'Personal', 'Business'].map(t => (
                                        <button key={t} type="button"
                                            className={newLoan.type === t ? 'active' : ''}
                                            onClick={() => setNewLoan({ ...newLoan, type: t })}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="completion-picker glassy">
                                <div className="picker-header">
                                    <Calendar size={16} />
                                    <span>EXPECTED COMPLETION DATE</span>
                                </div>
                                <div className="picker-row">
                                    <select value={newLoan.completionMonth} onChange={e => setNewLoan({ ...newLoan, completionMonth: Number(e.target.value) })}>
                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                                            <option key={m} value={i + 1}>{m}</option>
                                        ))}
                                    </select>
                                    <select value={newLoan.completionYear} onChange={e => setNewLoan({ ...newLoan, completionYear: Number(e.target.value) })}>
                                        {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() + i).map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="submit-btn-premium">
                                <ShieldCheck size={20} />
                                Add Loan Portfolio
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- Styles --- */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .loans-premium-root {
                    background: #060d19;
                    min-height: 100vh;
                    padding: 30px;
                    color: white;
                    font-family: 'Inter', sans-serif;
                }

                /* Hero Header */
                .loans-hero {
                    background: #0f172a;
                    border-radius: 28px;
                    padding: 40px;
                    margin-bottom: 30px;
                    position: relative;
                    overflow: hidden;
                    border: 2px solid rgba(255,255,255,0.1);
                    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                }
                .hero-bg-pattern { position: absolute; inset: 0; pointer-events: none; }
                .glow-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.2; }
                .orb-1 { top: -20%; left: -10%; width: 300px; height: 300px; background: #0057FF; }
                .orb-2 { bottom: -20%; right: 0; width: 400px; height: 400px; background: #00D1FF; }
                .orb-3 { top: 30%; right: 30%; width: 200px; height: 200px; background: #7C3AED; }

                .hero-top { display: flex; justify-content: space-between; align-items: flex-start; position: relative; z-index: 1; }
                .hero-badge { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 800; background: rgba(255,255,255,0.05); padding: 6px 14px; border-radius: 100px; border: 1.5px solid rgba(255,255,255,0.12); margin-bottom: 12px; }
                .badge-dot { width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 10px currentColor; }
                .hero-label { font-size: 14px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
                .hero-amount { font-size: 48px; font-weight: 900; margin-top: 5px; }
                
                .hero-countdown { text-align: right; }
                .hero-countdown .lbl { font-size: 11px; opacity: 0.5; font-weight: 700; display: block; margin-bottom: 8px; }
                .hero-countdown .timer { font-size: 20px; font-weight: 800; background: rgba(255,255,255,0.05); padding: 10px 20px; border-radius: 12px; border: 1.5px solid rgba(255,255,255,0.12); }

                .hero-stats { display: flex; gap: 60px; margin-top: 40px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 30px; position: relative; z-index: 1; }
                .h-stat .lbl { font-size: 11px; opacity: 0.5; font-weight: 600; text-transform: uppercase; }
                .h-stat .val { font-size: 26px; font-weight: 800; margin: 4px 0; }
                .h-stat .sub { font-size: 12px; opacity: 0.4; }
                .divider { width: 1px; background: rgba(255,255,255,0.05); }

                /* Layout Grids */
                .loans-grid { display: grid; grid-template-columns: 1fr 340px; gap: 30px; }
                .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .section-header h2 { font-size: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
                .header-actions { display: flex; gap: 15px; align-items: center; }
                
                .add-btn { background: #0f172a; color: white; border: 1.5px solid rgba(255,255,255,0.12); padding: 10px 18px; border-radius: 12px; font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
                .add-btn:hover { background: #1e293b; transform: translateY(-1px); }
                .view-all { background: none; border: none; color: #0076F5; font-weight: 700; font-size: 13px; cursor: pointer; }

                /* Card Styles */
                .glassy { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(25px); border: 1.5px solid rgba(255, 255, 255, 0.1); border-radius: 24px; transition: all 0.3s ease; }
                .glassy:hover { border-color: rgba(255,255,255,0.15); box-shadow: 0 10px 40px rgba(0,0,0,0.2); }

                .portfolio-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .portfolio-card { padding: 24px; }
                .portfolio-card .card-top { display: flex; justify-content: space-between; align-items: flex-start; }
                .bank-lbl { font-size: 10px; color: #8a99af; font-weight: 700; letter-spacing: 1px; }
                .portfolio-card h3 { font-size: 18px; font-weight: 800; margin: 5px 0; }
                .rate-badge { font-size: 11px; background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 6px; display: inline-block; color: #8a99af; font-weight: 600; }
                
                .progress-gauge { position: relative; display: flex; align-items: center; justify-content: center; }
                .progress-gauge .pct { position: absolute; font-size: 14px; font-weight: 800; }
                
                .card-mid { display: flex; justify-content: space-between; margin: 24px 0; }
                .stat { display: flex; flex-direction: column; gap: 4px; }
                .stat .lbl { font-size: 11px; color: #8a99af; font-weight: 600; }
                .stat .val { font-size: 18px; font-weight: 800; }
                .stat .val.primary { color: #0076F5; }
                .manage-btn { width: 100%; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1.5px solid rgba(255,255,255,0.1); color: white; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; }
                .manage-btn:hover { background: rgba(255,255,255,0.08); }

                /* Stress Analyzer */
                .analyzer-card { padding: 24px; }
                .analyzer-card h3 { font-size: 15px; font-weight: 800; margin: 0; }
                .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
                .analyzer-body { display: flex; gap: 40px; align-items: center; }
                
                .big-gauge { position: relative; width: 140px; height: 140px; display: flex; align-items: center; justify-content: center; }
                .gauge-text { position: absolute; text-align: center; }
                .gauge-text .pct { font-size: 32px; font-weight: 900; display: block; }
                .gauge-text .lbl { font-size: 10px; color: #8a99af; font-weight: 800; margin-top: -2px; }

                .analyzer-details { flex: 1; }
                .health-note { display: flex; align-items: center; gap: 10px; background: rgba(34, 197, 94, 0.05); padding: 12px 16px; border-radius: 14px; border: 1.5px solid rgba(34, 197, 94, 0.15); color: #22c55e; font-size: 13px; font-weight: 500; margin-bottom: 20px; }
                .simulator-box { background: rgba(0,0,0,0.15); padding: 20px; border-radius: 18px; border: 1.5px solid rgba(255,255,255,0.08); }
                .sim-lbl { font-size: 10px; font-weight: 800; color: #8a99af; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 12px; }
                .sim-input-row { display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 15px; }
                .sim-input-row .curr { font-size: 20px; font-weight: 800; color: #8a99af; }
                .sim-input-row input { background: none; border: none; font-size: 20px; font-weight: 800; color: white; outline: none; width: 100%; }
                .sim-results { display: flex; flex-direction: column; gap: 8px; }
                .sim-results .res { font-size: 12px; display: flex; align-items: center; gap: 8px; font-weight: 500; opacity: 0.8; }
                .sim-results .green { color: #22c55e; }

                /* Aside Sections */
                .aside-card { padding: 24px; }
                .aside-card h3 { font-size: 14px; font-weight: 800; text-transform: uppercase; margin: 0 0 20px 0; }
                .audit-list { display: flex; flex-direction: column; gap: 12px; }
                .audit-item { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); padding: 14px; border-radius: 16px; border: 1.5px solid rgba(255,255,255,0.08); }
                .item-left { display: flex; align-items: center; gap: 12px; }
                .item-left .dot { width: 8px; height: 8px; border-radius: 50%; }
                .item-left .name { display: block; font-size: 13px; font-weight: 700; color: #f1f5f9; }
                .item-left .type { font-size: 11px; color: #8a99af; }
                .item-right { text-align: right; }
                .item-right .amt { font-size: 14px; font-weight: 800; display: block; }
                .mini-pay-btn { margin-top: 6px; background: #0076F5; color: white; border: none; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; cursor: pointer; }

                .interest-gauge-wrap { position: relative; display: flex; justify-content: center; margin: 10px 0; }
                .gauge-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
                .gauge-center .val { font-size: 24px; font-weight: 900; display: block; }
                .gauge-center .lbl { font-size: 9px; color: #8a99af; font-weight: 800; }

                .interest-breakdown { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
                .b-item { display: flex; align-items: center; gap: 10px; font-size: 12px; }
                .b-item .dot { width: 8px; height: 8px; border-radius: 50%; }
                .b-item .dot.blue { background: #0076F5; box-shadow: 0 0 8px #0076F5; }
                .b-item .dot.red { background: #ef4444; box-shadow: 0 0 8px #ef4444; }
                .b-item .txt { flex: 1; color: #8a99af; font-weight: 500; }
                .b-item .val { font-weight: 800; }
                .b-item .val.red { color: #ef4444; }
                .insights-note { font-size: 11px; color: #8a99af; margin-top: 15px; text-align: center; font-style: italic; opacity: 0.7; }

                /* Modal Styling */
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; }
                .modal-content-glassy { background: #0f172a; border: 2px solid rgba(255,255,255,0.12); border-radius: 32px; width: 100%; max-width: 600px; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.6); animation: slideUp 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28); }
                @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                
                .modal-header-premium { background: linear-gradient(135deg, #0057FF, #00A3FF); padding: 25px 30px; display: flex; justify-content: space-between; align-items: center; }
                .h-left { display: flex; align-items: center; gap: 15px; }
                .icon-box { background: rgba(255,255,255,0.2); width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); }
                .subtitle { font-size: 10px; font-weight: 800; opacity: 0.7; letter-spacing: 1px; }
                .modal-header-premium h2 { margin: 2px 0 0 0; font-size: 20px; font-weight: 800; }
                .close-btn { background: none; border: none; color: white; cursor: pointer; opacity: 0.6; }
                .close-btn:hover { opacity: 1; }

                .modal-form { padding: 30px; }
                .form-section { margin-bottom: 25px; }
                .section-title { font-size: 11px; font-weight: 800; color: #8a99af; letter-spacing: 1px; display: block; margin-bottom: 15px; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
                .input-group label { font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 8px; display: block; }
                .input-group input, .input-group select { background: rgba(255,255,255,0.03); border: 1.5px solid rgba(255,255,255,0.1); padding: 12px 16px; border-radius: 12px; color: white; font-weight: 600; width: 100%; outline: none; box-sizing: border-box; transition: all 0.2s; }
                .input-group input:focus { border-color: #0076F5; background: rgba(255,255,255,0.06); }
                
                .input-with-symbol { position: relative; }
                .input-with-symbol .symbol { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-weight: 800; color: #0076F5; }
                .input-with-symbol input { padding-left: 32px; }

                .loan-type-selector { margin-bottom: 25px; }
                .pills { display: flex; gap: 8px; flex-wrap: wrap; }
                .pills button { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #8a99af; padding: 6px 14px; border-radius: 100px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
                .pills button.active { background: #0076F5; color: white; border-color: #0076F5; }

                .completion-picker { padding: 20px; margin-bottom: 30px; }
                .picker-header { display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 800; color: #0076F5; margin-bottom: 15px; }
                .picker-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

                .submit-btn-premium { width: 100%; background: linear-gradient(135deg, #0057FF, #0084FF); color: white; border: none; padding: 16px; border-radius: 16px; font-weight: 800; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; box-shadow: 0 10px 25px rgba(0, 87, 255, 0.3); transition: all 0.3s; }
                .submit-btn-premium:hover { transform: translateY(-2px); box-shadow: 0 15px 35px rgba(0, 87, 255, 0.4); }

                .icon-gold { color: #fbbf24; }
                .icon-blue { color: #0076F5; }
                .icon-green { color: #22c55e; }
                .icon-purple { color: #7C3AED; }
                .icon-red { color: #ef4444; }

                /* Responsiveness */
                @media (max-width: 1024px) {
                    .loans-grid { grid-template-columns: 1fr; }
                    .loans-aside { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
                }
                @media (max-width: 768px) {
                    .portfolio-grid { grid-template-columns: 1fr; }
                    .loans-aside { grid-template-columns: 1fr; }
                    .hero-stats { gap: 20px; flex-direction: column; }
                    .hero-top { flex-direction: column; gap: 20px; }
                    .hero-countdown { text-align: left; }
                }
            `}} />
        </div>
    );
};

export default LoansModule;
