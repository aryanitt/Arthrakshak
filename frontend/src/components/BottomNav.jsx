import React from 'react';
import {
    LayoutDashboard,
    Receipt,
    Target,
    TrendingUp,
    CreditCard,
    Users,
    Zap,
    User
} from 'lucide-react';

const BottomNav = ({ activeMenu, onMenuChange }) => {
    const navItems = [
        { id: 'Dashboard', icon: LayoutDashboard, label: 'Home' },
        { id: 'Expenses', icon: Receipt, label: 'Spends' },
        { id: 'Goals', icon: Target, label: 'Goals' },
        { id: 'Investments', icon: TrendingUp, label: 'Invest' },
        { id: 'Loans', icon: CreditCard, label: 'Loans' },
        { id: 'Family', icon: Users, label: 'Family' },
        { id: 'AI', icon: Zap, label: 'AI' },
        { id: 'Profile', icon: User, label: 'Profile' }
    ];

    return (
        <div className="bottom-nav-v2">
            {navItems.map((item) => {
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        className={`nav-item-v2 ${activeMenu === item.id ? 'active' : ''}`}
                        onClick={() => onMenuChange(item.id)}
                    >
                        <div className="nav-icon-wrapper">
                            <Icon size={20} strokeWidth={activeMenu === item.id ? 2.5 : 2} />
                        </div>
                        <span className="nav-label-v2">{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNav;
