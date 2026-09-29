import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  Terminal, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function RemediationModal({ resource, onClose, onConfirm }) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  if (!resource) return null;

  const steps = [
    "Validating AWS IAM permissions via MCP...",
    "Generating zero-downtime execution plan...",
    "Applying AWS CLI modification...",
    "Verifying CloudWatch health check metrics..."
  ];

  const handleExecute = () => {
    setIsExecuting(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < steps.length) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        // Fire confetti celebration
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          onConfirm(resource.id);
          setIsExecuting(false);
          onClose();
        }, 600);
      }
    }, 600);
  };

  return (
    <div className="modal-overlay" id="remediation-modal">
      <div className="modal-content glass-panel glow-cyan">
        
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255, 153, 0, 0.15)', color: 'var(--aws-orange)' }}>
              <Wrench size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                Autonomous Cloud Remediation Review
              </h3>
              <span className="mono-font" style={{ fontSize: '0.75rem', color: 'var(--neon-cyan)' }}>
                {resource.id} ({resource.service})
              </span>
            </div>
          </div>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            disabled={isExecuting}
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          
          {/* Impact Stats Banner */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '12px', 
            marginBottom: '20px',
            background: 'rgba(0,0,0,0.25)',
            padding: '14px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PROJECTED SAVINGS</div>
              <div className="mono-font" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--status-healthy)' }}>
                +${resource.wasteAmount.toFixed(2)}/mo
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ESTIMATED DOWNTIME</div>
              <div className="mono-font" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--neon-cyan)' }}>
                0 Seconds
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CHANGE RISK RATING</div>
              <div className="badge badge-healthy" style={{ fontSize: '0.7rem', marginTop: '2px' }}>
                Safe / Reversible
              </div>
            </div>
          </div>

          {/* Finding & Recommendation */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Detected Anomaly
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              {resource.issue}
            </p>
          </div>

          {/* Proposed Remediation */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--aws-orange)', marginBottom: '6px' }}>
              Autonomous Remediation Strategy
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-primary)', background: 'rgba(255, 153, 0, 0.05)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255, 153, 0, 0.2)' }}>
              {resource.recommendation}
            </p>
          </div>

          {/* Generated AWS CLI Command */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Terminal size={14} color="var(--neon-cyan)" />
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neon-cyan)' }}>
                Generated AWS CLI Command (Executed via MCP)
              </h4>
            </div>
            <pre style={{ 
              background: '#04070e', 
              padding: '12px', 
              borderRadius: '8px', 
              border: '1px solid rgba(0, 240, 255, 0.2)',
              fontSize: '0.775rem',
              color: '#38BDF8',
              overflowX: 'auto',
              fontFamily: 'var(--font-mono)'
            }}>
              {resource.cliCommand}
            </pre>
          </div>

          {/* Execution Progress Bar (When Active) */}
          {isExecuting && (
            <div style={{ marginTop: '16px', padding: '14px', borderRadius: '8px', background: 'rgba(0, 240, 255, 0.08)', border: '1px solid var(--border-cyan)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="pulse-dot green"></span>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--neon-cyan)' }}>
                  {steps[currentStep]}
                </span>
              </div>
              <div className="progress-track" style={{ height: '6px' }}>
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                    background: 'var(--neon-cyan)'
                  }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
            disabled={isExecuting}
          >
            Cancel
          </button>
          <button 
            id="btn-confirm-execute-remediation"
            className="btn btn-primary" 
            onClick={handleExecute}
            disabled={isExecuting}
          >
            <Sparkles size={16} />
            <span>{isExecuting ? 'Executing via AWS MCP...' : 'Execute Autonomous Remediation'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
