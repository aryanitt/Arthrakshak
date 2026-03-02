import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, Plus, CreditCard, Shield, TrendingUp, Calendar, Zap, Wifi, ShoppingBag,
  Coffee, Car, Play, Eye, EyeOff, AlertCircle, ChevronRight, ChevronLeft,
  Gift, Percent, Clock, Lock, ShieldCheck, PieChart, BarChart2, Info, Bell, Tag, X
} from 'lucide-react';
import { PieChart as RePie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CreditCardsModule = ({ onBack }) => {
  // --- States ---
  const [cards, setCards] = useState([
    {
      id: 1,
      holder: 'ARYAN SHARMA',
      number: '4582842100449912',
      expiry: '08/29',
      cvv: '123',
      bank: 'ARTH PREMIUM',
      type: 'Black-Gold',
      limit: 500000,
      used: 210000,
      billingDate: 15,
      dueDate: 5,
      points: 1245,
      cashback: 780,
      network: 'Mastercard'
    },
    {
      id: 2,
      holder: 'ARYAN SHARMA',
      number: '5241993344558877',
      expiry: '12/27',
      cvv: '998',
      bank: 'HDFC REGALIA',
      type: 'Blue-Purple',
      limit: 200000,
      used: 45000,
      billingDate: 20,
      dueDate: 10,
      points: 8500,
      cashback: 420,
      network: 'Visa'
    }
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showSensitive, setShowSensitive] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    holder: '',
    number: '',
    expiry: '',
    cvv: '',
    bank: '',
    type: 'Black-Gold',
    limit: '',
    billingDate: '',
    dueDate: '',
    network: 'Visa'
  });

  const activeCard = cards[activeIndex];

  // --- Calculations ---
  const utilization = useMemo(() => {
    if (!activeCard) return 0;
    return Math.round((activeCard.used / activeCard.limit) * 100);
  }, [activeCard]);

  const daysLeft = useMemo(() => {
    if (!activeCard) return 0;
    const now = new Date();
    const currMonth = now.getMonth();
    const currYear = now.getFullYear();
    let due = new Date(currYear, currMonth, activeCard.dueDate);

    if (now > due) {
      due = new Date(currYear, currMonth + 1, activeCard.dueDate);
    }

    const diff = due.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [activeCard]);

  const utilizationColor = utilization < 30 ? '#22c55e' : utilization < 50 ? '#f59e0b' : '#ef4444';

  // --- Handlers ---
  const handleAddCard = (e) => {
    e.preventDefault();
    const cardToAdd = {
      ...newCard,
      id: Date.now(),
      used: 0,
      points: 0,
      cashback: 0,
      limit: Number(newCard.limit),
      billingDate: Number(newCard.billingDate),
      dueDate: Number(newCard.dueDate)
    };
    setCards([...cards, cardToAdd]);
    setIsAddModalOpen(false);
    setNewCard({
      holder: '', number: '', expiry: '', cvv: '', bank: '',
      type: 'Black-Gold', limit: '', billingDate: '', dueDate: '', network: 'Visa'
    });
    setActiveIndex(cards.length); // Switch to the new card
  };

  const formatCardNumber = (num, mask = true) => {
    if (!num) return '**** **** **** ****';
    const clean = num.replace(/\s/g, '');
    if (mask && !showSensitive) {
      return `**** **** **** ${clean.slice(-4)}`;
    }
    return clean.replace(/(\d{4})/g, '$1 ').trim();
  };

  const nextCard = () => setActiveIndex((prev) => (prev + 1) % cards.length);
  const prevCard = () => setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);

  // --- Mock Data for UI ---
  const spendingData = [
    { name: 'Food', value: 4500, color: '#FF6B6B' },
    { name: 'Travel', value: 3200, color: '#4ECDC4' },
    { name: 'Shopping', value: 12000, color: '#45B7D1' },
    { name: 'Bills', value: 8500, color: '#96CEB4' },
    { name: 'Others', value: 2100, color: '#FFEEAD' }
  ];

  const recentTransactions = [
    { id: 1, merchant: 'Apple Store', category: 'Shopping', date: 'Mar 01', amount: 12999, status: 'Completed', icon: <ShoppingBag size={16} /> },
    { id: 2, merchant: 'Uber India', category: 'Travel', date: 'Feb 28', amount: 450, status: 'Completed', icon: <Car size={16} /> },
    { id: 3, merchant: 'Zomato', category: 'Food', date: 'Feb 28', amount: 890, status: 'Completed', icon: <Coffee size={16} /> },
    { id: 4, merchant: 'Netflix', category: 'Bills', date: 'Feb 25', amount: 499, status: 'Completed', icon: <Play size={16} /> },
    { id: 5, merchant: 'Amazon', category: 'Shopping', date: 'Feb 24', amount: 2450, status: 'Pending', icon: <ShoppingBag size={16} /> }
  ];

  return (
    <div className="cc-premium-root">
      {/* --- Page Header --- */}
      <header className="cc-header">
        <div className="cc-header-left">
          <button className="cc-back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="cc-title">My Credit Cards</h1>
            <p className="cc-subtitle">Manage and track all your cards in one place</p>
          </div>
        </div>
        <button className="cc-add-btn" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} />
          <span>Add New Card</span>
        </button>
      </header>

      <div className="cc-main-layout">
        {/* --- Left Column: Carousel & Overview --- */}
        <section className="cc-left-col">
          {/* horizontal carousel */}
          <div className="cc-carousel-wrapper">
            <button className="carousel-nav-btn prev" onClick={prevCard}><ChevronLeft /></button>
            <div className="cc-carousel">
              {cards.map((card, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <div
                    key={card.id}
                    className={`cc-realistic-card ${card.type.toLowerCase()} ${isSelected ? 'active' : 'inactive'}`}
                    style={{
                      transform: `translateX(${(idx - activeIndex) * 102}%) scale(${isSelected ? 1 : 0.85})`,
                      zIndex: isSelected ? 10 : 5
                    }}
                  >
                    <div className="card-inner">
                      <div className="card-glass-reflection"></div>
                      <div className="card-top">
                        <div className="bank-name">{card.bank || 'YOUR BANK'}</div>
                        <div className="nfc-icon"><Wifi size={20} /></div>
                      </div>
                      <div className="card-chip">
                        <div className="chip-line"></div>
                        <div className="chip-line"></div>
                        <div className="chip-line"></div>
                      </div>
                      <div className="card-number-wrapper">
                        {formatCardNumber(card.number)}
                      </div>
                      <div className="card-bottom">
                        <div className="card-holder">
                          <span className="lbl">CARD HOLDER</span>
                          <span className="val">{card.holder || 'HOLDER NAME'}</span>
                        </div>
                        <div className="card-expiry">
                          <span className="lbl">EXPIRES</span>
                          <span className="val">{card.expiry || 'MM/YY'}</span>
                        </div>
                        <div className="card-network">
                          {card.network === 'Visa' ? <div className="visa-logo">VISA</div> : <div className="mc-logo"><div className="c1"></div><div className="c2"></div></div>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="carousel-nav-btn next" onClick={nextCard}><ChevronRight /></button>
          </div>

          {/* Credit Overview */}
          <div className="cc-section overview-card">
            <div className="section-header">
              <div className="label-with-icon">
                <TrendingUp size={18} className="icon-blue" />
                <h3>Credit Overview</h3>
              </div>
              <div className="utilization-badge" style={{ color: utilizationColor, background: `${utilizationColor}15` }}>
                {utilization}% Used
              </div>
            </div>
            <div className="overview-stats">
              <div className="stat-box">
                <span className="lbl">Credit Limit</span>
                <span className="val">₹{activeCard.limit.toLocaleString()}</span>
              </div>
              <div className="stat-box underline-primary">
                <span className="lbl">Used Amount</span>
                <span className="val color-red">₹{activeCard.used.toLocaleString()}</span>
              </div>
              <div className="stat-box border-l">
                <span className="lbl">Available Credit</span>
                <span className="val color-green">₹{(activeCard.limit - activeCard.used).toLocaleString()}</span>
              </div>
            </div>
            <div className="progress-container">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${utilization}%`, background: utilizationColor }}></div>
              </div>
            </div>
          </div>

          {/* Billing & Due */}
          <div className="cc-section billing-card">
            <div className="billing-main">
              <div className="billing-info">
                <div className="bil-row">
                  <div className="bil-item">
                    <span className="lbl">Total Outstanding</span>
                    <span className="val-lg">₹{activeCard.used.toLocaleString()}</span>
                  </div>
                  <div className="bil-item border-l">
                    <span className="lbl">Minimum Due</span>
                    <span className="val-md">₹{Math.round(activeCard.used * 0.05).toLocaleString()}</span>
                  </div>
                </div>
                <div className="bil-dates">
                  <div className="date-box">
                    <Clock size={14} />
                    <span>Billing: {activeCard.billingDate}th of month</span>
                  </div>
                  <div className={`date-box ${daysLeft <= 5 ? 'warning' : ''}`}>
                    <Calendar size={14} />
                    <span>Due: {activeCard.dueDate}th ({daysLeft} days left) {daysLeft <= 5 && '⚠️'}</span>
                  </div>
                </div>
              </div>
              <button className="bil-reminder-btn">
                <Bell size={16} />
                Set Reminder
              </button>
            </div>
          </div>

          {/* Rewards & Spending Analytics */}
          <div className="cc-double-section">
            <div className="cc-section rewards-card">
              <div className="section-header">
                <div className="label-with-icon">
                  <Gift size={18} className="icon-gold" />
                  <h3>Rewards & Benefits</h3>
                </div>
              </div>
              <div className="rewards-content">
                <div className="reward-stat">
                  <span className="val">{activeCard.points.toLocaleString()}</span>
                  <span className="lbl">Points Earned</span>
                </div>
                <div className="divider"></div>
                <div className="reward-stat">
                  <span className="val">₹{activeCard.cashback.toLocaleString()}</span>
                  <span className="lbl">Monthly Cashback</span>
                </div>
              </div>
              <div className="milestone-box">
                <div className="miles-label">
                  <span>Milestone Progress</span>
                  <span>80%</span>
                </div>
                <div className="miles-track">
                  <div className="miles-fill" style={{ width: '80%' }}></div>
                </div>
                <p className="miles-note">₹20,000 more for ₹2,000 Voucher</p>
              </div>
            </div>

            <div className="cc-section analytics-card">
              <div className="section-header">
                <h3>Spending Analytics</h3>
                <PieChart size={16} className="icon-muted" />
              </div>
              <div className="analytics-body">
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={120}>
                    <RePie data={spendingData} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value">
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RePie>
                  </ResponsiveContainer>
                </div>
                <div className="chart-legend">
                  {spendingData.slice(0, 3).map(item => (
                    <div key={item.name} className="legend-item">
                      <span className="dot" style={{ background: item.color }}></span>
                      <span className="txt">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Right Column: Transactions, EMI, Security --- */}
        <aside className="cc-right-col">
          {/* Security Features */}
          <div className="cc-section security-card">
            <div className="section-header">
              <div className="label-with-icon">
                <ShieldCheck size={18} className="icon-green" />
                <h3>Security & Privacy</h3>
              </div>
              <div className="encrypted-tag"><Lock size={10} /> Encrypted</div>
            </div>
            <div className="security-controls">
              <div className="sec-item">
                <div className="sec-info">
                  <span className="title">Hide Sensitive Info</span>
                  <span className="desc">Mask card numbers and CVV</span>
                </div>
                <button className={`sec-toggle ${showSensitive ? 'off' : 'on'}`} onClick={() => setShowSensitive(!showSensitive)}>
                  <div className="knob"></div>
                </button>
              </div>
              <div className="sec-item">
                <div className="sec-info">
                  <span className="title">Face ID / PIN Lock</span>
                  <span className="desc">Require auth to open page</span>
                </div>
                <button className="sec-toggle on">
                  <div className="knob"></div>
                </button>
              </div>
            </div>
          </div>

          {/* EMI Tracker */}
          <div className="cc-section emi-card">
            <div className="section-header">
              <div className="label-with-icon">
                <Percent size={18} className="icon-purple" />
                <h3>Active EMIs</h3>
              </div>
              <button className="emi-convert-btn">Convert to EMI</button>
            </div>
            <div className="emi-list">
              <div className="emi-item">
                <div className="emi-top">
                  <span className="emi-merchant">iPhone 15 Pro Purchase</span>
                  <span className="emi-amount">₹8,499/mo</span>
                </div>
                <div className="emi-progress">
                  <div className="emi-bar"><div className="fill" style={{ width: '40%' }}></div></div>
                  <span className="emi-tenure">6/12 Left</span>
                </div>
                <div className="emi-details">
                  <span>Total Interest: ₹3,240</span>
                  <span>Next: Mar 15</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="cc-section transactions-card">
            <div className="section-header">
              <h3>Recent Transactions</h3>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="tx-list">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="tx-item">
                  <div className={`tx-icon-wrap ${tx.category.toLowerCase()}`}>
                    {tx.icon}
                  </div>
                  <div className="tx-info">
                    <span className="tx-merchant">{tx.merchant}</span>
                    <span className="tx-meta">{tx.date} • {tx.category}</span>
                  </div>
                  <div className="tx-amount-side">
                    <span className="tx-val">-₹{tx.amount.toLocaleString()}</span>
                    <span className={`tx-status ${tx.status.toLowerCase()}`}>{tx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Alerts */}
          <div className="cc-section alerts-card">
            <div className="section-header">
              <div className="label-with-icon">
                <Bell size={18} className="icon-red" />
                <h3>Smart Alerts</h3>
              </div>
            </div>
            <div className="alerts-list">
              <div className="alert-item warning">
                <AlertCircle size={14} />
                <span>Your credit utilization is high (42%)</span>
              </div>
              <div className="alert-item info">
                <Zap size={14} />
                <span>5,200 points expiring in 15 days</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* --- Add New Card Modal --- */}
      {isAddModalOpen && (
        <div className="cc-modal-overlay">
          <div className="cc-modal-v2">
            <header className="cc-modal-header-v2">
              <div className="h-left">
                <div className="icon-box"><ShieldCheck size={20} /></div>
                <div>
                  <span className="subtitle">CREDIT MANAGEMENT</span>
                  <h2>Add New Credit Card</h2>
                </div>
              </div>
              <button className="close-btn-v2" onClick={() => setIsAddModalOpen(false)}><X size={20} /></button>
            </header>

            <div className="cc-modal-body-v2">
              {/* Preview Side */}
              <div className="cc-preview-side-v2">
                <div className="preview-glow"></div>
                <div className={`cc-realistic-card ${newCard.type.toLowerCase()} preview-mode-v2`}>
                  <div className="card-inner">
                    <div className="card-glass-reflection"></div>
                    <div className="card-top">
                      <div className="bank-name">{newCard.bank || 'BANK NAME'}</div>
                      <div className="nfc-icon"><Wifi size={20} /></div>
                    </div>
                    <div className="card-chip">
                      <div className="chip-line"></div>
                      <div className="chip-line"></div>
                      <div className="chip-line"></div>
                    </div>
                    <div className="card-number-wrapper">
                      {formatCardNumber(newCard.number, false)}
                    </div>
                    <div className="card-bottom">
                      <div className="card-holder">
                        <span className="lbl">CARD HOLDER</span>
                        <span className="val">{newCard.holder || 'HOLDER NAME'}</span>
                      </div>
                      <div className="card-expiry">
                        <span className="lbl">EXPIRES</span>
                        <span className="val">{newCard.expiry || 'MM/YY'}</span>
                      </div>
                      <div className="card-network">
                        {newCard.network === 'Visa' ? <div className="visa-logo">VISA</div> : <div className="mc-logo"><div className="c1"></div><div className="c2"></div></div>}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="preview-subtext">Live preview updates in real-time</p>
              </div>

              {/* Form Side */}
              <form className="cc-add-form-v2" onSubmit={handleAddCard}>
                <div className="form-section-v2">
                  <label>CARD HOLDER NAME</label>
                  <div className="input-wrap-v2">
                    <input
                      type="text" required maxLength={24} placeholder="FULL NAME"
                      value={newCard.holder}
                      onChange={e => setNewCard({ ...newCard, holder: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>

                <div className="form-section-v2">
                  <label>CARD NUMBER</label>
                  <div className="input-wrap-v2">
                    <input
                      type="text" required maxLength={16} placeholder="XXXX XXXX XXXX XXXX"
                      value={newCard.number}
                      onChange={e => setNewCard({ ...newCard, number: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                </div>

                <div className="form-row-v2">
                  <div className="form-section-v2">
                    <label>EXPIRY DATE</label>
                    <div className="input-wrap-v2">
                      <input
                        type="text" required placeholder="MM/YY" maxLength={5}
                        value={newCard.expiry} onChange={e => setNewCard({ ...newCard, expiry: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-section-v2">
                    <label>CVV</label>
                    <div className="input-wrap-v2">
                      <input
                        type="password" required placeholder="***" maxLength={3}
                        value={newCard.cvv}
                        onChange={e => setNewCard({ ...newCard, cvv: e.target.value.replace(/\D/g, '') })}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section-v2">
                  <label>BANK NAME</label>
                  <div className="input-wrap-v2">
                    <input
                      type="text" required placeholder="Example: HDFC, ICICI..."
                      value={newCard.bank} onChange={e => setNewCard({ ...newCard, bank: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row-v2">
                  <div className="form-section-v2">
                    <label>CREDIT LIMIT</label>
                    <div className="input-wrap-v2 with-symbol">
                      <span className="sym">₹</span>
                      <input
                        type="number" required placeholder="50,000"
                        value={newCard.limit} onChange={e => setNewCard({ ...newCard, limit: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-section-v2">
                    <label>NETWORK</label>
                    <div className="input-wrap-v2">
                      <select value={newCard.network} onChange={e => setNewCard({ ...newCard, network: e.target.value })}>
                        <option>Visa</option>
                        <option>Mastercard</option>
                        <option>RuPay</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="theme-picker-section">
                  <label>CARD THEME</label>
                  <div className="theme-dots-v2">
                    {['Black-Gold', 'Blue-Purple', 'Platinum-Silver', 'Emerald', 'Matte-Black'].map(t => (
                      <button
                        key={t} type="button"
                        className={`theme-btn-v2 ${t.toLowerCase()} ${newCard.type === t ? 'active' : ''}`}
                        onClick={() => setNewCard({ ...newCard, type: t })}
                      />
                    ))}
                  </div>
                </div>

                <div className="form-row-v2">
                  <div className="form-section-v2">
                    <label>BILLING DATE</label>
                    <div className="input-wrap-v2">
                      <input
                        type="number" min={1} max={31} required placeholder="1-31"
                        value={newCard.billingDate} onChange={e => setNewCard({ ...newCard, billingDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-section-v2">
                    <label>DUE DATE</label>
                    <div className="input-wrap-v2">
                      <input
                        type="number" min={1} max={31} required placeholder="1-31"
                        value={newCard.dueDate} onChange={e => setNewCard({ ...newCard, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="cc-modal-actions-v2">
                  <button type="button" className="cc-btn-cancel-v2" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                  <button type="submit" className="cc-btn-save-v2">Add Premium Card</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- Page Styles --- */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .cc-premium-root {
          padding: 30px;
          min-height: 100vh;
          background: #060d19; /* Deeper midnight blue */
          color: white;
          font-family: 'Inter', sans-serif;
        }

        /* Header */
        .cc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        .cc-header-left { display: flex; align-items: center; gap: 20px; }
        .cc-back-btn {
          background: rgba(255,255,255,0.05);
          border: 1.5px solid rgba(255,255,255,0.12);
          color: white;
          padding: 10px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cc-back-btn:hover { background: rgba(255,255,255,0.1); transform: translateX(-2px); }
        .cc-title { font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
        .cc-subtitle { font-size: 14px; color: #8a99af; margin-top: 4px; }
        .cc-add-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #0076F5;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(0, 118, 245, 0.2);
          transition: all 0.3s;
        }
        .cc-add-btn:hover { background: #0066ff; transform: translateY(-2px); box-shadow: 0 15px 30px rgba(0, 118, 245, 0.3); }

        /* Layout */
        .cc-main-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 30px;
        }

        /* Generic Section Card */
        .cc-section {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(25px);
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 24px;
          margin-bottom: 24px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .cc-section:hover { border-color: rgba(255,255,255,0.15); box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .section-header h3 { font-size: 16px; font-weight: 700; }
        .label-with-icon { display: flex; align-items: center; gap: 10px; }

        /* Carousel */
        .cc-carousel-wrapper {
          position: relative;
          height: 280px;
          margin-bottom: 30px;
          perspective: 1000px;
        }
        .cc-carousel {
          position: relative;
          width: 440px;
          height: 100%;
          margin: 0 auto;
        }
        .cc-realistic-card {
          position: absolute;
          width: 440px;
          aspect-ratio: 1.586/1;
          border-radius: 22px;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          z-index: 1;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .cc-realistic-card.active { z-index: 10; opacity: 1; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .cc-realistic-card.inactive { opacity: 0.4; z-index: 5; filter: blur(2px); transform: scale(0.85); }
        .carousel-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          width: 40px; height: 40px;
          border-radius: 100px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 20; transition: all 0.2s;
        }
        .carousel-nav-btn:hover { background: rgba(255,255,255,0.15); transform: translateY(-50%) scale(1.1); }
        .carousel-nav-btn.prev { left: 40px; }
        .carousel-nav-btn.next { right: 40px; }

        /* Card Themes */
        .card-inner {
          width: 100%; height: 100%;
          padding: 22px 28px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.15);
        }
        .card-glass-reflection {
          position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
          transform: skewX(-20deg);
          animation: shine 8s infinite;
        }
        @keyframes shine { 0% { left: -100%; } 20% { left: 200%; } 100% { left: 200%; } }

        .black-gold { background: linear-gradient(135deg, #111 0%, #222 50%, #111 100%); border: 2px solid rgba(197, 160, 89, 0.7); box-shadow: 0 10px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1); }
        .black-gold .chip-line, .black-gold .card-chip { border-color: #c5a059; background: linear-gradient(135deg, #FFDF73, #D4AF37); }
        .black-gold .bank-name, .black-gold .val { color: #f2d091; }

        .blue-purple { background: linear-gradient(135deg, #2563eb, #7c3aed); border: 2px solid rgba(255,255,255,0.3); }
        .platinum-silver { background: linear-gradient(135deg, #9ca3af, #d1d5db); border: 2.2px solid rgba(255,255,255,0.9); }
        .platinum-silver .val, .platinum-silver .bank-name, .platinum-silver .card-number-wrapper { color: #111 !important; text-shadow: none !important; }
        .platinum-silver .lbl { color: #4b5563 !important; }

        .emerald { background: linear-gradient(135deg, #065f46, #059669); border: 2px solid rgba(52, 211, 153, 0.6); }
        .matte-black { background: #1a1a1a; border: 2px solid #444; }

        .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
        .bank-name { font-size: 14px; font-weight: 800; letter-spacing: 1.5px; opacity: 0.95; }
        .card-chip { width: 44px; height: 32px; border-radius: 6px; background: #e2e8f0; margin: 6px 0; }
        .card-number-wrapper { font-family: 'Courier New', Courier, monospace; font-size: 1.05rem; font-weight: 700; letter-spacing: 1.2px; text-shadow: 0 2px 4px rgba(0,0,0,0.4); white-space: nowrap; margin: 8px 0; }
        .card-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
        .card-bottom .lbl { font-size: 10px; opacity: 0.6; display: block; margin-bottom: 4px; }
        .card-bottom .val { font-size: 14px; font-weight: 700; }
        .mc-logo { position: relative; width: 40px; height: 26px; }
        .mc-logo .c1 { width: 26px; height: 26px; background: rgba(235, 0, 27, 0.8); border-radius: 50%; position: absolute; left: 0; }
        .mc-logo .c2 { width: 26px; height: 26px; background: rgba(247, 158, 27, 0.8); border-radius: 50%; position: absolute; left: 14px; mix-blend-mode: screen; }
        .visa-logo { font-size: 20px; font-weight: 900; font-style: italic; color: #fff; }

        /* Overview Sections */
        .overview-stats { display: flex; gap: 30px; margin-bottom: 20px; }
        .stat-box { display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .stat-box .lbl { font-size: 13px; color: #8a99af; font-weight: 500; }
        .stat-box .val { font-size: 20px; font-weight: 800; }
        .border-l { border-left: 1px solid rgba(255,255,255,0.1); padding-left: 30px; }
        .color-red { color: #ef4444; }
        .color-green { color: #22c55e; }
        
        .progress-track { height: 8px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 10px; transition: width 1s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

        /* Billing */
        .billing-main { display: flex; justify-content: space-between; align-items: center; }
        .bil-row { display: flex; gap: 40px; margin-bottom: 16px; }
        .bil-item .val-lg { font-size: 28px; font-weight: 900; display: block; }
        .bil-item .val-md { font-size: 22px; font-weight: 800; display: block; }
        .bil-dates { display: flex; gap: 20px; }
        .date-box { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #8a99af; padding: 6px 12px; background: rgba(255,255,255,0.05); border-radius: 100px; border: 1px solid rgba(255,255,255,0.08); }
        .date-box.warning { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1.5px solid rgba(239, 68, 68, 0.25); }
        .bil-reminder-btn { background: rgba(255,255,255,0.05); border: 1.5px solid rgba(255,255,255,0.12); color: white; padding: 12px 20px; border-radius: 14px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-weight: 600; transition: all 0.2s; }
        .bil-reminder-btn:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }

        /* Double Section Row */
        .cc-double-section { display: grid; grid-template-columns: 1fr 240px; gap: 20px; }
        .rewards-content { display: flex; gap: 20px; margin-bottom: 20px; }
        .reward-stat .val { font-size: 22px; font-weight: 800; display: block; color: #fbbf24; }
        .reward-stat .lbl { font-size: 12px; color: #8a99af; }
        .divider { width: 1px; background: rgba(255,255,255,0.1); }
        .milestone-box { background: rgba(255,255,255,0.03); padding: 16px; border-radius: 16px; border: 1.5px solid rgba(255,255,255,0.08); }
        .miles-label { display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; margin-bottom: 8px; }
        .miles-track { height: 6px; background: rgba(0,0,0,0.2); border-radius: 10px; margin-bottom: 8px; }
        .miles-fill { height: 100%; background: #fbbf24; border-radius: 10px; }
        .miles-note { font-size: 11px; color: #8a99af; }

        .analytics-body { display: flex; flex-direction: column; align-items: center; }
        .chart-legend { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 10px; }
        .legend-item { display: flex; align-items: center; gap: 6px; }
        .legend-item .dot { width: 8px; height: 8px; border-radius: 50%; }
        .legend-item .txt { font-size: 11px; font-weight: 500; color: #8a99af; }

        /* Security Panel */
        .encrypted-tag { font-size: 10px; background: rgba(34, 197, 94, 0.1); color: #22c55e; padding: 4px 8px; border-radius: 6px; display: flex; align-items: center; gap: 4px; font-weight: 700; }
        .security-controls { display: flex; flex-direction: column; gap: 20px; }
        .sec-item { display: flex; justify-content: space-between; align-items: center; }
        .sec-info .title { display: block; font-size: 14px; font-weight: 600; }
        .sec-info .desc { font-size: 12px; color: #8a99af; }
        .sec-toggle { width: 44px; height: 24px; border-radius: 100px; padding: 4px; cursor: pointer; border: none; transition: all 0.3s; position: relative; }
        .sec-toggle.on { background: #22c55e; }
        .sec-toggle.off { background: #334155; }
        .sec-toggle .knob { width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; transition: all 0.3s; top: 4px; }
        .sec-toggle.on .knob { left: 24px; }
        .sec-toggle.off .knob { left: 4px; }

        /* EMI Tracker */
        .emi-convert-btn { font-size: 12px; color: #0076F5; background: none; border: none; font-weight: 700; cursor: pointer; }
        .emi-item { background: rgba(255,255,255,0.03); padding: 16px; border-radius: 16px; border: 1.5px solid rgba(255,255,255,0.08); transition: all 0.2s; }
        .emi-item:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.05); }
        .emi-top { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; font-weight: 700; }
        .emi-progress { margin-bottom: 12px; display: flex; align-items: center; gap: 10px; }
        .emi-bar { flex: 1; height: 6px; background: rgba(0,0,0,0.2); border-radius: 10px; }
        .emi-bar .fill { height: 100%; background: #8b5cf6; border-radius: 10px; }
        .emi-tenure { font-size: 11px; font-weight: 700; color: #8a99af; }
        .emi-details { display: flex; justify-content: space-between; font-size: 11px; color: #8a99af; font-weight: 500; }

        /* Transaction List */
        .tx-list { display: flex; flex-direction: column; gap: 12px; }
        .tx-item { display: flex; align-items: center; gap: 14px; padding: 12px; border-radius: 16px; transition: all 0.2s; }
        .tx-item:hover { background: rgba(255,255,255,0.05); }
        .tx-icon-wrap { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .tx-icon-wrap.shopping { background: rgba(255,107,107,0.15); color: #FF6B6B; }
        .tx-icon-wrap.travel { background: rgba(78,205,196,0.15); color: #4ECDC4; }
        .tx-icon-wrap.food { background: rgba(69,183,209,0.15); color: #45B7D1; }
        .tx-icon-wrap.bills { background: rgba(150,206,180,0.15); color: #96CEB4; }
        .tx-info { flex: 1; }
        .tx-merchant { display: block; font-size: 14px; font-weight: 700; }
        .tx-meta { font-size: 12px; color: #8a99af; }
        .tx-amount-side { text-align: right; }
        .tx-val { display: block; font-size: 14px; font-weight: 800; color: #ef4444; }
        .tx-status { font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
        .tx-status.completed { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .tx-status.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }

        /* Alerts */
        .alerts-list { display: flex; flex-direction: column; gap: 10px; }
        .alert-item { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 14px; font-size: 13px; font-weight: 600; }
        .alert-item.warning { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.15); }
        .alert-item.info { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.15); }

        /* Modal Redesign V2 */
        .cc-modal-overlay { 
          position: fixed; inset: 0; 
          background: rgba(0,0,0,0.8); 
          backdrop-filter: blur(15px); 
          z-index: 2000; 
          display: flex; align-items: center; justify-content: center; 
          padding: 20px; 
        }
        .cc-modal-v2 { 
          background: #0f172a; 
          border: 1px solid rgba(255,255,255,0.1); 
          border-radius: 28px; 
          width: 100%; max-width: 820px; 
          max-height: 92vh; 
          overflow: hidden; 
          box-shadow: 0 40px 100px rgba(0,0,0,0.6); 
          animation: cc-slideUp 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28); 
          display: flex; flex-direction: column;
        }
        @keyframes cc-slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        .cc-modal-header-v2 { 
          background: linear-gradient(135deg, #0057FF, #00A3FF); 
          padding: 20px 24px; 
          display: flex; justify-content: space-between; align-items: center; 
        }
        .cc-modal-header-v2 .h-left { display: flex; align-items: center; gap: 12px; }
        .cc-modal-header-v2 .icon-box { 
          background: rgba(255,255,255,0.2); 
          width: 38px; height: 38px; 
          border-radius: 12px; 
          display: flex; align-items: center; justify-content: center; 
          backdrop-filter: blur(10px); 
          border: 1px solid rgba(255,255,255,0.2); 
        }
        .cc-modal-header-v2 .subtitle { font-size: 9px; font-weight: 800; opacity: 0.7; letter-spacing: 1.2px; text-transform: uppercase; }
        .cc-modal-header-v2 h2 { margin: 1px 0 0 0; font-size: 18px; font-weight: 800; color: white; }
        .close-btn-v2 { background: none; border: none; color: white; cursor: pointer; opacity: 0.6; transition: all 0.2s; padding: 5px; }
        .close-btn-v2:hover { opacity: 1; transform: rotate(90deg); }

        .cc-modal-body-v2 { 
          display: grid; grid-template-columns: 1fr 1.25fr; 
          overflow-y: auto; 
          scrollbar-width: thin; 
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        
        /* Preview Side V2 */
        .cc-preview-side-v2 { 
          background: #060d19; 
          padding: 30px; 
          display: flex; flex-direction: column; align-items: center; justify-content: center; 
          position: relative; overflow: hidden;
          border-right: 1px solid rgba(255,255,255,0.05);
        }
        .preview-glow { 
          position: absolute; width: 250px; height: 250px; 
          background: radial-gradient(circle, rgba(0,87,255,0.12) 0%, transparent 70%); 
          top: 50%; left: 50%; transform: translate(-50%, -50%); 
        }
        .preview-mode-v2 { 
          position: relative !important; 
          width: 360px !important; 
          transform: none !important; 
          opacity: 1 !important; 
          z-index: 1 !important; 
          box-shadow: 0 15px 40px rgba(0,0,0,0.5) !important;
          margin-bottom: 20px;
        }
        .preview-subtext { margin-top: 15px; font-size: 11px; color: #8a99af; font-weight: 600; font-style: italic; opacity: 0.6; }

        /* Form Side V2 */
        .cc-add-form-v2 { padding: 25px 30px; display: flex; flex-direction: column; gap: 16px; }
        .form-section-v2 { display: flex; flex-direction: column; gap: 6px; }
        .form-section-v2 label { font-size: 9px; font-weight: 800; color: #8a99af; letter-spacing: 0.8px; }
        .input-wrap-v2 { position: relative; }
        .input-wrap-v2 input, .input-wrap-v2 select { 
          width: 100%; 
          background: rgba(255,255,255,0.02); 
          border: 1.2px solid rgba(255,255,255,0.08); 
          border-radius: 10px; 
          padding: 10px 14px; 
          color: white; font-weight: 600; font-size: 13px;
          transition: all 0.2s; outline: none; box-sizing: border-box;
        }
        .input-wrap-v2 input:focus { border-color: #0076F5; background: rgba(255,255,255,0.05); box-shadow: 0 0 12px rgba(0,118,245,0.1); }
        .input-wrap-v2.with-symbol input { padding-left: 28px; }
        .input-wrap-v2 .sym { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-weight: 800; color: #0076F5; font-size: 12px; pointer-events: none; }
        
        .form-row-v2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        
        .theme-picker-section { margin-top: 2px; }
        .theme-dots-v2 { display: flex; gap: 8px; margin-top: 8px; }
        .theme-btn-v2 { 
          width: 24px; height: 24px; border-radius: 50%; border: 2.5px solid transparent; 
          cursor: pointer; transition: all 0.2s; 
        }
        .theme-btn-v2.active { border-color: white; transform: scale(1.15); box-shadow: 0 0 12px rgba(255,255,255,0.2); }
        .theme-btn-v2:hover { transform: scale(1.1); }

        .cc-modal-actions-v2 { display: flex; gap: 10px; margin-top: 10px; }
        .cc-btn-cancel-v2 { flex: 1; padding: 12px; background: rgba(255,255,255,0.04); border: none; border-radius: 12px; color: #8a99af; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .cc-btn-cancel-v2:hover { background: rgba(255,255,255,0.07); color: white; }
        .cc-btn-save-v2 { 
          flex: 2; padding: 12px; 
          background: linear-gradient(135deg, #0057FF, #0084FF); 
          border: none; border-radius: 12px; 
          color: white; font-weight: 800; font-size: 13px; cursor: pointer; 
          box-shadow: 0 8px 20px rgba(0, 87, 255, 0.25); 
          transition: all 0.3s; 
        }
        .cc-btn-save-v2:hover { transform: translateY(-1.5px); box-shadow: 0 12px 28px rgba(0, 87, 255, 0.35); }

        @media (max-width: 900px) {
          .cc-modal-v2 { width: 95%; height: 95vh; border-radius: 20px; }
          .cc-modal-body-v2 { grid-template-columns: 1fr; }
          .cc-preview-side-v2 { display: none; }
          .cc-add-form-v2 { padding: 20px; }
        }
        /* Icons */
        .icon-blue { color: #3b82f6; }
        .icon-green { color: #22c55e; }
        .icon-gold { color: #fbbf24; }
        .icon-purple { color: #8b5cf6; }
        .icon-muted { color: #4b5563; }
        .icon-red { color: #ef4444; }

        @media (max-width: 1200px) {
          .cc-main-layout { grid-template-columns: 1fr; }
          .cc-right-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        }
        @media (max-width: 900px) {
          .modal-content { grid-template-columns: 1fr; }
          .preview-side { display: none; }
          .cc-realistic-card { width: 340px; }
        }
      `}} />
    </div>
  );
};

export default CreditCardsModule;
