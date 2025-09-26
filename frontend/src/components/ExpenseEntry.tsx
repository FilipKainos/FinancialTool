import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

/**
 * Expense Entry Component for Financial Tool MVP
 * Following development guidelines: Clean, simple, secure, modular
 */

// Validation schema matching backend - security-first approach
const expenseEntrySchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0').max(100000, 'Amount too high'),
  description: z.string().min(1, 'Description is required').max(200, 'Description too long').trim(),
  category: z.enum(['Food', 'Transportation', 'Housing', 'Entertainment', 'Utilities'], {
    errorMap: () => ({ message: 'Please select a valid category' })
  }),
  date: z.string().min(1, 'Date is required'),
})

type ExpenseEntryData = z.infer<typeof expenseEntrySchema>

interface ExpenseEntry {
  id: number
  amount: number
  description: string
  category: string
  date: string
  createdAt: string
}

interface Category {
  id: number
  name: string
  color: string
}

export const ExpenseEntryForm: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [recentExpenses, setRecentExpenses] = useState<ExpenseEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<ExpenseEntryData>({
    resolver: zodResolver(expenseEntrySchema),
    defaultValues: {
      amount: 0,
      description: '',
      category: undefined,
      date: new Date().toISOString().split('T')[0],
    },
    mode: 'onChange'
  })

  const amount = watch('amount')

  // Fetch categories and recent expenses on mount
  useEffect(() => {
    fetchCategories()
    fetchRecentExpenses()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const result = await response.json()
      
      if (result.success) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchRecentExpenses = async () => {
    try {
      const response = await fetch('/api/expenses?limit=5')
      const result = await response.json()
      
      if (result.success) {
        setRecentExpenses(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch recent expenses:', error)
    }
  }

  const onSubmit = async (data: ExpenseEntryData) => {
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: 'Expense added successfully!' })
        reset({
          amount: 0,
          description: '',
          category: undefined,
          date: new Date().toISOString().split('T')[0],
        })
        // Refresh recent expenses list
        fetchRecentExpenses()
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || 'Failed to add expense'
        })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
      console.error('Error adding expense:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Expense Entry Form */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
        
        {message && (
          <div className={`p-3 rounded mb-4 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <input
              {...register('description')}
              type="text"
              className="input"
              placeholder="What did you spend money on?"
              maxLength={200}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount *
            </label>
            <input
              {...register('amount', { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0"
              className="input"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
            )}
            {amount > 0 && (
              <p className="text-gray-600 text-sm mt-1">
                Amount: {formatCurrency(amount)}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select {...register('category')} className="input">
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              {...register('date')}
              type="date"
              className="input"
            />
            {errors.date && (
              <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding...' : 'Add Expense'}
          </button>
        </form>

        <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
          <p className="font-medium">💡 Quick Tips:</p>
          <p>• Be specific in descriptions for better AI insights</p>
          <p>• Choose the most appropriate category</p>
          <p>• All amounts are in USD</p>
        </div>
      </div>

      {/* Recent Expenses Display */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
        
        {recentExpenses.length === 0 ? (
          <p className="text-gray-500 italic">No expenses recorded yet. Add your first expense!</p>
        ) : (
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div 
                key={expense.id} 
                className="flex justify-between items-center p-3 bg-gray-50 rounded border-l-4 border-blue-400"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <p className="text-sm text-gray-600">
                    {expense.category} • {formatDate(expense.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {recentExpenses.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm font-medium">
              <span>Recent Total:</span>
              <span>{formatCurrency(recentExpenses.reduce((sum, exp) => sum + exp.amount, 0))}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}