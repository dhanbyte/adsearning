import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

// GET /api/ads/categories - Get ad categories with counts
export async function GET() {
  try {
    const db = await getDatabase()
    const adsCollection = db.collection('ads')

    // Get counts for each category
    const categoryCounts = await adsCollection.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPayout: { $avg: '$payout' },
          maxPayout: { $max: '$payout' }
        }
      }
    ]).toArray()

    // Define category metadata
    const categories = [
      {
        id: 'earnable',
        name: 'Watch & Earn',
        description: 'Watch ads and earn money instantly',
        icon: '👁️',
        color: 'from-green-500 to-emerald-600',
        count: 0,
        avgPayout: 0,
        maxPayout: 0
      },
      {
        id: 'conditional',
        name: 'Install & Earn',
        description: 'Install apps and complete tasks for higher rewards',
        icon: '📱',
        color: 'from-orange-500 to-red-600',
        count: 0,
        avgPayout: 0,
        maxPayout: 0
      },
      {
        id: 'high_paying',
        name: 'High Paying Offers',
        description: 'Premium offers with maximum payouts',
        icon: '💎',
        color: 'from-purple-500 to-pink-600',
        count: 0,
        avgPayout: 0,
        maxPayout: 0
      },
      {
        id: 'surveys',
        name: 'Surveys & Tasks',
        description: 'Complete surveys and simple tasks',
        icon: '📝',
        color: 'from-blue-500 to-cyan-600',
        count: 0,
        avgPayout: 0,
        maxPayout: 0
      }
    ]

    // Map database counts to categories
    categoryCounts.forEach(cat => {
      const category = categories.find(c => c.id === cat._id)
      if (category) {
        category.count = cat.count
        category.avgPayout = Math.round(cat.avgPayout * 100) / 100
        category.maxPayout = cat.maxPayout
      }
    })

    // Add high paying category (payout > 10)
    const highPayingCount = await adsCollection.countDocuments({
      status: 'active',
      payout: { $gte: 10 }
    })

    const highPayingStats = await adsCollection.aggregate([
      { $match: { status: 'active', payout: { $gte: 10 } } },
      {
        $group: {
          _id: null,
          avgPayout: { $avg: '$payout' },
          maxPayout: { $max: '$payout' }
        }
      }
    ]).toArray()

    const highPayingCategory = categories.find(c => c.id === 'high_paying')
    if (highPayingCategory) {
      highPayingCategory.count = highPayingCount
      highPayingCategory.avgPayout = highPayingStats[0]?.avgPayout || 0
      highPayingCategory.maxPayout = highPayingStats[0]?.maxPayout || 0
    }

    // Surveys category (conditional with specific keywords)
    const surveysCount = await adsCollection.countDocuments({
      status: 'active',
      $or: [
        { title: { $regex: /survey/i } },
        { description: { $regex: /survey/i } }
      ]
    })

    const surveysCategory = categories.find(c => c.id === 'surveys')
    if (surveysCategory) {
      surveysCategory.count = surveysCount
    }

    return NextResponse.json({
      success: true,
      categories: categories
    })

  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
