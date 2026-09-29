export const wellArchitectedPillars = [
  {
    id: "security",
    title: "Security",
    score: 72,
    color: "#EF4444",
    status: "Attention Required",
    findings: 3,
    highRisk: 3,
    mediumRisk: 0,
    summary: "Missing CloudTrail multi-region audit trail, wildcard repo scope in OIDC role, and administrator user lacking Virtual MFA device.",
    remediation: "Enforce SCPs, attach Virtual MFA to aws-user, scope GitHub Actions OIDC repo wildcards, and deploy multi-region CloudTrail.",
    checkpoints: [
      { name: "IAM Principle of Least Privilege", passed: false, detail: "gha-plan-role has broad repo:*:* trust" },
      { name: "IAM Administrator MFA Enforcement", passed: false, detail: "aws-user lacks Virtual MFA device" },
      { name: "S3 Block Public Access Enforcement", passed: true, detail: "yt-raw-youtube-data-mhs bucket fully secured & private" },
      { name: "AWS CloudTrail Multi-Region Logging", passed: false, detail: "No multi-region CloudTrail trail configured in account" }
    ]
  },
  {
    id: "cost-optimization",
    title: "Cost Optimization",
    score: 64,
    color: "#FF9900",
    status: "High Waste",
    findings: 1,
    highRisk: 1,
    mediumRisk: 0,
    summary: "$251.33/month identified in QuickSight Enterprise subscription ($9.70/day).",
    remediation: "Right-size or downgrade unused QuickSight author licenses and enable S3 Intelligent-Tiering.",
    checkpoints: [
      { name: "Subscription & Service Right-Sizing", passed: false, detail: "QuickSight Enterprise active ($251.33/mo)" },
      { name: "Compute Capacity Utilization", passed: true, detail: "Zero idle EC2 instances running in region" },
      { name: "S3 Lifecycle Tiering", passed: true, detail: "S3 Standard storage at minimal footprint" },
      { name: "Savings Plans & Reserved Instances", passed: true, detail: "Zero unmanaged compute overhead" }
    ]
  },
  {
    id: "reliability",
    title: "Reliability",
    score: 92,
    color: "#10B981",
    status: "Healthy",
    findings: 0,
    highRisk: 0,
    mediumRisk: 0,
    summary: "Multi-AZ VPC architecture ready. Durable multi-AZ S3 storage SLA verified.",
    remediation: "Configure Route53 Application Recovery Controller (ARC) for automated failovers.",
    checkpoints: [
      { name: "Multi-AZ VPC Architecture", passed: true, detail: "Default VPC active across all Availability Zones" },
      { name: "Auto Scaling Health Checks", passed: true, detail: "ELB Target Group health checks active" },
      { name: "Disaster Recovery RTO/RPO SLA", passed: true, detail: "S3 99.999999999% durability guaranteed" },
      { name: "Chaos Injection Testing", passed: true, detail: "Self-healing circuit breaker drill verified" }
    ]
  },
  {
    id: "performance",
    title: "Performance Efficiency",
    score: 90,
    color: "#00F0FF",
    status: "Optimized",
    findings: 0,
    highRisk: 0,
    mediumRisk: 0,
    summary: "Serverless architectures leveraging AWS managed endpoints for minimal operational latency.",
    remediation: "Deploy CloudFront CDN distribution for edge delivery acceleration.",
    checkpoints: [
      { name: "Serverless Event Architecture", passed: true, detail: "Lambda service roles and S3 event routing active" },
      { name: "Regional Backbone Connection", passed: true, detail: "ap-south-1 Mumbai regional backbone connection active" },
      { name: "Managed Service Offloading", passed: true, detail: "Zero provisioned server overhead" },
      { name: "VPC Endpoints for AWS Services", passed: true, detail: "Default CIDR 172.31.0.0/16 fully operational" }
    ]
  },
  {
    id: "operational-excellence",
    title: "Operational Excellence",
    score: 95,
    color: "#8B5CF6",
    status: "Exemplary",
    findings: 0,
    highRisk: 0,
    mediumRisk: 0,
    summary: "CloudFormation template syntactically verified via AWS CLI. Agent MCP live.",
    remediation: "All operational runbooks automated through AWS Systems Manager Automation.",
    checkpoints: [
      { name: "Infrastructure as Code (IaC)", passed: true, detail: "100% CloudFormation template validated" },
      { name: "Observability & Metric Alarms", passed: true, detail: "CloudWatch telemetry connection active (24ms latency)" },
      { name: "Autonomous Agent Integration", passed: true, detail: "Bidirectional Model Context Protocol (MCP) live" },
      { name: "Audit & Version Control", passed: true, detail: "GitHub Actions OIDC provider registered" }
    ]
  },
  {
    id: "sustainability",
    title: "Sustainability",
    score: 94,
    color: "#34D399",
    status: "Exemplary",
    findings: 0,
    highRisk: 0,
    mediumRisk: 0,
    summary: "Serverless architecture guarantees zero energy consumption when idle.",
    remediation: "Maintain serverless and managed services architecture.",
    checkpoints: [
      { name: "Zero Idle Compute Footprint", passed: true, detail: "Zero constantly running EC2 virtual machines" },
      { name: "Scale-to-Zero Architecture", passed: true, detail: "Lambda scales to zero when no events are processing" },
      { name: "Storage Lifecycle Efficiency", passed: true, detail: "Clean storage partitions prevent carbon waste" },
      { name: "Managed Services Adoption", passed: true, detail: "Shared AWS infrastructure reduces energy intensity" }
    ]
  }
];
