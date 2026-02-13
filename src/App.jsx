import React from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HeroBalanceCard from './components/HeroBalanceCard';
import CombinedIncomeModule from './components/CombinedIncomeModule';
import ExpenseHub from './components/ExpenseHub';
import GoalMilestones from './components/GoalMilestones';
import RecentEMIs from './components/RecentEMIs';
import FloatingAssistant from './components/FloatingAssistant';

function App() {
  return (
    <div className="app-root">
      <Sidebar />
      <main className="main-content">
        <TopBar />

        <div className="dashboard-grid">
          <div className="left-column">
            <HeroBalanceCard />

            <div style={{ marginTop: '32px' }}>
              <CombinedIncomeModule />
            </div>

            <div style={{ marginTop: '32px' }}>
              <GoalMilestones />
            </div>
          </div>

          <div className="right-column">
            <ExpenseHub />
            <div style={{ marginTop: '32px' }}>
              <RecentEMIs />
            </div>
          </div>
        </div>

        <FloatingAssistant />
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .left-column {
          display: flex;
          flex-direction: column;
        }
        .right-column {
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 900px) {
          .income-row {
            flex-direction: column;
          }
        }
      `}} />
    </div>
  );
}

export default App;
