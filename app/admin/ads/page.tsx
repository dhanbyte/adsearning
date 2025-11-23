"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  ArrowLeft 
} from 'lucide-react'
import Link from 'next/link'

interface Ad {
  id: string
  title: string
  image_url: string | null
  category: string
  payout: number
  time_required: number
  description: string
  ad_link: string
  status: string
}

export default function ManageAdsPage() {
  const router = useRouter()
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAd, setEditingAd] = useState<Ad | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    category: 'earnable',
    payout: '',
    time_required: '',
    description: '',
    ad_link: '',
  })

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/ads')
      const data = await response.json()
      if (data.success) {
        setAds(data.ads)
      }
    } catch (error) {
      console.error('Error fetching ads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingAd ? `/api/ads/${editingAd.id}` : '/api/ads'
      const method = editingAd ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success || response.ok) {
        alert(editingAd ? 'Ad updated successfully!' : 'Ad created successfully!')
        setShowForm(false)
        setEditingAd(null)
        setFormData({
          title: '',
          image_url: '',
          category: 'earnable',
          payout: '',
          time_required: '',
          description: '',
          ad_link: '',
        })
        fetchAds()
      } else {
        alert(data.error || 'Failed to save ad')
      }
    } catch (error) {
      console.error('Error saving ad:', error)
      alert('Failed to save ad')
    }
  }

  const handleEdit = (ad: Ad) => {
    setEditingAd(ad)
    setFormData({
      title: ad.title,
      image_url: ad.image_url || '',
      category: ad.category,
      payout: ad.payout.toString(),
      time_required: ad.time_required.toString(),
      description: ad.description,
      ad_link: ad.ad_link,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to disable this ad?')) return

    try {
      const response = await fetch(`/api/ads/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        alert('Ad disabled successfully!')
        fetchAds()
      } else {
        alert(data.error || 'Failed to disable ad')
      }
    } catch (error) {
      console.error('Error deleting ad:', error)
      alert('Failed to disable ad')
    }
  }

  const toggleStatus = async (ad: Ad) => {
    try {
      const newStatus = ad.status === 'active' ? 'inactive' : 'active'
      const response = await fetch(`/api/ads/${ad.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (data.success) {
        alert(`Ad ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`)
        fetchAds()
      }
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Manage Ads
            </h1>
          </div>
          
          <Button 
            onClick={() => {
              setShowForm(!showForm)
              setEditingAd(null)
              setFormData({
                title: '',
                image_url: '',
                category: 'earnable',
                payout: '',
                time_required: '',
                description: '',
                ad_link: '',
              })
            }}
            className="bg-gradient-to-r from-cyan-500 to-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Ad
          </Button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <Card className="bg-slate-800/50 border-slate-700/50 p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingAd ? 'Edit Ad' : 'Create New Ad'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Image URL</label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md px-3 py-2"
                    required
                  >
                    <option value="earnable">Earnable (Needs Approval)</option>
                    <option value="conditional">Conditional (Needs Verification)</option>
                    <option value="view_only">View Only (No Earning)</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Payout (₹) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.payout}
                    onChange={(e) => setFormData({ ...formData, payout: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Time Required (seconds) *</label>
                  <Input
                    type="number"
                    value={formData.time_required}
                    onChange={(e) => setFormData({ ...formData, time_required: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Ad Link</label>
                  <Input
                    value={formData.ad_link}
                    onChange={(e) => setFormData({ ...formData, ad_link: e.target.value })}
                    className="bg-slate-700/50 border-slate-600 text-white"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 text-sm mb-2 block">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-600">
                  {editingAd ? 'Update Ad' : 'Create Ad'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingAd(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4">
          {ads.map((ad) => (
            <Card key={ad.id} className="bg-slate-800/50 border-slate-700/50 p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-bold text-lg">{ad.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      ad.category === 'earnable' ? 'bg-green-500/20 text-green-400' :
                      ad.category === 'conditional' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {ad.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      ad.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {ad.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{ad.description}</p>
                  <div className="flex gap-6 text-sm">
                    <span className="text-green-400 font-semibold">₹{ad.payout}</span>
                    <span className="text-gray-400">{ad.time_required}s</span>
                    {ad.ad_link && (
                      <a href={ad.ad_link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                        View Link
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleStatus(ad)}
                    className="border-slate-600"
                  >
                    {ad.status === 'active' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(ad)}
                    className="border-slate-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(ad.id)}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {ads.length === 0 && (
            <Card className="bg-slate-800/50 border-slate-700/50 p-12 text-center">
              <p className="text-gray-400">No ads created yet. Click "Create New Ad" to get started!</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
