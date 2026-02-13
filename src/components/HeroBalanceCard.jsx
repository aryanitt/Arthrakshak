import React, { useState } from 'react';
import { Eye, ShieldCheck, TrendingUp, Wallet } from 'lucide-react';

const HeroBalanceCard = () => {
  const [timePeriod, setTimePeriod] = useState('Today');

  // Financial data (base values)
  const monthlySalary = 85000;
  const dailyActiveIncome = Math.round(monthlySalary / 30); // Fixed: salary/30
  const dailyPassiveIncome = 413; // Daily passive income
  const dailyExpenses = 607; // Daily expenses (18,200/30)

  const totalBalance = 1245000; // Always fixed

  // Calculate based on selected period
  const getPeriodMultiplier = () => {
    switch (timePeriod) {
      case 'Today': return 1;
      case 'Week': return 7;
      case 'Monthly': return 30;
      default: return 1;
    }
  };

  const multiplier = getPeriodMultiplier();
  const periodActiveIncome = dailyActiveIncome * multiplier;
  const periodPassiveIncome = dailyPassiveIncome * multiplier;
  const totalPeriodIncome = periodActiveIncome + periodPassiveIncome;
  const periodExpenses = dailyExpenses * multiplier;

  return (
    <div className="hero-balance-card">
      <div className="hero-bg-pattern">
        <ShieldCheck className="bg-icon shield" size={240} strokeWidth={1} />
        <TrendingUp className="bg-icon trend" size={120} strokeWidth={1.5} />
        <Wallet className="bg-icon wallet" size={80} strokeWidth={1.5} />
      </div>

      <div className="hero-main-content">
        <div className="hero-header-row">
          <div className="hero-label">
            <span>Total Treasury Balance</span>
            <Eye size={18} className="eye-icon" />
          </div>
          <div className="period-tabs-hero">
            {['Today', 'Week', 'Monthly'].map((period) => (
              <button
                key={period}
                className={timePeriod === period ? 'active' : ''}
                onClick={() => setTimePeriod(period)}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="balance-fig">₹{totalBalance.toLocaleString()}.00</div>

        <div className="hero-subs">
          <div className="hero-sub-card">
            <span className="sub-label">Income (Active + Passive)</span>
            <div className="sub-value">
              <span className="val">+ ₹{totalPeriodIncome.toLocaleString()}</span>
              <span className="pct-tag green">{timePeriod}</span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.7 }}>
              Active: ₹{periodActiveIncome.toLocaleString()} | Passive: ₹{periodPassiveIncome.toLocaleString()}
            </div>
          </div>
          <div className="hero-sub-card">
            <span className="sub-label">Expenses</span>
            <div className="sub-value">
              <span className="val">- ₹{periodExpenses.toLocaleString()}</span>
              <span className="pct-tag orange">{timePeriod}</span>
            </div>
            <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.7 }}>
              {timePeriod !== 'Monthly' && `Monthly: ₹${(dailyExpenses * 30).toLocaleString()}`}
              {timePeriod === 'Monthly' && `Daily Avg: ₹${dailyExpenses.toLocaleString()}`}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hero-balance-card {
          background: linear-gradient(120deg, #0057FF 0%, #0084FF 50%, #00D1FF 100%);
          border-radius: 24px;
          padding: 40px;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 87, 255, 0.25);
          transition: transform 0.3s ease;
        }
        .hero-balance-card:hover {
          transform: translateY(-4px);
        }
        .hero-bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }
        .bg-icon {
          position: absolute;
          opacity: 0.08;
          color: white;
        }
        .bg-icon.shield {
          right: -40px;
          bottom: -60px;
          transform: rotate(-15deg);
        }
        .bg-icon.trend {
          top: 20px;
          right: 180px;
          opacity: 0.05;
          transform: rotate(10deg);
        }
        .bg-icon.wallet {
          bottom: 40px;
          left: 50%;
          opacity: 0.04;
          transform: rotate(-10deg);
        }
        .hero-main-content {
          position: relative;
          z-index: 1;
        }
        /* Removed old ::before */
        .hero-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          opacity: 0.9;
        }
        .hero-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .period-tabs-hero {
          background: rgba(255, 255, 255, 0.2);
          padding: 4px;
          border-radius: 10px;
          display: flex;
          gap: 4px;
        }
        .period-tabs-hero button {
          border: none;
          background: none;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.2s;
        }
        .period-tabs-hero button.active {
          background: rgba(255, 255, 255, 0.3);
          color: white;
          backdrop-filter: blur(10px);
        }
        .eye-icon {
          margin-left: auto;
          cursor: pointer;
        }
        .balance-fig {
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -1px;
          margin-bottom: 32px;
        }
        .hero-subs {
          display: flex;
          gap: 20px;
        }
        .hero-sub-card {
          flex: 1;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 16px 20px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .sub-label {
          font-size: 11px;
          font-weight: 600;
          opacity: 0.8;
          display: block;
          margin-bottom: 6px;
        }
        .sub-value {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sub-value .val {
          font-size: 20px;
          font-weight: 700;
        }
        .pct-tag {
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 8px;
        }
        .pct-tag.green {
          background: rgba(25, 230, 128, 0.2);
          color: #CCFFEB;
        }
        .pct-tag.orange {
          background: rgba(255, 138, 0, 0.2);
          color: #FFE4CC;
        }
      `}} />
    </div>
  );
};

export default HeroBalanceCard;
