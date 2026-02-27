import React from 'react';
import {
    TrendingUp,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Coins,
    Gem,
    Briefcase,
    Building2,
    Calendar,
    ChevronRight,
    Zap
} from 'lucide-react';

const InvestmentsModule = () => {
    const assets = [
        { id: 1, title: 'Mutual Fund (SIP)', icon: Briefcase, value: 450000, growth: 12.5, color: '#0076F5' },
        { id: 2, title: 'Digital Gold', icon: Gem, value: 85000, growth: 8.2, color: '#FFD700' },
        { id: 3, title: 'Fixed Deposit', icon: Building2, value: 200000, growth: 7.1, color: '#19E680' },
        { id: 4, title: 'Equity Stocks', icon: TrendingUp, value: 320000, growth: -2.4, color: '#FF4D4D' }
    ];

    return (
        <div className="investments-module">
            <div className="invest-hero">
                <div className="hero-content">
                    <span className="hero-eyebrow">Wealth Management</span>
                    <h1>Portfolio Master</h1>
                    <p>India's strategy for financial freedom</p>
                </div>
                <div className="total-portfolio-val">
                    <span className="lbl">Total Asset Valuation</span>
                    <div className="val">₹12,45,000</div>
                    <div className="growth-badge positive">
                        <ArrowUpRight size={14} /> +₹1.2L (14.2%)
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="left-column">
                    <div className="base-card assets-grid">
                        <div className="card-header flex-between" style={{ marginBottom: '24px' }}>
                            <h3>Asset Allocation</h3>
                            <button className="add-asset-btn"><Coins size={16} /> New Investment</button>
                        </div>

                        <div className="asset-cards-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {assets.map(asset => {
                                const Icon = asset.icon;
                                return (
                                    <div key={asset.id} className="asset-item-card" style={{ borderLeft: `4px solid ${asset.color}` }}>
                                        <div className="asset-header">
                                            <div className="asset-icon" style={{ backgroundColor: `${asset.color}20`, color: asset.color }}>
                                                <Icon size={20} />
                                            </div>
                                            <div className={`growth-tag ${asset.growth > 0 ? 'pos' : 'neg'}`}>
                                                {asset.growth > 0 ? '+' : ''}{asset.growth}%
                                            </div>
                                        </div>
                                        <div className="asset-body">
                                            <h4>{asset.title}</h4>
                                            <div className="asset-val">₹{asset.value.toLocaleString()}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="base-card recommendations-card" style={{ marginTop: '24px' }}>
                        <div className="flex-between">
                            <h3>Strategic Recommendations</h3>
                            <Zap size={20} className="ai-zap" />
                        </div>
                        <div className="rec-list">
                            <div className="rec-item">
                                <div className="rec-dot"></div>
                                <p>Increase your SIP in **HDFC Index Fund** by ₹2,000 to meet your Retirement goal early.</p>
                            </div>
                            <div className="rec-item">
                                <div className="rec-dot"></div>
                                <p>Gold prices are dipping. A **2 gram digital gold** purchase today is recommended.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right-column">
                    <div className="base-card allocation-pie">
                        <h3>Sector Distribution</h3>
                        <div className="pie-container">
                            <PieChart size={160} strokeWidth={0.5} color="var(--primary-blue)" />
                            <div className="pie-center">
                                <strong>82%</strong>
                                <span>Equity</span>
                            </div>
                        </div>
                        <div className="legend">
                            <div className="legend-item">
                                <span className="dot" style={{ background: '#0076F5' }}></span>
                                <span>Mutual Funds</span>
                            </div>
                            <div className="legend-item">
                                <span className="dot" style={{ background: '#19E680' }}></span>
                                <span>FDs</span>
                            </div>
                            <div className="legend-item">
                                <span className="dot" style={{ background: '#FFD700' }}></span>
                                <span>Gold</span>
                            </div>
                        </div>
                    </div>

                    <div className="base-card market-insight" style={{ marginTop: '24px', background: '#0F172A', color: 'white' }}>
                        <TrendingUp size={24} style={{ color: 'var(--accent-green)', marginBottom: '12px' }} />
                        <h4>NIFTY 50 • +1.2%</h4>
                        <p style={{ fontSize: '12px', opacity: 0.7 }}>Bullish trend detected. Your portfolio mirrored the market growth perfectly.</p>
                        <button className="market-btn">View Market Pulse</button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .invest-hero { padding: 40px; background: white; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; border-radius: 0 0 40px 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
                .total-portfolio-val { text-align: right; }
                .total-portfolio-val .lbl { font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; }
                .total-portfolio-val .val { font-size: 36px; font-weight: 800; color: var(--text-main); line-height: 1; margin: 4px 0; }
                .growth-badge { display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: 20px; font-weight: 800; font-size: 13px; }
                .growth-badge.positive { background: rgba(25, 230, 128, 0.1); color: var(--accent-green); }

                .asset-item-card { background: white; padding: 24px; border-radius: 20px; border: 1px solid var(--border-subtle); transition: all 0.3s; cursor: pointer; }
                .asset-item-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.05); }
                .asset-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
                .asset-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .growth-tag { font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 8px; }
                .growth-tag.pos { background: rgba(25, 230, 128, 0.1); color: var(--accent-green); }
                .growth-tag.neg { background: rgba(255, 77, 77, 0.1); color: var(--accent-red); }
                .asset-body h4 { font-size: 14px; font-weight: 700; color: var(--text-muted); margin-bottom: 4px; }
                .asset-val { font-size: 20px; font-weight: 800; color: var(--text-main); }

                .add-asset-btn { background: var(--primary-blue); color: white; border: none; padding: 10px 16px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
                .add-asset-btn:hover { background: #000; transform: scale(1.02); }

                .rec-item { display: flex; gap: 12px; margin-top: 16px; align-items: flex-start; }
                .rec-dot { width: 8px; height: 8px; border-radius: 10px; background: var(--primary-blue); margin-top: 6px; flex-shrink: 0; }
                .rec-item p { font-size: 13px; font-weight: 600; color: var(--text-secondary); line-height: 1.5; }

                .pie-container { position: relative; display: flex; flex-direction: column; align-items: center; padding: 30px; }
                .pie-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
                .pie-center strong { font-size: 24px; display: block; }
                .legend { display: flex; justify-content: space-between; padding-top: 20px; border-top: 1px solid var(--border-subtle); }
                .legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: var(--text-muted); }
                .legend-item .dot { width: 6px; height: 6px; border-radius: 10px; }

                .market-btn { width: 100%; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: white; padding: 12px; border-radius: 12px; margin-top: 16px; font-weight: 700; cursor: pointer; }
                .ai-zap { color: var(--accent-orange); }
            ` }} />
        </div>
    );
};

export default InvestmentsModule;
