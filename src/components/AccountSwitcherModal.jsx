import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  UserCheck, 
  RefreshCw, 
  CheckCircle2, 
  Plus, 
  Layers, 
  Eye, 
  EyeOff, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export function AccountSwitcherModal({ 
  isOpen, 
  onClose, 
  liveAccount, 
  currentProfile, 
  onSelectProfile,
  onProfileSaved
}) {
  const [profiles, setProfiles] = useState(['default']);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [activeTab, setActiveTab] = useState('switch'); // 'switch' or 'add'
  
  // New profile form state
  const [profileName, setProfileName] = useState('');
  const [accessKeyId, setAccessKeyId] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [region, setRegion] = useState('ap-south-1');
  const [showSecret, setShowSecret] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    let ignore = false;
    if (isOpen) {
      fetch('/api/aws/profiles')
        .then(res => res.json())
        .then(data => {
          if (!ignore && data.profiles && Array.isArray(data.profiles)) {
            setProfiles(data.profiles);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (!ignore) {
            setLoadingProfiles(false);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveNewProfile = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!profileName.trim()) {
      setFormError('Please provide a profile name (e.g., client-prod, dev-account).');
      return;
    }
    if (!accessKeyId.trim() || !secretAccessKey.trim()) {
      setFormError('AWS Access Key ID and Secret Access Key are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/aws/save-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileName: profileName.trim(),
          accessKeyId: accessKeyId.trim(),
          secretAccessKey: secretAccessKey.trim(),
          region
        })
      });
      const data = await res.json();
      if (data.success) {
        if (!profiles.includes(data.profile)) {
          setProfiles(prev => [...prev, data.profile]);
        }
        if (onProfileSaved) {
          onProfileSaved(data.profile);
        }
        onSelectProfile(data.profile);
        setActiveTab('switch');
        setProfileName('');
        setAccessKeyId('');
        setSecretAccessKey('');
      } else {
        setFormError(data.error || 'Failed to save AWS profile.');
      }
    } catch (err) {
      setFormError(err.message || 'Network error while saving profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" id="account-switcher-modal" onClick={onClose}>
      <div 
        className="modal-content glass-panel" 
        style={{ maxWidth: '640px', border: '1px solid rgba(0, 240, 255, 0.3)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              padding: '8px', 
              borderRadius: '8px', 
              background: 'rgba(0, 240, 255, 0.15)', 
              color: 'var(--neon-cyan)' 
            }}>
              <Key size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                AWS Account &amp; Profile Switcher
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Dynamic multi-account management with live telemetry
              </p>
            </div>
          </div>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={onClose}
            style={{ padding: '6px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Current Active Account Box */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(8, 12, 22, 0.6) 100%)', 
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--neon-green)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                <span className="pulse-dot green" style={{ width: '8px', height: '8px' }}></span>
                Active Connected AWS Account
              </span>
              <span className="badge badge-healthy" style={{ fontSize: '0.675rem' }}>
                Profile: {currentProfile || 'default'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Account ID</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--neon-cyan)' }}>
                  {liveAccount?.id || '300617413029'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Account Owner</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {liveAccount?.owner || 'Muhammad Hamza Siddiqui'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>IAM User</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {liveAccount?.user || 'aws-user'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Default Region</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--aws-orange)' }}>
                  {liveAccount?.region || 'ap-south-1'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <button
              className={`btn btn-sm ${activeTab === 'switch' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('switch')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Layers size={14} />
              <span>Available Profiles ({profiles.length})</span>
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'add' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('add')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} />
              <span>Connect New AWS Account</span>
            </button>
          </div>

          {/* Tab 1: Available Profiles */}
          {activeTab === 'switch' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Select an AWS CLI profile to instantly query and switch the dashboard context:
              </div>

              {loadingProfiles ? (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                  <RefreshCw size={18} className="spin-animation" style={{ margin: '0 auto 8px' }} />
                  <div>Discovering AWS profiles...</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {profiles.map(p => {
                    const isCurrent = (currentProfile || 'default') === p;
                    return (
                      <div 
                        key={p} 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          background: isCurrent ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                          border: isCurrent ? '1px solid var(--neon-cyan)' : '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <UserCheck size={16} color={isCurrent ? 'var(--neon-cyan)' : 'var(--text-muted)'} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: isCurrent ? 'var(--neon-cyan)' : 'var(--text-primary)' }}>
                              [{p}]
                            </div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                              Configured in ~/.aws/credentials
                            </div>
                          </div>
                        </div>

                        {isCurrent ? (
                          <span className="badge badge-healthy" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} />
                            Currently Active
                          </span>
                        ) : (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              onSelectProfile(p);
                              onClose();
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <span>Switch</span>
                            <ArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Connect New AWS Account */}
          {activeTab === 'add' && (
            <form onSubmit={handleSaveNewProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Add credentials for a new AWS account. These are stored locally in your machine's standard <code>~/.aws/credentials</code>.
              </div>

              {formError && (
                <div style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid rgba(239, 68, 68, 0.3)', 
                  borderRadius: '6px', 
                  padding: '10px', 
                  color: '#EF4444', 
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <ShieldAlert size={16} />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Profile Name (Identifier)
                </label>
                <input 
                  type="text"
                  placeholder="e.g. client-prod, staging-account"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  AWS Access Key ID
                </label>
                <input 
                  type="text"
                  placeholder="AKIAIOSFODNN7EXAMPLE"
                  value={accessKeyId}
                  onChange={(e) => setAccessKeyId(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  AWS Secret Access Key
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showSecret ? "text" : "password"}
                    placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                    value={secretAccessKey}
                    onChange={(e) => setSecretAccessKey(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '8px 36px 8px 12px',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Default AWS Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0d1322',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="ap-south-1">ap-south-1 (Mumbai)</option>
                  <option value="us-east-1">us-east-1 (N. Virginia)</option>
                  <option value="us-west-2">us-west-2 (Oregon)</option>
                  <option value="eu-west-1">eu-west-1 (Ireland)</option>
                  <option value="ap-southeast-1">ap-southeast-1 (Singapore)</option>
                </select>
              </div>

              <div style={{ marginTop: '6px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="spin-animation" />
                      <span>Saving &amp; Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={15} />
                      <span>Save Profile &amp; Connect Live</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Dynamic Architecture Assurance Notice */}
          <div style={{
            background: 'rgba(255, 153, 0, 0.05)',
            border: '1px solid rgba(255, 153, 0, 0.2)',
            borderRadius: '8px',
            padding: '12px 14px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{ fontWeight: 700, color: 'var(--aws-orange)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⚡ 100% Dynamic Synchronization</span>
            </div>
            <div>
              Next month or whenever changes occur in your AWS account (e.g. costs change, new S3 buckets added, IAM roles modified), CloudPulse AI queries the active profile directly via AWS CLI and updates in real-time. No code changes needed!
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountSwitcherModal;
