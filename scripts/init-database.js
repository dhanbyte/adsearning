// MongoDB Database Initialization Script
// This script creates all collections with proper indexes
// Run: node scripts/init-database.js

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb+srv://social:dhanbyte@socialbosster.rsqc4ma.mongodb.net/adsdb?retryWrites=true&w=majority";

async function initializeDatabase() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db('adsdb');

        // ========================================
        // 1. USERS COLLECTION
        // ========================================
        console.log("\n📦 Creating 'users' collection...");

        const usersCollection = db.collection('users');

        // Create indexes for users
        await usersCollection.createIndex({ clerkId: 1 }, { unique: true });
        await usersCollection.createIndex({ email: 1 }, { unique: true });
        await usersCollection.createIndex({ phone: 1 }, { sparse: true });
        await usersCollection.createIndex({ referralCode: 1 }, { unique: true });
        await usersCollection.createIndex({ referredBy: 1 }, { sparse: true });
        await usersCollection.createIndex({ createdAt: -1 });

        console.log("✅ Users collection created with indexes:");
        console.log("   - clerkId (unique)");
        console.log("   - email (unique)");
        console.log("   - phone (sparse)");
        console.log("   - referralCode (unique)");
        console.log("   - referredBy (sparse)");
        console.log("   - createdAt (descending)");

        // ========================================
        // 2. ADS COLLECTION
        // ========================================
        console.log("\n📦 Creating 'ads' collection...");

        const adsCollection = db.collection('ads');

        // Create indexes for ads
        await adsCollection.createIndex({ status: 1 });
        await adsCollection.createIndex({ category: 1 });
        await adsCollection.createIndex({ createdAt: -1 });
        await adsCollection.createIndex({ status: 1, category: 1 });
        await adsCollection.createIndex({ payout: -1 });

        console.log("✅ Ads collection created with indexes:");
        console.log("   - status");
        console.log("   - category");
        console.log("   - createdAt (descending)");
        console.log("   - status + category (compound)");
        console.log("   - payout (descending)");

        // ========================================
        // 3. USER_TASKS COLLECTION
        // ========================================
        console.log("\n📦 Creating 'user_tasks' collection...");

        const userTasksCollection = db.collection('user_tasks');

        // Create indexes for user_tasks
        await userTasksCollection.createIndex({ userId: 1 });
        await userTasksCollection.createIndex({ adId: 1 });
        await userTasksCollection.createIndex({ status: 1 });
        await userTasksCollection.createIndex({ userId: 1, adId: 1 });
        await userTasksCollection.createIndex({ userId: 1, status: 1 });
        await userTasksCollection.createIndex({ openedAt: -1 });
        await userTasksCollection.createIndex({ completedAt: -1 }, { sparse: true });
        await userTasksCollection.createIndex({ externalTransactionId: 1 }, { sparse: true });

        console.log("✅ User_tasks collection created with indexes:");
        console.log("   - userId");
        console.log("   - adId");
        console.log("   - status");
        console.log("   - userId + adId (compound)");
        console.log("   - userId + status (compound)");
        console.log("   - openedAt (descending)");
        console.log("   - completedAt (descending, sparse)");
        console.log("   - externalTransactionId (sparse)");

        // ========================================
        // 4. WITHDRAWALS COLLECTION
        // ========================================
        console.log("\n📦 Creating 'withdrawals' collection...");

        const withdrawalsCollection = db.collection('withdrawals');

        // Create indexes for withdrawals
        await withdrawalsCollection.createIndex({ userId: 1 });
        await withdrawalsCollection.createIndex({ status: 1 });
        await withdrawalsCollection.createIndex({ userId: 1, status: 1 });
        await withdrawalsCollection.createIndex({ createdAt: -1 });
        await withdrawalsCollection.createIndex({ method: 1 });

        console.log("✅ Withdrawals collection created with indexes:");
        console.log("   - userId");
        console.log("   - status");
        console.log("   - userId + status (compound)");
        console.log("   - createdAt (descending)");
        console.log("   - method");

        // ========================================
        // SEED SAMPLE DATA
        // ========================================
        console.log("\n🌱 Seeding sample ads...");

        const sampleAds = [
            {
                title: "Watch Smartphone Ad - Premium Brand",
                category: "earnable",
                payout: 5.00,
                imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
                description: "Watch a 30-second advertisement for the latest smartphone. Complete the task and submit proof to earn ₹5.",
                link: "https://example.com/smartphone-ad",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Fashion Brand Video Ad",
                category: "earnable",
                payout: 3.50,
                imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
                description: "Watch a 20-second fashion brand video advertisement and earn ₹3.50.",
                link: "https://example.com/fashion-ad",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Install Fitness App - High Payout",
                category: "conditional",
                payout: 15.00,
                imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
                description: "Install the fitness tracking app, create an account, and use it for 5 minutes. Submit screenshot proof to earn ₹15.",
                link: "https://play.google.com/store",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Food Delivery App Ad",
                category: "earnable",
                payout: 4.00,
                imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
                description: "Watch a 25-second food delivery service advertisement. Earn ₹4 after admin approval.",
                link: "https://example.com/food-ad",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "E-commerce Shopping Ad",
                category: "view_only",
                payout: 0,
                imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400",
                description: "View this e-commerce platform advertisement. No earning, just for awareness.",
                link: "https://example.com/ecommerce-ad",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Gaming App Install - Premium",
                category: "conditional",
                payout: 20.00,
                imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400",
                description: "Install the gaming app, complete the tutorial level, and submit proof. Earn ₹20!",
                link: "https://play.google.com/store",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Travel Booking Ad",
                category: "earnable",
                payout: 3.00,
                imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
                description: "Watch a 15-second travel booking platform advertisement and earn ₹3.",
                link: "https://example.com/travel-ad",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Online Education Platform",
                category: "earnable",
                payout: 6.00,
                imageUrl: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400",
                description: "Watch a 40-second online education platform ad. Earn ₹6 after completion.",
                link: "https://example.com/education-ad",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Survey - Shopping Habits",
                category: "conditional",
                payout: 10.00,
                imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
                description: "Complete a 2-minute survey about your shopping preferences. Earn ₹10 after verification.",
                link: "https://example.com/survey",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Cryptocurrency Exchange Ad",
                category: "earnable",
                payout: 7.00,
                imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400",
                description: "Watch a 35-second cryptocurrency exchange advertisement. Earn ₹7.",
                link: "https://example.com/crypto-ad",
                status: "active",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        // Clear existing ads and insert new ones
        await adsCollection.deleteMany({});
        const adsResult = await adsCollection.insertMany(sampleAds);
        console.log(`✅ Inserted ${adsResult.insertedCount} sample ads`);

        // ========================================
        // SUMMARY
        // ========================================
        console.log("\n" + "=".repeat(50));
        console.log("🎉 DATABASE INITIALIZATION COMPLETE!");
        console.log("=".repeat(50));
        console.log("\n📊 Collections Created:");
        console.log("   1. users (with 6 indexes)");
        console.log("   2. ads (with 5 indexes)");
        console.log("   3. user_tasks (with 8 indexes)");
        console.log("   4. withdrawals (with 5 indexes)");
        console.log("\n🌱 Sample Data:");
        console.log(`   - ${adsResult.insertedCount} ads inserted`);
        console.log("\n✅ All indexes created for fast queries!");
        console.log("\n🚀 Your database is ready to use!");
        console.log("=".repeat(50) + "\n");

    } catch (error) {
        console.error("❌ Error initializing database:", error);
        process.exit(1);
    } finally {
        await client.close();
        console.log("🔌 Database connection closed");
    }
}

// Run the initialization
initializeDatabase();
