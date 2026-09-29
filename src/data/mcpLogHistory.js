export const mcpInitialLogs = [
  {
    timestamp: "2026-09-27T07:15:22.104Z",
    type: "agent_init",
    source: "AWS_MCP_SERVER",
    message: "Connected to AWS MCP Server (v2.37.4) at local endpoint: stdio://aws-mcp-server",
    details: {
      account: "123456789012 (Production-CloudPulse)",
      region: "us-east-1",
      authenticatedVia: "AWS IAM Identity Center / AWS Builder ID SSO",
      toolsCount: 48,
      status: "READY"
    }
  },
  {
    timestamp: "2026-09-27T07:15:24.412Z",
    type: "tool_call",
    source: "CLOUDPULSE_AI_AGENT",
    tool: "aws__cost_explorer_get_cost_and_usage",
    input: {
      TimePeriod: { Start: "2026-09-01", End: "2026-09-27" },
      Granularity: "DAILY",
      Metrics: ["UnblendedCost", "UsageQuantity"],
      GroupBy: [{ Type: "DIMENSION", Key: "SERVICE" }]
    },
    output: {
      status: "200 OK",
      recordsRetrieved: 168,
      anomalyDetected: true,
      anomalySummary: "Spike detected in us-east-1 EC2-Other (EBS unattached provisioned IOPS) on Sep 23 ($890 vs baseline $360)."
    }
  },
  {
    timestamp: "2026-09-27T07:15:29.831Z",
    type: "tool_call",
    source: "CLOUDPULSE_AI_AGENT",
    tool: "aws__ec2_describe_instances",
    input: {
      Filters: [{ Name: "instance-state-name", Values: ["running"] }]
    },
    output: {
      status: "200 OK",
      instancesEvaluated: 14,
      underutilizedInstances: [
        { instanceId: "i-09f128bc9a81e3", type: "c5.4xlarge", avgCpuPercent: 3.4, recommendation: "t4g.xlarge" }
      ]
    }
  },
  {
    timestamp: "2026-09-27T07:15:32.190Z",
    type: "tool_call",
    source: "CLOUDPULSE_AI_AGENT",
    tool: "aws__s3_get_public_access_block",
    input: {
      Bucket: "customer-export-staging-v2"
    },
    output: {
      status: "WARNING",
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        BlockPublicPolicy: false,
        IgnorePublicAcls: false,
        RestrictPublicBuckets: false
      },
      flaggedRisk: "CRITICAL: Anonymous public read access permitted on sensitive telemetry bucket."
    }
  },
  {
    timestamp: "2026-09-27T07:15:35.012Z",
    type: "tool_call",
    source: "CLOUDPULSE_AI_AGENT",
    tool: "aws__iam_simulate_principal_policy",
    input: {
      PolicySourceArn: "arn:aws:iam::123456789012:role/DataPipelineWorkerRole",
      ActionNames: ["*"]
    },
    output: {
      status: "VIOLATION",
      EvaluationResults: [{ EvalDecision: "allowed", EvalActionName: "*", EvalResourceName: "*" }],
      flaggedRisk: "HIGH: Wildcard administrator privilege violates AWS Security Pillar least-privilege guardrail."
    }
  },
  {
    timestamp: "2026-09-27T07:15:40.540Z",
    type: "remediation_ready",
    source: "AUTONOMOUS_SYNTHESIZER",
    message: "Formulated 8 automated IaC and AWS CLI remediation commands. Total monthly potential savings: $1,602.24.",
    details: {
      actionsAvailable: 8,
      riskLevel: "LOW_IMPACT_ZERO_DOWNTIME",
      cloudFormationTemplateGenerated: "infra/cloudformation.yaml"
    }
  }
];
