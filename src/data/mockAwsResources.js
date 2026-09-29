export const initialAwsResources = [
  {
    id: "quicksight-subscription-mhs",
    name: "QuickSight Enterprise (MuhammadHamza99)",
    service: "QuickSight",
    type: "Enterprise Subscription",
    region: "us-east-1",
    status: "active",
    monthlyCost: 251.33,
    utilization: 4.8,
    wasteAmount: 251.33,
    severity: "critical",
    issue: "QuickSight Enterprise Edition active ($251.33/mo, ~$9.70/day) billed to account.",
    recommendation: "Evaluate user usage and unsubscribe or downgrade to Standard if enterprise governance/SPICE features are unneeded.",
    cloudFormationSnippet: `# Resource managed via AWS QuickSight Account Administration`,
    cliCommand: `aws quicksight describe-account-subscription --aws-account-id 300617413029 --region us-east-1`,
    remediated: false
  },
  {
    id: "s3://yt-raw-youtube-data-mhs",
    name: "yt-raw-youtube-data-mhs",
    service: "S3",
    type: "Standard (117 Live Objects, 23.6 MB)",
    region: "us-east-1",
    status: "active",
    monthlyCost: 0.01,
    utilization: 95.0,
    wasteAmount: 0.00,
    severity: "low",
    issue: "117 live YouTube data partition files. Storage is healthy; S3 Block Public Access is fully enabled (versioning active; ~558 stored revisions in S3 CloudWatch metrics).",
    recommendation: "Apply S3 Intelligent-Tiering to maintain zero waste as datasets expand.",
    cloudFormationSnippet: `Type: AWS::S3::Bucket
Properties:
  BucketName: yt-raw-youtube-data-mhs
  PublicAccessBlockConfiguration:
    BlockPublicAcls: true
    BlockPublicPolicy: true
    IgnorePublicAcls: true
    RestrictPublicBuckets: true`,
    cliCommand: `aws s3api put-bucket-lifecycle-configuration --bucket yt-raw-youtube-data-mhs --lifecycle-configuration file://lifecycle.json`,
    remediated: false
  },
  {
    id: "arn:aws:iam::300617413029:role/gha-plan-role",
    name: "gha-plan-role (GitHub Actions OIDC)",
    service: "IAM",
    type: "GitHub Actions OIDC Trust",
    region: "global",
    status: "vulnerable",
    monthlyCost: 0.00,
    utilization: 100.0,
    wasteAmount: 0.00,
    severity: "critical",
    issue: "OIDC Trust policy contains overly permissive wildcard 'repo:*:*' alongside 'Muhammad-Hamza69/Production-Style-Data-Engineering-Pipeline-using-AWS'.",
    recommendation: "Remove wildcard pattern 'repo:*:*' to restrict STS AssumeRoleWithWebIdentity exclusively to authorized repositories.",
    cloudFormationSnippet: `Type: AWS::IAM::Role
Properties:
  RoleName: gha-plan-role
  AssumeRolePolicyDocument:
    Statement:
      - Effect: Allow
        Action: sts:AssumeRoleWithWebIdentity
        Condition:
          StringLike:
            token.actions.githubusercontent.com:sub: "repo:Muhammad-Hamza69/Production-Style-Data-Engineering-Pipeline-using-AWS:*"`,
    cliCommand: `aws iam update-assume-role-policy --role-name gha-plan-role --policy-document file://scoped-oidc-trust.json`,
    remediated: false
  },
  {
    id: "arn:aws:iam::300617413029:user/aws-user",
    name: "aws-user (Account: 300617413029)",
    service: "IAM",
    type: "IAM User (Admin)",
    region: "global",
    status: "vulnerable",
    monthlyCost: 0.00,
    utilization: 100.0,
    wasteAmount: 0.00,
    severity: "critical",
    issue: "IAM User has AdministratorAccess policy attached without required Multi-Factor Authentication (MFA).",
    recommendation: "Enforce Hardware/Virtual MFA requirement and configure session-based temporary credentials.",
    cloudFormationSnippet: `Type: AWS::IAM::Policy
Properties:
  PolicyName: EnforceMFA
  PolicyDocument:
    Statement:
      - Effect: Deny
        NotAction: iam:*
        Resource: "*"
        Condition:
          BoolIfExists:
            aws:MultiFactorAuthPresent: "false"`,
    cliCommand: `aws iam create-virtual-mfa-device --virtual-mfa-device-name HamzaAdminMFA --outfile QRCode.png --bootstrap-method QRCodePNG`,
    remediated: false
  },
  {
    id: "arn:aws:iam::300617413029:role/service-role/yt-raw-data-mhs-role-kpu0agrd",
    name: "yt-raw-data-mhs-role-kpu0agrd",
    service: "IAM",
    type: "Unattached IAM Role (Lambda Trust)",
    region: "ap-south-1",
    status: "active",
    monthlyCost: 0.00,
    utilization: 100.0,
    wasteAmount: 0.00,
    severity: "low",
    issue: "IAM role exists but has no deployed Lambda function in ap-south-1 / no log group yet — no retention issue to report.",
    recommendation: "No retention action needed. If this role is not planned for active workloads in ap-south-1, consider removing it to maintain least-privilege hygiene.",
    cloudFormationSnippet: `# IAM role is present in account but unattached to any deployed Lambda function in ap-south-1`,
    cliCommand: `aws iam get-role --role-name yt-raw-data-mhs-role-kpu0agrd`,
    remediated: false
  },
  {
    id: "arn:aws:kms:us-east-1:300617413029:key/ae30d9eb-fbdb-4a1c-9b8c-7049c07fd6db",
    name: "alias/yt-data-key-mhs (Customer Key)",
    service: "KMS",
    type: "Customer Managed Key (Symmetric)",
    region: "us-east-1",
    status: "active",
    monthlyCost: 0.04,
    utilization: 100.0,
    wasteAmount: 0.00,
    severity: "low",
    issue: "Customer managed KMS key active without annual automatic key rotation enabled.",
    recommendation: "Enable KMS Automatic Key Rotation (annual rotation cycle).",
    cloudFormationSnippet: `Type: AWS::KMS::Key
Properties:
  EnableKeyRotation: true`,
    cliCommand: `aws kms enable-key-rotation --key-id ae30d9eb-fbdb-4a1c-9b8c-7049c07fd6db --region us-east-1`,
    remediated: false
  },
  {
    id: "arn:aws:secretsmanager:us-east-1:300617413029:secret:youtube/data/api/key/mhs-wiCuKa",
    name: "youtube/data/api/key/mhs",
    service: "SecretsManager",
    type: "Secret Storage (API Key)",
    region: "us-east-1",
    status: "active",
    monthlyCost: 0.02,
    utilization: 90.0,
    wasteAmount: 0.00,
    severity: "low",
    issue: "Active secret storage for YouTube Data API credentials without automated rotation scheduled.",
    recommendation: "Configure automated secret rotation schedule using AWS Secrets Manager and Lambda.",
    cloudFormationSnippet: `Type: AWS::SecretsManager::RotationSchedule
Properties:
  SecretId: youtube/data/api/key/mhs`,
    cliCommand: `aws secretsmanager rotate-secret --secret-id youtube/data/api/key/mhs --region us-east-1`,
    remediated: false
  }
];

export const spendTrendData = [
  { day: "Mon", spend: 9.67, target: 0.50, anomaly: false },
  { day: "Tue", spend: 9.67, target: 0.50, anomaly: false },
  { day: "Wed", spend: 9.67, target: 0.50, anomaly: false },
  { day: "Thu", spend: 9.67, target: 0.50, anomaly: false },
  { day: "Fri", spend: 9.68, target: 0.50, anomaly: false },
  { day: "Sat", spend: 9.71, target: 0.50, anomaly: true, reason: "QuickSight Enterprise subscription billing ($9.71/day)" },
  { day: "Sun", spend: 9.71, target: 0.50, anomaly: false }
];

export const serviceCostBreakdown = [
  { name: "Amazon QuickSight Enterprise", cost: 251.33, percentage: 99.9, color: "#FF9900" },
  { name: "AWS Key Management Service", cost: 0.04, percentage: 0.05, color: "#00F0FF" },
  { name: "AWS Secrets Manager", cost: 0.02, percentage: 0.03, color: "#A855F7" },
  { name: "Amazon Simple Storage Service", cost: 0.01, percentage: 0.02, color: "#10B981" }
];
