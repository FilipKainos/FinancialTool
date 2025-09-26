import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatCurrency } from '@/utils/dateUtils'

/**
 * Wage Entry Form Schema and Component
 */
const wageEntrySchema = z.object({
  monthlyWage: z.number().min(0, 'Monthly wage must be positive').max(1000000, 'Monthly wage is too high'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  description: z.string().optional(),
})

type WageEntryData = z.infer<typeof wageEntrySchema>

interface WageEntryFormProps {
  onSubmit: (data: WageEntryData) => void
  initialData?: Partial<WageEntryData>
  isLoading?: boolean
}

export const WageEntryForm: React.FC<WageEntryFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<WageEntryData>({
    resolver: zodResolver(wageEntrySchema),
    defaultValues: {
      monthlyWage: initialData?.monthlyWage || 0,
      effectiveDate: initialData?.effectiveDate || new Date().toISOString().split('T')[0],
      description: initialData?.description || '',
    },
    mode: 'onChange'
  })

  const monthlyWage = watch('monthlyWage')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
      <h2 className="text-xl font-semibold">Enter Monthly Wage</h2>
      
      <div>
        <label htmlFor="monthlyWage" className="block text-sm font-medium text-gray-700 mb-1">
          Monthly Wage
        </label>
        <input
          {...register('monthlyWage', { valueAsNumber: true })}
          type="number"
          step="0.01"
          className="input"
          placeholder="Enter your monthly wage"
        />
        {errors.monthlyWage && (
          <p className="text-red-600 text-sm mt-1">{errors.monthlyWage.message}</p>
        )}
        {monthlyWage > 0 && (
          <p className="text-gray-600 text-sm mt-1">
            Annual: {formatCurrency(monthlyWage * 12)}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700 mb-1">
          Effective Date
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
          placeholder="e.g., New job, raise, bonus adjustment"
        />
      </div>

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Saving...' : 'Save Monthly Wage'}
      </button>
    </form>
  )
}

/**
 * Expense Entry Form Schema and Component
 */
const expenseEntrySchema = z.object({
  description: z.string().min(1, 'Description is required').max(100, 'Description is too long'),
  amount: z.number().min(0.01, 'Amount must be greater than 0').max(100000, 'Amount is too high'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  isRecurring: z.boolean().default(false),
  recurringFrequency: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']).optional(),
})

type ExpenseEntryData = z.infer<typeof expenseEntrySchema>

interface ExpenseEntryFormProps {
  onSubmit: (data: ExpenseEntryData) => void
  categories: Array<{ id: string; name: string }>
  initialData?: Partial<ExpenseEntryData>
  isLoading?: boolean
}

export const ExpenseEntryForm: React.FC<ExpenseEntryFormProps> = ({
  onSubmit,
  categories,
  initialData,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<ExpenseEntryData>({
    resolver: zodResolver(expenseEntrySchema),
    defaultValues: {
      description: initialData?.description || '',
      amount: initialData?.amount || 0,
      category: initialData?.category || '',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      isRecurring: initialData?.isRecurring || false,
    },
    mode: 'onChange'
  })

  const isRecurring = watch('isRecurring')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4">
      <h2 className="text-xl font-semibold">Add Expense</h2>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          {...register('description')}
          type="text"
          className="input"
          placeholder="What did you spend money on?"
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <input
          {...register('amount', { valueAsNumber: true })}
          type="number"
          step="0.01"
          className="input"
          placeholder="0.00"
        />
        {errors.amount && (
          <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select {...register('category')} className="input">
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
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
          Date
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

      <div className="flex items-center">
        <input
          {...register('isRecurring')}
          type="checkbox"
          id="isRecurring"
          className="mr-2"
        />
        <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
          This is a recurring expense
        </label>
      </div>

      {isRecurring && (
        <div>
          <label htmlFor="recurringFrequency" className="block text-sm font-medium text-gray-700 mb-1">
            Frequency
          </label>
          <select {...register('recurringFrequency')} className="input">
            <option value="">Select frequency</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Saving...' : 'Add Expense'}
      </button>
    </form>
  )
}