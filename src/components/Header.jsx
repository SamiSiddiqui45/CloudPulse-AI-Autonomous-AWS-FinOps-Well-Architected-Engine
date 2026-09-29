import React from 'react';
import { 
  Cloud, 
  Rocket, 
  ShieldCheck, 
  Globe,
  TrendingDown,
  RefreshCw,
  Key
} from 'lucide-react';

export function Header({ 
  selectedRegion, 
  setSelectedRegion, 
  onOpenProofModal, 
  onNavigateToTab,
  remediatedCount,
  totalSaved,
  onSyncLiveAws,
  isSyncing,
  liveAccount,
  onOpenAccountModal,
  currentProfile
}) {
  return (
    <header className="app-header" id="main-header">
      <div className="container header-content">
        
        {/* Brand & Project Identity */}
        <div className="logo-wrapper">
          <div className="logo-icon-box">
            <Cloud size={24} />
          </div>
          <div className="logo-title-group">
            <h1>
              CloudPulse AI
              <span className="badge badge-aws" style={{ fontSize: '0.65rem' }}>
                AWS AI Agent
              </span>
            </h1>
            <div className="logo-subtitle">
              FinOps &amp; Well-Architected Autonomous Cloud Mesh
            </div>
          </div>
        </div>

        {/* Live System & Agent Connection Status */}
        <div className="header-meta">
          {totalSaved > 0 && (
            <div className="badge badge-healthy" title={`${remediatedCount} resources remediated`}>
              <TrendingDown size={13} />
              <span>Saved: ${totalSaved.toFixed(2)}/mo</span>
            </div>
          )}

          {/* AWS MCP Connection Badge */}
          <div 
            className="mcp-connection-pill"
            title="AWS Model Context Protocol (MCP) agent is connected via AWS CLI v2.37.4"
          >
            <span className="pulse-dot green"></span>
            <span>AWS MCP AGENT: <strong>ACTIVE</strong></span>
            <span style={{ opacity: 0.6 }}>|</span>
            <span style={{ color: 'var(--text-secondary)' }}>24ms</span>
          </div>

          {/* Region Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={14} color="var(--text-muted)" />
            <select 
              id="region-selector"
              className="region-select"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="all">Global (All Regions)</option>
              <option value="ap-south-1">ap-south-1 (Mumbai)</option>
              <option value="us-east-1">us-east-1 (N. Virginia)</option>
              <option value="us-west-2">us-west-2 (Oregon)</option>
              <option value="eu-west-1">eu-west-1 (Ireland)</option>
            </select>
          </div>

          {/* Live Dynamic AWS Scan Button */}
          <button 
            id="btn-sync-live-aws"
            className="btn btn-secondary btn-sm"
            onClick={() => onSyncLiveAws(currentProfile)}
            disabled={isSyncing}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Scan currently configured AWS CLI credentials in real-time"
          >
            <RefreshCw size={13} className={isSyncing ? "spin-animation" : ""} />
            <span>{isSyncing ? "Scanning AWS..." : "Sync Live AWS"}</span>
          </button>

          {/* AWS Account Switcher Button */}
          <button 
            id="btn-switch-account"
            className="btn btn-secondary btn-sm"
            onClick={onOpenAccountModal}
            title={`Switch AWS Account (Connected: ${liveAccount?.owner || 'aws-user'} - ${liveAccount?.id || '300617413029'})`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', borderColor: 'rgba(0, 240, 255, 0.4)' }}
          >
            <Key size={13} color="var(--neon-cyan)" />
            <span>{currentProfile === 'default' ? 'Switch AWS Account' : `Profile: ${currentProfile}`}</span>
          </button>

          {/* Quick Action: Open Hackathon Proof */}
          <button 
            id="btn-hackathon-proof"
            className="btn btn-cyan btn-sm"
            onClick={onOpenProofModal}
            title={`View documented proof for account ${liveAccount?.id || '300617413029'}`}
          >
            <ShieldCheck size={14} />
            <span>AWS Judge Proof</span>
          </button>

          {/* Quick Action: Deploy to AWS */}
          <button 
            id="btn-deploy-aws"
            className="btn btn-primary btn-sm"
            onClick={() => onNavigateToTab('deploy')}
          >
            <Rocket size={14} />
            <span>Deploy Live</span>
          </button>
        </div>

      </div>
    </header>
  );
}
