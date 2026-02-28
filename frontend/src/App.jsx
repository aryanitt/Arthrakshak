import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import BottomNav from './components/BottomNav';
import ExpensesModule from './components/ExpensesModule';
import InvestmentsModule from './components/InvestmentsModule';
import LoansModule from './components/LoansModule';
import FamilyModule from './components/FamilyModule';
import InsightsAI from './components/InsightsAI';
import AdminProfile from './components/AdminProfile';
import TransactionsPage from './components/TransactionsPage';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [mainBalance, setMainBalance] = useState(1245000);
  const [financials, setFinancials] = useState({
    today: { active: 0, passive: 0, expense: 0 },
    week: { active: 0, passive: 0, expense: 0 },
    month: { active: 0, passive: 0, expense: 0 }
  });

  useEffect(() => {
    fetchFinancials();
    window.addEventListener('transactionAdded', fetchFinancials);
    return () => window.removeEventListener('transactionAdded', fetchFinancials);
  }, []);

  const fetchFinancials = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/financial-summary');
      setFinancials(res.data);
      // Use backend-calculated total balance
      if (typeof res.data.totalBalance === 'number') {
        setMainBalance(res.data.totalBalance);
      }
    } catch (e) {
      console.error("Error fetching financials:", e);
    }
  };

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
                      <TransactionHistory onViewAll={() => handleNavigate('Transactions')} />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            ) : activeMenu === 'Goals' ? (
              <ErrorBoundary name="StrategicGoals">
                <StrategicGoals
                  monthlyIncome={financials.month.active}
                  onPayment={handleGoalPayment}
                />
              </ErrorBoundary>
            ) : activeMenu === 'Expenses' ? (
              <ErrorBoundary name="ExpensesModule">
                <ExpensesModule />
              </ErrorBoundary>
            ) : activeMenu === 'Investments' ? (
              <ErrorBoundary name="InvestmentsModule">
                <InvestmentsModule />
              </ErrorBoundary>
            ) : activeMenu === 'Loans' ? (
              <ErrorBoundary name="LoansModule">
                <LoansModule
                  onPayment={(amt) => setMainBalance(prev => prev - amt)}
                  balance={mainBalance}
                />
              </ErrorBoundary>
            ) : activeMenu === 'Family' ? (
              <ErrorBoundary name="FamilyModule">
                <FamilyModule />
              </ErrorBoundary>
            ) : activeMenu === 'AI' ? (
              <ErrorBoundary name="InsightsAI">
                <InsightsAI />
              </ErrorBoundary>
            ) : activeMenu === 'Transactions' ? (
              <ErrorBoundary name="TransactionsPage">
                <TransactionsPage />
              </ErrorBoundary>
            ) : activeMenu === 'Profile' ? (
              <ErrorBoundary name="AdminProfile">
                <AdminProfile />
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

      <BottomNav
        activeMenu={activeMenu}
        onMenuChange={handleNavigate}
      />
    </div>
  );
}

export default App;
