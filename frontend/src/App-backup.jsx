import React, { useState } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
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

    const handleNavigate = (label) => {
        setActiveMenu(label);
    };

    return (
        <div className={`app-root ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
            <Sidebar
                isOpen={isSidebarOpen}
                activeMenu={activeMenu}
                onMenuChange={handleNavigate}
            />
            <main className="main-content">
                <TopBar
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onNavigate={handleNavigate}
                    isSidebarOpen={isSidebarOpen}
                />

                {activeMenu === 'Dashboard' ? (
                    <div className="dashboard-grid">
                        <div className="left-column">
                            <HeroBalanceCard />
                            <div style={{ marginTop: '20px' }}>
                                <CombinedIncomeModule />
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <GoalMilestones onViewGoals={() => handleNavigate('Goals')} />
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <FinancialWellness />
                            </div>
                        </div>

                        <div className="right-column">
                            <ExpenseHub />
                            <div style={{ marginTop: '20px' }}>
                                <RecentEMIs />
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <TransactionHistory />
                            </div>
                        </div>
                    </div>
                ) : activeMenu === 'Goals' ? (
                    <StrategicGoals />
                ) : (
                    <div className="base-card" style={{ padding: '40px', textAlign: 'center' }}>
                        <h3>Module Coming Soon</h3>
                        <p>Navigating to: {activeMenu}</p>
                        <button
                            className="view-link"
                            style={{ marginTop: '20px' }}
                            onClick={() => handleNavigate('Dashboard')}
                        >
                            Go back to Dashboard
                        </button>
                    </div>
                )}

                <FloatingAssistant />
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
        .left-column { display: flex; flex-direction: column; }
        .right-column { display: flex; flex-direction: column; }
        @media (max-width: 900px) {
          .income-row { flex-direction: column; }
        }
      `}} />
        </div>
    );
}

export default App;
