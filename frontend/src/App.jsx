import React, { useState } from 'react';
import './index.css';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ErrorBoundary from './components/ErrorBoundary';
import HeroBalanceCard from './components/HeroBalanceCard';
import CombinedIncomeModule from './components/CombinedIncomeModule';
import ExpenseHub from './components/ExpenseHub';
import GoalMilestones from './components/GoalMilestones';
import RecentEMIs from './components/RecentEMIs';
import FloatingAssistant from './components/FloatingAssistant';
import FinancialWellness from './components/FinancialWellness';
import TransactionHistory from './components/TransactionHistory';
import StrategicGoals from './components/StrategicGoals';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [mainBalance, setMainBalance] = useState(1245000);
  const [financials, setFinancials] = useState({
    monthlySalary: 85000,
    dailyPassiveIncome: 413,
    dailyExpenses: 607
  });

  const handleNavigate = (label) => {
    setActiveMenu(label);
    if (window.innerWidth <= 1024) {
      setIsSidebarOpen(false);
    } else {
      // User explicitly asked for sidebar to disappear on click
      setIsSidebarOpen(false);
    }
  };

  const handleGoalPayment = (amount) => {
    setMainBalance(prev => prev - amount);
  };

  return (
    <div className={`app-root ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
      <TopBar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigate={handleNavigate}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="app-body">
        <Sidebar
          isOpen={isSidebarOpen}
          activeMenu={activeMenu}
          onMenuChange={handleNavigate}
        />

        <main className="main-container">
          <div className="content-area">
            {activeMenu === 'Dashboard' ? (
              <div className="dashboard-grid">
                <div className="left-column">
                  <ErrorBoundary name="HeroBalanceCard">
                    <HeroBalanceCard balance={mainBalance} financials={financials} />
                  </ErrorBoundary>
                  <div style={{ marginTop: '20px' }}>
                    <ErrorBoundary name="CombinedIncomeModule">
                      <CombinedIncomeModule />
                    </ErrorBoundary>
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <ErrorBoundary name="GoalMilestones">
                      <GoalMilestones onViewGoals={() => handleNavigate('Goals')} />
                    </ErrorBoundary>
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <ErrorBoundary name="FinancialWellness">
                      <FinancialWellness />
                    </ErrorBoundary>
                  </div>
                </div>

                <div className="right-column">
                  <ErrorBoundary name="ExpenseHub">
                    <ExpenseHub />
                  </ErrorBoundary>
                  <div style={{ marginTop: '20px' }}>
                    <ErrorBoundary name="RecentEMIs">
                      <RecentEMIs />
                    </ErrorBoundary>
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <ErrorBoundary name="TransactionHistory">
                      <TransactionHistory />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            ) : activeMenu === 'Goals' ? (
              <ErrorBoundary name="StrategicGoals">
                <StrategicGoals
                  monthlyIncome={financials.monthlySalary}
                  onPayment={handleGoalPayment}
                />
              </ErrorBoundary>
            ) : (
              <div className="base-card" style={{ padding: '60px', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--primary-blue)', marginBottom: '16px' }}>{activeMenu} Module</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                  We are currently optimizing the {activeMenu} experience for you.
                </p>
                <button
                  className="primary-action-btn"
                  style={{ width: 'auto', padding: '12px 32px' }}
                  onClick={() => handleNavigate('Dashboard')}
                >
                  Back to Dashboard
                </button>
              </div>
            )}

            <ErrorBoundary name="FloatingAssistant">
              <FloatingAssistant />
            </ErrorBoundary>
          </div>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .left-column { display: flex; flex-direction: column; }
        .right-column { display: flex; flex-direction: column; }
        
        @media (max-width: 1240px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        .primary-action-btn {
          background: var(--primary-blue);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .primary-action-btn:hover {
          background: #006ae0;
          transform: translateY(-1px);
        }
      `}} />
    </div>
  );
}

export default App;
