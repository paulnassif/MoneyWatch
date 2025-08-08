export interface Account {
  id: string
  name: string
  type: 'checking' | 'savings' | 'credit_card' | 'investment'
  balance: number
  currency: string
  institution: string
  lastUpdated: Date
}

export interface Transaction {
  id: string
  accountId: string
  amount: number
  description: string
  category: string
  date: Date
  type: 'income' | 'expense'
  merchant?: string
  isRecurring?: boolean
}

export interface Budget {
  id: string
  category: string
  limit: number
  spent: number
  period: 'monthly' | 'weekly'
  color: string
}

export interface Subscription {
  id: string
  name: string
  amount: number
  frequency: 'monthly' | 'yearly' | 'weekly'
  nextBilling: Date
  status: 'active' | 'cancelled' | 'paused'
  category: string
  icon?: string
  logo?: string
}

export interface CreditScore {
  score: number
  provider: string
  lastUpdated: Date
  change: number
  factors: Array<{
    factor: string
    impact: 'positive' | 'negative' | 'neutral'
    description: string
  }>
}

export interface FinancialGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: Date
  category: string
}