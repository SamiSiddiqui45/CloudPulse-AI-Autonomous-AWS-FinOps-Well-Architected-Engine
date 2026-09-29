import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Wrench
} from 'lucide-react';
import { wellArchitectedPillars } from '../data/wellArchitectedRules';

export function SecurityCompliance({ 
  resources = [], 
  onOpenRemediationModal,
  livePillars,
  criticalRiskCount,
  criticalSecurityRisks
}) {
  const [selectedPillarId, setSelectedPillarId] = useState('security');

  const pillarsToUse = (livePillars && livePillars.length > 0) ? livePillars : wellArchitectedPillars;
  const activePillar = pillarsToUse.find(p => p.id === selectedPillarId) || pillarsToUse[0];

  const activeRisks = criticalSecurityRisks || resources.filter(r => !r.remediated && r.severity === 'critical');
  const activeRiskCount = typeof criticalRiskCount === 'number' ? criticalRiskCount : activeRisks.length;

  const totalCheckpoints = pillarsToUse.reduce((acc, p) => acc + (p.checkpoints ? p.checkpoints.length : 0), 0) || 24;
  const passedCheckpoints = pillarsToUse.reduce((acc, p) => acc + (p.checkpoints ? p.checkpoints.filter(c => c.passed).length : 0), 0);

  return (
    <div className="animate-fade-in" id="security-compliance">
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div className="badge badge-danger">
                AWS Well-Architected Framework &amp; Security Posture
              </div>
              <span className="badge" style={{ 
                background: livePillars ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', 
                color: livePillars ? '#34D399' : '#FBBF24', 
                border: '1px solid currentColor', 
                fontSize: '0.7rem' 
              }}>
                {livePillars ? '● LIVE POSTURE' : '◐ BEST PRACTICE'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
              Autonomous 6-Pillar Architectural Assessment (CloudPulse AI Estimate)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '680px' }}>
              CloudPulse AI independently evaluates your multi-account AWS environment against the official AWS Well-Architected Framework: Security, Reliability, Performance Efficiency, Cost Optimization, Operational Excellence, and Sustainability (internal estimate; 0 workloads defined in AWS Tool).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="glass-panel" style={{ padding: '12px 18px', textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>High-Risk Findings</div>
              <div className="mono-font" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-danger)' }}>
                {activeRiskCount}
              </div>
            </div>
            <div className="glass-panel" style={{ padding: '12px 18px', textAlign: 'center', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Compliance Checkpoints</div>
              <div className="mono-font" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-healthy)' }}>
                {passedCheckpoints} / {totalCheckpoints}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Security Alerts Section */}
      {activeRisks.some(r => !r.remediated) && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <ShieldAlert size={20} color="var(--status-danger)" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FCA5A5' }}>
              Critical Security Posture Violations Detected ({activeRisks.filter(r => !r.remediated).length})
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
            {activeRisks.map((risk) => (
              <div 
                key={risk.id}
                className="glass-panel"
                style={{ 
                  padding: '20px', 
                  borderLeft: '4px solid var(--status-danger)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-danger">
                      <Lock size={12} /> {risk.service} Exposure
                    </span>
                    <span className="mono-font" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {risk.region}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>
                    {risk.name}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {risk.issue}
                  </p>
                  <div style={{ 
                    padding: '8px 12px', 
                    background: 'rgba(0,0,0,0.3)', 
                    borderRadius: '6px', 
                    fontSize: '0.75rem', 
                    color: 'var(--neon-cyan)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    Fix: {risk.recommendation}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Auto-generated least privilege policy
                  </span>
                  {risk.remediated ? (
                    <span className="badge badge-healthy">Remediated</span>
                  ) : (
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => onOpenRemediationModal(risk)}
                    >
                      <Wrench size={13} />
                      <span>Remediate via MCP</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6-Pillars Matrix */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>
          AWS Well-Architected Framework: 6 Pillars Breakdown
        </h3>

        {/* Pillar Selector Cards */}
        <div className="pillars-grid" style={{ marginBottom: '24px' }}>
          {pillarsToUse.map((pillar) => {
            const isSelected = pillar.id === selectedPillarId;
            return (
              <div 
                key={pillar.id}
                className="glass-panel pillar-card"
                onClick={() => setSelectedPillarId(pillar.id)}
                style={{ 
                  cursor: 'pointer',
                  borderColor: isSelected ? pillar.color : 'var(--border-subtle)',
                  boxShadow: isSelected ? `0 0 20px ${pillar.color}25` : 'none',
                  position: 'relative'
                }}
              >
                <div className="pillar-header">
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{pillar.title}</h4>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      {pillar.status}
                    </span>
                  </div>
                  <div 
                    className="pillar-score-badge"
                    style={{ 
                      background: `${pillar.color}20`, 
                      color: pillar.color,
                      border: `1px solid ${pillar.color}40`
                    }}
                  >
                    {pillar.score}%
                  </div>
                </div>

                <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {pillar.summary}
                </p>

                <div className="progress-track">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${pillar.score}%`, background: pillar.color }} 
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Pillar Checkpoints Deep-Dive */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                {activePillar.title} Pillar — Detailed Verification Matrix
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Modeled on AWS Well-Architected Framework best practices (CloudPulse AI independent assessment)
              </p>
            </div>
            <span className="badge badge-aws">{livePillars ? '● CloudPulse AI Live Audit' : 'CloudPulse AI Framework Estimate'}</span>
          </div>

          <div className="checkpoints-list">
            {activePillar.checkpoints.map((cp, idx) => (
              <div 
                key={idx}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  background: cp.passed ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                  border: `1px solid ${cp.passed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {cp.passed ? (
                    <CheckCircle2 size={18} color="var(--status-healthy)" />
                  ) : (
                    <XCircle size={18} color="var(--status-danger)" />
                  )}
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: cp.passed ? 'var(--text-primary)' : '#FCA5A5' }}>
                      {cp.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {cp.detail}
                    </div>
                  </div>
                </div>

                <div>
                  {cp.passed ? (
                    <span className="badge badge-healthy">Passed</span>
                  ) : (
                    <span className="badge badge-danger">Non-Compliant</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
