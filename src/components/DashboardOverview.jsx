import React from 'react';
import { 
  DollarSign, 
  TrendingDown, 
  ShieldCheck, 
  Zap, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { serviceCostBreakdown, spendTrendData } from '../data/mockAwsResources';
import { wellArchitectedPillars } from '../data/wellArchitectedRules';

export function DashboardOverview({ 
  resources, 
  onNavigateToTab, 
  onOpenRemediationModal,
  liveFinops,
  livePillars,
  liveAccount,
  criticalRiskCount = 0,
  scanErrors = []
}) {
  const unaddressedResources = resources.filter(r => !r.remediated);
  const totalSaved = resources.filter(r => r.remediated).reduce((acc, r) => acc + r.wasteAmount, 0);

  // Read from Live FinOps if available, else fallback
  const isLiveSpend = Boolean(liveFinops?.isLive);
  const totalMonthlySpend = liveFinops?.totalMonthlySpend !== undefined 
    ? liveFinops.totalMonthlySpend 
    : resources.reduce((acc, r) => acc + r.monthlyCost, 0);

  const totalWaste = liveFinops?.potentialSavings !== undefined
    ? liveFinops.potentialSavings
    : unaddressedResources.reduce((acc, r) => acc + r.wasteAmount, 0);

  const dailyAverage = liveFinops?.dailyAverage || (totalMonthlySpend > 0 ? (totalMonthlySpend / 28).toFixed(2) : '0.00');

  // Overall Well-Architected score calculation from Live Pillars or baseline
  const activePillars = livePillars && livePillars.length > 0 ? livePillars : wellArchitectedPillars;
  const overallScore = Math.round(
    activePillars.reduce((acc, p) => acc + p.score, 0) / activePillars.length
  );

  // 7-Day Spend & Anomaly Trend (Live from Cost Explorer or baseline)
  const trendData = (liveFinops?.dailySpendTrend && liveFinops.dailySpendTrend.length > 0)
    ? liveFinops.dailySpendTrend
    : spendTrendData;

  const detectedSpikes = trendData.filter(d => d.anomaly);
  const spikeCount = detectedSpikes.length;

  // Dynamic SVG Coordinates calculation
  const maxVal = Math.max(...trendData.map(d => d.spend), 11);
  const minVal = Math.min(...trendData.map(d => d.spend), 0);
  const range = maxVal - minVal || 1;

  const points = trendData.map((d, idx) => {
    const x = 50 + idx * 100;
    // Map spend to y between 45 (high) and 165 (low)
    const normalized = (d.spend - minVal) / range;
    const y = 165 - normalized * 115;
    return { x, y, ...d };
  });

  const polylineStr = points.map(p => `${p.x},${p.y.toFixed(1)}`).join(' ');
  const polygonStr = `${polylineStr} 650,170 50,170`;

  // Top Service Breakdown List
  const breakdownList = (liveFinops?.serviceBreakdown && liveFinops.serviceBreakdown.length > 0)
    ? liveFinops.serviceBreakdown
    : serviceCostBreakdown;

  const topService = breakdownList[0];

  return (
    <div className="animate-fade-in" id="dashboard-overview">
      
      {/* 4 KPI Cards */}
      <div className="kpi-grid">
        
        {/* KPI 1: Spend */}
        <div className="glass-panel kpi-card" style={{ '--card-accent': '#FF9900' }}>
          <div className="kpi-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Monthly AWS Spend</span>
              <span className={`badge ${isLiveSpend ? 'badge-healthy' : 'badge-warning'}`} style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                {isLiveSpend ? 'LIVE CE' : 'MOCK/ESTIMATED'}
              </span>
            </div>
            <div className="kpi-icon-wrap" style={{ color: '#FF9900' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div className="kpi-value mono-font" style={{ color: '#F8FAFC' }}>
            ${totalMonthlySpend.toFixed(2)}
          </div>
          <div className="kpi-footer">
            <span style={{ color: 'var(--status-danger)', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <ArrowUpRight size={14} /> ${dailyAverage}/day
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              {topService ? `${topService.name.slice(0, 20)} active` : 'Active AWS workloads'}
            </span>
          </div>
        </div>

        {/* KPI 2: Identified Waste / FinOps Savings */}
        <div className="glass-panel kpi-card" style={{ '--card-accent': '#00F0FF' }}>
          <div className="kpi-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Potential Monthly Savings</span>
              <span className={`badge ${totalWaste > 0 ? 'badge-danger' : 'badge-healthy'}`} style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                {totalWaste > 0 ? 'WASTE DETECTED' : 'CLEAN'}
              </span>
            </div>
            <div className="kpi-icon-wrap" style={{ color: '#00F0FF' }}>
              <TrendingDown size={18} />
            </div>
          </div>
          <div className="kpi-value mono-font" style={{ color: '#00F0FF' }}>
            ${totalWaste.toFixed(2)}
          </div>
          <div className="kpi-footer">
            <span style={{ color: 'var(--status-healthy)', display: 'flex', alignItems: 'center' }}>
              <ArrowDownRight size={14} /> ${(totalWaste * 12).toLocaleString()}/yr
            </span>
            <span style={{ color: 'var(--text-muted)' }}>recoverable via 1-click MCP</span>
          </div>
        </div>

        {/* KPI 3: CloudPulse AI Estimated Score */}
        <div className="glass-panel kpi-card" style={{ '--card-accent': '#10B981' }}>
          <div className="kpi-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>CloudPulse AI Estimated Score</span>
              <span className={`badge ${livePillars ? 'badge-healthy' : 'badge-warning'}`} style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                {livePillars ? 'ESTIMATED HEURISTIC' : 'SIMULATED BASELINE'}
              </span>
            </div>
            <div className="kpi-icon-wrap" style={{ color: '#10B981' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="kpi-value mono-font" style={{ color: '#10B981' }}>
            {overallScore}<span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <div className="kpi-footer">
            <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
              6 Well-Architected Pillars Modeled
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              {criticalRiskCount} high-risk findings
            </span>
          </div>
        </div>

        {/* KPI 4: Autonomous Remediation */}
        <div className="glass-panel kpi-card" style={{ '--card-accent': '#A855F7' }}>
          <div className="kpi-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Autonomous Actions</span>
              <span className="badge badge-cyan" style={{ fontSize: '0.6rem', padding: '1px 6px' }}>
                MCP LOOP
              </span>
            </div>
            <div className="kpi-icon-wrap" style={{ color: '#A855F7' }}>
              <Zap size={18} />
            </div>
          </div>
          <div className="kpi-value mono-font" style={{ color: '#A855F7' }}>
            {resources.filter(r => r.remediated).length}
            <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}> / {resources.length}</span>
          </div>
          <div className="kpi-footer">
            <span style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>
              ${totalSaved.toFixed(2)}/mo saved
            </span>
            <span style={{ color: 'var(--text-muted)' }}>via Agent MCP</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Chart & Telemetry Stream */}
      <div className="dashboard-main-grid">
        
        {/* Left Column: 7-Day Spend & Anomaly Chart */}
        <div className="glass-panel chart-card">
          <div className="chart-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="chart-title">AWS Cost Explorer — 7-Day Spend &amp; Anomaly Detection</div>
                <span className={`badge ${isLiveSpend ? 'badge-healthy' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                  {isLiveSpend ? 'LIVE CE' : 'MOCK/ESTIMATED'}
                </span>
              </div>
              <div className="chart-subtitle">Telemetry stream from CloudWatch &amp; AWS Cost Ingestion API</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="badge badge-aws">Daily Granularity</span>
              {spikeCount > 0 ? (
                <span className="badge badge-danger">{spikeCount} Spike{spikeCount > 1 ? 's' : ''} Detected</span>
              ) : (
                <span className="badge badge-healthy">Spend Stable</span>
              )}
            </div>
          </div>

          {/* Dynamic SVG Line Chart */}
          <div className="svg-chart-container">
            <svg viewBox="0 0 700 200" width="100%" height="100%" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF9900" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#FF9900" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="anomalyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="680" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
              <line x1="40" y1="70" x2="680" y2="70" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
              <line x1="40" y1="120" x2="680" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
              <line x1="40" y1="170" x2="680" y2="170" stroke="rgba(255,255,255,0.12)" />

              {/* Y Axis Labels */}
              <text x="5" y="24" fill="#64748B" fontSize="11" fontFamily="JetBrains Mono">${maxVal.toFixed(0)}/d</text>
              <text x="5" y="74" fill="#64748B" fontSize="11" fontFamily="JetBrains Mono">${((maxVal * 2) / 3).toFixed(0)}/d</text>
              <text x="5" y="124" fill="#64748B" fontSize="11" fontFamily="JetBrains Mono">${(maxVal / 3).toFixed(0)}/d</text>
              <text x="5" y="174" fill="#64748B" fontSize="11" fontFamily="JetBrains Mono">$0/d</text>

              {/* Target Baseline Line ($0.50 baseline = y:165) */}
              <line x1="50" y1="165" x2="670" y2="165" stroke="#10B981" strokeWidth="2" strokeDasharray="5 5" opacity="0.6" />
              <text x="550" y="158" fill="#10B981" fontSize="10" fontWeight="600">Target Baseline ($0.50/d)</text>

              {/* Shaded Area Under Curve */}
              <polygon points={polygonStr} fill="url(#areaGrad)" />

              {/* Spend Curve Line */}
              <polyline fill="none" stroke="#FF9900" strokeWidth="3" points={polylineStr} />

              {/* Data Points */}
              {points.map((p) => (
                <g key={p.date || p.day}>
                  {p.anomaly ? (
                    <>
                      <circle cx={p.x} cy={p.y} r="7" fill="#EF4444" stroke="#FFF" strokeWidth="2" />
                      <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="2" opacity="0.8" />
                      <text x={p.x - 12} y="190" fill="#EF4444" fontWeight="700" fontSize="11" fontFamily="JetBrains Mono">{p.day}</text>
                      <text x={Math.max(40, p.x - 100)} y={Math.max(25, p.y - 14)} fill="#EF4444" fontWeight="700" fontSize="11" fontFamily="JetBrains Mono">
                        ${p.spend.toFixed(2)}/d {p.reason ? `(${p.reason.slice(0, 24)})` : ''}
                      </text>
                    </>
                  ) : (
                    <>
                      <circle cx={p.x} cy={p.y} r="4" fill="#FF9900" />
                      <text x={p.x - 10} y="190" fill="#94A3B8" fontSize="11" fontFamily="JetBrains Mono">{p.day}</text>
                    </>
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* Anomaly Callout Banner */}
          {totalWaste > 0 ? (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={18} color="#EF4444" />
                <span style={{ fontSize: '0.825rem', color: '#FCA5A5' }}>
                  <strong>AWS Cost Explorer Finding:</strong> {topService?.name || 'QuickSight Enterprise'} active (${topService?.cost?.toFixed(2) || '261.00'}/mo, ~${dailyAverage}/day). Account: <em>{liveAccount?.user || 'aws-user'}</em> ({liveAccount?.id || '300617413029'}).
                </span>
              </div>
              <button 
                className="btn btn-danger btn-sm"
                onClick={() => onNavigateToTab('finops')}
              >
                Remediate in FinOps
              </button>
            </div>
          ) : (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle2 size={18} color="#10B981" />
              <span style={{ fontSize: '0.825rem', color: '#86EFAC' }}>
                <strong>Cloud Health Hardened:</strong> Zero active FinOps waste detected. Infrastructure matches minimum baseline.
              </span>
            </div>
          )}

        </div>

        {/* Right Column: Service Cost Breakdown */}
        <div className="glass-panel chart-card">
          <div className="chart-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="chart-title">AWS Service Spend Breakdown</div>
                <span className={`badge ${isLiveSpend ? 'badge-healthy' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                  {isLiveSpend ? 'LIVE CE' : 'MOCK/ESTIMATED'}
                </span>
              </div>
              <div className="chart-subtitle">Aggregated by AWS Cost Allocation &amp; CE APIs</div>
            </div>
            <span className="badge badge-cyan">Monthly Active</span>
          </div>

          <div className="service-breakdown-list">
            {breakdownList.map((item) => (
              <div key={item.name} className="service-item">
                <div className="service-item-header">
                  <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                  <span className="mono-font" style={{ color: '#F8FAFC' }}>
                    ${item.cost.toFixed(2)} <span style={{ color: 'var(--text-muted)' }}>({item.percentage}%)</span>
                  </span>
                </div>
                <div className="progress-track">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${Math.min(100, Math.max(2, item.percentage))}%`, 
                      background: item.color || '#FF9900' 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <button 
              className="btn btn-secondary" 
              style={{ width: '100%', justifyContent: 'space-between' }}
              onClick={() => onNavigateToTab('security')}
            >
              <span>View 6-Pillar Well-Architected Matrix</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* Optional Scan Warnings Box */}
      {scanErrors && scanErrors.length > 0 && (
        <div className="glass-panel" style={{ padding: '14px 20px', marginBottom: '24px', borderColor: 'rgba(245, 158, 11, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FBBF24', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
            <AlertCircle size={16} />
            <span>AWS CLI Scan Telemetry Warnings ({scanErrors.length})</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Some AWS APIs returned permission warnings (safe fallbacks active):
            <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
              {scanErrors.slice(0, 3).map((err, i) => (
                <li key={i} className="mono-font" style={{ fontSize: '0.7rem' }}>
                  {err.command}: {err.message?.slice(0, 100)} (exit code {err.exitCode})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Top 3 High-Priority Action Items Banner */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="var(--aws-orange)" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Immediate Autonomous Action Recommendations</h3>
          </div>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Zero-downtime fixes pre-calculated by CloudPulse Agent
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {unaddressedResources.slice(0, 3).map((res) => (
            <div 
              key={res.id} 
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="mono-font" style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)' }}>{res.id}</span>
                  <span className={`badge ${res.severity === 'critical' ? 'badge-danger' : 'badge-warning'}`}>
                    {res.severity}
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '4px' }}>{res.name}</div>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{res.issue}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="mono-font" style={{ fontSize: '0.8rem', color: 'var(--status-healthy)', fontWeight: 700 }}>
                  Save ${res.wasteAmount.toFixed(2)}/mo
                </span>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenRemediationModal(res)}
                >
                  Remediate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
