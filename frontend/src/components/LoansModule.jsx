import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, ShieldCheck, CheckCircle2, Clock, TrendingUp, Calendar, DollarSign, Plus, X } from 'lucide-react';

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

    // New Loan Form State
    const [newLoan, setNewLoan] = useState({
        type: 'Home Loan',
        lender: '',
        totalAmount: '',
        outstandingBalance: '',
        interestRate: '',
        emi: '',
        tenureTotal: '',
        tenureLeft: '',
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

    const calculateEMI = (p, r, n) => {
        if (!p || !r || !n) return 0;
        const rate = r / 12 / 100;
        return Math.round((p * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1));
    };

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
            console.log('Sending loan data:', payload);
            const response = await axios.post('http://localhost:5000/api/loans', payload);
            console.log('Loan added successfully:', response.data);
            setIsModalOpen(false);
            fetchLoans();
            // Reset form
            setNewLoan({
                type: 'Home Loan',
                lender: '',
                totalAmount: '',
                outstandingBalance: '',
                interestRate: '',
                emi: '',
                tenureTotal: '',
                tenureLeft: '',
                color: '#0076F5'
            });
            alert('Loan added successfully!');
        } catch (err) {
            console.error('Error adding loan:', err);
            const errorMsg = err.response?.data?.message || err.message || 'Failed to add loan';
            alert(`Error: ${errorMsg}\n\nPlease make sure the backend server is running on port 5000.`);
        }
    };


    const emiResult = calculateEMI(calcAmount, calcRate, calcTenure);
    const interestSaved = prepayAmount * 16;
    const tenureReduced = Math.floor(prepayAmount / 2500);

    const principalPaid = 11.04;
    const interestPaidPct = 40;

    if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ width: '100%', padding: '24px', background: '#F6F9FF' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0057FF 0%, #00A3FF 100%)', borderRadius: '24px', padding: '32px', color: 'white', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, opacity: 0.9 }}>TOTAL OUTSTANDING (कुल बकाया राशि)</span>
                            <span style={{ fontSize: '11px', fontWeight: 800, background: dtiRatio > 35 ? 'rgba(255,77,77,0.3)' : 'rgba(25,230,128,0.3)', padding: '4px 12px', borderRadius: '20px' }}>
                                DEBT HEALTH IN {dtiRatio > 35 ? 'CRITICAL' : dtiRatio > 25 ? 'MEDIUM' : 'OPTIMAL'}
                            </span>
                        </div>
                        <div style={{ fontSize: '48px', fontWeight: 800, marginBottom: '20px' }}>₹{totalOutstanding.toLocaleString('en-IN')}</div>
                        <div style={{ display: 'flex', gap: '40px' }}>
                            <div>
                                <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '4px' }}>MONTHLY BURN (EMI)</div>
                                <div style={{ fontSize: '28px', fontWeight: 800 }}>₹{totalEmi.toLocaleString('en-IN')}</div>
                                <div style={{ fontSize: '11px', opacity: 0.7 }}>FROM EMI / LOSS - 25%</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '4px' }}>DEBT HEALTH INDICATOR</div>
                                <div style={{ fontSize: '28px', fontWeight: 800, color: dtiRatio > 35 ? '#FFB3B3' : '#19E680' }}>Optimal</div>
                                <div style={{ fontSize: '11px', opacity: 0.7 }}>DSR ratio: {dtiRatio}% (Sustainable - 35%)</div>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', opacity: 0.8, marginBottom: '8px' }}>NEXT EMI DUE IN</div>
                        <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '1px' }}>
                            {String(timeLeft.days).padStart(2, '0')}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m
                        </div>
                        <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '12px' }}>
                            <div style={{ fontSize: '10px', marginBottom: '4px' }}>Admin Portal</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#FF8A00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>A</div>
                                <span style={{ fontSize: '13px', fontWeight: 700 }}>Admin Portal</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Left Column */}
                <div>
                    {/* Active Loan Portfolios */}
                    <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>ACTIVE LOAN PORTFOLIOS</h3>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <button onClick={() => setIsModalOpen(true)} style={{ background: '#0F172A', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
                                    <Plus size={18} /> Add Loan
                                </button>
                                <button style={{ color: '#0076F5', fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>View All →</button>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {loans.slice(0, 2).map((loan, idx) => {
                                const progress = ((loan.totalAmount - loan.outstandingBalance) / loan.totalAmount) * 100;
                                return (
                                    <div key={idx} style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #EDF2F7' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                            <div>
                                                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>HDFC</div>
                                                <div style={{ fontSize: '16px', fontWeight: 800 }}>{loan.type}</div>
                                                <div style={{ fontSize: '11px', color: '#64748B' }}>{loan.interestRate}</div>
                                            </div>
                                            <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                                                <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
                                                    <circle cx="30" cy="30" r="24" fill="none" stroke="#F1F5F9" strokeWidth="6" />
                                                    <circle cx="30" cy="30" r="24" fill="none" stroke={idx === 0 ? '#0076F5' : '#FF8A00'} strokeWidth="6" strokeDasharray={`${progress * 1.5} 150`} />
                                                </svg>
                                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '14px', fontWeight: 800 }}>{Math.round(progress)}%</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <div>
                                                <div style={{ fontSize: '10px', color: '#94A3B8' }}>Principal Balance</div>
                                                <div style={{ fontSize: '16px', fontWeight: 800 }}>₹{loan.outstandingBalance.toLocaleString('en-IN')}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '10px', color: '#94A3B8' }}>Monthly EMI</div>
                                                <div style={{ fontSize: '16px', fontWeight: 800 }}>₹{loan.emi.toLocaleString('en-IN')}</div>
                                            </div>
                                        </div>
                                        <button style={{ width: '100%', background: '#F8FAFC', border: 'none', padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Manage Portfolio</button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stress Analyzer & Simulator */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #EDF2F7' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                            <ShieldCheck size={18} color="#FF8A00" />
                            <h3 style={{ fontSize: '14px', fontWeight: 800, margin: 0 }}>Stress Analyzer & Simulator</h3>
                        </div>
                        <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '4px' }}>EMI-TO-INCOME RATIO</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '24px', alignItems: 'center' }}>
                            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                                <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                                    <circle cx="60" cy="60" r="50" fill="none" stroke={dtiRatio > 35 ? '#FF4D4D' : '#19E680'} strokeWidth="12" strokeDasharray={`${dtiRatio * 3.14} 314`} />
                                </svg>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 800 }}>{dtiRatio}%</div>
                                    <div style={{ fontSize: '9px', color: '#94A3B8', fontWeight: 700 }}>DTI RATIO</div>
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: dtiRatio > 35 ? '#FF4D4D' : '#19E680', marginBottom: '8px' }}>
                                    CURRENT: {dtiRatio}%
                                </div>
                                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', fontSize: '11px', color: '#64748B', marginBottom: '12px' }}>
                                    Your debt capacity allows for an additional EMI of up to ₹65,000 while remaining in the green zone.
                                </div>
                                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '10px', color: '#94A3B8', marginBottom: '8px' }}>PREPAYMENT SIMULATOR</div>
                                    <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>One-time Prepay:</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '16px', fontWeight: 800 }}>₹</span>
                                        <input type="number" value={prepayAmount} onChange={e => setPrepayAmount(e.target.value)} style={{ border: 'none', background: 'transparent', fontSize: '16px', fontWeight: 800, width: '100%', outline: 'none' }} />
                                    </div>
                                    <div style={{ fontSize: '11px', marginBottom: '4px' }}>
                                        <span style={{ color: '#19E680', fontWeight: 700 }}>✓</span> Tenure Reduced: <strong>{tenureReduced} Months</strong>
                                    </div>
                                    <div style={{ fontSize: '11px' }}>
                                        <span style={{ color: '#19E680', fontWeight: 700 }}>✓</span> Interest Saved: <strong>₹{interestSaved.toLocaleString('en-IN')}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Credit Card EMIs */}
                    <div style={{ marginTop: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>CREDIT CARD EMIS (SHORT TENURE)</h3>
                        <div style={{ background: '#19E680', color: 'white', padding: '12px 20px', borderRadius: '12px', fontSize: '12px', fontWeight: 700, marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                            <CheckCircle2 size={16} /> CREDIT SHIELD ACTIVE
                        </div>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {[{ item: 'Tech Infrastructure Upgrade', desc: 'Amazon Corporate Business Amex • NO-COST EMI', amount: 12500, badge: 'NO-COST EMI' }, { item: 'Office Furniture', desc: 'Merchant: IKEA • SBI Credit Card', amount: 4800, badge: '0% DEAL' }].map((emi, idx) => (
                                <div key={idx} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #EDF2F7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <div style={{ width: '48px', height: '48px', background: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CreditCard size={24} color="#0076F5" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '14px', fontWeight: 800 }}>{emi.item}</div>
                                            <div style={{ fontSize: '11px', color: '#64748B' }}>{emi.desc}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '18px', fontWeight: 800 }}>₹{emi.amount.toLocaleString('en-IN')}mo</div>
                                        <div style={{ fontSize: '10px', background: emi.badge.includes('NO-COST') ? '#E3F5FF' : '#FFE8CC', color: emi.badge.includes('NO-COST') ? '#0076F5' : '#FF8A00', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, display: 'inline-block' }}>{emi.badge}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div>
                    {/* EMI Audit Trail */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #EDF2F7', marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '16px' }}>EMI AUDIT TRAIL</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[{ name: 'Mortgage EMI (HDFC)', amount: 72400, type: 'Pay Now', color: '#0076F5' }, { name: 'Auto-debit', amount: 15000, type: 'Auto-debit', color: '#19E680' }, { name: 'Personal Credit (SBI)', amount: 28500, type: 'Manual', color: '#64748B' }].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#F8FAFC', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></div>
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: 700 }}>{item.name}</div>
                                            <div style={{ fontSize: '10px', color: '#94A3B8' }}>{item.type}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 800 }}>₹{item.amount.toLocaleString('en-IN')}</div>
                                        {idx === 0 && <button style={{ marginTop: '4px', background: '#0076F5', color: 'white', border: 'none', padding: '4px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}>Pay Now</button>}
                                        {idx === 1 && <div style={{ fontSize: '10px', color: '#94A3B8', textAlign: 'right' }}>Schedule</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interest Analytics */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #EDF2F7' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                            <TrendingUp size={18} color="#0076F5" />
                            <h3 style={{ fontSize: '14px', fontWeight: 800, margin: 0 }}>INTEREST ANALYTICS</h3>
                        </div>
                        <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 20px' }}>
                            <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="90" cy="90" r="70" fill="none" stroke="#F1F5F9" strokeWidth="20" />
                                <circle cx="90" cy="90" r="70" fill="none" stroke="#0076F5" strokeWidth="20" strokeDasharray={`${principalPaid * 4.4} 440`} />
                                <circle cx="90" cy="90" r="70" fill="none" stroke="#FF4D4D" strokeWidth="20" strokeDasharray={`${interestPaidPct * 4.4} 440`} strokeDashoffset={`-${principalPaid * 4.4}`} />
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: 800 }}>₹{principalPaid}L</div>
                                <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700 }}>TOTAL PAID</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0076F5' }}></div>
                                <span style={{ fontSize: '12px', flex: 1 }}>Principal Paid (60%)</span>
                                <span style={{ fontWeight: 800 }}>₹{(principalPaid * 0.6).toFixed(2)}L</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF4D4D' }}></div>
                                <span style={{ fontSize: '12px', flex: 1 }}>Interest Paid (BRO) ({interestPaidPct}%)</span>
                                <span style={{ fontWeight: 800, color: '#FF4D4D' }}>₹{(principalPaid * 0.4).toFixed(2)}L</span>
                            </div>
                        </div>
                        <p style={{ fontSize: '10px', color: '#64748B', marginTop: '16px' }}>At current burn, you will pay ₹2.94L (~40%) as interest over the remaining life of all loans.</p>
                    </div>
                </div>
            </div>

            {/* Add Loan Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ width: '100%', maxWidth: '600px', background: 'white', borderRadius: '28px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden', animation: 'modalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Add New Loan</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: '#F8FAFC', border: 'none', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddLoan} style={{ padding: '32px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '8px', display: 'block', letterSpacing: '0.5px' }}>LOAN TYPE</label>
                                    <select value={newLoan.type} onChange={e => setNewLoan({ ...newLoan, type: e.target.value })} style={{ width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, outline: 'none' }} required>
                                        <option>Home Loan</option>
                                        <option>Car Loan</option>
                                        <option>Personal Loan</option>
                                        <option>Education Loan</option>
                                        <option>Business Loan</option>
                                        <option>Gold Loan</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '8px', display: 'block', letterSpacing: '0.5px' }}>LENDER / BANK</label>
                                    <input type="text" placeholder="e.g. HDFC Bank" value={newLoan.lender} onChange={e => setNewLoan({ ...newLoan, lender: e.target.value })} style={{ width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, outline: 'none' }} required />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '8px', display: 'block', letterSpacing: '0.5px' }}>TOTAL LOAN AMOUNT (₹)</label>
                                    <input type="number" placeholder="1000000" value={newLoan.totalAmount} onChange={e => setNewLoan({ ...newLoan, totalAmount: e.target.value })} style={{ width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, outline: 'none' }} required />
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '8px', display: 'block', letterSpacing: '0.5px' }}>CURRENT OUTSTANDING (₹)</label>
                                    <input type="number" placeholder="800000" value={newLoan.outstandingBalance} onChange={e => setNewLoan({ ...newLoan, outstandingBalance: e.target.value })} style={{ width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, outline: 'none' }} required />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '8px', display: 'block', letterSpacing: '0.5px' }}>MONTHLY EMI (₹)</label>
                                    <input type="number" placeholder="25000" value={newLoan.emi} onChange={e => setNewLoan({ ...newLoan, emi: e.target.value })} style={{ width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, outline: 'none' }} required />
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '8px', display: 'block', letterSpacing: '0.5px' }}>INTEREST RATE (%)</label>
                                    <input type="text" placeholder="8.5%" value={newLoan.interestRate} onChange={e => setNewLoan({ ...newLoan, interestRate: e.target.value })} style={{ width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, outline: 'none' }} required />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '8px', display: 'block', letterSpacing: '0.5px' }}>TOTAL TENURE (MONTHS)</label>
                                    <input type="number" placeholder="120" value={newLoan.tenureTotal} onChange={e => setNewLoan({ ...newLoan, tenureTotal: e.target.value })} style={{ width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, outline: 'none' }} required />
                                </div>
                                <div>
                                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '8px', display: 'block', letterSpacing: '0.5px' }}>REMAINING MONTHS</label>
                                    <input type="number" placeholder="96" value={newLoan.tenureLeft} onChange={e => setNewLoan({ ...newLoan, tenureLeft: e.target.value })} style={{ width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, outline: 'none' }} required />
                                </div>
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '18px', background: '#0076F5', color: 'white', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0, 118, 245, 0.2)', transition: 'all 0.2s' }}>
                                <ShieldCheck size={20} />
                                <span>Add Loan Account</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes modalPop {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                button:hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                }
                `
            }} />
        </div>
    );
};

export default LoansModule;
