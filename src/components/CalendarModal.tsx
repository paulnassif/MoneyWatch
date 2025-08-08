import { Calendar } from 'lucide-react'
import Modal from './Modal'
import { Subscription } from '../types'

interface CalendarModalProps {
  isOpen: boolean
  onClose: () => void
  subscriptions: Subscription[]
}

export default function CalendarModal({ isOpen, onClose, subscriptions }: CalendarModalProps) {
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active')
  
  const getUpcomingBills = () => {
    const today = new Date()
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    
    return activeSubscriptions
      .filter(s => s.nextBilling >= today && s.nextBilling <= nextMonth)
      .sort((a, b) => a.nextBilling.getTime() - b.nextBilling.getTime())
  }

  const upcomingBills = getUpcomingBills()
  
  const getDaysUntilBilling = (date: Date) => {
    const today = new Date()
    const billingDate = date
    const diffTime = billingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatAmount = (amount: number, frequency: string) => {
    return `$${amount.toFixed(2)}/${frequency === 'yearly' ? 'year' : frequency === 'weekly' ? 'week' : 'month'}`
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Subscription Calendar">
      <div className="space-y-6">
        <div className="flex items-center justify-center p-6 bg-primary-50 rounded-lg">
          <Calendar className="w-12 h-12 text-primary-600 mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Next 30 Days</h3>
            <p className="text-sm text-gray-600">
              {upcomingBills.length} bills coming up
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Upcoming Bills</h4>
          {upcomingBills.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No bills due in the next 30 days</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBills.map((subscription) => {
                const daysUntil = getDaysUntilBilling(subscription.nextBilling)
                
                return (
                  <div key={subscription.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{subscription.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900">{subscription.name}</p>
                        <p className="text-sm text-gray-500">
                          {subscription.nextBilling.toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric' 
                          })}
                          {daysUntil === 0 && ' • Today'}
                          {daysUntil === 1 && ' • Tomorrow'}
                          {daysUntil > 1 && ` • In ${daysUntil} days`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatAmount(subscription.amount, subscription.frequency)}
                      </p>
                      <p className="text-sm text-gray-500">{subscription.category}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Total for next 30 days:</span>
            <span className="font-semibold text-gray-900">
              ${upcomingBills.reduce((sum, sub) => sum + sub.amount, 0).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}