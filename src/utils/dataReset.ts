// Utility function to reset all localStorage data
export const resetAllData = () => {
  try {
    console.log('Resetting all data...')
    
    const keys = [
      'moneywatch-accounts',
      'moneywatch-transactions', 
      'moneywatch-budgets',
      'moneywatch-subscriptions',
      'moneywatch-categories'
    ]
    
    keys.forEach(key => {
      console.log(`Removing ${key}`)
      localStorage.removeItem(key)
    })
    
    console.log('Data reset complete, reloading page...')
    // Reload the page to reinitialize with fresh data
    window.location.reload()
  } catch (error) {
    console.error('Error resetting data:', error)
    alert('Error resetting data. Please try refreshing the page manually.')
  }
}

// Check if user has old data
export const hasOldData = () => {
  try {
    const transactions = localStorage.getItem('moneywatch-transactions')
    if (!transactions) return true // No data means they need the demo data
    
    const parsed = JSON.parse(transactions)
    if (!parsed || !Array.isArray(parsed)) return true
    
    // Check if any transactions are after August 7, 2025
    const maxDate = new Date(2025, 7, 7) // August 7, 2025
    const hasInvalidDates = parsed.some(t => {
      const transactionDate = new Date(t.date)
      return transactionDate > maxDate
    })
    
    // If there are transactions after Aug 7, 2025 OR less than 200 transactions, it's old data
    return hasInvalidDates || parsed.length < 200
  } catch (error) {
    console.error('Error checking old data:', error)
    return true // If there's an error, offer to reset
  }
}