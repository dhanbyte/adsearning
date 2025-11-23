// MongoDB Indexes for Fraud Detection & Performance
// Run: node scripts/create-fraud-indexes.js

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb+srv://social:dhanbyte@socialbosster.rsqc4ma.mongodb.net/adsdb?retryWrites=true&w=majority";

async function createFraudIndexes() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db('adsdb');

        // ========================================
        // 1. USER_TASKS - Add fraud detection indexes
        // ========================================
        console.log("\n📦 Creating indexes on 'user_tasks'...");

        const userTasksCollection = db.collection('user_tasks');

        // CRITICAL: Unique index on externalTransactionId for idempotency
        await userTasksCollection.createIndex(
            { externalTransactionId: 1 },
            { unique: true, sparse: true, name: 'idx_external_tx_unique' }
        );
        console.log("✅ Created unique index on externalTransactionId");

        // Index for fraud score queries
        await userTasksCollection.createIndex(
            { fraudScore: -1 },
            { name: 'idx_fraud_score' }
        );
        console.log("✅ Created index on fraudScore");

        // Index for flagged tasks
        await userTasksCollection.createIndex(
            { flagged: 1, status: 1 },
            { name: 'idx_flagged_status' }
        );
        console.log("✅ Created compound index on flagged + status");

        // Index for provider queries
        await userTasksCollection.createIndex(
            { provider: 1 },
            { sparse: true, name: 'idx_provider' }
        );
        console.log("✅ Created index on provider");

        // ========================================
        // 2. USER_DEVICES - Device fingerprinting
        // ========================================
        console.log("\n📦 Creating indexes on 'user_devices'...");

        const userDevicesCollection = db.collection('user_devices');

        // Compound index for device tracking
        await userDevicesCollection.createIndex(
            { userId: 1, deviceHash: 1 },
            { unique: true, name: 'idx_user_device' }
        );
        console.log("✅ Created unique compound index on userId + deviceHash");

        // Index for IP-based queries
        await userDevicesCollection.createIndex(
            { ip: 1, lastSeen: -1 },
            { name: 'idx_ip_lastseen' }
        );
        console.log("✅ Created compound index on ip + lastSeen");

        // Index for device reuse detection
        await userDevicesCollection.createIndex(
            { deviceHash: 1, lastSeen: -1 },
            { name: 'idx_device_lastseen' }
        );
        console.log("✅ Created compound index on deviceHash + lastSeen");

        // ========================================
        // 3. POSTBACK_LOGS - Audit trail
        // ========================================
        console.log("\n📦 Creating indexes on 'postback_logs'...");

        const postbackLogsCollection = db.collection('postback_logs');

        // Index for time-based queries
        await postbackLogsCollection.createIndex(
            { receivedAt: -1 },
            { name: 'idx_received_at' }
        );
        console.log("✅ Created index on receivedAt");

        // Index for provider queries
        await postbackLogsCollection.createIndex(
            { provider: 1, receivedAt: -1 },
            { name: 'idx_provider_time' }
        );
        console.log("✅ Created compound index on provider + receivedAt");

        // ========================================
        // 4. MONITORING_LOGS - Security events
        // ========================================
        console.log("\n📦 Creating indexes on 'monitoring_logs'...");

        const monitoringLogsCollection = db.collection('monitoring_logs');

        // Index for severity-based queries
        await monitoringLogsCollection.createIndex(
            { severity: 1, timestamp: -1 },
            { name: 'idx_severity_time' }
        );
        console.log("✅ Created compound index on severity + timestamp");

        // Index for event type queries
        await monitoringLogsCollection.createIndex(
            { eventType: 1, timestamp: -1 },
            { name: 'idx_event_time' }
        );
        console.log("✅ Created compound index on eventType + timestamp");

        // TTL index - auto-delete logs older than 90 days
        await monitoringLogsCollection.createIndex(
            { timestamp: 1 },
            { expireAfterSeconds: 90 * 24 * 60 * 60, name: 'idx_ttl_90days' }
        );
        console.log("✅ Created TTL index (90 days retention)");

        // ========================================
        // SUMMARY
        // ========================================
        console.log("\n" + "=".repeat(50));
        console.log("🎉 FRAUD DETECTION INDEXES CREATED!");
        console.log("=".repeat(50));
        console.log("\n📊 Indexes Summary:");
        console.log("   user_tasks: 4 new indexes");
        console.log("   user_devices: 3 indexes");
        console.log("   postback_logs: 2 indexes");
        console.log("   monitoring_logs: 3 indexes (including TTL)");
        console.log("\n🔐 Security Features:");
        console.log("   ✅ Unique constraint on externalTransactionId");
        console.log("   ✅ Device fingerprint tracking");
        console.log("   ✅ IP-based fraud detection");
        console.log("   ✅ Audit trail with 90-day retention");
        console.log("\n✅ Your database is optimized for fraud detection!");
        console.log("=".repeat(50) + "\n");

    } catch (error) {
        console.error("❌ Error creating indexes:", error);
        process.exit(1);
    } finally {
        await client.close();
        console.log("🔌 Database connection closed");
    }
}

// Run the script
createFraudIndexes();
