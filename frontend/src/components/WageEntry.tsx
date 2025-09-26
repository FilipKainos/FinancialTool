import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

/**
 * Simple Wage Entry Component for Financial Tool MVP
 * Focus: Reliability and minimal complexity
 */

// Validation schema matching backend
const wageEntrySchema = z.object({
  monthlyAmount: z.number().min(0.01, 'Monthly amount must be greater than 0').max(1000000, 'Monthly amount too high'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  description: z.string().optional(),
})

type WageEntryData = z.infer<typeof wageEntrySchema>

interface WageEntry {
  id: number
  monthlyAmount: number
  effectiveDate: string
  description?: string
  createdAt: string
}

export const WageEntryForm: React.FC = () => {
  const [currentWage, setCurrentWage] = useState<WageEntry | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset
  } = useForm<WageEntryData>({
    resolver: zodResolver(wageEntrySchema),
    defaultValues: {
      monthlyAmount: 0,
      effectiveDate: new Date().toISOString().split('T')[0],
      description: '',
    },
    mode: 'onChange'
  })

  const monthlyAmount = watch('monthlyAmount')

  // Fetch current wage on component mount
  useEffect(() => {
    fetchCurrentWage()
  }, [])

  const fetchCurrentWage = async () => {
    try {
      const response = await fetch('/api/wage/current')
      const result = await response.json()
      
      if (result.success && result.data) {
        setCurrentWage(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch current wage:', error)
    }
  }

  const onSubmit = async (data: WageEntryData) => {
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/wage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: 'Wage saved successfully!' })
        setCurrentWage(result.data)
        reset({
          monthlyAmount: 0,
          effectiveDate: new Date().toISOString().split('T')[0],
          description: '',
        })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save wage' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
      console.error('Error saving wage:', error)
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

  return (
    <div className="max-w-md mx-auto mt-8 space-y-6">
      {/* Current Wage Display */}
      {currentWage && (
        <div className="card p-4 bg-blue-50">
          <h3 className="font-semibold text-blue-800">Current Monthly Wage</h3>
          <p className="text-2xl font-bold text-blue-900">
            {formatCurrency(currentWage.monthlyAmount)}
          </p>
          <p className="text-sm text-blue-600">
            Annual: {formatCurrency(currentWage.monthlyAmount * 12)}
          </p>
          <p className="text-xs text-blue-500">
            Effective: {new Date(currentWage.effectiveDate).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Wage Entry Form */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">
          {currentWage ? 'Update Monthly Wage' : 'Set Monthly Wage'}
        </h2>
        
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
            <label htmlFor="monthlyAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Wage *
            </label>
            <input
              {...register('monthlyAmount', { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0"
              className="input"
              placeholder="Enter your monthly wage"
            />
            {errors.monthlyAmount && (
              <p className="text-red-600 text-sm mt-1">{errors.monthlyAmount.message}</p>
            )}
            {monthlyAmount > 0 && (
              <p className="text-gray-600 text-sm mt-1">
                Annual projection: {formatCurrency(monthlyAmount * 12)}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">
              Effective Date *
            </label>
            <input
              {...register('effectiveDate')}
              type="date"
              className="input"
            />
            {errors.effectiveDate && (
              <p className="text-red-600 text-sm mt-1">{errors.effectiveDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <input
              {...register('description')}
              type="text"
              className="input"
              placeholder="e.g., New job, raise, promotion"
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : (currentWage ? 'Update Wage' : 'Save Wage')}
          </button>
        </form>

        <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
          <p className="font-medium">💡 Remember:</p>
          <p>• Wages are typically received on the 25th of each month</p>
          <p>• This will track your wage history over time</p>
          <p>• All amounts should be in USD</p>
        </div>
      </div>
    </div>
  )
}