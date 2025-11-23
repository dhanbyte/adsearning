import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET /api/ads - Fetch all active ads
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    
    const db = await getDatabase()
    const adsCollection = db.collection('ads')

    const query: any = { status: 'active' }
    if (category) {
      query.category = category
    }

    const ads = await adsCollection.find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      success: true,
      ads: ads.map(ad => ({
        id: ad._id.toString(),
        title: ad.title,
        imageUrl: ad.imageUrl,
        category: ad.category,
        payout: ad.payout,
        description: ad.description,
        link: ad.link,
        status: ad.status,
      }))
    })
  } catch (error) {
    console.error('Error fetching ads:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/ads - Create new ad (Admin only)
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, imageUrl, category, payout, description, link } = body

    if (!title || !category || !payout) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = await getDatabase()
    const adsCollection = db.collection('ads')

    const newAd = {
      title,
      imageUrl: imageUrl || null,
      category, // earnable / conditional / view_only
      payout: parseFloat(payout),
      description: description || '',
      link: link || '',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await adsCollection.insertOne(newAd)

    return NextResponse.json({
      success: true,
      ad: {
        id: result.insertedId.toString(),
        ...newAd
      }
    })
  } catch (error) {
    console.error('Error creating ad:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
