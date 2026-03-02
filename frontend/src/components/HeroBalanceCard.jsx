import React, { useState } from 'react';
import { ShieldCheck, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';

const HeroBalanceCard = ({ balance, financials, onNavigate }) => {
  const [timePeriod, setTimePeriod] = useState('Today');

  // Map internal state to backend response keys
  const getPeriodData = () => {
    switch (timePeriod) {
      case 'Today': return financials.today || { active: 0, passive: 0, expense: 0 };
      case 'Week': return financials.week || { active: 0, passive: 0, expense: 0 };
      case 'Monthly': return financials.month || { active: 0, passive: 0, expense: 0 };
      default: return financials.today || { active: 0, passive: 0, expense: 0 };
    }
  };

  const periodData = getPeriodData();
  const totalPeriodIncome = periodData.active + periodData.passive;
  const periodExpenses = periodData.expense;

  return (
    <div
      className="hero-balance-card"
      onClick={() => onNavigate && onNavigate('Cards')}
      title="Click to view Credit Card details"
    >
      <div className="hero-bg-pattern">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="glow-orb orb-3"></div>
      </div>

      <div className="half-credit-card">
        <div className="cc-glass">
          <div className="cc-top">
            <div className="cc-chip">
              <div className="cc-chip-line"></div>
              <div className="cc-chip-line"></div>
              <div className="cc-chip-line"></div>
            </div>
            <div className="cc-type">ARTH</div>
          </div>
          <div className="cc-middle">
            <div className="cc-number">**** **** **** 8421</div>
          </div>
          <div className="cc-bottom">
            <div className="cc-name">PREMIUM MEMBER</div>
            <div className="cc-logo">
              <div className="circle-1"></div>
              <div className="circle-2"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-main-content">
        <div className="hero-header-row">
          <div className="hero-label">
            <Wallet size={18} style={{ opacity: 0.8 }} />
            <span>Financial Overview</span>
          </div>
          <div className="period-tabs-hero">
            {['Today', 'Week', 'Monthly'].map((period) => (
              <button
                key={period}
                className={timePeriod === period ? 'active' : ''}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card navigation
                  setTimePeriod(period);
                }}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="hero-subs">
          <div className="hero-sub-card income-card">
            <div className="sub-header">
              <span className="sub-label">Income (Active + Passive)</span>
              <div className="icon-wrapper green-bg">
                <ArrowUpRight size={16} />
              </div>
            </div>
            <div className="sub-value">
              <span className="val">+ ₹{totalPeriodIncome.toLocaleString()}</span>
              <span className="pct-tag green">{timePeriod}</span>
            </div>
            <div className="sub-details">
              <span>Active: ₹{periodData.active.toLocaleString()}</span>
              <span className="dot-sep">&bull;</span>
              <span>Passive: ₹{periodData.passive.toLocaleString()}</span>
            </div>
          </div>

          <div className="hero-sub-card expense-card">
            <div className="sub-header">
              <span className="sub-label">Expenses</span>
              <div className="icon-wrapper red-bg">
                <ArrowDownRight size={16} />
              </div>
            </div>
            <div className="sub-value">
              <span className="val">- ₹{periodExpenses.toLocaleString()}</span>
              <span className="pct-tag orange">{timePeriod}</span>
            </div>
            <div className="sub-details">
              {timePeriod === 'Today' && <span>Yesterday: ₹0</span>}
              {timePeriod === 'Week' && <span>Daily Avg: ₹{(periodExpenses / 7).toFixed(0)}</span>}
              {timePeriod === 'Monthly' && <span>Daily Avg: ₹{(periodExpenses / 30).toFixed(0)}</span>}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .hero-balance-card {
          background: #0f172a; /* Sleek dark blue base */
          border-radius: 28px;
          padding: 32px 40px;
          color: white;
          position: relative;
          overflow: hidden;
          border: 2px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
          cursor: pointer;
        }
        .hero-balance-card:hover {
          transform: translateY(-6px) scale(1.005);
          box-shadow: 0 32px 60px rgba(0, 87, 255, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.15);
        }
        .hero-balance-card:active {
          transform: translateY(-2px) scale(0.99);
        }
        .hero-bg-pattern {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none; z-index: -1;
          overflow: hidden;
          background: 
            radial-gradient(circle at 15% 50%, rgba(255, 255, 255, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 85% 30%, rgba(255, 255, 255, 0.04) 0%, transparent 50%);
        }
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          transform: translateZ(0);
        }
        .orb-1 {
          top: -20%; left: -10%;
          width: 350px; height: 350px;
          background: #0057FF; /* Arth brand blue */
          opacity: 0.35;
        }
        .orb-2 {
          bottom: -30%; right: 5%;
          width: 450px; height: 450px;
          background: #00D1FF; /* Arth bright cyan */
          opacity: 0.3;
        }
        .orb-3 {
          top: 40%; left: 40%;
          width: 200px; height: 200px;
          background: #7C3AED; /* Premium purple touch */
          opacity: 0.25;
        }

        /* Half Credit Card */
        .half-credit-card {
          position: absolute;
          right: -40px;
          bottom: -50px;
          width: 300px;
          height: 190px;
          transform: rotate(-12deg) translateY(10px);
          z-index: 0;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.02) 100%);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: -15px 25px 40px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.3);
          display: flex;
          flex-direction: column;
          padding: 24px;
          overflow: hidden;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
          pointer-events: none;
        }
        
        .half-credit-card::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
          transform: skewX(-20deg);
          animation: shine 6s infinite;
        }
        
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }

        .hero-balance-card:hover .half-credit-card {
          transform: rotate(-8deg) translateY(-10px) translateX(-5px) scale(1.02);
          box-shadow: -20px 30px 50px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4);
        }
        
        .cc-glass {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          position: relative;
          z-index: 2;
        }
        .cc-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .cc-chip {
          width: 42px;
          height: 32px;
          background: linear-gradient(135deg, #FFDF73 0%, #D4AF37 50%, #B8860B 100%);
          border-radius: 6px;
          position: relative;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.5);
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          padding: 0 4px;
        }
        .cc-chip-line {
          height: 1px;
          background: rgba(0,0,0,0.2);
          width: 100%;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }
        .cc-type {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 3px;
          color: rgba(255, 255, 255, 0.9);
          font-style: italic;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          background: linear-gradient(to right, #fff, #ccc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .cc-middle {
          margin-top: 20px;
        }
        .cc-number {
          font-family: 'Courier New', Courier, monospace;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 4px;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.6);
        }
        .cc-bottom {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: auto;
        }
        .cc-name {
          font-size: 12px;
          letter-spacing: 2px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
        }
        .cc-logo {
          position: relative;
          width: 40px;
          height: 24px;
          display: flex;
          align-items: center;
        }
        .cc-logo .circle-1, .cc-logo .circle-2 {
          position: absolute;
          width: 24px; height: 24px;
          border-radius: 50%;
        }
        .cc-logo .circle-1 {
          background: rgba(235, 0, 27, 0.8);
          left: 0;
          z-index: 1;
        }
        .cc-logo .circle-2 {
          background: rgba(247, 158, 27, 0.8);
          left: 14px;
          z-index: 2;
          mix-blend-mode: screen;
        }

        /* Main Content */
        .hero-main-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 20px; /* Reduced Vertical Gap */
        }
        .hero-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.5px;
          opacity: 0.95;
          text-transform: uppercase;
        }
        .hero-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .period-tabs-hero {
          background: rgba(0, 0, 0, 0.4);
          padding: 8px;
          border-radius: 16px;
          display: flex;
          gap: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
        }
        .period-tabs-hero button {
          border: none;
          background: none;
          padding: 8px 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .period-tabs-hero button:hover {
          color: rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.05);
        }
        .period-tabs-hero button.active {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2);
          backdrop-filter: blur(12px);
        }
        
        .hero-subs {
          display: flex;
          gap: 24px;
        }
        .hero-sub-card {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 24px;
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1), inset 0 1px 1px rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: transform 0.3s ease, background 0.3s ease;
        }
        .hero-sub-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }
        
        .sub-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .icon-wrapper {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .icon-wrapper.green-bg {
          background: rgba(25, 230, 128, 0.2);
          color: #2ED573;
        }
        .icon-wrapper.red-bg {
          background: rgba(255, 82, 82, 0.2);
          color: #FF5252;
        }
        
        .sub-label {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .sub-value {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .sub-value .val {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .pct-tag {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 10px;
          text-transform: uppercase;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .pct-tag.green {
          background: linear-gradient(135deg, rgba(46, 213, 115, 0.2) 0%, rgba(46, 213, 115, 0.1) 100%);
          color: #CCFFEB;
          border: 1px solid rgba(46, 213, 115, 0.2);
        }
        .pct-tag.orange {
          background: linear-gradient(135deg, rgba(255, 138, 0, 0.2) 0%, rgba(255, 138, 0, 0.1) 100%);
          color: #FFE4CC;
          border: 1px solid rgba(255, 138, 0, 0.2);
        }
        .sub-details {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: rgba(255,255,255,0.6);
          font-weight: 500;
        }
        .dot-sep {
          color: rgba(255,255,255,0.3);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .hero-subs {
            flex-direction: column;
          }
          .half-credit-card {
            display: none;
          }
          .sub-value .val {
            font-size: 24px;
          }
        }
        `}} />
    </div>
  );
};

export default HeroBalanceCard;
