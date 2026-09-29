# CloudPulse AI — Live AWS Deployment Guide (Ship Gate)

> **MANDATORY SHIP GATE REQUIREMENT:**  
> Your project must be live on AWS and reachable at a public URL at the time of evaluation. Follow either **Option 1 (Fastest: 2 Minutes via AWS Amplify)** or **Option 2 (AWS CLI S3 + CloudFront)**.

---

## Option 1: Deploy to AWS Amplify Console (Recommended — 2 Minutes)
AWS Amplify Hosting is the fastest, zero-config method to deploy a React 19 / Vite SPA to AWS with free SSL and global CDN distribution.

### Step 1: Build the Production Bundle
Open PowerShell in `d:\Zero to Shipped Project` and run:
```powershell
npm.cmd run build
```
This produces an optimized production bundle in the `dist/` directory.

### Step 2: Open AWS Amplify Console
1. Log into your [AWS Management Console](https://console.aws.amazon.com/amplify/home).
2. Click **Create new app**.
3. Choose **Deploy without Git provider** (Manual upload) OR connect your GitHub repository if you pushed this code to GitHub.
4. Set App name: `cloudpulse-ai`.
5. Set Environment name: `production`.

### Step 3: Upload the `dist/` Folder
- If using manual upload: Drag and drop the `dist/` folder directly into the Amplify console window.
- Click **Save and deploy**.

### Step 4: Obtain Your Live Public URL
Within 60 to 90 seconds, AWS Amplify will provision an SSL certificate and assign a public domain:
```
https://production.d123456789.amplifyapp.com
```
Test this URL in your browser. This is your official submission link for the **AWS Builder Center**!

---

## Option 2: Deploy via AWS CLI (S3 + CloudFront CDN)

If you prefer Infrastructure as Code (IaC), use the included CloudFormation template in `infra/cloudformation.yaml`:

### Step 1: Deploy the CloudFormation Stack
```powershell
aws cloudformation deploy `
  --template-file infra/cloudformation.yaml `
  --stack-name CloudPulseAI-Production `
  --capabilities CAPABILITY_IAM `
  --parameter-overrides EnvironmentName=production
```

### Step 2: Query the Provisioned S3 Bucket & CloudFront URL
```powershell
aws cloudformation describe-stacks `
  --stack-name CloudPulseAI-Production `
  --query "Stacks[0].Outputs"
```
Look for `WebsiteURL` (e.g. `https://d111111abcdef8.cloudfront.net`) and `HostingBucketName`.

### Step 3: Sync the `dist/` Folder to S3
```powershell
npm.cmd run build
aws s3 sync dist/ s3://<Your-Hosting-Bucket-Name>/ --delete
```

### Step 4: Invalidate CloudFront Cache
```powershell
aws cloudfront create-invalidation `
  --distribution-id <Your-Distribution-Id> `
  --paths "/*"
```

---

## Troubleshooting & Verification Checklist
- [ ] Visit your public URL in an Incognito / Private browser tab.
- [ ] Ensure all 6 tabs load seamlessly.
- [ ] Test the **Ship Gate & Submission** tab in the app to copy your project description.
- [ ] Click **AWS Judge Proof** in the header to ensure the verification dossier displays.
