import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardOverview } from './components/DashboardOverview';
import { FinOpsEngine } from './components/FinOpsEngine';
import { SecurityCompliance } from './components/SecurityCompliance';
import { ResilienceSandbox } from './components/ResilienceSandbox';
import { AgentMcpTerminal } from './components/AgentMcpTerminal';
import { SubmissionProofDeploy } from './components/SubmissionProofDeploy';
import { RemediationModal } from './components/RemediationModal';
import { AgentProofModal } from './components/AgentProofModal';
import { AccountSwitcherModal } from './components/AccountSwitcherModal';
import { Toast } from './components/Toast';
import { initialAwsResources } from './data/mockAwsResources';
import confetti from 'canvas-confetti';
import './styles/components.css';

export function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [resources, setResources] = useState(initialAwsResources);
  const [selectedResourceForModal, setSelectedResourceForModal] = useState(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState('default');
  const [toast, setToast] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [liveFinops, setLiveFinops] = useState(null);
  const [livePillars, setLivePillars] = useState(null);
  const [_liveCliLogs, setLiveCliLogs] = useState([]);
  const [scanErrors, setScanErrors] = useState([]);
  const [liveAccount, setLiveAccount] = useState({
    id: "300617413029",
    user: "aws-user",
    owner: "Muhammad Hamza Siddiqui",
    location: "Karachi, PK",
    region: "ap-south-1"
  });

  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const syncLiveAws = async (targetProfile) => {
    // Safely extract string profile name; prevent SyntheticEvent object or [object Object]
    let profileToUse = currentProfile;
    if (typeof targetProfile === 'string' && targetProfile.trim() && targetProfile !== '[object Object]') {
      profileToUse = targetProfile.trim();
    } else if (targetProfile && typeof targetProfile === 'object' && typeof targetProfile.name === 'string') {
      profileToUse = targetProfile.name.trim();
    } else if (typeof currentProfile === 'string' && currentProfile.trim()) {
      profileToUse = currentProfile.trim();
    }

    setIsSyncing(true);
    try {
      const url = profileToUse && profileToUse !== 'default'
        ? `/api/aws/live-status?profile=${encodeURIComponent(profileToUse)}`
        : '/api/aws/live-status';
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.resources && Array.isArray(data.resources) && data.resources.length > 0) {
          setResources(data.resources);
        }
        if (data.account) {
          setLiveAccount(data.account);
        }
        if (data.finops) {
          setLiveFinops(data.finops);
        }
        if (data.pillars) {
          setLivePillars(data.pillars);
        }
        if (data.cliLogs) {
          setLiveCliLogs(data.cliLogs);
        }
        if (data.errors && data.errors.length > 0) {
          setScanErrors(data.errors);
          showToast(`Synced AWS with ${data.errors.length} warning(s) logged.`);
        } else {
          setScanErrors([]);
          const spend = data.finops?.totalMonthlySpend !== undefined ? `$${data.finops.totalMonthlySpend.toFixed(2)}/mo` : 'active';
          showToast(`Synced live with AWS: ${data.account?.owner || 'AWS Account'} (${data.account?.id || '300617413029'}) [${spend}]`);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(`Sync warning: ${errData.error || res.statusText}`);
      }
    } catch (err) {
      showToast(`AWS CLI error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch('/api/aws/live-status')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!isMounted || !data) return;
        if (data.resources && Array.isArray(data.resources) && data.resources.length > 0) {
          setResources(data.resources);
        }
        if (data.account) {
          setLiveAccount(data.account);
        }
        if (data.finops) {
          setLiveFinops(data.finops);
        }
        if (data.pillars) {
          setLivePillars(data.pillars);
        }
        if (data.cliLogs) {
          setLiveCliLogs(data.cliLogs);
        }
        if (data.errors) {
          setScanErrors(data.errors);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Region filtering
  const visibleResources = selectedRegion === 'all' 
    ? resources 
    : resources.filter(r => r.region === selectedRegion || r.region === 'global');

  // Single Unified Source of Truth for Security Risks across ALL tabs
  const criticalSecurityRisks = visibleResources.filter(r => !r.remediated && r.severity === 'critical');
  const criticalRiskCount = criticalSecurityRisks.length;
  const unaddressedWasteCount = visibleResources.filter(r => !r.remediated && r.wasteAmount > 0).length;
  const totalSaved = resources.filter(r => r.remediated).reduce((sum, r) => sum + r.wasteAmount, 0);

  const handleRemediateResource = (id) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, remediated: true } : r));
    const target = resources.find(r => r.id === id);
    if (target) {
      showToast(`Successfully remediated ${target.id} via AWS MCP Agent!`);
    }
  };

  const handleRemediateAll = () => {
    setResources(prev => prev.map(r => ({ ...r, remediated: true })));
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });
    showToast(`All ${resources.length} AWS resources successfully optimized and hardened!`);
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Global Application Header */}
      <Header 
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        onOpenProofModal={() => setIsProofModalOpen(true)}
        onNavigateToTab={(tab) => setActiveTab(tab)}
        remediatedCount={resources.filter(r => r.remediated).length}
        totalSaved={totalSaved}
        onSyncLiveAws={syncLiveAws}
        isSyncing={isSyncing}
        liveAccount={liveAccount}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
        currentProfile={currentProfile}
      />

      {/* Main Workspace Area */}
      <main className="container" style={{ flex: 1, paddingBottom: '60px' }}>
        
        {/* Navigation Tabs Bar */}
        <Navigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unaddressedWasteCount={unaddressedWasteCount}
          flaggedSecurityCount={criticalRiskCount}
        />

        {/* Tab 1: Executive Overview */}
        {activeTab === 'overview' && (
          <DashboardOverview 
            resources={visibleResources}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenRemediationModal={(res) => setSelectedResourceForModal(res)}
            liveFinops={liveFinops}
            livePillars={livePillars}
            liveAccount={liveAccount}
            criticalRiskCount={criticalRiskCount}
            criticalSecurityRisks={criticalSecurityRisks}
            scanErrors={scanErrors}
          />
        )}

        {/* Tab 2: FinOps & Waste Hunter */}
        {activeTab === 'finops' && (
          <FinOpsEngine 
            resources={visibleResources}
            onOpenRemediationModal={(res) => setSelectedResourceForModal(res)}
            onRemediateAll={handleRemediateAll}
            liveFinops={liveFinops}
          />
        )}

        {/* Tab 3: Security & Well-Architected 6 Pillars */}
        {activeTab === 'security' && (
          <SecurityCompliance 
            resources={visibleResources}
            onOpenRemediationModal={(res) => setSelectedResourceForModal(res)}
            livePillars={livePillars}
            criticalRiskCount={criticalRiskCount}
            criticalSecurityRisks={criticalSecurityRisks}
          />
        )}

        {/* Tab 4: Chaos Resilience Sandbox */}
        {activeTab === 'resilience' && (
          <ResilienceSandbox />
        )}

        {/* Tab 5: Agent MCP Console */}
        {activeTab === 'mcp-terminal' && (
          <AgentMcpTerminal />
        )}

        {/* Tab 6: Ship Gate Deployment & Official Submission */}
        {activeTab === 'deploy' && (
          <SubmissionProofDeploy />
        )}

      </main>

      {/* Footer */}
      <footer style={{ 
        borderTop: '1px solid var(--border-subtle)', 
        background: 'rgba(5, 8, 16, 0.9)', 
        padding: '18px 0',
        textAlign: 'center',
        fontSize: '0.775rem',
        color: 'var(--text-muted)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <strong>CloudPulse AI</strong> — Built for the AWS <em>Zero to Shipped</em> Hackathon 2026.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Category: <strong>Workplace Efficiency</strong></span>
            <span>Focus Track: <strong>Startups</strong></span>
            <span>CLI: <strong>v2.37.4</strong></span>
          </div>
        </div>
      </footer>

      {/* Remediation Review Modal */}
      {selectedResourceForModal && (
        <RemediationModal 
          resource={selectedResourceForModal}
          onClose={() => setSelectedResourceForModal(null)}
          onConfirm={handleRemediateResource}
        />
      )}

      {/* Agent Hackathon Proof Modal */}
      {isProofModalOpen && (
        <AgentProofModal 
          onClose={() => setIsProofModalOpen(false)}
          liveAccount={liveAccount}
        />
      )}

      {/* Dynamic AWS Account & Profile Switcher Modal */}
      <AccountSwitcherModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        liveAccount={liveAccount}
        currentProfile={currentProfile}
        onSelectProfile={(p) => {
          setCurrentProfile(p);
          syncLiveAws(p);
        }}
        onProfileSaved={(p) => {
          showToast(`Configured AWS profile [${p}] successfully!`);
        }}
      />

      {/* Action Notification Toast */}
      <Toast 
        toast={toast} 
        onClose={() => setToast(null)} 
      />

    </div>
  );
}

export default App;
