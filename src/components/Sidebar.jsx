import React from 'react';
import { LayoutDashboard, Wallet, TrendingUp, Receipt, ShieldCheck, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
    { icon: <Wallet size={20} />, label: 'Accounts' },
    { icon: <TrendingUp size={20} />, label: 'Investments' },
    { icon: <Receipt size={20} />, label: 'Transactions' },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">
          <ShieldCheck size={28} color="var(--primary-blue)" />
        </div>
        <div className="brand-text">
          <h2>Arthrakshak</h2>
          <span>TREASURY</span>
        </div>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item, index) => (
          <div key={index} className={`nav-item ${item.active ? 'active' : ''}`}>
            <div className="nav-link">
              <span className="nav-icon">{item.icon}</span>
              <span className="main-label">{item.label}</span>
            </div>
          </div>
        ))}
      </nav>

      <div className="premium-plan">
        <div className="plan-header">
          <span className="plan-tag">PREMIUM PLAN</span>
          <p>Your financial shield is active.</p>
        </div>
        <div className="plan-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .sidebar {
          width: var(--sidebar-width);
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border-subtle);
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          box-shadow: var(--shadow-sidebar);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 48px;
          padding-left: 8px;
        }
        .brand-text h2 {
          font-size: 20px;
          font-weight: 800;
          color: var(--primary-blue);
          line-height: 1;
        }
        .brand-text span {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 1px;
        }
        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }
        .nav-item {
          padding: 12px 16px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .nav-item.active {
          background: var(--primary-light-blue);
          color: var(--primary-blue);
        }
        .nav-item:not(.active) {
          color: var(--text-secondary);
        }
        .nav-item:not(.active):hover {
          background: rgba(0, 0, 0, 0.02);
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .nav-labels {
          display: flex;
          flex-direction: column;
        }
        .main-label {
          font-size: 15px;
          font-weight: 600;
        }
        .sub-label {
          font-size: 10px;
          font-weight: 500;
          color: var(--text-muted);
          opacity: 0.8;
        }
        .nav-item.active .sub-label {
          color: var(--primary-blue);
          opacity: 0.6;
        }
        .premium-plan {
          background: var(--primary-light-blue);
          padding: 20px;
          border-radius: 20px;
          margin-top: auto;
        }
        .plan-tag {
          font-size: 10px;
          font-weight: 800;
          color: var(--primary-blue);
          letter-spacing: 0.5px;
        }
        .premium-plan p {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 4px;
          font-weight: 500;
        }
        .plan-progress {
          margin-top: 12px;
        }
        .progress-bar {
          height: 6px;
          background: rgba(0, 118, 245, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--primary-blue);
          border-radius: 3px;
        }
        
        @media (max-width: 1024px) {
          .sidebar {
            display: none;
          }
        }
      `}} />
    </aside>
  );
};

export default Sidebar;
