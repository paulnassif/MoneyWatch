import { useState } from 'react'
import { Search, Filter, Download, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import AddTransactionModal from '../components/AddTransactionModal'
import EditTransactionModal from '../components/EditTransactionModal'
import { useApp } from '../contexts/AppContext'

export default function Transactions() {
  const { transactions, addTransaction, updateTransaction, categories } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || transaction.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
    
  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <div className="flex items-center gap-3">
          <button 
            className="btn-secondary flex items-center gap-2"
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," + 
                "Date,Description,Category,Account,Amount,Type\n" +
                filteredTransactions.map(t => 
                  `${t.date.toLocaleDateString()},"${t.description}","${t.category}","${t.accountId}",${t.amount},"${t.type}"`
                ).join("\n");
              
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            className="btn-primary flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-success-500">
                +${totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-success-50 rounded-lg">
              <ArrowUpRight className="w-6 h-6 text-success-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-danger-500">
                -${totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-danger-50 rounded-lg">
              <ArrowDownRight className="w-6 h-6 text-danger-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Cash Flow</p>
              <p className={`text-2xl font-bold ${
                totalIncome - totalExpenses >= 0 ? 'text-success-500' : 'text-danger-500'
              }`}>
                {totalIncome - totalExpenses >= 0 ? '+' : '-'}${Math.abs(totalIncome - totalExpenses).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full md:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Category:</span>
              <button
                key="All"
                onClick={() => setSelectedCategory('All')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1">
          <div className="hidden md:grid md:grid-cols-6 gap-4 px-4 py-3 text-sm font-medium text-gray-500 border-b border-gray-200">
            <span>Description</span>
            <span>Category</span>
            <span>Account</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
            <span></span>
          </div>
          
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 px-4 py-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg mr-3 ${
                  transaction.amount > 0 ? 'bg-success-50' : 'bg-gray-50'
                }`}>
                  {transaction.amount > 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-success-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500 md:hidden">{transaction.category} • {transaction.accountId}</p>
                </div>
              </div>
              
              <div className="hidden md:block text-gray-700">
                {transaction.category}
              </div>
              
              <div className="hidden md:block text-gray-700">
                {transaction.accountId}
              </div>
              
              <div className="hidden md:block text-gray-700">
                {transaction.date.toLocaleDateString()}
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.amount > 0 ? 'text-success-500' : 'text-gray-900'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 md:hidden">{transaction.date.toLocaleDateString()}</p>
              </div>
              
              <div className="hidden md:flex justify-end">
                <button 
                  className="text-gray-400 hover:text-gray-600 text-sm"
                  onClick={() => {
                    setEditingTransaction(transaction)
                    setShowEditModal(true)
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}
      </div>

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={addTransaction}
      />

      <EditTransactionModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingTransaction(null)
        }}
        onEdit={updateTransaction}
        transaction={editingTransaction}
      />
    </div>
  )
}