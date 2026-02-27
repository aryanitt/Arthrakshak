import { LayoutDashboard, Wallet, TrendingUp, Receipt, Users, Zap, User, Target } from 'lucide-react';

const Sidebar = ({ isOpen, activeMenu, onMenuChange }) => {
  if (!isOpen) return null;

  const handleMenuClick = (label) => {
    if (onMenuChange) {
      onMenuChange(label);
    }
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { icon: <Receipt size={20} />, label: 'Expenses' },
    { icon: <Target size={20} />, label: 'Goals' },
    { icon: <TrendingUp size={20} />, label: 'Investments' },
    { icon: <Wallet size={20} />, label: 'Loans' },
    { icon: <Users size={20} />, label: 'Family' },
    { icon: <Zap size={20} />, label: 'AI' },
    { icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <aside className="sidebar">
      <nav className="nav-menu">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`nav-item ${activeMenu === item.label ? 'active' : ''}`}
            onClick={() => handleMenuClick(item.label)}
          >
            <div className="nav-link">
              <span className="nav-icon">{item.icon}</span>
              <div className="nav-labels">
                <span className="main-label">{item.label}</span>
              </div>
            </div>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="strategic-mode-card">
          <span className="sm-label">STRATEGIC MODE</span>
          <p>Goal tracking is prioritized.</p>
          <div className="sm-progress">
            <div className="sm-fill" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .sidebar {
          width: var(--sidebar-width);
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border-subtle);
          padding: 24px 24px; /* Reduced top padding to align with menu items */
          display: flex;
          flex-direction: column;
          height: calc(100vh - 72px); /* Content below the 72px TopBar */
          position: sticky;
          top: 72px; /* Starts below the bar */
          box-shadow: var(--shadow-sidebar);
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 52px;
          padding: 8px 8px;
          height: 44px; /* Matches circular toggle height */
        }
        .brand-logo {
          display: flex;
          align-items: center;
          justify-content: center;
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
        .strategic-mode-card {
           background: #F8FAFC;
           padding: 20px;
           border-radius: 20px;
           margin-top: auto;
           border: 1px solid var(--border-subtle);
        }
        .sm-label {
           font-size: 10px;
           font-weight: 800;
           color: var(--primary-blue);
           letter-spacing: 0.5px;
           display: block;
           margin-bottom: 4px;
        }
        .strategic-mode-card p {
           font-size: 11px;
           font-weight: 600;
           color: var(--text-secondary);
        }
        .sm-progress {
           height: 4px;
           background: rgba(0, 118, 245, 0.1);
           border-radius: 2px;
           margin-top: 12px;
           overflow: hidden;
        }
        .sm-fill {
           height: 100%;
           background: var(--primary-blue);
           border-radius: 2px;
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
