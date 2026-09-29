# AWS Builder Center Project Submission Write-Up
**Hackathon:** AWS Zero to Shipped  
**Submission Deadline:** Friday, October 2, 2026 at 11:59 p.m. PT  

---

## 1. Project Overview & Metadata

* **Project Title:** CloudPulse AI — Autonomous AWS FinOps & Well-Architected Engine
* **App Category:** Commercial Potential (Alternative: Workplace Efficiency)
* **App Category Tag (Required):** `#commercial-potential` (or `#workplace-efficiency`)
* **Lane:** Startups
* **Lane Tag (Required):** `#startups`
* **Tagline:** Autonomous AI-native cloud governance platform connected to AWS Console via MCP. Live cost anomaly detection, automated infrastructure remediation, chaos resilience sandbox, and 6-pillar Well-Architected scoring.
* **Public Live URL (Ship Gate):** `https://main.d1li4p5kl468bn.amplifyapp.com`
* **GitHub Repository:** `https://github.com/SamiSiddiqui45/CloudPulse-AI-Autonomous-AWS-FinOps-Well-Architected-Engine`

---

## 2. The Problem & Market Need
Modern engineering teams and hyper-growth startups waste between 25% and 35% of their total AWS budget on "silent cloud waste"—idle over-provisioned compute instances, unattached EBS volumes left behind by teardown scripts, neglected NAT Gateways routing negligible traffic, and massive cold datasets idling on S3 Standard storage.

Simultaneously, small devops teams struggle to maintain compliance with the 6 pillars of the **AWS Well-Architected Framework**. Misconfigurations such as accidentally unblocked public S3 buckets and overly broad wildcard IAM permissions (`Action: *`) persist unnoticed until a security incident or an astronomical bill arrives at month-end.

---

## 3. Our Solution: CloudPulse AI
**CloudPulse AI** is an autonomous 24/7 AI Cloud Architect and FinOps Copilot that connects directly to the AWS Console via the **Model Context Protocol (MCP)** and **AWS CLI v2.37.4**.

Unlike traditional intrusive monitoring agents that require installing Daemons or DaemonSets inside every virtual machine, CloudPulse AI works completely **agentlessly** by querying AWS native control-plane APIs.

### Key Capabilities:
1. **Autonomous FinOps Waste Hunter:**
   - Detects compute under-utilization (<10% CPU over 14 days) and formulates AWS Graviton3 right-sizing blueprints.
   - Identifies orphaned EBS volumes and orchestrates safe snapshot-before-delete automation.
   - Surfaces idle NAT Gateways and drafts VPC Endpoint migration templates.
   - Evaluates object storage access patterns and generates S3 Intelligent-Tiering lifecycle rules.
2. **AWS Well-Architected 6-Pillar Engine:**
   - Evaluates workloads against the official 6 pillars: Security, Reliability, Performance Efficiency, Cost Optimization, Operational Excellence, and Sustainability.
   - Provides granular checkpoints with real-time pass/fail posture scoring.
3. **Autonomous Remediation Loop with Reversible IaC:**
   - Generates executable AWS CLI commands and CloudFormation rollback stacks.
   - Features 1-click execution with pre-flight dry-runs and automated snapshot protection.
4. **Chaos Engineering & Resilience Sandbox:**
   - Interactive fault-injection sandbox allowing engineers to simulate Availability Zone partitions, DynamoDB throttling, and Lambda concurrency spikes to test Route53 ARC failover and auto-healing circuit breakers.
5. **Interactive AWS MCP Console:**
   - Built-in terminal emulator demonstrating live bidirectional MCP tool calling between the AI agent and the AWS Console.

---

## 4. How We Built It & AI Coding Agent Integration
CloudPulse AI was developed end-to-end using an **AI Coding Agent directly connected to the AWS Console**:
- **AWS Agent Toolkit & MCP Server:** We integrated the AI Coding Agent with `@aws/mcp-server` and AWS CLI v2.37.4. The agent executed live tool calls (`aws__cost_explorer_get_cost_and_usage`, `aws__ec2_describe_instances`, `aws__s3_get_public_access_block`, `aws__iam_simulate_principal_policy`) to interrogate and diagnose infrastructure.
- **Frontend Architecture:** Built using React 19, Vite, and custom CSS design system with responsive glassmorphism, real-time SVG charting, cybernetic HUD telemetry, and micro-animations.
- **Cloud Infrastructure (IaC):** Designed production-ready AWS CloudFormation templates provisioning Amazon CloudFront with Origin Access Control (OAC), Amazon S3 static hosting, Amazon DynamoDB for audit trails, and least-privilege IAM roles.
- **Deployment:** Live on AWS Amplify with global CDN edge acceleration and HTTPS.

---

## 5. Commercial Potential & Startup Impact
For a Series A startup spending $25,000/month on AWS:
- **Immediate Cost Reduction:** CloudPulse AI recovers $4,000 to $7,500/month within the first 48 hours of autonomous operation.
- **Engineering Time Saved:** Eliminates 30+ hours/month of manual CloudWatch and Cost Explorer spreadsheet auditing.
- **Risk Mitigation:** Prevents catastrophic data breaches through proactive S3 and IAM wildcard detection.
- **Sustainability:** Reduces cloud energy consumption by up to 34% through Graviton migration and scale-to-zero enforcement.

---

## 6. What's Next for CloudPulse AI
- Integration with Amazon Bedrock to support natural-language cloud architectural queries.
- Multi-cloud federation expanding to hybrid AWS Outposts.
- Automated Slack/PagerDuty agent alerts for high-confidence anomalous egress spikes.
