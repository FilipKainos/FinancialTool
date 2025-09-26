import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { z } from 'zod'
import { 
  initializeDatabase, 
  getCurrentWage, 
  addWageEntry, 
  getWageHistory,
  addExpenseEntry,
  getRecentExpenses,
  getCategories
} from './database.js'

/**
 * Simple Express server for Financial Tool MVP
 * Focus: Reliability and minimal complexity
 */

const app = express()
const PORT = process.env.PORT || 8000

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '1mb' }))

// Validation schemas
const wageEntrySchema = z.object({
  monthlyAmount: z.number().min(0.01, 'Monthly amount must be greater than 0').max(1000000, 'Monthly amount too high'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  description: z.string().optional()
})

// Expense validation schema - following security standards
const expenseEntrySchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0').max(100000, 'Amount too high'),
  description: z.string().min(1, 'Description is required').max(200, 'Description too long').trim(),
  category: z.enum(['Food', 'Transportation', 'Housing', 'Entertainment', 'Utilities'], {
    errorMap: () => ({ message: 'Invalid category selected' })
  }),
  date: z.string().min(1, 'Date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
})

/**
 * Routes
 */

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Financial Tool API' })
})

// Get current wage
app.get('/api/wage/current', async (req, res) => {
  try {
    const wage = await getCurrentWage()
    res.json({ 
      success: true, 
      data: wage 
    })
  } catch (error) {
    console.error('Error fetching current wage:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch current wage' 
    })
  }
})

// Get wage history
app.get('/api/wage/history', async (req, res) => {
  try {
    const wages = await getWageHistory()
    res.json({ 
      success: true, 
      data: wages 
    })
  } catch (error) {
    console.error('Error fetching wage history:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch wage history' 
    })
  }
})

// Add new wage entry
app.post('/api/wage', async (req, res) => {
  try {
    // Validate input
    const validation = wageEntrySchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: validation.error.errors
      })
    }

    const wage = await addWageEntry(validation.data)
    res.status(201).json({ 
      success: true, 
      data: wage 
    })
  } catch (error) {
    console.error('Error adding wage entry:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to add wage entry'
    })
  }
})

// Get available categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await getCategories()
    res.json({ 
      success: true, 
      data: categories 
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch categories' 
    })
  }
})

// Get recent expenses
app.get('/api/expenses', async (req, res) => {
  try {
    // Parse and validate limit parameter
    const limitParam = req.query.limit
    const limit = limitParam ? parseInt(limitParam as string) : 30
    
    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        error: 'Limit must be between 1 and 100'
      })
    }

    const expenses = await getRecentExpenses(limit)
    res.json({ 
      success: true, 
      data: expenses 
    })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch expenses' 
    })
  }
})

// Add new expense entry
app.post('/api/expenses', async (req, res) => {
  try {
    // Validate input with comprehensive security checks
    const validation = expenseEntrySchema.safeParse(req.body)
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data',
        details: validation.error.errors
      })
    }

    const expense = await addExpenseEntry(validation.data)
    res.status(201).json({ 
      success: true, 
      data: expense 
    })
  } catch (error) {
    console.error('Error adding expense entry:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to add expense entry'
    })
  }
})

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  })
})

/**
 * Start server
 */
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase()
    console.log('✅ Database ready')

    // Start server
    app.listen(PORT, () => {
      console.log(`✅ Financial Tool API running on port ${PORT}`)
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down server...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down server...')
  process.exit(0)
})

// Start the application
startServer()