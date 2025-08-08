import React, { createContext, useContext, useState, useEffect } from 'react'
import { Account, Transaction, Budget, Subscription } from '../types'

interface AppContextType {
  accounts: Account[]
  transactions: Transaction[]
  budgets: Budget[]
  subscriptions: Subscription[]
  categories: string[]
  addAccount: (account: Omit<Account, 'id'>) => void
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void
  updateBudget: (id: string, budget: Omit<Budget, 'id' | 'spent'>) => void
  updateSubscription: (id: string, subscription: Omit<Subscription, 'id'>) => void
  deleteBudget: (id: string) => void
  updateSubscriptionStatus: (id: string, status: 'active' | 'cancelled' | 'paused') => void
  getBudgetSpending: (category: string) => number
  addCategory: (category: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const initialAccounts: Account[] = [
  {
    id: '1',
    name: 'Chase Checking',
    type: 'checking',
    balance: 5423.67,
    currency: 'USD',
    institution: 'Chase',
    lastUpdated: new Date()
  },
  {
    id: '2',
    name: 'Chase Savings',
    type: 'savings',
    balance: 15230.45,
    currency: 'USD',
    institution: 'Chase',
    lastUpdated: new Date()
  },
  {
    id: '3',
    name: 'Credit Card',
    type: 'credit_card',
    balance: -1234.56,
    currency: 'USD',
    institution: 'Chase',
    lastUpdated: new Date()
  }
]

const generateYearOfTransactions = (): Transaction[] => {
  const transactions: Transaction[] = []
  const currentYear = new Date().getFullYear()
  
  const accounts = ['Chase Checking', 'Chase Savings', 'Credit Card']
  
  // Regular income transactions (bi-weekly salary + monthly freelance)
  for (let month = 0; month < 12; month++) {
    // Bi-weekly salary (26 payments per year)
    const payDates = [7, 21] // 7th and 21st of each month
    payDates.forEach(day => {
      if (month < 11 || day <= 15) { // Don't go into future
        transactions.push({
          id: `salary-${month}-${day}`,
          accountId: 'Chase Checking',
          description: 'Salary Deposit - Tech Corp',
          amount: 3200 + Math.random() * 300, // $3200-3500
          category: 'Income',
          date: new Date(currentYear, month, day),
          type: 'income'
        })
      }
    })
    
    // Monthly freelance income (varying)
    if (Math.random() > 0.3) { // 70% chance each month
      transactions.push({
        id: `freelance-${month}`,
        accountId: 'Chase Checking',
        description: 'Freelance Web Development',
        amount: 400 + Math.random() * 1200, // $400-1600
        category: 'Income',
        date: new Date(currentYear, month, Math.floor(Math.random() * 28) + 1),
        type: 'income'
      })
    }
  }
  
  // Regular monthly expenses
  const monthlyExpenses = [
    { description: 'Rent Payment', amount: -2400, category: 'Housing', account: 'Chase Checking' },
    { description: 'Electric Bill', amount: -85 - Math.random() * 40, category: 'Utilities', account: 'Chase Checking' },
    { description: 'Internet Service', amount: -79.99, category: 'Utilities', account: 'Chase Checking' },
    { description: 'Phone Bill', amount: -65 - Math.random() * 15, category: 'Utilities', account: 'Chase Checking' },
    { description: 'Car Insurance', amount: -142, category: 'Transportation', account: 'Chase Checking' },
    { description: 'Health Insurance', amount: -320, category: 'Healthcare', account: 'Chase Checking' },
    { description: 'Gym Membership', amount: -29.99, category: 'Health & Fitness', account: 'Chase Checking' },
  ]
  
  for (let month = 0; month < 12; month++) {
    monthlyExpenses.forEach((expense, index) => {
      transactions.push({
        id: `monthly-${month}-${index}`,
        accountId: expense.account,
        description: expense.description,
        amount: typeof expense.amount === 'number' ? expense.amount : expense.amount,
        category: expense.category,
        date: new Date(currentYear, month, Math.floor(Math.random() * 5) + 1), // First 5 days of month
        type: 'expense'
      })
    })
  }
  
  // Subscription services
  const subscriptions = [
    { name: 'Netflix', amount: -15.99, day: 8 },
    { name: 'Spotify Premium', amount: -9.99, day: 12 },
    { name: 'Adobe Creative Cloud', amount: -52.99, day: 15 },
    { name: 'iCloud Storage', amount: -2.99, day: 20 },
    { name: 'Disney+', amount: -7.99, day: 25 }
  ]
  
  for (let month = 0; month < 12; month++) {
    subscriptions.forEach((sub, index) => {
      transactions.push({
        id: `sub-${month}-${index}`,
        accountId: 'Credit Card',
        description: `${sub.name} Subscription`,
        amount: sub.amount,
        category: 'Entertainment',
        date: new Date(currentYear, month, sub.day),
        type: 'expense'
      })
    })
  }
  
  // Weekly grocery shopping
  for (let month = 0; month < 12; month++) {
    for (let week = 0; week < 4; week++) {
      transactions.push({
        id: `grocery-${month}-${week}`,
        accountId: Math.random() > 0.5 ? 'Credit Card' : 'Chase Checking',
        description: ['Whole Foods', 'Trader Joes', 'Safeway', 'Target Grocery'][Math.floor(Math.random() * 4)],
        amount: -(80 + Math.random() * 120), // $80-200
        category: 'Food & Dining',
        date: new Date(currentYear, month, (week * 7) + Math.floor(Math.random() * 3) + 1),
        type: 'expense'
      })
    }
  }
  
  // Restaurants and coffee (2-4 times per week)
  for (let month = 0; month < 12; month++) {
    for (let week = 0; week < 4; week++) {
      // Coffee shops
      for (let coffee = 0; coffee < 2; coffee++) {
        transactions.push({
          id: `coffee-${month}-${week}-${coffee}`,
          accountId: 'Chase Checking',
          description: ['Starbucks', 'Blue Bottle Coffee', 'Local Cafe', 'Peets Coffee'][Math.floor(Math.random() * 4)],
          amount: -(3 + Math.random() * 8), // $3-11
          category: 'Food & Dining',
          date: new Date(currentYear, month, (week * 7) + Math.floor(Math.random() * 7) + 1),
          type: 'expense'
        })
      }
      
      // Restaurants
      if (Math.random() > 0.3) { // 70% chance per week
        transactions.push({
          id: `restaurant-${month}-${week}`,
          accountId: Math.random() > 0.6 ? 'Credit Card' : 'Chase Checking',
          description: ['Italian Restaurant', 'Sushi Bar', 'Mexican Food', 'Pizza Place', 'Burger Joint', 'Thai Restaurant'][Math.floor(Math.random() * 6)],
          amount: -(25 + Math.random() * 75), // $25-100
          category: 'Food & Dining',
          date: new Date(currentYear, month, (week * 7) + Math.floor(Math.random() * 7) + 1),
          type: 'expense'
        })
      }
    }
  }
  
  // Gas and transportation (2-3 times per month)
  for (let month = 0; month < 12; month++) {
    for (let gas = 0; gas < 3; gas++) {
      if (Math.random() > 0.2) { // 80% chance
        transactions.push({
          id: `gas-${month}-${gas}`,
          accountId: Math.random() > 0.7 ? 'Credit Card' : 'Chase Checking',
          description: ['Shell Gas Station', 'Chevron', '76 Gas', 'Costco Gas'][Math.floor(Math.random() * 4)],
          amount: -(35 + Math.random() * 45), // $35-80
          category: 'Transportation',
          date: new Date(currentYear, month, Math.floor(Math.random() * 28) + 1),
          type: 'expense'
        })
      }
    }
  }
  
  // Shopping (clothing, electronics, etc.)
  for (let month = 0; month < 12; month++) {
    // Regular shopping
    for (let shop = 0; shop < 2; shop++) {
      if (Math.random() > 0.4) { // 60% chance
        transactions.push({
          id: `shopping-${month}-${shop}`,
          accountId: Math.random() > 0.5 ? 'Credit Card' : 'Chase Checking',
          description: ['Amazon Purchase', 'Target', 'Best Buy', 'Macys', 'REI', 'Apple Store'][Math.floor(Math.random() * 6)],
          amount: -(20 + Math.random() * 200), // $20-220
          category: 'Shopping',
          date: new Date(currentYear, month, Math.floor(Math.random() * 28) + 1),
          type: 'expense'
        })
      }
    }
    
    // Bigger purchases occasionally
    if (Math.random() > 0.85) { // 15% chance per month
      transactions.push({
        id: `big-purchase-${month}`,
        accountId: 'Credit Card',
        description: ['New Laptop', 'iPhone', 'Winter Coat', 'Furniture', 'TV', 'Kitchen Appliance'][Math.floor(Math.random() * 6)],
        amount: -(300 + Math.random() * 1200), // $300-1500
        category: 'Shopping',
        date: new Date(currentYear, month, Math.floor(Math.random() * 28) + 1),
        type: 'expense'
      })
    }
  }
  
  // Healthcare expenses
  for (let month = 0; month < 12; month++) {
    if (Math.random() > 0.7) { // 30% chance per month
      transactions.push({
        id: `healthcare-${month}`,
        accountId: Math.random() > 0.5 ? 'Credit Card' : 'Chase Checking',
        description: ['Doctor Visit', 'Dentist', 'Pharmacy', 'Eye Exam', 'Physical Therapy'][Math.floor(Math.random() * 5)],
        amount: -(25 + Math.random() * 200), // $25-225
        category: 'Healthcare',
        date: new Date(currentYear, month, Math.floor(Math.random() * 28) + 1),
        type: 'expense'
      })
    }
  }
  
  // Entertainment and travel
  for (let month = 0; month < 12; month++) {
    // Regular entertainment
    if (Math.random() > 0.5) { // 50% chance
      transactions.push({
        id: `entertainment-${month}`,
        accountId: Math.random() > 0.4 ? 'Credit Card' : 'Chase Checking',
        description: ['Movie Theater', 'Concert Tickets', 'Sports Game', 'Museum', 'Bowling'][Math.floor(Math.random() * 5)],
        amount: -(15 + Math.random() * 85), // $15-100
        category: 'Entertainment',
        date: new Date(currentYear, month, Math.floor(Math.random() * 28) + 1),
        type: 'expense'
      })
    }
    
    // Travel expenses (less frequent)
    if (Math.random() > 0.9) { // 10% chance per month
      transactions.push({
        id: `travel-${month}`,
        accountId: 'Credit Card',
        description: ['Flight Booking', 'Hotel Stay', 'Airbnb', 'Rental Car', 'Trip Expenses'][Math.floor(Math.random() * 5)],
        amount: -(200 + Math.random() * 800), // $200-1000
        category: 'Travel',
        date: new Date(currentYear, month, Math.floor(Math.random() * 28) + 1),
        type: 'expense'
      })
    }
  }
  
  // Add housing category for rent
  transactions.forEach(t => {
    if (t.description.includes('Rent')) {
      t.category = 'Housing'
    }
  })
  
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime()) // Sort newest first
}

const initialBudgets: Budget[] = [
  { id: '1', category: 'Food & Dining', limit: 800, spent: 0, color: '#3B82F6', period: 'monthly' },
  { id: '2', category: 'Transportation', limit: 400, spent: 0, color: '#10B981', period: 'monthly' },
  { id: '3', category: 'Entertainment', limit: 200, spent: 0, color: '#F59E0B', period: 'monthly' },
  { id: '4', category: 'Shopping', limit: 500, spent: 0, color: '#EF4444', period: 'monthly' },
  { id: '5', category: 'Utilities', limit: 300, spent: 0, color: '#8B5CF6', period: 'monthly' },
  { id: '6', category: 'Healthcare', limit: 400, spent: 0, color: '#06B6D4', period: 'monthly' },
  { id: '7', category: 'Housing', limit: 2500, spent: 0, color: '#EC4899', period: 'monthly' },
  { id: '8', category: 'Health & Fitness', limit: 100, spent: 0, color: '#6366F1', period: 'monthly' }
]

const initialSubscriptions: Subscription[] = [
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

const defaultCategories = [
  'Food & Dining',
  'Transportation', 
  'Shopping',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Travel',
  'Education',
  'Business',
  'Income',
  'Housing',
  'Health & Fitness',
  'Other'
]

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('moneywatch-accounts')
    return saved ? JSON.parse(saved) : initialAccounts
  })

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('moneywatch-transactions')
    if (saved) {
      return JSON.parse(saved).map((t: any) => ({
        ...t,
        date: new Date(t.date)
      }))
    }
    return generateYearOfTransactions()
  })

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('moneywatch-budgets')
    return saved ? JSON.parse(saved) : initialBudgets
  })

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const saved = localStorage.getItem('moneywatch-subscriptions')
    if (saved) {
      return JSON.parse(saved).map((s: any) => ({
        ...s,
        nextBilling: new Date(s.nextBilling)
      }))
    }
    return initialSubscriptions
  })

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('moneywatch-categories')
    return saved ? JSON.parse(saved) : defaultCategories
  })

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('moneywatch-accounts', JSON.stringify(accounts))
  }, [accounts])

  useEffect(() => {
    localStorage.setItem('moneywatch-transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('moneywatch-budgets', JSON.stringify(budgets))
  }, [budgets])

  useEffect(() => {
    localStorage.setItem('moneywatch-subscriptions', JSON.stringify(subscriptions))
  }, [subscriptions])

  useEffect(() => {
    localStorage.setItem('moneywatch-categories', JSON.stringify(categories))
  }, [categories])

  // Calculate budget spending from transactions
  const getBudgetSpending = (category: string): number => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    return transactions
      .filter(t => 
        t.category === category && 
        t.amount < 0 && 
        t.date >= startOfMonth
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  }

  // Update budget spent amounts when transactions change
  useEffect(() => {
    setBudgets(prevBudgets => 
      prevBudgets.map(budget => ({
        ...budget,
        spent: getBudgetSpending(budget.category)
      }))
    )
  }, [transactions])

  const addAccount = (account: Omit<Account, 'id'>) => {
    const newAccount: Account = {
      ...account,
      id: Date.now().toString(),
    }
    setAccounts(prev => [...prev, newAccount])
  }

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  const addBudget = (budget: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      spent: getBudgetSpending(budget.category)
    }
    setBudgets(prev => [...prev, newBudget])
  }

  const addSubscription = (subscription: Omit<Subscription, 'id'>) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: Date.now().toString(),
    }
    setSubscriptions(prev => [...prev, newSubscription])
  }

  const updateTransaction = (id: string, transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...transaction, id } : t
    ))
  }

  const updateBudget = (id: string, budget: Omit<Budget, 'id' | 'spent'>) => {
    setBudgets(prev => prev.map(b => 
      b.id === id ? { ...budget, id, spent: getBudgetSpending(budget.category) } : b
    ))
  }

  const updateSubscription = (id: string, subscription: Omit<Subscription, 'id'>) => {
    setSubscriptions(prev => prev.map(s => 
      s.id === id ? { ...subscription, id } : s
    ))
  }

  const deleteBudget = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id))
  }

  const updateSubscriptionStatus = (id: string, status: 'active' | 'cancelled' | 'paused') => {
    setSubscriptions(prev => prev.map(s => 
      s.id === id ? { ...s, status } : s
    ))
  }

  const addCategory = (category: string) => {
    if (!categories.includes(category) && category.trim() !== '') {
      setCategories(prev => [...prev, category.trim()])
    }
  }

  return (
    <AppContext.Provider value={{
      accounts,
      transactions,
      budgets,
      subscriptions,
      categories,
      addAccount,
      addTransaction,
      addBudget,
      addSubscription,
      updateTransaction,
      updateBudget,
      updateSubscription,
      deleteBudget,
      updateSubscriptionStatus,
      getBudgetSpending,
      addCategory
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}