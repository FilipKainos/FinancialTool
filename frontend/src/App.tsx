import React, { useState } from 'react'
import { WageEntryForm } from './components/WageEntry'
import { ExpenseEntryForm } from './components/ExpenseEntry'
import './index.css'

/**
 * Simple Financial Tool App - MVP
 * Focus: Reliability and minimal complexity
 */

function App() {
  const [activeTab, setActiveTab] = useState<'wage' | 'expenses'>('wage')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Financial Tool</h1>
          <p className="text-gray-600">Simple wage tracking and financial insights</p>
          
          {/* Simple Tab Navigation */}
          <div className="mt-4 flex space-x-1">
            <button
              onClick={() => setActiveTab('wage')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'wage'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Monthly Wage
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'expenses'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Expenses
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'wage' ? <WageEntryForm /> : <ExpenseEntryForm />}
      </main>

      <footer className="mt-12 py-6 text-center text-sm text-gray-500">
        <p>Financial Tool MVP - Built for reliability and simplicity</p>
      </footer>
    </div>
  )
}

export default App