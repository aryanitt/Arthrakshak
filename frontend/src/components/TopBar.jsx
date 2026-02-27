import React, { useState } from 'react';
import { Bell, Search, Menu, X, ShieldCheck, TrendingUp } from 'lucide-react';

const TopBar = ({ onToggleSidebar, onNavigate, isSidebarOpen, showProfile = true }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  return (
    <header className="unified-top-bar">
      <div className="bar-branding">
        <button className="circular-toggle branding-toggle" onClick={onToggleSidebar} title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}>
          {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <div className="brand-icon">
          <ShieldCheck size={28} color="var(--primary-blue)" />
        </div>
        <div className="brand-info">
          <h2>Arthrakshak</h2>
          <span>TREASURY</span>
        </div>
      </div>

      <div className="bar-separator" />

      <div className="bar-content">
        <div className="bar-left">
          {/* Search Removed by Strategy Update */}
          <div className="search-placeholder-spacer" style={{ flex: 1 }}></div>
        </div>

        <div className="actions-v2">
          <button className="circular-action">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>

          {showProfile && (
            <div className="profile-pill" onClick={() => onNavigate('Settings')}>
              <div className="pill-avatar">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" alt="Rohan" />
              </div>
              <span className="pill-name">Rohan Sharma</span>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .unified-top-bar {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          height: 72px;
          border-bottom: 1px solid var(--border-subtle);
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
        }

        .bar-branding {
          display: flex;
          align-items: center;
          gap: 16px;
          min-width: 280px;
          padding: 0 24px;
        }

        .branding-toggle {
          margin-right: -4px; /* Tighten gap slightly */
        }

        .brand-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--primary-light-blue);
          padding: 8px;
          border-radius: 12px;
          margin-left: 4px;
        }

        .brand-info h2 {
          font-size: 20px;
          font-weight: 800;
          color: var(--primary-blue);
          line-height: 1.1;
          letter-spacing: -0.4px;
        }

        .brand-info span {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 1px;
        }

        .bar-separator {
          width: 1px;
          height: 32px;
          background: var(--border-subtle);
        }

        .bar-content {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
        }
        
        .bar-left {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .search-container-v2 {
          position: relative;
          width: 380px;
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          background: #F8FAFC;
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 0 16px;
          height: 44px;
          transition: all 0.2s;
        }

        .search-input-wrapper:focus-within {
          background: white;
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 4px var(--primary-light-blue);
        }

        .search-icon-v2 {
          color: var(--text-muted);
          margin-right: 12px;
        }

        .global-search-v2 {
          border: none;
          background: transparent;
          width: 100%;
          font-weight: 600;
          font-size: 14px;
          color: var(--text-main);
          outline: none;
        }

        .search-suggestions-v2 {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 100%;
          background: white;
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          padding: 12px;
          z-index: 1001;
          animation: slideInDown 0.2s ease-out;
        }

        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .suggestion-group {
          margin-bottom: 12px;
        }

        .suggestion-group:last-child {
          margin-bottom: 0;
        }

        .group-label {
          font-size: 10px;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          padding: 0 12px;
          margin-bottom: 6px;
          display: block;
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-secondary);
        }

        .suggestion-item:hover {
          background: var(--primary-light-blue);
          color: var(--primary-blue);
        }

        .suggestion-item span {
          font-size: 13px;
          font-weight: 600;
        }
        
        .circular-toggle {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--border-subtle);
          background: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .circular-toggle:hover {
          background: var(--primary-light-blue);
          border-color: var(--primary-blue);
          color: var(--primary-blue);
          transform: translateY(-1px);
        }
        
        .actions-v2 {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .circular-action {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--border-subtle);
          background: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-secondary);
          position: relative;
          transition: all 0.2s;
        }
        
        .circular-action:hover {
          border-color: var(--primary-blue);
          color: var(--primary-blue);
          background: var(--primary-light-blue);
        }
        
        .notification-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background: var(--accent-red);
          border-radius: 50%;
          border: 2px solid white;
        }
        
        .profile-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #F8FAFC;
          border: 1px solid var(--border-subtle);
          padding: 6px 20px 6px 6px;
          border-radius: 40px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .profile-pill:hover {
          border-color: var(--primary-blue);
          background: #FFFFFF;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .pill-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          overflow: hidden;
          background: #FFE4E6;
        }
        
        .pill-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .pill-name {
          font-size: 13px;
          font-weight: 700;
          color: #1E293B;
        }
      `}} />
    </header>
  );
};

export default TopBar;
