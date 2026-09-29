import React, { useState } from 'react';
import { 
  Flame, 
  RefreshCw, 
  Zap 
} from 'lucide-react';

export function ResilienceSandbox() {
  const [activeChaos, setActiveChaos] = useState(null);
  const [simulatedLatency, setSimulatedLatency] = useState(24);
  const [trafficShiftPercent, setTrafficShiftPercent] = useState(0);
  const [chaosLog, setChaosLog] = useState([
    "[SYS] Route53 Application Recovery Controller (ARC) active. Multi-AZ routing 33% / 33% / 34%.",
    "[SYS] All target groups reporting HTTP 200 OK across us-east-1a, 1b, and 1c.",
    "[SYS] Auto-healing circuit breakers armed and ready."
  ]);

  const triggerChaosScenario = (scenario) => {
    setActiveChaos(scenario);
    if (scenario === 'az-failure') {
      setSimulatedLatency(412);
      setTrafficShiftPercent(100);
      setChaosLog(prev => [
        `[SIMULATED DRILL] Simulating us-east-1a availability zone isolation...`,
        `[ALERT] CloudWatch Composite Alarm ALARM_AZ_OUTAGE triggered (P99 latency > 400ms).`,
        `[HEALING] Autonomous Route53 health check evacuated us-east-1a.`,
        `[HEALING] 100% ingress rerouted to us-east-1b & us-east-1c.`,
        `[RESOLVED] Latency normalized to 28ms. Zero customer-facing packet drop.`,
        ...prev
      ]);
    } else if (scenario === 'lambda-surge') {
      setSimulatedLatency(680);
      setChaosLog(prev => [
        `[SIMULATED DRILL] Ingesting 10,000 req/sec burst into serverless ingress...`,
        `[THROTTLE] DynamoDB WriteCapacityUnits saturated (429 Too Many Requests).`,
        `[HEALING] SQS Dead Letter Buffer auto-engaged. SQS FIFO absorbing burst.`,
        `[HEALING] Lambda Provisioned Concurrency auto-scaled from 20 to 150 instances.`,
        `[RESOLVED] SQS backlog drained in 4.2 seconds. Full consistency guaranteed.`,
        ...prev
      ]);
    } else if (scenario === 'circuit-breaker') {
      setSimulatedLatency(920);
      setChaosLog(prev => [
        `[SIMULATED DRILL] Downstream third-party payment webhook latency timeout (>10,000ms)...`,
        `[CIRCUIT BREAKER] State changed from CLOSED to OPEN after 5 consecutive timeouts.`,
        `[FALLBACK] Serving cached idempotent transaction tokens to protect primary thread.`,
        `[RESOLVED] Degradation prevented cascading microservice deadlock.`,
        ...prev
      ]);
    }

    // Auto-normalize latency after 3 seconds
    setTimeout(() => {
      setSimulatedLatency(26);
    }, 2800);
  };

  const resetSandbox = () => {
    setActiveChaos(null);
    setSimulatedLatency(24);
    setTrafficShiftPercent(0);
    setChaosLog([
      "[RESET] All simulated drills terminated. Multi-AZ cluster operating at optimal baseline.",
      "[SYS] CloudPulse AI Reliability Estimate: 91/100 (Simulated Architecture Baseline)."
    ]);
  };

  return (
    <div className="animate-fade-in" id="resilience-sandbox">
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>
              Architectural Simulation Sandbox (Simulated Drills)
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
              Autonomous Resiliency &amp; Self-Healing Sandbox (Simulated Drills)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '640px' }}>
              Interactive failure-mode simulation. Observe how CloudPulse AI telemetry orchestrates circuit breakers, AZ traffic shifting, and autonomous self-healing during simulated architectural drills (0 live FIS templates configured in AWS account).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              id="btn-reset-chaos"
              className="btn btn-secondary"
              onClick={resetSandbox}
            >
              <RefreshCw size={14} />
              <span>Reset Sandbox</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chaos Triggers Grid */}
      <div className="chaos-grid" style={{ marginBottom: '24px' }}>
        
        {/* Scenario 1: Availability Zone Partition */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--status-danger)' }}>
                <Flame size={18} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Drill 1: Availability Zone Partition (Simulated)</h3>
            </div>
            <span className="badge badge-danger">High Severity</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Simulate complete loss of <code>us-east-1a</code>. Evaluates Route53 ARC cell routing, cross-zone load balancing, and zero-downtime failover to <code>us-east-1b/c</code>.
          </p>
          <button 
            id="btn-trigger-az-failure"
            className="btn btn-danger"
            style={{ width: '100%' }}
            onClick={() => triggerChaosScenario('az-failure')}
          >
            <Flame size={16} />
            <span>Simulate us-east-1a Outage (Drill)</span>
          </button>
        </div>

        {/* Scenario 2: Lambda Concurrency Explosion */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255, 153, 0, 0.15)', color: 'var(--aws-orange)' }}>
                <Zap size={18} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Drill 2: Lambda &amp; DynamoDB Throttle (Simulated)</h3>
            </div>
            <span className="badge badge-warning">Medium Severity</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Inject sudden 10,000 req/sec burst to test DynamoDB provisioned capacity exhaustion, SQS DLQ backpressure absorption, and automatic concurrency scaling.
          </p>
          <button 
            id="btn-trigger-lambda-surge"
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => triggerChaosScenario('lambda-surge')}
          >
            <Zap size={16} />
            <span>Simulate 10k Req/s Spike (Drill)</span>
          </button>
        </div>

      </div>

      {/* Real-Time Live Telemetry HUD */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Resilience Telemetry &amp; Latency HUD</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time synthetic probe measuring P99 round-trip latency</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {activeChaos && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DRILL</div>
                <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                  {activeChaos}
                </span>
              </div>
            )}

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TRAFFIC SHIFT</div>
              <div className="mono-font" style={{ 
                fontSize: '1.4rem', 
                fontWeight: 800, 
                color: trafficShiftPercent > 0 ? 'var(--neon-cyan)' : 'var(--text-secondary)' 
              }}>
                {trafficShiftPercent}%
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>P99 LATENCY</div>
              <div className="mono-font" style={{ 
                fontSize: '1.4rem', 
                fontWeight: 800, 
                color: simulatedLatency > 100 ? 'var(--status-danger)' : 'var(--status-healthy)' 
              }}>
                {simulatedLatency}ms
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AUTO-HEALING</div>
              <div className="mono-font" style={{ 
                fontSize: '1.4rem', 
                fontWeight: 800, 
                color: 'var(--neon-cyan)' 
              }}>
                {simulatedLatency > 100 ? 'ACTIVE' : 'ARMED'}
              </div>
            </div>
          </div>
        </div>

        {/* Live Terminal Log */}
        <div className="terminal-window">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="terminal-dot red"></span>
              <span className="terminal-dot yellow"></span>
              <span className="terminal-dot green"></span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              aws-cloudwatch-events-stream.log
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>LIVE PROBE</span>
          </div>
          <div className="terminal-body" style={{ maxHeight: '220px' }}>
            {chaosLog.map((log, index) => (
              <div 
                key={index}
                style={{ 
                  marginBottom: '6px', 
                  color: log.includes('CHAOS') ? 'var(--status-danger)' : 
                         log.includes('ALERT') ? 'var(--status-warning)' : 
                         log.includes('HEALING') ? 'var(--neon-cyan)' : 
                         log.includes('RESOLVED') ? 'var(--status-healthy)' : '#94A3B8'
                }}
              >
                {log}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
