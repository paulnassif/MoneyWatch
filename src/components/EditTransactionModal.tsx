import { useState, useEffect } from 'react'
import Modal from './Modal'
import { useApp } from '../contexts/AppContext'
import { Transaction } from '../types'

interface EditTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (id: string, transaction: Omit<Transaction, 'id'>) => void
  transaction: Transaction | null
}

export default function EditTransactionModal({ isOpen, onClose, onEdit, transaction }: EditTransactionModalProps) {
  const { accounts, categories, addCategory } = useApp()
  const [showCustomCategory, setShowCustomCategory] = useState(false)
  const [customCategory, setCustomCategory] = useState('')
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: categories[0] || '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'income' | 'expense',
    accountId: accounts[0]?.name || '',
    merchant: ''
  })

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: Math.abs(transaction.amount).toString(),
        category: transaction.category,
        date: transaction.date.toISOString().split('T')[0],
        type: transaction.type,
        accountId: transaction.accountId,
        merchant: transaction.merchant || ''
      })
    }
  }, [transaction])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!transaction) return
    
    const updatedTransaction: Omit<Transaction, 'id'> = {
      accountId: formData.accountId,
      amount: formData.type === 'expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount)),
      description: formData.description,
      category: formData.category,
      date: new Date(formData.date),
      type: formData.type,
      merchant: formData.merchant || undefined
    }

    onEdit(transaction.id, updatedTransaction)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      addCategory(customCategory.trim())
      setFormData(prev => ({ ...prev, category: customCategory.trim() }))
      setCustomCategory('')
      setShowCustomCategory(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <input
            type="text"
            required
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter transaction description"
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
            Category
          </label>
          <div className="space-y-2">
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            {!showCustomCategory ? (
              <button
                type="button"
                onClick={() => setShowCustomCategory(true)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                + Add Custom Category
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter category name"
                  className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddCustomCategory()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomCategory(false)
                    setCustomCategory('')
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account
          </label>
          <select
            value={formData.accountId}
            onChange={(e) => handleInputChange('accountId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {accounts.map(account => (
              <option key={account.id} value={account.name}>{account.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Merchant (Optional)
          </label>
          <input
            type="text"
            value={formData.merchant}
            onChange={(e) => handleInputChange('merchant', e.target.value)}
            placeholder="Enter merchant name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
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