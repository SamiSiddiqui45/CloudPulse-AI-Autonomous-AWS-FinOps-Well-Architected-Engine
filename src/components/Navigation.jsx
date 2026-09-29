import React from 'react';
import { 
  LayoutDashboard, 
  DollarSign, 
  ShieldAlert, 
  Activity, 
  Terminal, 
  Award
} from 'lucide-react';

export function Navigation({ activeTab, setActiveTab, unaddressedWasteCount, flaggedSecurityCount }) {
  const tabs = [
    {
      id: 'overview',
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'finops',
      label: 'FinOps & Waste Hunter',
      icon: DollarSign,
      badge: unaddressedWasteCount > 0 ? `${unaddressedWasteCount} Anomaly` : 'Clean',
      badgeColor: unaddressedWasteCount > 0 ? 'badge-warning' : 'badge-healthy'
    },
    {
      id: 'security',
      label: 'Security & 6 Pillars',
      icon: ShieldAlert,
      badge: flaggedSecurityCount > 0 ? `${flaggedSecurityCount} Risks` : 'Passing',
      badgeColor: flaggedSecurityCount > 0 ? 'badge-danger' : 'badge-healthy'
    },
    {
      id: 'resilience',
      label: 'Chaos Resilience Sandbox',
      icon: Activity,
      badge: 'Live Drill',
      badgeColor: 'badge-cyan'
    },
    {
      id: 'mcp-terminal',
      label: 'Agent MCP Console',
      icon: Terminal,
      badge: 'v2.37',
      badgeColor: 'badge-aws'
    },
    {
      id: 'deploy',
      label: 'Ship Gate & Submission',
      icon: Award,
      badge: 'Mandatory',
      badgeColor: 'badge-aws',
      special: true
    }
  ];

  return (
    <nav className="nav-tabs-bar" id="main-navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-nav-${tab.id}`}
            className={`nav-tab-btn ${isActive ? 'active' : ''} ${tab.special ? 'special-proof' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon size={16} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`badge ${tab.badgeColor}`} style={{ fontSize: '0.65rem' }}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
