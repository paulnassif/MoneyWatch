import { useState } from 'react'
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
import { Account } from '../types'

const mockSpendingData = [
  { month: 'Jan', amount: 2400 },
  { month: 'Feb', amount: 1398 },
  { month: 'Mar', amount: 9800 },
  { month: 'Apr', amount: 3908 },
  { month: 'May', amount: 4800 },
  { month: 'Jun', amount: 3800 }
]

const mockCategoryData = [
  { name: 'Food & Dining', value: 1200, color: '#3B82F6' },
  { name: 'Shopping', value: 800, color: '#10B981' },
  { name: 'Transportation', value: 400, color: '#F59E0B' },
  { name: 'Entertainment', value: 300, color: '#EF4444' }
]

const mockRecentTransactions = [
  { id: '1', description: 'Starbucks Coffee', amount: -5.47, category: 'Food & Dining', date: '2024-01-15' },
  { id: '2', description: 'Salary Deposit', amount: 3500.00, category: 'Income', date: '2024-01-15' },
  { id: '3', description: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', date: '2024-01-14' },
  { id: '4', description: 'Gas Station', amount: -45.20, category: 'Transportation', date: '2024-01-14' }
]

export default function Dashboard() {
  const [netWorth] = useState(125430)
  const [monthlyChange] = useState(2.4)
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  
  return (
    <div className="space-y-6">
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
              <p className="text-2xl font-bold text-gray-900">$3,847</p>
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
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-500 mt-1">3 over limit</p>
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
              <p className="text-2xl font-bold text-gray-900">$247/mo</p>
              <p className="text-sm text-gray-500 mt-1">12 active</p>
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
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockSpendingData}>
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
                <Pie
                  data={mockCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {mockCategoryData.map((category) => (
              <div key={category.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{category.name}</p>
                  <p className="text-sm text-gray-500">${category.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all
          </button>
        </div>
        <div className="space-y-4">
          {mockRecentTransactions.map((transaction) => (
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
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddAccountModal
        isOpen={showAddAccountModal}
        onClose={() => setShowAddAccountModal(false)}
        onAdd={(newAccount) => {
          const account: Account = {
            ...newAccount,
            id: (accounts.length + 1).toString(),
          }
          setAccounts(prev => [...prev, account])
        }}
      />
    </div>
  )
}