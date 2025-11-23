// Run this script to seed the database with sample tasks
// Usage: node scripts/seed-tasks.js

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb+srv://social:dhanbyte@socialbosster.rsqc4ma.mongodb.net/adsdb?retryWrites=true&w=majority";

const sampleTasks = [
    {
        title: "Watch Product Ad - Smartphone",
        description: "Watch a 30-second advertisement for the latest smartphone",
        type: "ad",
        reward: 2.50,
        duration: 30,
        active: true,
        url: "https://example.com/ad1",
        imageUrl: null,
        createdAt: new Date(),
    },
    {
        title: "Watch Video Ad - Fashion",
        description: "Watch a 15-second fashion brand advertisement",
        type: "ad",
        reward: 1.50,
        duration: 15,
        active: true,
        url: "https://example.com/ad2",
        imageUrl: null,
        createdAt: new Date(),
    },
    {
        title: "Complete Survey - Shopping Habits",
        description: "Complete a quick 2-minute survey about your shopping preferences",
        type: "survey",
        reward: 5.00,
        duration: 120,
        active: true,
        url: "https://example.com/survey1",
        imageUrl: null,
        createdAt: new Date(),
    },
    {
        title: "Watch Ad - Travel Deals",
        description: "Watch a 20-second advertisement about travel packages",
        type: "ad",
        reward: 2.00,
        duration: 20,
        active: true,
        url: "https://example.com/ad3",
        imageUrl: null,
        createdAt: new Date(),
    },
    {
        title: "Install App - Fitness Tracker",
        description: "Install and open a fitness tracking app",
        type: "app_install",
        reward: 10.00,
        duration: 60,
        active: true,
        url: "https://example.com/app1",
        imageUrl: null,
        createdAt: new Date(),
    },
    {
        title: "Watch Ad - Food Delivery",
        description: "Watch a 25-second food delivery service advertisement",
        type: "ad",
        reward: 2.25,
        duration: 25,
        active: true,
        url: "https://example.com/ad4",
        imageUrl: null,
        createdAt: new Date(),
    },
    {
        title: "Complete Quiz - General Knowledge",
        description: "Answer 5 simple general knowledge questions",
        type: "quiz",
        reward: 3.00,
        duration: 60,
        active: true,
        url: "https://example.com/quiz1",
        imageUrl: null,
        createdAt: new Date(),
    },
    {
        title: "Watch Ad - Gaming",
        description: "Watch a 30-second gaming advertisement",
        type: "ad",
        reward: 2.50,
        duration: 30,
        active: true,
        url: "https://example.com/ad5",
        imageUrl: null,
        createdAt: new Date(),
    },
];

async function seedTasks() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db('adsdb');
        const tasksCollection = db.collection('tasks');

        // Clear existing tasks
        await tasksCollection.deleteMany({});
        console.log("Cleared existing tasks");

        // Insert sample tasks
        const result = await tasksCollection.insertMany(sampleTasks);
        console.log(`Inserted ${result.insertedCount} tasks`);

        console.log("✅ Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await client.close();
    }
}

seedTasks();
