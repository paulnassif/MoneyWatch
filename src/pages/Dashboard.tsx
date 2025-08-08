import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { resetAllData, hasOldData } from '../utils/dataReset'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Target,
  RefreshCcw,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import AddAccountModal from '../components/AddAccountModal'


export default function Dashboard() {
  const navigate = useNavigate()
  const { accounts, transactions, budgets, subscriptions, addAccount } = useApp()
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)
  const [chartPeriod, setChartPeriod] = useState('6months')
  const showResetOption = hasOldData()

  const recentTransactions = transactions.slice(0, 4)
  
  // Calculate real spending data for charts
  const getSpendingData = () => {
    const months = chartPeriod === '6months' ? 6 : 12
    const data = []
    const now = new Date()
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      
      const monthlyTransactions = transactions.filter(t => 
        t.amount < 0 && // Only expenses
        t.date >= date && 
        t.date < nextMonth
      )
      
      const monthlySpending = monthlyTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        amount: monthlySpending
      })
    }
    
    return data
  }

  // Calculate real category spending data
  const getCategoryData = () => {
    const currentMonth = new Date()
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    
    const categoryTotals = transactions
      .filter(t => t.amount < 0 && t.date >= startOfMonth && t.category !== 'Income')
      .reduce((acc, t) => {
        const category = t.category
        acc[category] = (acc[category] || 0) + Math.abs(t.amount)
        return acc
      }, {} as Record<string, number>)
    
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1']
    
    return Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a) // Sort by amount descending
      .slice(0, 8) // Top 8 categories
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }))
  }

  // Calculate real statistics
  const netWorth = accounts.reduce((sum, account) => sum + account.balance, 0)
  const monthlyChange = 2.4 // This would be calculated from historical data
  
  const currentMonth = new Date()
  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const monthlySpending = transactions
    .filter(t => t.amount < 0 && t.date >= startOfMonth)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
  const activeBudgets = budgets.length
  const overBudgetCount = budgets.filter(b => {
    const actualSpent = transactions
      .filter(t => 
        t.category === b.category && 
        t.amount < 0 && 
        t.date >= startOfMonth
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    return actualSpent > b.limit
  }).length
  
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active')
  const monthlySubscriptionCost = activeSubscriptions.reduce((sum, sub) => {
    if (sub.frequency === 'monthly') return sum + sub.amount
    if (sub.frequency === 'yearly') return sum + (sub.amount / 12)
    return sum + (sub.amount * 4.33) // weekly to monthly
  }, 0)
  
  return (
    <div className="space-y-6">
      {showResetOption && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-800">New Demo Data Available!</h3>
              <p className="text-sm text-blue-700 mt-1">
                We've added a full year of realistic transaction data. Reset to see comprehensive spending analysis and charts.
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('This will reset all your data and load a full year of demo transactions. Continue?')) {
                  resetAllData()
                }
              }}
              className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Load Demo Data
            </button>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowAddAccountModal(true)}
        >
          <Plus className="w-4 h-4" />
          Add Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Worth</p>
              <p className="text-2xl font-bold text-gray-900">
                ${netWorth.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
                <span className="text-sm text-success-500">+{monthlyChange}%</span>
              </div>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Spending</p>
              <p className="text-2xl font-bold text-gray-900">${monthlySpending.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingDown className="w-4 h-4 text-danger-500 mr-1" />
                <span className="text-sm text-danger-500">+12%</span>
              </div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Budgets</p>
              <p className="text-2xl font-bold text-gray-900">{activeBudgets}</p>
              <p className="text-sm text-gray-500 mt-1">{overBudgetCount} over limit</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">${monthlySubscriptionCost.toFixed(0)}/mo</p>
              <p className="text-sm text-gray-500 mt-1">{activeSubscriptions.length} active</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <RefreshCcw className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Spending Trend</h2>
            <select 
              className="text-sm border border-gray-300 rounded-md px-3 py-1"
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
            >
              <option value="6months">Last 6 months</option>
              <option value="year">Last year</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getSpendingData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Area type="monotone" dataKey="amount" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {getCategoryData().length > 0 ? (
                  <Pie
                    data={getCategoryData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {getCategoryData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                ) : (
                  <text x="50%" y="50%" textAnchor="middle" className="text-gray-400 text-sm">
                    No data available
                  </text>
                )}
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {getCategoryData().map((category) => (
              <div key={category.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{category.name}</p>
                  <p className="text-sm text-gray-500">${category.value.toFixed(2)}</p>
                </div>
              </div>
            ))}
            {getCategoryData().length === 0 && (
              <div className="col-span-2 text-center py-4 text-gray-500">
                <p>No expense data for this month</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <button 
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            onClick={() => navigate('/transactions')}
          >
            View all
          </button>
        </div>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${
                  transaction.amount > 0 ? 'bg-success-50' : 'bg-gray-50'
                }`}>
                  {transaction.amount > 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-success-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.amount > 0 ? 'text-success-500' : 'text-gray-900'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">{transaction.date.toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddAccountModal
        isOpen={showAddAccountModal}
        onClose={() => setShowAddAccountModal(false)}
        onAdd={addAccount}
      />
    </div>
  )
}