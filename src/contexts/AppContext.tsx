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
  const startDate = new Date(2024, 6, 1) // July 1, 2024
  const endDate = new Date(2025, 7, 7) // August 7, 2025
  
  // Helper function to check if date is a holiday season
  const isHolidaySeason = (month: number): boolean => {
    return month === 10 || month === 11 // November & December (holiday shopping)
  }
  
  const isSummer = (month: number): boolean => {
    return month === 5 || month === 6 || month === 7 // June, July, August (vacation/outdoor spending)
  }
  
  // Generate transactions month by month from July 2024 to August 2025
  let currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' })
    
    // Skip if we're past August 7, 2025
    if (year === 2025 && month === 7 && currentDate.getDate() > 7) break
    
    // INCOME - Bi-weekly salary (every other Friday)
    const salaryDates = []
    let salaryDate = new Date(year, month, 1)
    // Find Fridays
    while (salaryDate.getMonth() === month) {
      if (salaryDate.getDay() === 5) { // Friday
        salaryDates.push(new Date(salaryDate))
      }
      salaryDate.setDate(salaryDate.getDate() + 1)
    }
    
    // Add every other Friday as payday
    salaryDates.forEach((date, index) => {
      if (index % 2 === 0) {
        transactions.push({
          id: `salary-${year}-${month}-${index}`,
          accountId: 'Chase Checking',
          description: 'Salary Direct Deposit - TechCorp',
          amount: 3200 + Math.random() * 400, // $3200-3600
          category: 'Income',
          date: new Date(date),
          type: 'income'
        })
      }
    })
    
    // Girlfriend's part-time income (freelance design work)
    if (Math.random() > 0.4) { // 60% chance per month
      transactions.push({
        id: `gf-income-${year}-${month}`,
        accountId: 'Chase Checking',
        description: 'Freelance Design Payment - Sarah',
        amount: 800 + Math.random() * 1200, // $800-2000
        category: 'Income',
        date: new Date(year, month, 15 + Math.floor(Math.random() * 10)),
        type: 'income'
      })
    }
    
    // HOUSING & UTILITIES
    const monthlyFixedExpenses = [
      { desc: 'Rent - Downtown Apartment', amount: -2800, cat: 'Housing', day: 1 },
      { desc: 'Renters Insurance', amount: -45, cat: 'Housing', day: 1 },
      { desc: 'Electric & Gas Bill', amount: -(120 + Math.random() * 80), cat: 'Utilities', day: 5 },
      { desc: 'Internet - Xfinity', amount: -89.99, cat: 'Utilities', day: 12 },
      { desc: 'Phone Plan - Verizon (2 lines)', amount: -135, cat: 'Utilities', day: 18 },
    ]
    
    monthlyFixedExpenses.forEach((expense, idx) => {
      // Skip future dates
      const expenseDate = new Date(year, month, expense.day)
      if (expenseDate <= endDate) {
        transactions.push({
          id: `fixed-${year}-${month}-${idx}`,
          accountId: 'Chase Checking',
          description: expense.desc,
          amount: expense.amount,
          category: expense.cat,
          date: expenseDate,
          type: 'expense'
        })
      }
    })
    
    // TRANSPORTATION
    transactions.push({
      id: `car-insurance-${year}-${month}`,
      accountId: 'Chase Checking',
      description: 'State Farm Auto Insurance',
      amount: -165,
      category: 'Transportation',
      date: new Date(year, month, 8),
      type: 'expense'
    })
    
    // Gas - more in summer (road trips)
    const gasFrequency = isSummer(month) ? 4 : 3
    for (let i = 0; i < gasFrequency; i++) {
      transactions.push({
        id: `gas-${year}-${month}-${i}`,
        accountId: Math.random() > 0.3 ? 'Credit Card' : 'Chase Checking',
        description: ['Shell', 'Chevron', 'Costco Gas', '76'][Math.floor(Math.random() * 4)],
        amount: -(45 + Math.random() * 35), // $45-80
        category: 'Transportation',
        date: new Date(year, month, Math.floor(Math.random() * 28) + 1),
        type: 'expense'
      })
    }
    
    // DOG EXPENSES (2 dogs - monthly costs)
    const dogExpenses = [
      { desc: 'Chewy.com - Dog Food & Supplies', amount: -(80 + Math.random() * 40), cat: 'Other' },
      { desc: 'VCA Animal Hospital', amount: -(120 + Math.random() * 200), cat: 'Healthcare', chance: 0.3 }, // 30% chance
      { desc: 'PetSmart - Dog Toys/Treats', amount: -(25 + Math.random() * 35), cat: 'Other', chance: 0.7 },
      { desc: 'Dog Grooming - Petco', amount: -(85 + Math.random() * 45), cat: 'Other', chance: 0.4 }
    ]
    
    dogExpenses.forEach((expense, idx) => {
      if (!expense.chance || Math.random() < expense.chance) {
        transactions.push({
          id: `dog-${year}-${month}-${idx}`,
          accountId: Math.random() > 0.5 ? 'Credit Card' : 'Chase Checking',
          description: expense.desc,
          amount: expense.amount,
          category: expense.cat,
          date: new Date(year, month, Math.floor(Math.random() * 28) + 1),
          type: 'expense'
        })
      }
    })
    
    // GROCERIES & DINING (couple lifestyle)
    // Weekly grocery shopping - higher amounts for 2 people + 2 dogs
    for (let week = 0; week < 4; week++) {
      const groceryDay = week * 7 + Math.floor(Math.random() * 7) + 1
      if (groceryDay <= 28) {
        transactions.push({
          id: `grocery-${year}-${month}-${week}`,
          accountId: Math.random() > 0.4 ? 'Credit Card' : 'Chase Checking',
          description: ['Whole Foods', 'Trader Joes', 'Safeway', 'Costco'][Math.floor(Math.random() * 4)],
          amount: -(130 + Math.random() * 120), // $130-250 (for 2 people + dogs)
          category: 'Food & Dining',
          date: new Date(year, month, groceryDay),
          type: 'expense'
        })
      }
    }
    
    // Date nights & restaurants (2-3 times per month)
    const dateNights = Math.floor(Math.random() * 2) + 2 // 2-3 times
    for (let i = 0; i < dateNights; i++) {
      transactions.push({
        id: `datenight-${year}-${month}-${i}`,
        accountId: Math.random() > 0.6 ? 'Credit Card' : 'Chase Checking',
        description: ['Italian Bistro', 'Sushi Restaurant', 'Steakhouse', 'Thai Place', 'Mexican Grill', 'Wine Bar'][Math.floor(Math.random() * 6)],
        amount: -(65 + Math.random() * 85), // $65-150 (dinner for 2)
        category: 'Food & Dining',
        date: new Date(year, month, Math.floor(Math.random() * 28) + 1),
        type: 'expense'
      })
    }
    
    // Coffee & quick meals
    const coffeeVisits = 8 + Math.floor(Math.random() * 6) // 8-14 times per month
    for (let i = 0; i < coffeeVisits; i++) {
      transactions.push({
        id: `coffee-${year}-${month}-${i}`,
        accountId: 'Chase Checking',
        description: ['Starbucks', 'Local Coffee Shop', 'Blue Bottle', 'Dunkin'][Math.floor(Math.random() * 4)],
        amount: -(8 + Math.random() * 15), // $8-23
        category: 'Food & Dining',
        date: new Date(year, month, Math.floor(Math.random() * 28) + 1),
        type: 'expense'
      })
    }
    
    // SUBSCRIPTIONS & ENTERTAINMENT
    const subscriptions = [
      { name: 'Netflix', amount: -15.99, day: 8 },
      { name: 'Spotify Premium Duo', amount: -12.99, day: 12 },
      { name: 'Amazon Prime', amount: -14.98, day: 15 },
      { name: 'Adobe Creative Suite', amount: -52.99, day: 20 },
      { name: 'Disney+ Bundle', amount: -19.99, day: 25 },
      { name: 'Gym Membership (2 people)', amount: -89.99, day: 3 }
    ]
    
    subscriptions.forEach((sub, idx) => {
      transactions.push({
        id: `sub-${year}-${month}-${idx}`,
        accountId: 'Credit Card',
        description: sub.name,
        amount: sub.amount,
        category: 'Entertainment',
        date: new Date(year, month, sub.day),
        type: 'expense'
      })
    })
    
    // SEASONAL SHOPPING
    let shoppingMultiplier = 1
    let shoppingDescription = ['Amazon Purchase', 'Target', 'Best Buy', 'Macys']
    
    if (isHolidaySeason(month)) {
      shoppingMultiplier = 2.5 // Much more holiday shopping
      shoppingDescription = ['Christmas Gifts - Amazon', 'Holiday Shopping - Mall', 'Gift Cards - Target', 'Black Friday Deals']
    } else if (isSummer(month)) {
      shoppingMultiplier = 1.3 // More summer activities
      shoppingDescription = ['Summer Gear - REI', 'Beach Supplies', 'BBQ Equipment', 'Outdoor Furniture']
    }
    
    // Regular shopping
    const shoppingTrips = Math.floor((2 + Math.random() * 3) * shoppingMultiplier) // 2-5 trips, more in holidays
    for (let i = 0; i < shoppingTrips; i++) {
      transactions.push({
        id: `shopping-${year}-${month}-${i}`,
        accountId: 'Credit Card',
        description: shoppingDescription[Math.floor(Math.random() * shoppingDescription.length)],
        amount: -(40 + Math.random() * 160) * (isHolidaySeason(month) ? 1.5 : 1), // Higher amounts during holidays
        category: 'Shopping',
        date: new Date(year, month, Math.floor(Math.random() * 28) + 1),
        type: 'expense'
      })
    }
    
    // HEALTHCARE
    if (Math.random() > 0.7) { // 30% chance
      transactions.push({
        id: `health-${year}-${month}`,
        accountId: Math.random() > 0.5 ? 'Credit Card' : 'Chase Checking',
        description: ['Doctor Visit', 'Dentist Checkup', 'Pharmacy - CVS', 'Urgent Care'][Math.floor(Math.random() * 4)],
        amount: -(35 + Math.random() * 185), // $35-220
        category: 'Healthcare',
        date: new Date(year, month, Math.floor(Math.random() * 28) + 1),
        type: 'expense'
      })
    }
    
    // SEASONAL ACTIVITIES
    if (isSummer(month)) {
      // Summer activities
      if (Math.random() > 0.6) {
        transactions.push({
          id: `summer-${year}-${month}`,
          accountId: 'Credit Card',
          description: ['Concert Tickets', 'Baseball Game', 'Beach Trip', 'Camping Gear'][Math.floor(Math.random() * 4)],
          amount: -(85 + Math.random() * 165), // $85-250
          category: 'Entertainment',
          date: new Date(year, month, Math.floor(Math.random() * 28) + 1),
          type: 'expense'
        })
      }
    }
    
    if (month === 1) { // February - Valentine's Day
      transactions.push({
        id: `valentines-${year}`,
        accountId: 'Credit Card',
        description: 'Valentine\'s Day Dinner',
        amount: -(120 + Math.random() * 80),
        category: 'Food & Dining',
        date: new Date(year, month, 14),
        type: 'expense'
      })
    }
    
    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1)
    currentDate.setDate(1)
  }
  
  const sortedTransactions = transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
  console.log(`Generated ${sortedTransactions.length} transactions from July 2024 to August 2025`)
  return sortedTransactions
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