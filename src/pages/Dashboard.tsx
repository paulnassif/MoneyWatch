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
  ArrowDownRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  Tooltip,
  Legend
} from 'recharts'
import AddAccountModal from '../components/AddAccountModal'


export default function Dashboard() {
  const navigate = useNavigate()
  const { accounts, transactions, budgets, subscriptions, addAccount } = useApp()
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)
  const [chartPeriod, setChartPeriod] = useState('6months')
  const [chartType, setChartType] = useState('spending') // spending, income, savings, budget
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const showResetOption = hasOldData()
  
  // Enhanced chart data calculation
  const getChartData = () => {
    const months = chartPeriod === '6months' ? 6 : chartPeriod === 'year' ? 12 : 3
    const data = []
    const now = new Date()
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      
      const monthlyTransactions = transactions.filter(t => 
        t.date >= date && 
        t.date < nextMonth
      )
      
      const income = monthlyTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0)
      
      const expenses = monthlyTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
      
      const savings = income - expenses
      
      // Budget performance for this month
      const budgetSpent = budgets.reduce((total, budget) => {
        const categorySpending = monthlyTransactions
          .filter(t => t.amount < 0 && t.category === budget.category)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        return total + categorySpending
      }, 0)
      
      const budgetLimit = budgets.reduce((total, budget) => total + budget.limit, 0)
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        fullMonth: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        spending: expenses,
        income: income,
        savings: savings,
        budgetSpent: budgetSpent,
        budgetLimit: budgetLimit,
        savingsRate: income > 0 ? ((savings / income) * 100) : 0
      })
    }
    
    return data
  }

  // Get target date for calculations (either selected or current)
  const getTargetDate = () => {
    return selectedMonth && selectedYear 
      ? new Date(parseInt(selectedYear), parseInt(selectedMonth), 1)
      : new Date() // Default to current month
  }

  // Daily spending data for selected month
  const getDailyData = () => {
    const targetDate = getTargetDate()
    
    const year = targetDate.getFullYear()
    const month = targetDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    const dailyData = []
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.date)
        return tDate.getFullYear() === year && 
               tDate.getMonth() === month && 
               tDate.getDate() === day
      })
      
      const income = dayTransactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0)
      
      const expenses = dayTransactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
      
      dailyData.push({
        day: day,
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        spending: expenses,
        income: income,
        net: income - expenses,
        transactionCount: dayTransactions.length
      })
    }
    
    return dailyData
  }

  // Calculate real category spending data using target month
  const getCategoryData = () => {
    const categoryTotals = targetMonthTransactions
      .filter(t => t.amount < 0 && t.category !== 'Income')
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

  // Enhanced analytics
  const chartData = getChartData()
  const currentMonthData = chartData[chartData.length - 1]
  const previousMonthData = chartData[chartData.length - 2]
  
  const netWorth = accounts.reduce((sum, account) => sum + account.balance, 0)
  
  // Calculate month-over-month changes
  const spendingChange = previousMonthData ? 
    ((currentMonthData?.spending - previousMonthData.spending) / previousMonthData.spending * 100) : 0
  
  const incomeChange = previousMonthData ? 
    ((currentMonthData?.income - previousMonthData.income) / previousMonthData.income * 100) : 0
    
  const avgSavingsRate = chartData.reduce((sum, month) => sum + month.savingsRate, 0) / chartData.length
  
  // Use target date for all calculations
  const targetDate = getTargetDate()
  const targetMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1)
  const targetMonthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0)
  
  // Filtered transactions for target month
  const targetMonthTransactions = transactions.filter(t => 
    t.date >= targetMonth && t.date <= targetMonthEnd
  )
  
  const monthlySpending = targetMonthTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
  const monthlyIncome = targetMonthTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
    
  const targetSavingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlySpending) / monthlyIncome * 100) : 0
    
  const activeBudgets = budgets.length
  const overBudgetCount = budgets.filter(b => {
    const actualSpent = targetMonthTransactions
      .filter(t => 
        t.category === b.category && 
        t.amount < 0
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
  
  // Show recent transactions from target month if filtered, otherwise all recent
  const recentTransactions = (selectedMonth || selectedYear) 
    ? targetMonthTransactions.slice(0, 4)
    : transactions.slice(0, 4)
  
  return (
    <div className="space-y-6">
      {showResetOption && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-800">Updated Demo Data Available!</h3>
              <p className="text-sm text-blue-700 mt-1">
                Load realistic transaction data (July 2024 - August 2025) for a couple with 2 dogs, including seasonal variations.
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('This will reset all your data and load the new realistic demo transactions (July 2024 - August 2025). Continue?')) {
                  resetAllData()
                }
              }}
              className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Load New Data
            </button>
          </div>
        </div>
      )}
      
      {/* Force reset button for testing */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Force Data Reset</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Click this to force reset and load the correct July 2024 - August 2025 data.
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm('This will force reset all data. Continue?')) {
                resetAllData()
              }
            }}
            className="ml-4 px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Force Reset
          </button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        
        {/* Global Date Filter */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">View Period:</span>
          <select 
            className="text-sm border border-gray-300 rounded-md px-3 py-1"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">Current Month</option>
            <option value="0">January</option>
            <option value="1">February</option>
            <option value="2">March</option>
            <option value="3">April</option>
            <option value="4">May</option>
            <option value="5">June</option>
            <option value="6">July</option>
            <option value="7">August</option>
            <option value="8">September</option>
            <option value="9">October</option>
            <option value="10">November</option>
            <option value="11">December</option>
          </select>
          <select 
            className="text-sm border border-gray-300 rounded-md px-3 py-1"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Current Year</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={() => setShowAddAccountModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add Account
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Worth</p>
              <p className="text-2xl font-bold text-gray-900">
                ${netWorth.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                {incomeChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-danger-500 mr-1" />
                )}
                <span className={`text-sm ${incomeChange >= 0 ? 'text-success-500' : 'text-danger-500'}`}>
                  {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}% net worth growth
                </span>
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
                {spendingChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-danger-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-success-500 mr-1" />
                )}
                <span className={`text-sm ${spendingChange >= 0 ? 'text-danger-500' : 'text-success-500'}`}>
                  {spendingChange >= 0 ? '+' : ''}{spendingChange.toFixed(1)}% vs last month
                </span>
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

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Savings Rate</p>
              <p className="text-2xl font-bold text-gray-900">{targetSavingsRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-500 mt-1">
                {selectedMonth || selectedYear ? 'Selected Period' : `Avg: ${avgSavingsRate.toFixed(1)}%`}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h2 className="text-lg font-semibold text-gray-900">Financial Trends</h2>
            <div className="flex flex-wrap gap-2">
              <select 
                className="text-sm border border-gray-300 rounded-md px-3 py-1"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <option value="spending">Spending Only</option>
                <option value="income">Income vs Spending</option>
                <option value="savings">Savings Trend</option>
                <option value="budget">Budget Performance</option>
              </select>
              <select 
                className="text-sm border border-gray-300 rounded-md px-3 py-1"
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value)}
              >
                <option value="3months">Last 3 months</option>
                <option value="6months">Last 6 months</option>
                <option value="year">Last year</option>
              </select>
            </div>
          </div>
          <div className="h-80">
            {chartType === 'spending' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spending']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="spending" 
                    stroke="#EF4444" 
                    fill="#EF4444" 
                    fillOpacity={0.1} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
            {chartType === 'income' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `$${value.toLocaleString()}`, 
                      name === 'income' ? 'Income' : 'Spending'
                    ]}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.2} 
                    name="Income"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="spending" 
                    stroke="#EF4444" 
                    fill="#EF4444" 
                    fillOpacity={0.2}
                    name="Spending" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
            {chartType === 'savings' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Savings Rate']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="savingsRate" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            {chartType === 'budget' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `$${value.toLocaleString()}`, 
                      name === 'budgetSpent' ? 'Spent' : 'Budget'
                    ]}
                  />
                  <Bar dataKey="budgetLimit" fill="#E5E7EB" name="Budget" />
                  <Bar dataKey="budgetSpent" fill="#F59E0B" name="Spent" />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            )}
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
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 gap-2 mt-4 max-h-32 overflow-y-auto">
            {getCategoryData().map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                </div>
                <span className="text-sm text-gray-600">${category.value.toLocaleString()}</span>
              </div>
            ))}
            {getCategoryData().length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No expense data for this month</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Daily View Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Daily Spending Pattern 
            {selectedMonth && selectedYear && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                - {new Date(parseInt(selectedYear), parseInt(selectedMonth)).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            )}
          </h2>
          {!selectedMonth && !selectedYear && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Use date filter above to view historical months
            </span>
          )}
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getDailyData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                interval="preserveStartEnd"
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `$${value.toLocaleString()}`, 
                  name === 'spending' ? 'Daily Spending' : name === 'income' ? 'Daily Income' : 'Net'
                ]}
                labelFormatter={(label, payload: any) => {
                  if (payload && payload[0]) {
                    return `${payload[0].payload.fullDate} - ${payload[0].payload.transactionCount} transactions`
                  }
                  return label
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.2} 
                name="Income"
              />
              <Area 
                type="monotone" 
                dataKey="spending" 
                stroke="#EF4444" 
                fill="#EF4444" 
                fillOpacity={0.2}
                name="Spending" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Insights Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Budget Alerts</h3>
            {overBudgetCount > 0 ? (
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
          <div className="space-y-2">
            {budgets
              .map(budget => ({
                ...budget,
                spent: targetMonthTransactions
                  .filter(t => 
                    t.category === budget.category && 
                    t.amount < 0
                  )
                  .reduce((sum, t) => sum + Math.abs(t.amount), 0)
              }))
              .filter(budget => budget.spent > budget.limit * 0.8)
              .slice(0, 3)
              .map((budget) => (
                <div key={budget.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{budget.category}</span>
                  <span className={`font-medium ${
                    budget.spent > budget.limit ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {((budget.spent / budget.limit) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            {budgets.every(b => {
              const spent = targetMonthTransactions
                .filter(t => t.category === b.category && t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0)
              return spent <= b.limit * 0.8
            }) && (
              <p className="text-sm text-green-600">All budgets on track! 🎉</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Monthly Insights</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Top Category</span>
              <span className="text-sm font-medium text-gray-900">
                {getCategoryData()[0]?.name || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Biggest Expense</span>
              <span className="text-sm font-medium text-gray-900">
                $
                {targetMonthTransactions
                  .filter(t => t.amount < 0)
                  .reduce((max, t) => Math.abs(t.amount) > Math.abs(max.amount) ? t : max, { amount: 0 })
                  .amount !== 0 
                    ? Math.abs(targetMonthTransactions
                        .filter(t => t.amount < 0)
                        .reduce((max, t) => Math.abs(t.amount) > Math.abs(max.amount) ? t : max, { amount: 0 })
                        .amount
                      ).toLocaleString()
                    : '0'
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Daily Spending</span>
              <span className="text-sm font-medium text-gray-900">
                ${targetMonthTransactions.length > 0 ? (monthlySpending / Math.max(getDailyData().filter(d => d.transactionCount > 0).length, 1)).toFixed(0) : '0'}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/transactions')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              View All Transactions
            </button>
            <button
              onClick={() => navigate('/budgets')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              Manage Budgets
            </button>
            <button
              onClick={() => navigate('/subscriptions')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              Review Subscriptions
            </button>
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