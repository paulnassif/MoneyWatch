import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from './contexts/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budgets from './pages/Budgets'
import Subscriptions from './pages/Subscriptions'
import CreditScore from './pages/CreditScore'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/credit-score" element={<CreditScore />} />
            </Routes>
          </Layout>
        </Router>
      </AppProvider>
    </QueryClientProvider>
  )
}

export default App