// Utility function to reset all localStorage data
export const resetAllData = () => {
  const keys = [
    'moneywatch-accounts',
    'moneywatch-transactions', 
    'moneywatch-budgets',
    'moneywatch-subscriptions',
    'moneywatch-categories'
  ]
  
  keys.forEach(key => {
    localStorage.removeItem(key)
  })
  
  // Reload the page to reinitialize with fresh data
  window.location.reload()
}

// Check if user has old data
export const hasOldData = () => {
  const transactions = localStorage.getItem('moneywatch-transactions')
  if (!transactions) return false
  
  const parsed = JSON.parse(transactions)
  // If there are less than 100 transactions, it's probably old data
  return parsed.length < 100
}