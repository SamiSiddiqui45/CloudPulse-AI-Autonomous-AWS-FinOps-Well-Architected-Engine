import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Layers,
  Wrench
} from 'lucide-react';

export function FinOpsEngine({ 
  resources, 
  onOpenRemediationModal, 
  onRemediateAll,
  liveFinops
}) {
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const serviceCategories = ['ALL', 'QuickSight', 'EC2', 'EBS', 'VPC', 'S3', 'RDS', 'EC2-EIP'];
  const availableServices = Array.from(new Set([...serviceCategories, ...resources.map(r => r.service)]));

  const filteredResources = resources.filter(res => {
    const matchesService = serviceFilter === 'ALL' || res.service === serviceFilter;
    const matchesQuery = res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         res.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         res.issue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesService && matchesQuery;
  });

  const totalWasteRemaining = liveFinops?.potentialSavings !== undefined
    ? liveFinops.potentialSavings
    : resources.filter(r => !r.remediated).reduce((sum, r) => sum + r.wasteAmount, 0);

  const totalSaved = resources
    .filter(r => r.remediated)
    .reduce((sum, r) => sum + r.wasteAmount, 0);

  return (
    <div className="animate-fade-in" id="finops-engine">
      
      {/* FinOps Hero Summary Banner */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div className="badge badge-aws">
                FinOps Autonomous Cost Hunter
              </div>
              <span className={`badge ${liveFinops?.isLive ? 'badge-healthy' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                {liveFinops?.isLive ? 'LIVE CE' : 'MOCK/ESTIMATED'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
              Identified Cloud Waste: <span className="mono-font" style={{ color: 'var(--neon-cyan)' }}>${totalWasteRemaining.toFixed(2)}/mo</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '640px' }}>
              CloudPulse AI continuously inspects CloudWatch metric streams, EBS attachment states, NAT gateway packet egress, and S3 access tiers using zero-agent AWS APIs.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Accumulated Annualized Savings
              </div>
              <div className="mono-font" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--status-healthy)' }}>
                +${(totalSaved * 12).toLocaleString()}/yr
              </div>
            </div>

            <button 
              id="btn-remediate-all"
              className="btn btn-primary"
              onClick={onRemediateAll}
              disabled={totalWasteRemaining === 0}
            >
              <Sparkles size={16} />
              <span>Auto-Remediate All Waste</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        
        {/* Service Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
          {availableServices.map((srv) => (
            <button
              key={srv}
              className={`btn btn-sm ${serviceFilter === srv ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setServiceFilter(srv)}
            >
              {srv}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            placeholder="Search by ID, name, or anomaly..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Waste Inventory Table */}
      <div className="resource-table-container">
        <table className="resource-table" id="finops-resources-table">
          <thead>
            <tr>
              <th>AWS Resource</th>
              <th>Service &amp; Region</th>
              <th>Current Spend</th>
              <th>Utilization Rate</th>
              <th>Monthly Waste</th>
              <th>AI Recommendation</th>
              <th style={{ textAlign: 'right' }}>Remediation Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map((res) => (
              <tr key={res.id}>
                {/* Resource Name and ID */}
                <td>
                  <div className="resource-name-cell">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="resource-desc">{res.name}</span>
                      {res.type && (
                        <span 
                          className="badge" 
                          style={{ 
                            fontSize: '0.675rem', 
                            padding: '1px 6px',
                            background: res.objectCountStatus === 'unavailable' 
                              ? 'rgba(239, 68, 68, 0.15)' 
                              : 'rgba(59, 130, 246, 0.15)',
                            color: res.objectCountStatus === 'unavailable' ? '#FCA5A5' : '#93C5FD',
                            border: `1px solid ${res.objectCountStatus === 'unavailable' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                          }}
                        >
                          {res.type}
                        </span>
                      )}
                    </div>
                    <span className="resource-id">{res.id}</span>
                  </div>
                </td>

                {/* Service and Region */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-aws">{res.service}</span>
                    <span className="mono-font" style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      {res.region}
                    </span>
                  </div>
                </td>

                {/* Current Spend */}
                <td>
                  <span className="mono-font" style={{ fontWeight: 600 }}>
                    ${res.monthlyCost.toFixed(2)}/mo
                  </span>
                </td>

                {/* Utilization */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="progress-track" style={{ width: '60px', height: '6px' }}>
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${Math.min(res.utilization * 10, 100)}%`,
                          background: res.utilization < 10 ? 'var(--status-danger)' : 'var(--status-healthy)'
                        }}
                      />
                    </div>
                    <span className="mono-font" style={{ fontSize: '0.75rem', color: res.utilization < 10 ? 'var(--status-danger)' : 'var(--text-secondary)' }}>
                      {res.utilization}%
                    </span>
                  </div>
                </td>

                {/* Monthly Waste */}
                <td>
                  <span className="mono-font" style={{ 
                    fontWeight: 700, 
                    color: res.wasteAmount > 0 ? 'var(--neon-cyan)' : 'var(--text-muted)' 
                  }}>
                    ${res.wasteAmount.toFixed(2)}
                  </span>
                </td>

                {/* Recommendation */}
                <td style={{ maxWidth: '300px' }}>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-primary)', marginBottom: '3px' }}>
                    {res.recommendation}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    {res.issue}
                  </div>
                </td>

                {/* Action Button */}
                <td style={{ textAlign: 'right' }}>
                  {res.remediated ? (
                    <span className="badge badge-healthy" style={{ padding: '6px 12px' }}>
                      <CheckCircle2 size={12} /> Remediated
                    </span>
                  ) : (
                    <button 
                      id={`btn-remediate-${res.id}`}
                      className="btn btn-primary btn-sm"
                      onClick={() => onOpenRemediationModal(res)}
                    >
                      <Wrench size={13} />
                      <span>Remediate via MCP</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FinOps Principles Deep-Dive Info Box */}
      <div className="glass-panel" style={{ marginTop: '24px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Layers size={18} color="var(--neon-cyan)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
            Enterprise FinOps Architecture &amp; Methodology
          </h3>
        </div>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          CloudPulse AI operates on the FinOps Foundation lifecycle: <strong>Inform, Optimize, and Operate</strong>. 
          Through Model Context Protocol (MCP) integrations with AWS Cost Explorer and CloudWatch, CloudPulse does not require invasive server agents. It identifies idle resources using rolling 14-day P95 heuristics and generates non-destructive, zero-downtime remediation blueprints.
        </p>
      </div>

    </div>
  );
}
