import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Search, Menu, X, ShieldCheck, TrendingUp, Mic, MessageSquare } from 'lucide-react';
import './index.css';
import { API_BASE_URL } from './config';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import ErrorBoundary from './components/ErrorBoundary';
import HeroBalanceCard from './components/HeroBalanceCard';
import CombinedIncomeModule from './components/CombinedIncomeModule';
import ExpenseHub from './components/ExpenseHub';
import GoalMilestones from './components/GoalMilestones';
import RecentEMIs from './components/RecentEMIs';
import AIAssistant from './components/AIAssistant';
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
import CreditCardsModule from './components/CreditCardsModule';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [mainBalance, setMainBalance] = useState(1245000);
  const [financials, setFinancials] = useState({
    today: { active: 0, passive: 0, expense: 0 },
    week: { active: 0, passive: 0, expense: 0 },
    month: { active: 0, passive: 0, expense: 0 }
  });
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState('');
  const [aiSearchInput, setAiSearchInput] = useState('');

  useEffect(() => {
    fetchFinancials();
    window.addEventListener('transactionAdded', fetchFinancials);
    return () => window.removeEventListener('transactionAdded', fetchFinancials);
  }, []);

  const fetchFinancials = async () => {
    try {
      const now = new Date();
      const clientDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const res = await axios.get(`${API_BASE_URL}/financial-summary?clientDate=${clientDate}`);
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

  const handleVoiceAI = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      if (text.trim()) {
        setAiInitialQuery(text);
        setIsAIChatOpen(true);
      }
    };
    recognition.start();
  };

  return (
    <div className={`app-root ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
      <TopBar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onNavigate={handleNavigate}
        isSidebarOpen={isSidebarOpen}
        onSearchAI={(query) => {
          setAiInitialQuery(query);
          setIsAIChatOpen(true);
        }}
        onVoiceAI={handleVoiceAI}
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
                    <HeroBalanceCard
                      balance={mainBalance}
                      financials={financials}
                      onNavigate={handleNavigate}
                    />
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
                    <ExpenseHub onViewAll={() => handleNavigate('Expenses')} />
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
                <ExpensesModule onBack={() => handleNavigate('Dashboard')} />
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
            ) : activeMenu === 'Cards' ? (
              <ErrorBoundary name="CreditCardsModule">
                <CreditCardsModule onBack={() => handleNavigate('Dashboard')} />
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

            <AIAssistant
              isOpen={isAIChatOpen}
              onClose={() => {
                setIsAIChatOpen(false);
                setAiInitialQuery('');
              }}
              initialQuery={aiInitialQuery}
            />
          </div>
        </main>
      </div>

      <div className="floating-ai-bar-v3">
        <div className="search-pill-v3">
          <button className="voice-trigger-v3" onClick={handleVoiceAI} title="Ask with Voice">
            <Mic size={20} />
          </button>
          <div className="v3-separator" />
          <div className="ai-input-group-v3" onClick={() => {
            if (aiSearchInput.trim()) {
              setAiInitialQuery(aiSearchInput);
              setIsAIChatOpen(true);
              setAiSearchInput('');
            } else {
              setIsAIChatOpen(true);
            }
          }}>
            <div className="sparkle-icon">
              <ShieldCheck size={16} color="var(--primary-blue)" />
            </div>
            <input
              type="text"
              className="global-search-v3"
              placeholder="Ask Arthrakshak AI"
              value={aiSearchInput}
              onChange={(e) => setAiSearchInput(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && aiSearchInput.trim()) {
                  setAiInitialQuery(aiSearchInput);
                  setIsAIChatOpen(true);
                  setAiSearchInput('');
                }
              }}
            />
            <div className="chat-hint-icon">
              <MessageSquare size={16} color="rgba(255,255,255,0.9)" />
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .floating-ai-bar-v3 {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 9999;
          display: ${isAIChatOpen ? 'none' : 'block'};
          animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .search-pill-v3 {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 100px;
          height: 52px;
          padding: 4px;
          width: 380px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .search-pill-v3:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }

        .voice-trigger-v3 {
          background: transparent;
          border: none;
          color: var(--text-muted);
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 50%;
          transition: all 0.2s;
          margin-left: 6px;
        }

        .voice-trigger-v3:hover {
          background: #f1f5f9;
          color: var(--primary-blue);
        }

        .v3-separator {
          width: 1px;
          height: 24px;
          background: #e2e8f0;
          margin: 0 8px;
        }

        .ai-input-group-v3 {
          flex: 1;
          display: flex;
          align-items: center;
          background: var(--primary-blue);
          height: 44px;
          border-radius: 100px;
          padding: 0 16px;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .ai-input-group-v3:hover {
          background: #0056b3;
        }

        .sparkle-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFFFF;
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }

        .global-search-v3 {
          border: none;
          background: transparent;
          width: 100%;
          font-weight: 700;
          font-size: 14px;
          color: #FFFFFF;
          outline: none;
          cursor: text;
        }

        .global-search-v3::placeholder {
          color: rgba(255, 255, 255, 0.9);
        }

        .chat-hint-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .left-column { display: flex; flex-direction: column; }
        .right-column { display: flex; flex-direction: column; }
        
        @media (max-width: 1240px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .floating-ai-bar-v3 {
            bottom: 80px; /* Avoid bottom nav */
            right: 20px;
            width: calc(100% - 40px);
            max-width: 380px;
          }
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
