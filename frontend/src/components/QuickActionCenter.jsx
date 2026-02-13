import React from 'react';
import { Plus, Mic, TrendingUp, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const QuickActionCenter = () => {
    return (
        <div className="quick-actions">
            <motion.button
                className="action-btn income-btn"
                whileTap={{ scale: 0.95 }}
            >
                <div className="btn-icon">
                    <TrendingUp size={20} />
                </div>
                <span>Income</span>
            </motion.button>

            <motion.button
                className="action-btn expense-btn"
                whileTap={{ scale: 0.95 }}
            >
                <div className="btn-icon">
                    <ShoppingCart size={20} />
                    <Mic size={10} className="mini-mic" />
                </div>
                <span>Expense</span>
            </motion.button>

            <style dangerouslySetInnerHTML={{
                __html: `
        .quick-actions {
          display: flex;
          justify-content: center;
          gap: var(--spacing-lg);
          padding: var(--spacing-md);
          background: rgba(0,0,0,0.2);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(8px);
          position: sticky;
          bottom: 20px;
          z-index: 10;
        }
        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--text-main);
          cursor: pointer;
        }
        .btn-icon {
          width: 50px;
          height: 50px;
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        }
        .income-btn .btn-icon {
          background: var(--passive-gradient);
        }
        .expense-btn .btn-icon {
          background: var(--active-gradient);
        }
        .mini-mic {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: var(--bg-dark);
          border-radius: 50%;
          padding: 1px;
        }
        .action-btn span {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-dim);
        }
      `}} />
        </div>
    );
};

export default QuickActionCenter;
