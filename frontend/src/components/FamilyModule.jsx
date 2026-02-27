import React from 'react';
import {
    Users,
    Heart,
    Baby,
    GraduationCap,
    Briefcase,
    ArrowUpRight,
    ShieldCheck,
    Plus,
    ChevronRight
} from 'lucide-react';

const FamilyModule = () => {
    const familyGoals = [
        { id: 1, title: 'Prisha Marriage Fund', icon: Heart, target: '₹20,00,000', saved: '₹5,40,000', color: '#FF4D8D' },
        { id: 2, title: 'Son Education (IIT)', icon: GraduationCap, target: '₹15,00,000', saved: '₹2,10,000', color: '#0076F5' },
        { id: 3, title: 'Elder Care Reserve', icon: Baby, target: '₹10,00,000', saved: '₹8,45,000', color: '#19E680' }
    ];

    return (
        <div className="family-module">
            <div className="family-hero">
                <div className="hero-content">
                    <span className="hero-eyebrow">Collective Security</span>
                    <h1>Family Financials</h1>
                    <p>Securing the future of your loved ones</p>
                </div>
                <div className="shared-wallet-cta">
                    <div className="avatar-group">
                        <div className="avatar">A</div>
                        <div className="avatar">P</div>
                        <div className="avatar">+</div>
                    </div>
                    <span>Shared Family Wallet Active</span>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="left-column">
                    <div className="base-card family-goals-card">
                        <div className="flex-between" style={{ marginBottom: '24px' }}>
                            <h3>Future Milestones</h3>
                            <button className="add-family-btn"><Plus size={16} /> New Fund</button>
                        </div>

                        <div className="family-goal-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {familyGoals.map(goal => {
                                const Icon = goal.icon;
                                return (
                                    <div key={goal.id} className="family-item" style={{ background: goal.color }}>
                                        <div className="item-inner">
                                            <div className="icon-box"><Icon size={24} /></div>
                                            <h4>{goal.title}</h4>
                                            <div className="stats-box">
                                                <div className="stat">
                                                    <span className="lbl">Target</span>
                                                    <span className="val">{goal.target}</span>
                                                </div>
                                                <div className="stat">
                                                    <span className="lbl">Corpus</span>
                                                    <span className="val">{goal.saved}</span>
                                                </div>
                                            </div>
                                            <div className="f-prog-bar">
                                                <div className="f-fill" style={{ width: '40%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="right-column">
                    <div className="base-card insurance-card">
                        <div className="flex-between">
                            <h3>Active Protection</h3>
                            <ShieldCheck size={20} style={{ color: 'var(--accent-green)' }} />
                        </div>
                        <div className="ins-list" style={{ marginTop: '16px' }}>
                            <div className="ins-item">
                                <span className="ins-lbl">Life Cover (Term)</span>
                                <span className="ins-val">₹1 Crore</span>
                            </div>
                            <div className="ins-item">
                                <span className="ins-lbl">Family Floater</span>
                                <span className="ins-val">₹10 Lakhs</span>
                            </div>
                        </div>
                        <button className="ins-review-btn">Review All Policies</button>
                    </div>

                    <div className="base-card business-summary" style={{ marginTop: '20px' }}>
                        <div className="flex-between">
                            <h3>Business Ledger</h3>
                            <Briefcase size={20} color="var(--primary-blue)" />
                        </div>
                        <p style={{ fontSize: '13px', marginTop: '12px', color: 'var(--text-muted)' }}>You have **₹1,24,000** in pending receivables from 4 clients.</p>
                        <button className="view-ledger-btn">Open Business Vault <ChevronRight size={14} /></button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .family-hero { padding: 40px; background: white; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-radius: 0 0 40px 40px; }
                .shared-wallet-cta { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
                .avatar-group { display: flex; gap: -8px; }
                .avatar { width: 36px; height: 36px; border-radius: 100%; background: var(--primary-blue); color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; border: 3px solid white; margin-left: -12px; }
                .shared-wallet-cta span { font-size: 12px; font-weight: 700; color: var(--accent-green); }

                .family-item { border-radius: 28px; padding: 2px; color: white; }
                .item-inner { padding: 24px; }
                .icon-box { margin-bottom: 16px; opacity: 0.9; }
                .family-item h4 { font-size: 18px; font-weight: 800; margin-bottom: 20px; line-height: 1.2; }
                .stats-box { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
                .stat .lbl { font-size: 10px; font-weight: 700; opacity: 0.7; text-transform: uppercase; display: block; }
                .stat .val { font-size: 15px; font-weight: 800; }
                .f-prog-bar { height: 6px; background: rgba(255,255,255,0.2); border-radius: 10px; }
                .f-fill { height: 100%; background: white; border-radius: 10px; }

                .add-family-btn { border: 1.5px solid var(--border-subtle); background: white; color: var(--text-main); padding: 10px 16px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; }
                
                .ins-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border-subtle); }
                .ins-lbl { font-size: 13px; font-weight: 600; color: var(--text-muted); }
                .ins-val { font-size: 14px; font-weight: 800; color: var(--text-main); }
                .ins-review-btn { width: 100%; padding: 12px; margin-top: 16px; border-radius: 12px; border: none; background: #0F172A; color: white; font-weight: 700; cursor: pointer; }

                .view-ledger-btn { background: none; border: none; color: var(--primary-blue); font-weight: 800; font-size: 13px; margin-top: 12px; display: flex; align-items: center; gap: 4px; cursor: pointer; }
            ` }} />
        </div>
    );
};

export default FamilyModule;
