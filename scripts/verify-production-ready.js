// Server Readiness Verification Script
// Run: node scripts/verify-production-ready.js

const https = require('https');
const http = require('http');

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const tests = {
    passed: 0,
    failed: 0,
    results: []
};

// Test API endpoint
async function testEndpoint(method, path, body = null, expectedStatus = 200) {
    return new Promise((resolve) => {
        const url = new URL(path, BASE_URL);
        const protocol = url.protocol === 'https:' ? https : http;

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = protocol.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const success = res.statusCode === expectedStatus;
                resolve({
                    success,
                    status: res.statusCode,
                    data: data ? JSON.parse(data) : null
                });
            });
        });

        req.on('error', (error) => {
            resolve({ success: false, error: error.message });
        });

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
}

// Run all tests
async function runTests() {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 PRODUCTION READINESS VERIFICATION');
    console.log('='.repeat(60) + '\n');

    // ========================================
    // PART 1: API Routes Check
    // ========================================
    console.log('📡 PART 1: API Routes Verification\n');

    const apiTests = [
        { name: 'GET /api/ads', method: 'GET', path: '/api/ads' },
        { name: 'GET /api/ads/categories', method: 'GET', path: '/api/ads/categories' },
        { name: 'GET /api/user/overview', method: 'GET', path: '/api/user/overview', expectedStatus: 401 },
        { name: 'POST /api/auth/login', method: 'POST', path: '/api/auth/login', expectedStatus: 400 },
        { name: 'GET /api/admin/stats', method: 'GET', path: '/api/admin/stats', expectedStatus: 401 },
    ];

    for (const test of apiTests) {
        const result = await testEndpoint(test.method, test.path, test.body, test.expectedStatus);
        const passed = result.success;

        if (passed) {
            tests.passed++;
            console.log(`✅ ${test.name} - PASSED`);
        } else {
            tests.failed++;
            console.log(`❌ ${test.name} - FAILED (Status: ${result.status})`);
        }

        tests.results.push({ ...test, result });
    }

    // ========================================
    // PART 2: Environment Variables Check
    // ========================================
    console.log('\n⚙️  PART 2: Environment Variables\n');

    const requiredEnvVars = [
        'MONGODB_URI',
        'JWT_SECRET',
        'ADMIN_EMAIL',
        'ADMIN_PASSWORD',
        'ADMIN_TOKEN',
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        'CLERK_SECRET_KEY',
        'FRAUD_SCORE_THRESHOLD',
        'NEW_USER_DAILY_CAP',
        'RATE_LIMIT_TASK_START'
    ];

    requiredEnvVars.forEach(varName => {
        if (process.env[varName]) {
            tests.passed++;
            console.log(`✅ ${varName} - SET`);
        } else {
            tests.failed++;
            console.log(`❌ ${varName} - MISSING`);
        }
    });

    // ========================================
    // PART 3: Ad Network Configuration
    // ========================================
    console.log('\n📢 PART 3: Ad Network Configuration\n');

    const adNetworkVars = [
        'NEXT_PUBLIC_ADSTERRA_SOCIALBAR',
        'NEXT_PUBLIC_ADSTERRA_300X250',
        'NEXT_PUBLIC_ADSTERRA_728X90',
        'NEXT_PUBLIC_PROPELLER_ID',
        'NEXT_PUBLIC_CPALEAD_PUBID',
        'POSTBACK_SECRET_CPALEAD'
    ];

    adNetworkVars.forEach(varName => {
        if (process.env[varName]) {
            tests.passed++;
            console.log(`✅ ${varName} - CONFIGURED`);
        } else {
            tests.failed++;
            console.log(`⚠️  ${varName} - NOT SET (Optional but recommended)`);
        }
    });

    // ========================================
    // SUMMARY
    // ========================================
    console.log('\n' + '='.repeat(60));
    console.log('📊 VERIFICATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`\n✅ Passed: ${tests.passed}`);
    console.log(`❌ Failed: ${tests.failed}`);
    console.log(`📈 Success Rate: ${Math.round((tests.passed / (tests.passed + tests.failed)) * 100)}%\n`);

    if (tests.failed === 0) {
        console.log('🎉 ALL CHECKS PASSED! Server is production-ready!\n');
    } else {
        console.log('⚠️  Some checks failed. Please fix issues before deploying.\n');
    }

    console.log('='.repeat(60) + '\n');
}

// Run verification
runTests().catch(console.error);
