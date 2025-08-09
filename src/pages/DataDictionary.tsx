export default function DataDictionary() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Data Dictionary</h1>
      </div>

      <div className="space-y-6">
        {/* KPI Metrics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Performance Indicators</h3>
          <div className="grid gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Net Worth</h4>
              <p className="text-sm text-gray-600">Total value of all your accounts (checking + savings - credit card balances). Shows month-over-month income growth percentage.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Monthly Spending</h4>
              <p className="text-sm text-gray-600">Total expenses for the current month. Percentage shows increase/decrease compared to previous month (red=increase, green=decrease).</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Savings Rate</h4>
              <p className="text-sm text-gray-600">Percentage of income saved this month: (Income - Expenses) / Income × 100. Also shows your historical average.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Active Budgets</h4>
              <p className="text-sm text-gray-600">Number of budget categories you're tracking. Shows how many are over their limits.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Subscriptions</h4>
              <p className="text-sm text-gray-600">Total monthly cost of all active recurring subscriptions and services.</p>
            </div>
          </div>
        </div>

        {/* Chart Types */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Chart Types</h3>
          <div className="grid gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Spending Only</h4>
              <p className="text-sm text-gray-600">Area chart showing monthly spending trends over time. Helps identify spending patterns and seasonal variations.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Income vs Spending</h4>
              <p className="text-sm text-gray-600">Dual area chart comparing income and expenses month by month. Gap between lines shows savings (green) or deficit (red).</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Savings Trend</h4>
              <p className="text-sm text-gray-600">Line chart showing savings rate percentage over time. Higher is better - aim for 20% or more for healthy financial growth.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Budget Performance</h4>
              <p className="text-sm text-gray-600">Bar chart comparing actual spending vs budget limits by month. Orange bars over gray bars indicate overspending.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Daily View</h4>
              <p className="text-sm text-gray-600">Daily breakdown of income and spending for a selected month/year. Shows spending patterns, paydays, and transaction frequency.</p>
            </div>
          </div>
        </div>

        {/* Budget Alerts */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget Alerts & Insights</h3>
          <div className="grid gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Budget Alerts</h4>
              <p className="text-sm text-gray-600">Shows categories that are over 80% of budget limit. Red = over budget, Amber = near limit (80-100%), Green = all budgets on track.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Top Category</h4>
              <p className="text-sm text-gray-600">Your highest spending category this month. Usually Food & Dining or Housing for most people.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Biggest Expense</h4>
              <p className="text-sm text-gray-600">Single largest transaction this month. Helps identify major purchases or unexpected expenses.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Average Daily Spending</h4>
              <p className="text-sm text-gray-600">Monthly spending divided by current day of month. Helps project end-of-month totals.</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Spending Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Housing</h4>
              <p className="text-sm text-gray-600">Rent, mortgage, utilities, renters insurance, maintenance costs</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Food & Dining</h4>
              <p className="text-sm text-gray-600">Groceries, restaurants, coffee shops, takeout, meal delivery</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Transportation</h4>
              <p className="text-sm text-gray-600">Gas, car insurance, maintenance, parking, public transit</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Healthcare</h4>
              <p className="text-sm text-gray-600">Doctor visits, prescriptions, insurance premiums, vet bills</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Entertainment</h4>
              <p className="text-sm text-gray-600">Streaming subscriptions, movies, concerts, hobbies, games</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Shopping</h4>
              <p className="text-sm text-gray-600">Clothing, electronics, home goods, online purchases</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Health & Fitness</h4>
              <p className="text-sm text-gray-600">Gym memberships, fitness equipment, wellness services</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Other</h4>
              <p className="text-sm text-gray-600">Pet expenses, gifts, miscellaneous purchases, custom categories</p>
            </div>
          </div>
        </div>

        {/* Financial Health Guidelines */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">💡 Financial Health Guidelines</h3>
          <div className="grid gap-4">
            <div className="p-4 bg-white border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Savings Rate</h4>
              <p className="text-sm text-blue-700">Aim for 20% or higher. This includes emergency fund, retirement, and other savings goals.</p>
            </div>
            <div className="p-4 bg-white border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Housing Costs</h4>
              <p className="text-sm text-blue-700">Keep total housing expenses (rent/mortgage + utilities) under 30% of gross income.</p>
            </div>
            <div className="p-4 bg-white border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Budget Review</h4>
              <p className="text-sm text-blue-700">Review and adjust budgets monthly. Track trends over 3-6 months for better insights.</p>
            </div>
            <div className="p-4 bg-white border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Daily Tracking</h4>
              <p className="text-sm text-blue-700">Use daily view to understand spending triggers and identify patterns in your behavior.</p>
            </div>
          </div>
        </div>

        {/* Feature Guide */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Use MoneyWatch</h3>
          <div className="grid gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">1. Add Transactions</h4>
              <p className="text-sm text-gray-600">Record your income and expenses with proper categories. The more data, the better your insights.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">2. Set Budgets</h4>
              <p className="text-sm text-gray-600">Create realistic monthly budgets for each spending category. Start conservative and adjust as needed.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">3. Review Weekly</h4>
              <p className="text-sm text-gray-600">Check your progress weekly. Look for budget alerts and spending trends.</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">4. Analyze Monthly</h4>
              <p className="text-sm text-gray-600">Use charts to understand your financial patterns and make informed decisions about future spending.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}