import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// GET /api/ads/[id] - Get single ad
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const db = await getDatabase()
    const adsCollection = db.collection('ads')

    const ad = await adsCollection.findOne({ _id: new ObjectId(id) })

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      ad: {
        id: ad._id.toString(),
        title: ad.title,
        image_url: ad.image_url,
        category: ad.category,
        payout: ad.payout,
        time_required: ad.time_required,
        description: ad.description,
        ad_link: ad.ad_link,
        status: ad.status,
      }
    })
  } catch (error) {
    console.error('Error fetching ad:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/ads/[id] - Update ad (Admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const db = await getDatabase()
    const adsCollection = db.collection('ads')

    const updateData: any = {
      updated_at: new Date()
    }

    if (body.title) updateData.title = body.title
    if (body.image_url !== undefined) updateData.image_url = body.image_url
    if (body.category) updateData.category = body.category
    if (body.payout !== undefined) updateData.payout = parseFloat(body.payout)
    if (body.time_required !== undefined) updateData.time_required = parseInt(body.time_required)
    if (body.description !== undefined) updateData.description = body.description
    if (body.ad_link !== undefined) updateData.ad_link = body.ad_link
    if (body.status) updateData.status = body.status

    const result = await adsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Ad updated successfully'
    })
  } catch (error) {
    console.error('Error updating ad:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/ads/[id] - Delete/Disable ad (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    const db = await getDatabase()
    const adsCollection = db.collection('ads')

    // Soft delete - just mark as inactive
    const result = await adsCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'inactive',
          updated_at: new Date()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Ad disabled successfully'
    })
  } catch (error) {
    console.error('Error deleting ad:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
