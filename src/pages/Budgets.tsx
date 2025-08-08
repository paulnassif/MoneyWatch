import { useState } from 'react'
import { Plus, AlertTriangle, TrendingUp, Target } from 'lucide-react'
import AddBudgetModal from '../components/AddBudgetModal'
import { Budget } from '../types'

const mockBudgets: Budget[] = [
  { id: '1', category: 'Food & Dining', limit: 600, spent: 487.23, color: '#3B82F6', period: 'monthly' },
  { id: '2', category: 'Transportation', limit: 200, spent: 156.80, color: '#10B981', period: 'monthly' },
  { id: '3', category: 'Entertainment', limit: 150, spent: 203.45, color: '#F59E0B', period: 'monthly' },
  { id: '4', category: 'Shopping', limit: 300, spent: 189.99, color: '#EF4444', period: 'monthly' },
  { id: '5', category: 'Utilities', limit: 250, spent: 234.67, color: '#8B5CF6', period: 'monthly' },
  { id: '6', category: 'Healthcare', limit: 100, spent: 45.00, color: '#06B6D4', period: 'monthly' }
]

export default function Budgets() {
  const [budgets, setBudgets] = useState(mockBudgets)
  const [showAddModal, setShowAddModal] = useState(false)
  
  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.limit, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const overBudgetCount = budgets.filter(budget => budget.spent > budget.limit).length

  const getProgressPercentage = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100)
  }

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 80) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4" />
          Create Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budgeted</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalBudgeted.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalSpent.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-gray-500 mr-1" />
                <span className="text-sm text-gray-500">
                  {((totalSpent / totalBudgeted) * 100).toFixed(1)}% of budget
                </span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Over Budget</p>
              <p className="text-2xl font-bold text-red-600">
                {overBudgetCount}
              </p>
              <p className="text-sm text-gray-500 mt-1">Categories</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {budgets.map((budget) => {
          const progressPercentage = getProgressPercentage(budget.spent, budget.limit)
          const remaining = budget.limit - budget.spent
          const isOverBudget = budget.spent > budget.limit
          
          return (
            <div key={budget.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: budget.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                    <p className="text-sm text-gray-500 capitalize">{budget.period} budget</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                  </p>
                  {isOverBudget ? (
                    <p className="text-sm text-red-600 font-medium">
                      ${Math.abs(remaining).toFixed(2)} over budget
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      ${remaining.toFixed(2)} remaining
                    </p>
                  )}
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(budget.spent, budget.limit)}`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
                {isOverBudget && (
                  <div
                    className="h-3 rounded-full bg-red-200 -mt-3"
                    style={{ 
                      width: `${Math.min(progressPercentage - 100, 20)}%`,
                      marginLeft: '100%'
                    }}
                  />
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {progressPercentage.toFixed(1)}% used
                </span>
                
                <div className="flex items-center gap-4">
                  <button className="text-primary-600 hover:text-primary-700 font-medium">
                    Edit
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    Delete
                  </button>
                </div>
              </div>
              
              {isOverBudget && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-700">
                    You've exceeded your budget for this category this month.
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Tips</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="p-1 bg-primary-50 rounded mr-3 mt-0.5">
              <Target className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Set realistic goals</p>
              <p className="text-sm text-gray-600">
                Base your budgets on your actual spending patterns from the past few months.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="p-1 bg-primary-50 rounded mr-3 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Review regularly</p>
              <p className="text-sm text-gray-600">
                Check your budget progress weekly to stay on track and make adjustments as needed.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AddBudgetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(newBudget) => {
          const budget: Budget = {
            ...newBudget,
            id: (budgets.length + 1).toString(),
            spent: 0
          }
          setBudgets(prev => [...prev, budget])
        }}
      />
    </div>
  )
}