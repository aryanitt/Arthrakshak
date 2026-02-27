import React from 'react';
import {
    User,
    Shield,
    Settings,
    Bell,
    HelpCircle,
    LogOut,
    ChevronRight,
    Languages,
    Database,
    Fingerprint
} from 'lucide-react';

const AdminProfile = () => {
    return (
        <div className="admin-profile-module">
            <div className="profile-hero">
                <div className="hero-content">
                    <span className="hero-eyebrow">Identity Management</span>
                    <h1>Aryan's Strategy Root</h1>
                    <p>Security and personalization control center</p>
                </div>
                <div className="profile-badge-v2">
                    <div className="profile-pic">A</div>
                    <div className="profile-meta">
                        <strong>ARYAN</strong>
                        <span>PRO MEMBER</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="left-column">
                    <div className="base-card settings-stack">
                        <h3>General Settings</h3>
                        <div className="setting-item">
                            <div className="s-icon"><Languages size={20} /></div>
                            <div className="s-info">
                                <strong>Bilingual Interface</strong>
                                <span>Currently: **English** (Tap to switch Hindi)</span>
                            </div>
                            <button className="toggle-btn"></button>
                        </div>
                        <div className="setting-item">
                            <div className="s-icon"><Bell size={20} /></div>
                            <div className="s-info">
                                <strong>Automated Alerts</strong>
                                <span>Manage EMI & Bill notifications</span>
                            </div>
                            <ChevronRight size={18} className="s-arrow" />
                        </div>
                        <div className="setting-item">
                            <div className="s-icon"><Fingerprint size={20} /></div>
                            <div className="s-info">
                                <strong>Biometric Authentication</strong>
                                <span>Secured via Fingerprint/FaceID</span>
                            </div>
                            <button className="toggle-btn active"></button>
                        </div>
                    </div>

                    <div className="base-card security-card" style={{ marginTop: '24px' }}>
                        <div className="flex-between">
                            <h3>Security & Privacy</h3>
                            <Shield size={20} color="var(--accent-green)" />
                        </div>
                        <div className="sec-options-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
                            <div className="sec-box">
                                <Database size={18} />
                                <span>Export Data</span>
                            </div>
                            <div className="sec-box">
                                <HelpCircle size={18} />
                                <span>Support</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right-column">
                    <div className="base-card admin-stats">
                        <h3>App Metrics</h3>
                        <div className="metric-row">
                            <span>Data Sources Linked</span>
                            <strong>4 Bank/Apps</strong>
                        </div>
                        <div className="metric-row">
                            <span>Storage Usage</span>
                            <strong>1.2 MB</strong>
                        </div>
                        <div className="metric-row">
                            <span>Last Backup</span>
                            <strong>Today, 4:00 AM</strong>
                        </div>
                    </div>

                    <button className="logout-btn-premium">
                        <LogOut size={20} />
                        <span>Terminate Session</span>
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .profile-hero { padding: 40px; background: white; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-radius: 0 0 40px 40px; }
                .profile-badge-v2 { display: flex; align-items: center; gap: 16px; background: var(--bg-app); padding: 10px 20px; border-radius: 100px; border: 1px solid var(--border-subtle); }
                .profile-pic { width: 44px; height: 44px; background: var(--primary-blue); color: white; border-radius: 100%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; }
                .profile-meta strong { display: block; font-size: 14px; }
                .profile-meta span { font-size: 10px; font-weight: 800; color: var(--primary-blue); }

                .setting-item { display: flex; align-items: center; gap: 20px; padding: 16px 0; border-bottom: 1px solid var(--border-subtle); cursor: pointer; }
                .setting-item:last-child { border-bottom: none; }
                .s-icon { width: 44px; height: 44px; background: var(--primary-light-blue); color: var(--primary-blue); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .s-info { flex: 1; }
                .s-info strong { display: block; font-size: 15px; color: var(--text-main); }
                .s-info span { font-size: 12px; color: var(--text-muted); font-weight: 600; }
                .s-arrow { color: #CBD5E1; }

                .toggle-btn { width: 44px; height: 24px; background: #E2E8F0; border-radius: 100px; border: none; position: relative; cursor: pointer; }
                .toggle-btn::after { content: ''; position: absolute; left: 4px; top: 4px; width: 16px; height: 16px; background: white; border-radius: 100%; transition: 0.3s; }
                .toggle-btn.active { background: var(--accent-green); }
                .toggle-btn.active::after { left: 24px; }

                .sec-box { background: var(--bg-app); padding: 16px; border-radius: 16px; display: flex; flex-direction: column; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: var(--text-secondary); cursor: pointer; transition: 0.2s; border: 1px solid var(--border-subtle); }
                .sec-box:hover { background: white; transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.05); }

                .metric-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border-subtle); }
                .metric-row span { font-size: 13px; color: var(--text-muted); font-weight: 600; }
                .metric-row strong { font-size: 13px; color: var(--text-main); font-weight: 800; }

                .logout-btn-premium { width: 100%; padding: 16px; margin-top: 24px; background: #FEF2F2; color: #EF4444; border: 1px solid #FEE2E2; border-radius: 16px; display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: 800; cursor: pointer; transition: 0.2s; }
                .logout-btn-premium:hover { background: #EF4444; color: white; }
            ` }} />
        </div>
    );
};

export default AdminProfile;
