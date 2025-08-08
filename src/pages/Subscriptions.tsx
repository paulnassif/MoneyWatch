import { useState } from 'react'
import { Plus, AlertCircle, Calendar, DollarSign, X } from 'lucide-react'
import AddSubscriptionModal from '../components/AddSubscriptionModal'
import { Subscription } from '../types'

const mockSubscriptions: Subscription[] = [
  { 
    id: '1', 
    name: 'Netflix', 
    amount: 15.99, 
    frequency: 'monthly' as const, 
    nextBilling: new Date('2024-02-15'), 
    status: 'active' as const, 
    category: 'Entertainment',
    icon: '🎬'
  },
  { 
    id: '2', 
    name: 'Spotify Premium', 
    amount: 9.99, 
    frequency: 'monthly' as const, 
    nextBilling: new Date('2024-02-08'), 
    status: 'active' as const, 
    category: 'Entertainment',
    icon: '🎵'
  },
  { 
    id: '3', 
    name: 'Amazon Prime', 
    amount: 139.00, 
    frequency: 'yearly' as const, 
    nextBilling: new Date('2024-08-15'), 
    status: 'active' as const, 
    category: 'Shopping',
    icon: '📦'
  },
  { 
    id: '4', 
    name: 'Adobe Creative Cloud', 
    amount: 52.99, 
    frequency: 'monthly' as const, 
    nextBilling: new Date('2024-02-12'), 
    status: 'active' as const, 
    category: 'Software',
    icon: '🎨'
  },
  { 
    id: '5', 
    name: 'Gym Membership', 
    amount: 29.99, 
    frequency: 'monthly' as const, 
    nextBilling: new Date('2024-02-20'), 
    status: 'active' as const, 
    category: 'Health & Fitness',
    icon: '💪'
  },
  { 
    id: '6', 
    name: 'Disney+', 
    amount: 7.99, 
    frequency: 'monthly' as const, 
    nextBilling: new Date('2024-01-25'), 
    status: 'cancelled' as const, 
    category: 'Entertainment',
    icon: '🏰'
  }
]

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions)
  const [filter, setFilter] = useState<'all' | 'active' | 'cancelled'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  
  const filteredSubscriptions = subscriptions.filter(sub => {
    if (filter === 'all') return true
    return sub.status === filter
  })
  
  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active')
  const monthlyTotal = activeSubscriptions.reduce((sum, sub) => {
    if (sub.frequency === 'monthly') return sum + sub.amount
    if (sub.frequency === 'yearly') return sum + (sub.amount / 12)
    return sum + (sub.amount * 4.33) // weekly to monthly
  }, 0)
  
  const yearlyTotal = monthlyTotal * 12
  const upcomingBills = activeSubscriptions
    .sort((a, b) => a.nextBilling.getTime() - b.nextBilling.getTime())
    .slice(0, 3)

  const formatAmount = (amount: number, frequency: string) => {
    return `$${amount.toFixed(2)}/${frequency === 'yearly' ? 'year' : frequency === 'weekly' ? 'week' : 'month'}`
  }

  const getDaysUntilBilling = (date: Date) => {
    const today = new Date()
    const billingDate = date
    const diffTime = billingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <button 
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4" />
          Add Subscription
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Total</p>
              <p className="text-2xl font-bold text-gray-900">
                ${monthlyTotal.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {activeSubscriptions.length} active subscriptions
              </p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Yearly Total</p>
              <p className="text-2xl font-bold text-gray-900">
                ${yearlyTotal.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Projected annual cost
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Potential Savings</p>
              <p className="text-2xl font-bold text-primary-600">
                ${(monthlyTotal * 0.3).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                By cancelling unused
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Bills</h2>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View calendar
          </button>
        </div>
        
        <div className="space-y-3">
          {upcomingBills.map((subscription) => {
            const daysUntil = getDaysUntilBilling(subscription.nextBilling)
            
            return (
              <div key={`upcoming-${subscription.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{subscription.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{subscription.name}</p>
                    <p className="text-sm text-gray-500">
                      {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatAmount(subscription.amount, subscription.frequency)}
                  </p>
                  <p className="text-sm text-gray-500">{subscription.nextBilling.toLocaleDateString()}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">All Subscriptions</h2>
          <div className="flex items-center gap-2">
            {(['all', 'active', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 text-sm rounded-full transition-colors capitalize ${
                  filter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredSubscriptions.map((subscription) => (
            <div key={subscription.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <span className="text-3xl mr-4">{subscription.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{subscription.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      subscription.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscription.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {subscription.category} • Next billing: {subscription.nextBilling.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatAmount(subscription.amount, subscription.frequency)}
                  </p>
                  {subscription.frequency !== 'monthly' && (
                    <p className="text-sm text-gray-500">
                      ${(subscription.frequency === 'yearly' ? subscription.amount / 12 : subscription.amount * 4.33).toFixed(2)}/month
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {subscription.status === 'active' ? (
                    <>
                      <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded flex items-center gap-1">
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button className="px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded">
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSubscriptions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No subscriptions found</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Management Tips</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="p-1 bg-primary-50 rounded mr-3 mt-0.5">
              <AlertCircle className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Review monthly</p>
              <p className="text-sm text-gray-600">
                Check if you're still using all your subscriptions and cancel unused ones.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="p-1 bg-primary-50 rounded mr-3 mt-0.5">
              <Calendar className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Set reminders</p>
              <p className="text-sm text-gray-600">
                Get notified before renewal dates to avoid unwanted charges.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AddSubscriptionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(newSubscription) => {
          const subscription: Subscription = {
            ...newSubscription,
            id: (subscriptions.length + 1).toString(),
          }
          setSubscriptions(prev => [...prev, subscription])
        }}
      />
    </div>
  )
}