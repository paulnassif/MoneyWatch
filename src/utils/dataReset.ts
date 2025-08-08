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
    // If there are less than 200 transactions, it's probably old data
    return !parsed || !Array.isArray(parsed) || parsed.length < 200
  } catch (error) {
    console.error('Error checking old data:', error)
    return true // If there's an error, offer to reset
  }
}