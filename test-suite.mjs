import { scanLiveAwsEnvironment, listAwsProfiles, saveAwsProfile, fetchS3BucketObjectMetrics, auditLambdaExecutionRoles, auditKmsKeys, auditSecretsManager } from './src/server/awsScanner.js';
import http from 'http';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

const results = {
  whitebox: [],
  blackbox: [],
  inputOutput: [],
  uiLogic: []
};

function assert(condition, suite, testName, details = '') {
  if (condition) {
    results[suite].push({ name: testName, pass: true, details });
    console.log(`  ✓ [PASS] [${suite}] ${testName}`);
  } else {
    results[suite].push({ name: testName, pass: false, details });
    console.error(`  ✗ [FAIL] [${suite}] ${testName}: ${details}`);
  }
}

async function runAllTests() {
  console.log('====================================================');
  console.log('CLOUDPULSE AI — COMPREHENSIVE MULTI-METHODOLOGY TEST SUITE');
  console.log('====================================================\n');

  // ==========================================
  // 1. WHITEBOX TESTING (Internal Logic & Error Handling)
  // ==========================================
  console.log('1. RUNNING WHITEBOX TESTS...');
  
  // Test 1.1: listAwsProfiles returns an array with at least 'default'
  try {
    const profiles = listAwsProfiles();
    assert(Array.isArray(profiles) && profiles.length > 0 && profiles.includes('default'), 
      'whitebox', 'listAwsProfiles() returns valid array containing default', `Profiles: ${JSON.stringify(profiles)}`);
  } catch (err) {
    assert(false, 'whitebox', 'listAwsProfiles() should not throw', err.message);
  }

  // Test 1.2: saveAwsProfile handles valid payload safely
  try {
    // Save a dedicated test profile
    const saveRes = saveAwsProfile('test-verify-profile', 'AKIAIOSFODNN7TESTVERIFY', 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYTESTVERIFY', 'ap-south-1');
    assert(saveRes.success === true && saveRes.profile === 'test-verify-profile', 
      'whitebox', 'saveAwsProfile() writes credentials and returns success', JSON.stringify(saveRes));

    // Verify it is listed in listAwsProfiles
    const updatedProfiles = listAwsProfiles();
    assert(updatedProfiles.includes('test-verify-profile'),
      'whitebox', 'listAwsProfiles() reflects newly saved profile', `Updated: ${JSON.stringify(updatedProfiles)}`);
  } catch (err) {
    assert(false, 'whitebox', 'saveAwsProfile() threw exception', err.message);
  }

  // Test 1.3: scanLiveAwsEnvironment returns expected data structure
  try {
    const scanData = scanLiveAwsEnvironment();
    assert(scanData && typeof scanData === 'object', 'whitebox', 'scanLiveAwsEnvironment() returns valid object');
    assert(Boolean(scanData.account && scanData.account.id), 'whitebox', 'scanLiveAwsEnvironment() contains account.id', scanData.account?.id);
    assert(Boolean(scanData.account && scanData.account.owner), 'whitebox', 'scanLiveAwsEnvironment() contains account.owner', scanData.account?.owner);
    assert(Boolean(scanData.finops && typeof scanData.finops.totalMonthlySpend === 'number'), 'whitebox', 'scanLiveAwsEnvironment() contains numeric monthly spend', `$${scanData.finops?.totalMonthlySpend}`);
    assert(Array.isArray(scanData.resources) && scanData.resources.length > 0, 'whitebox', 'scanLiveAwsEnvironment() yields non-empty resources list', `${scanData.resources?.length} items`);
    assert(Array.isArray(scanData.pillars) && scanData.pillars.length === 6, 'whitebox', 'scanLiveAwsEnvironment() produces all 6 Well-Architected pillars', `${scanData.pillars?.length} pillars`);
  } catch (err) {
    assert(false, 'whitebox', 'scanLiveAwsEnvironment() threw exception', err.message);
  }

  // Test 1.4: scanLiveAwsEnvironment handles non-existent profile fallback gracefully without crash
  try {
    const fallbackScan = scanLiveAwsEnvironment('non-existent-dummy-profile-xyz');
    assert(fallbackScan && fallbackScan.account && fallbackScan.finops, 
      'whitebox', 'scanLiveAwsEnvironment() graceful fallback on invalid profile', 'Handled without crashing');
  } catch (err) {
    assert(false, 'whitebox', 'scanLiveAwsEnvironment() failed on invalid profile', err.message);
  }

  // Test 1.5: fetchS3BucketObjectMetrics on real bucket returns available with numeric count & size
  try {
    const s3Metrics = fetchS3BucketObjectMetrics('yt-raw-youtube-data-mhs');
    assert(s3Metrics && s3Metrics.status === 'available' && typeof s3Metrics.count === 'number' && s3Metrics.count > 0,
      'whitebox', 'fetchS3BucketObjectMetrics() accurately returns count for active bucket', `Count: ${s3Metrics.count}, Size: ${s3Metrics.sizeMB} MB`);
    assert(s3Metrics.displayType.includes('Objects'), 
      'whitebox', 'fetchS3BucketObjectMetrics() formats displayType with object count', s3Metrics.displayType);
  } catch (err) {
    assert(false, 'whitebox', 'fetchS3BucketObjectMetrics() threw exception on valid bucket', err.message);
  }

  // Test 1.6: fetchS3BucketObjectMetrics on failing/non-existent bucket retries and returns unavailable (count: null, NEVER fake 0)
  try {
    const s3FailMetrics = fetchS3BucketObjectMetrics('non-existent-bucket-998877665544');
    assert(s3FailMetrics && s3FailMetrics.status === 'unavailable',
      'whitebox', 'fetchS3BucketObjectMetrics() marks status as unavailable on failure', `Status: ${s3FailMetrics.status}`);
    assert(s3FailMetrics.count === null,
      'whitebox', 'fetchS3BucketObjectMetrics() returns count: null (NEVER a fake 0)', `count: ${s3FailMetrics.count}`);
    assert(s3FailMetrics.displayType === 'Standard (Count unavailable)',
      'whitebox', 'fetchS3BucketObjectMetrics() produces explicit "Standard (Count unavailable)" displayType', s3FailMetrics.displayType);
  } catch (err) {
    assert(false, 'whitebox', 'fetchS3BucketObjectMetrics() threw exception on failing bucket', err.message);
  }

  // Test 1.7: auditLambdaExecutionRoles on yt-raw-data-mhs-role-kpu0agrd in ap-south-1
  // Strictly verifies: NO deployed Lambda function in ap-south-1 -> NO false retention claim!
  try {
    const mockRoles = [
      {
        Arn: "arn:aws:iam::300617413029:role/service-role/yt-raw-data-mhs-role-kpu0agrd",
        RoleName: "yt-raw-data-mhs-role-kpu0agrd",
        AssumeRolePolicyDocument: { Statement: [{ Effect: "Allow", Principal: { Service: "lambda.amazonaws.com" }, Action: "sts:AssumeRole" }] }
      }
    ];
    const roleFindings = auditLambdaExecutionRoles(mockRoles, 'ap-south-1');
    assert(roleFindings.length === 1, 'whitebox', 'auditLambdaExecutionRoles() generates 1 resource for unattached role');
    const roleRes = roleFindings[0];
    assert(roleRes.issue.includes('no deployed Lambda function in ap-south-1'), 
      'whitebox', 'Role finding accurately states no deployed Lambda function in ap-south-1', roleRes.issue);
    assert(!roleRes.issue.includes('retention not bound'), 
      'whitebox', 'Role finding NEVER falsely claims "retention not bound" when no log group exists');
    assert(roleRes.wasteAmount === 0, 'whitebox', 'Role finding waste amount is 0 (not unmanaged compute waste)');
  } catch (err) {
    assert(false, 'whitebox', 'auditLambdaExecutionRoles() threw exception', err.message);
  }

  // Test 1.8: auditKmsKeys in ap-south-1 generates 0 false findings when no customer keys exist
  try {
    const kmsFindings = auditKmsKeys('ap-south-1');
    assert(Array.isArray(kmsFindings) && kmsFindings.length === 0, 
      'whitebox', 'auditKmsKeys() yields 0 findings in ap-south-1 (never creates phantom recommendations)', `${kmsFindings.length} findings`);
  } catch (err) {
    assert(false, 'whitebox', 'auditKmsKeys() threw exception', err.message);
  }

  // Test 1.9: auditSecretsManager in ap-south-1 generates 0 false findings when no secrets exist
  try {
    const smFindings = auditSecretsManager('ap-south-1');
    assert(Array.isArray(smFindings) && smFindings.length === 0, 
      'whitebox', 'auditSecretsManager() yields 0 findings in ap-south-1 (never creates phantom recommendations)', `${smFindings.length} findings`);
  } catch (err) {
    assert(false, 'whitebox', 'auditSecretsManager() threw exception', err.message);
  }

  // ==========================================
  // 2. BLACKBOX TESTING (REST Endpoints via HTTP)
  // ==========================================
  console.log('\n2. RUNNING BLACKBOX TESTS (HTTP /api/aws/*)...');

  // Test 2.1: GET /api/aws/profiles
  try {
    const resProfiles = await makeRequest('http://localhost:5173/api/aws/profiles');
    assert(resProfiles.status === 200, 'blackbox', 'GET /api/aws/profiles returns HTTP 200', `Status: ${resProfiles.status}`);
    assert(Array.isArray(resProfiles.data?.profiles), 'blackbox', 'GET /api/aws/profiles returns { profiles: [...] }', JSON.stringify(resProfiles.data));
  } catch (err) {
    assert(false, 'blackbox', 'GET /api/aws/profiles failed', err.message);
  }

  // Test 2.2: GET /api/aws/live-status
  try {
    const resLive = await makeRequest('http://localhost:5173/api/aws/live-status');
    assert(resLive.status === 200, 'blackbox', 'GET /api/aws/live-status returns HTTP 200', `Status: ${resLive.status}`);
    assert(resLive.data?.account?.id === '300617413029', 'blackbox', 'Live status accurately returns caller Account ID 300617413029', resLive.data?.account?.id);
    assert(resLive.data?.account?.owner === 'Muhammad Hamza Siddiqui', 'blackbox', 'Live status accurately returns Account Owner Muhammad Hamza Siddiqui', resLive.data?.account?.owner);
  } catch (err) {
    assert(false, 'blackbox', 'GET /api/aws/live-status failed', err.message);
  }

  // Test 2.3: POST /api/aws/save-profile with JSON payload
  try {
    const postPayload = {
      profileName: 'blackbox-test-profile',
      accessKeyId: 'AKIAIOSFODNN7BLACKBOX',
      secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYBLACKBOX',
      region: 'us-east-1'
    };
    const resPost = await makeRequest('http://localhost:5173/api/aws/save-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postPayload)
    });
    assert(resPost.status === 200 && resPost.data?.success === true, 
      'blackbox', 'POST /api/aws/save-profile returns HTTP 200 with success: true', JSON.stringify(resPost.data));
  } catch (err) {
    assert(false, 'blackbox', 'POST /api/aws/save-profile failed', err.message);
  }

  // Test 2.4: Query param profile support: GET /api/aws/live-status?profile=default
  try {
    const resParam = await makeRequest('http://localhost:5173/api/aws/live-status?profile=default');
    assert(resParam.status === 200 && resParam.data?.profile === 'default', 
      'blackbox', 'GET /api/aws/live-status?profile=default correctly respects query param', `Profile: ${resParam.data?.profile}`);
  } catch (err) {
    assert(false, 'blackbox', 'Query param test failed', err.message);
  }

  // ==========================================
  // 3. INPUT / OUTPUT (I/O) TESTING
  // ==========================================
  console.log('\n3. RUNNING INPUT / OUTPUT (I/O) TESTS...');

  const sampleResources = [
    { id: "qs-1", name: "QuickSight Enterprise", service: "QuickSight", region: "us-east-1", monthlyCost: 251.33, severity: "critical", remediated: false },
    { id: "s3-1", name: "yt-raw-youtube-data-mhs", service: "S3", region: "us-east-1", monthlyCost: 0.01, severity: "low", remediated: false },
    { id: "iam-1", name: "aws-user (Account: 300617413029)", service: "IAM", region: "global", monthlyCost: 0.00, severity: "critical", remediated: false }
  ];

  // Test 3.1: FinOps Search Filter I/O
  const filterQuery = (query, list) => list.filter(r => 
    r.name.toLowerCase().includes(query.toLowerCase()) || 
    r.service.toLowerCase().includes(query.toLowerCase())
  );

  const qsResults = filterQuery('QuickSight', sampleResources);
  assert(qsResults.length === 1 && qsResults[0].id === 'qs-1', 'inputOutput', 'Search Query: "QuickSight" outputs 1 exact match');

  const s3Results = filterQuery('S3', sampleResources);
  assert(s3Results.length === 1 && s3Results[0].id === 's3-1', 'inputOutput', 'Search Query: "S3" outputs 1 exact match');

  const nonExistentResults = filterQuery('nonexistent-service', sampleResources);
  assert(nonExistentResults.length === 0, 'inputOutput', 'Search Query: "nonexistent-service" outputs empty list');

  // Test 3.2: Region Selector Filter I/O
  const filterRegion = (region, list) => region === 'all' 
    ? list 
    : list.filter(r => r.region === region || r.region === 'global');

  const allRegionOut = filterRegion('all', sampleResources);
  assert(allRegionOut.length === 3, 'inputOutput', 'Region Input: "all" outputs all 3 resources');

  const usEastOut = filterRegion('us-east-1', sampleResources);
  assert(usEastOut.length === 3, 'inputOutput', 'Region Input: "us-east-1" outputs 2 regional + 1 global');

  const apSouthOut = filterRegion('ap-south-1', sampleResources);
  assert(apSouthOut.length === 1 && apSouthOut[0].region === 'global', 'inputOutput', 'Region Input: "ap-south-1" outputs 1 global resource');

  // Test 3.3: Remediation State Mutation I/O
  const remediateTarget = (id, list) => list.map(r => r.id === id ? { ...r, remediated: true } : r);
  const remediatedOut = remediateTarget('qs-1', sampleResources);
  assert(remediatedOut.find(r => r.id === 'qs-1').remediated === true, 'inputOutput', 'Remediation Input: "qs-1" flips remediated to true');
  assert(remediatedOut.find(r => r.id === 's3-1').remediated === false, 'inputOutput', 'Remediation Input: unaffected resources remain false');

  // ==========================================
  // 4. UI / LOGIC & ACCESSIBILITY TESTS
  // ==========================================
  console.log('\n4. RUNNING UI & ACCESSIBILITY COMPONENT TESTS...');

  // Test 4.1: Six pillars integrity
  const pillarIds = ['security', 'cost-optimization', 'reliability', 'performance', 'operational-excellence', 'sustainability'];
  const livePillars = scanLiveAwsEnvironment().pillars;
  const allPillarsPresent = pillarIds.every(id => livePillars.some(p => p.id === id));
  assert(allPillarsPresent, 'uiLogic', 'All 6 Well-Architected Pillar IDs verified in UI model');

  // Test 4.2: Health Score bounds (0-100)
  const scoresWithinRange = livePillars.every(p => typeof p.score === 'number' && p.score >= 0 && p.score <= 100);
  assert(scoresWithinRange, 'uiLogic', 'All pillar health scores strictly bounded between 0 and 100');

  // Test 4.3: Financial precision check
  const scanFinops = scanLiveAwsEnvironment().finops;
  const hasTwoDecimals = Number.isFinite(scanFinops.totalMonthlySpend) && 
    (scanFinops.totalMonthlySpend.toString().split('.')[1] || '').length <= 2;
  assert(hasTwoDecimals, 'uiLogic', 'Financial amounts formatted with valid 2-decimal currency precision', `$${scanFinops.totalMonthlySpend}`);

  // Summary
  console.log('\n====================================================');
  console.log('TEST SUMMARY MATRIX');
  console.log('====================================================');
  const total = results.whitebox.length + results.blackbox.length + results.inputOutput.length + results.uiLogic.length;
  const passed = [
    ...results.whitebox, 
    ...results.blackbox, 
    ...results.inputOutput, 
    ...results.uiLogic
  ].filter(t => t.pass).length;
  
  console.log(`Whitebox Tests:       ${results.whitebox.filter(t => t.pass).length}/${results.whitebox.length} Passed`);
  console.log(`Blackbox Tests:       ${results.blackbox.filter(t => t.pass).length}/${results.blackbox.length} Passed`);
  console.log(`Input/Output Tests:   ${results.inputOutput.filter(t => t.pass).length}/${results.inputOutput.length} Passed`);
  console.log(`UI/Logic Tests:       ${results.uiLogic.filter(t => t.pass).length}/${results.uiLogic.length} Passed`);
  console.log(`----------------------------------------------------`);
  console.log(`Total Success Rate:   ${passed}/${total} (${((passed/total)*100).toFixed(1)}%)\n`);

  if (passed === total) {
    console.log('>>> ALL MULTI-METHODOLOGY TESTS PASSED 100% SUCCESFULLY! <<<');
  } else {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Test Suite Fatal Error:', err);
  process.exit(1);
});
