import React from 'react';
import { Bell, Search } from 'lucide-react';

const TopBar = () => {
  return (
    <header className="top-bar">
      <div className="greeting">
        <h1>Welcome back, Rohan 👋</h1>
        <p>Here's your treasury summary for today.</p>
      </div>
      <div className="actions">
        <button className="icon-btn notification-btn">
          <Bell size={20} color="var(--text-secondary)" />
        </button>
        <div className="user-profile">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan" alt="User Profile" />
          <span className="user-name">Rohan Sharma</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        .greeting h1 {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.5px;
        }
        .greeting p {
          color: var(--text-secondary);
          font-size: 14px;
          margin-top: 4px;
          font-weight: 500;
        }
        .greeting p span {
          color: var(--text-muted);
          font-style: italic;
          margin-left: 4px;
        }
        .actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .icon-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--border-subtle);
          background: var(--bg-card);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .icon-btn:hover {
          background: var(--primary-light-blue);
          border-color: var(--primary-blue);
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          padding: 6px 16px 6px 6px;
          border-radius: 30px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .user-profile img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ffe4e6;
        }
        .user-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-main);
        }
      `}} />
    </header>
  );
};

export default TopBar;
