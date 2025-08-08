import { useState } from 'react'
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

const mockCreditData = [
  { month: 'Aug', score: 720 },
  { month: 'Sep', score: 725 },
  { month: 'Oct', score: 718 },
  { month: 'Nov', score: 730 },
  { month: 'Dec', score: 735 },
  { month: 'Jan', score: 742 }
]

const creditFactors = [
  {
    factor: 'Payment History',
    impact: 'positive' as const,
    description: 'You have made all payments on time for the past 12 months',
    weight: 35
  },
  {
    factor: 'Credit Utilization',
    impact: 'neutral' as const,
    description: 'Your credit utilization is 28% - try to keep it below 30%',
    weight: 30
  },
  {
    factor: 'Length of Credit History',
    impact: 'positive' as const,
    description: 'Your average account age is 8 years, which is excellent',
    weight: 15
  },
  {
    factor: 'Credit Mix',
    impact: 'positive' as const,
    description: 'You have a good mix of credit cards, loans, and mortgage',
    weight: 10
  },
  {
    factor: 'New Credit',
    impact: 'negative' as const,
    description: 'You opened 2 new accounts in the last 6 months',
    weight: 10
  }
]

const creditAccounts = [
  { name: 'Chase Freedom', type: 'Credit Card', balance: 1250, limit: 5000, utilization: 25, status: 'Good Standing' },
  { name: 'Capital One Venture', type: 'Credit Card', balance: 890, limit: 3000, utilization: 30, status: 'Good Standing' },
  { name: 'Wells Fargo Mortgage', type: 'Mortgage', balance: 245000, limit: null, utilization: null, status: 'Good Standing' },
  { name: 'Auto Loan', type: 'Auto Loan', balance: 15600, limit: null, utilization: null, status: 'Good Standing' }
]

export default function CreditScore() {
  const [currentScore] = useState(742)
  const [scoreChange] = useState(7)
  const [lastUpdated] = useState('2024-01-15')
  
  const getScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600'
    if (score >= 740) return 'text-green-500'
    if (score >= 670) return 'text-yellow-500'
    if (score >= 580) return 'text-orange-500'
    return 'text-red-500'
  }

  const getScoreRating = (score: number) => {
    if (score >= 800) return 'Excellent'
    if (score >= 740) return 'Very Good'
    if (score >= 670) return 'Good'
    if (score >= 580) return 'Fair'
    return 'Poor'
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'negative':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Info className="w-5 h-5 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Credit Score</h1>
        <div className="text-sm text-gray-500">
          Last updated: {lastUpdated}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="text-center mb-6">
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(currentScore)}`}>
                {currentScore}
              </div>
              <div className="text-lg font-medium text-gray-600 mb-2">
                {getScoreRating(currentScore)}
              </div>
              <div className="flex items-center justify-center">
                {scoreChange > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  scoreChange > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {scoreChange > 0 ? '+' : ''}{scoreChange} points this month
                </span>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockCreditData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Score Range</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Poor</span>
                <span className="text-gray-600">300-579</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Fair</span>
                <span className="text-gray-600">580-669</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Good</span>
                <span className="text-gray-600">670-739</span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium text-green-600">
                <span>Very Good</span>
                <span>740-799</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Excellent</span>
                <span className="text-gray-600">800-850</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Credit Monitoring</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Identity Monitoring</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dark Web Monitoring</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Credit Alerts</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Credit Factors</h2>
        <div className="space-y-4">
          {creditFactors.map((factor, index) => (
            <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                {getImpactIcon(factor.impact)}
                <div className="ml-3 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-gray-900">{factor.factor}</h3>
                    <span className="text-sm text-gray-500">({factor.weight}% of score)</span>
                  </div>
                  <p className="text-sm text-gray-600">{factor.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Credit Accounts</h2>
        <div className="space-y-4">
          {creditAccounts.map((account, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{account.name}</h3>
                <p className="text-sm text-gray-500">{account.type}</p>
              </div>
              
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  ${account.balance.toLocaleString()}
                  {account.limit && (
                    <span className="text-gray-500"> / ${account.limit.toLocaleString()}</span>
                  )}
                </p>
                {account.utilization && (
                  <p className={`text-sm ${
                    account.utilization > 30 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {account.utilization}% utilization
                  </p>
                )}
              </div>
              
              <div className="text-right">
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  {account.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tips to Improve Your Score</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="p-1 bg-primary-50 rounded mr-3 mt-0.5">
              <TrendingUp className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Lower your credit utilization</p>
              <p className="text-sm text-gray-600">
                Keep your credit card balances below 30% of your credit limits, ideally below 10%.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="p-1 bg-primary-50 rounded mr-3 mt-0.5">
              <CheckCircle className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Make payments on time</p>
              <p className="text-sm text-gray-600">
                Payment history is the most important factor. Set up autopay to never miss a payment.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="p-1 bg-primary-50 rounded mr-3 mt-0.5">
              <AlertCircle className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Limit new credit applications</p>
              <p className="text-sm text-gray-600">
                Avoid opening too many new accounts in a short period, as this can lower your score.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}