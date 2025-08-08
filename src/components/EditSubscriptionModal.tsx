import { useState, useEffect } from 'react'
import Modal from './Modal'
import { Subscription } from '../types'

interface EditSubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (id: string, subscription: Omit<Subscription, 'id'>) => void
  subscription: Subscription | null
}

const categories = [
  'Entertainment',
  'Software', 
  'Shopping',
  'Health & Fitness',
  'News & Magazines',
  'Music',
  'Productivity',
  'Cloud Storage',
  'Other'
]

const popularIcons = ['🎬', '🎵', '📦', '🎨', '💪', '📰', '☁️', '🎮', '📱', '💻', '🏠', '🚗']

export default function EditSubscriptionModal({ isOpen, onClose, onEdit, subscription }: EditSubscriptionModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    frequency: 'monthly' as 'monthly' | 'yearly' | 'weekly',
    nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active' as 'active' | 'cancelled' | 'paused',
    category: 'Entertainment',
    icon: '🎬'
  })

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        amount: subscription.amount.toString(),
        frequency: subscription.frequency,
        nextBilling: subscription.nextBilling.toISOString().split('T')[0],
        status: subscription.status,
        category: subscription.category,
        icon: subscription.icon
      })
    }
  }, [subscription])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!subscription) return
    
    const updatedSubscription: Omit<Subscription, 'id'> = {
      name: formData.name,
      amount: Number(formData.amount),
      frequency: formData.frequency,
      nextBilling: new Date(formData.nextBilling),
      status: formData.status,
      category: formData.category,
      icon: formData.icon
    }

    onEdit(subscription.id, updatedSubscription)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Subscription">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Netflix, Spotify, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount *
          </label>
          <input
            type="number"
            required
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Billing Frequency
          </label>
          <select
            value={formData.frequency}
            onChange={(e) => handleInputChange('frequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Next Billing Date
          </label>
          <input
            type="date"
            value={formData.nextBilling}
            onChange={(e) => handleInputChange('nextBilling', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Icon
          </label>
          <div className="grid grid-cols-6 gap-2">
            {popularIcons.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => handleInputChange('icon', icon)}
                className={`w-full h-10 text-xl rounded-md border-2 transition-all hover:scale-105 ${
                  formData.icon === icon 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  )
}