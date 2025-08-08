import { useState, useEffect } from 'react'
import Modal from './Modal'
import { useApp } from '../contexts/AppContext'
import { Budget } from '../types'

interface EditBudgetModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (id: string, budget: Omit<Budget, 'id' | 'spent'>) => void
  budget: Budget | null
}


const colors = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Cyan', value: '#06B6D4' }
]

export default function EditBudgetModal({ isOpen, onClose, onEdit, budget }: EditBudgetModalProps) {
  const { categories } = useApp()
  const [formData, setFormData] = useState({
    category: categories[0] || '',
    limit: '',
    period: 'monthly' as 'monthly' | 'weekly',
    color: '#3B82F6'
  })

  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        limit: budget.limit.toString(),
        period: budget.period,
        color: budget.color
      })
    }
  }, [budget])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!budget) return
    
    const updatedBudget: Omit<Budget, 'id' | 'spent'> = {
      category: formData.category,
      limit: Number(formData.limit),
      period: formData.period,
      color: formData.color
    }

    onEdit(budget.id, updatedBudget)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Budget">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
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
            Budget Limit *
          </label>
          <input
            type="number"
            required
            step="0.01"
            min="0"
            value={formData.limit}
            onChange={(e) => handleInputChange('limit', e.target.value)}
            placeholder="Enter budget amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Period
          </label>
          <select
            value={formData.period}
            onChange={(e) => handleInputChange('period', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => handleInputChange('color', color.value)}
                className={`w-full h-10 rounded-md border-2 transition-all ${
                  formData.color === color.value 
                    ? 'border-gray-900 scale-105' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
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