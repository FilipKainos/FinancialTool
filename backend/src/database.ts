import sqlite3 from 'sqlite3'
import { Database, open } from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Simple database initialization for Financial Tool
 * Focuses on reliability and minimal complexity
 */

export interface WageEntry {
  id?: number
  monthlyAmount: number
  effectiveDate: string
  description?: string
  createdAt?: string
}

export interface ExpenseEntry {
  id?: number
  amount: number
  description: string
  category: string
  date: string
  createdAt?: string
}

let db: Database | null = null

/**
 * Initialize database connection and create tables
 */
export async function initializeDatabase(): Promise<Database> {
  try {
    if (db) return db

    const dbPath = path.join(__dirname, '../../database/financial-tool.db')
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })

    // Create wages table (simplified for MVP)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS wages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        monthly_amount DECIMAL(10,2) NOT NULL,
        effective_date DATE NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_wages_effective_date ON wages(effective_date);

      -- Create expenses table
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount DECIMAL(10,2) NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        date DATE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
      CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

      -- Create categories table with default categories
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        color TEXT DEFAULT '#6B7280',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Insert default categories if they don't exist
      INSERT OR IGNORE INTO categories (name, color) VALUES
        ('Food', '#10B981'),
        ('Transportation', '#3B82F6'),
        ('Housing', '#8B5CF6'),
        ('Entertainment', '#F59E0B'),
        ('Utilities', '#EF4444');
    `)

    console.log('✅ Database initialized successfully')
    return db

  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    throw new Error(`Database setup failed: ${error}`)
  }
}

/**
 * Get current wage (most recent entry)
 */
export async function getCurrentWage(): Promise<WageEntry | null> {
  try {
    if (!db) await initializeDatabase()
    
    const wage = await db?.get(`
      SELECT 
        id,
        monthly_amount as monthlyAmount,
        effective_date as effectiveDate,
        description,
        created_at as createdAt
      FROM wages 
      ORDER BY effective_date DESC, created_at DESC 
      LIMIT 1
    `)

    return wage || null

  } catch (error) {
    console.error('❌ Error fetching current wage:', error)
    throw new Error('Failed to retrieve wage information')
  }
}

/**
 * Add new wage entry
 */
export async function addWageEntry(wage: Omit<WageEntry, 'id' | 'createdAt'>): Promise<WageEntry> {
  try {
    if (!db) await initializeDatabase()

    // Validate input
    if (!wage.monthlyAmount || wage.monthlyAmount <= 0) {
      throw new Error('Monthly amount must be greater than 0')
    }
    
    if (!wage.effectiveDate) {
      throw new Error('Effective date is required')
    }

    const result = await db?.run(`
      INSERT INTO wages (monthly_amount, effective_date, description)
      VALUES (?, ?, ?)
    `, [wage.monthlyAmount, wage.effectiveDate, wage.description || null])

    if (!result?.lastID) {
      throw new Error('Failed to insert wage entry')
    }

    // Return the created entry
    const newWage = await db?.get(`
      SELECT 
        id,
        monthly_amount as monthlyAmount,
        effective_date as effectiveDate,
        description,
        created_at as createdAt
      FROM wages 
      WHERE id = ?
    `, result.lastID)

    console.log('✅ Wage entry added successfully:', newWage)
    return newWage

  } catch (error) {
    console.error('❌ Error adding wage entry:', error)
    throw error
  }
}

/**
 * Get wage history
 */
export async function getWageHistory(): Promise<WageEntry[]> {
  try {
    if (!db) await initializeDatabase()
    
    const wages = await db?.all(`
      SELECT 
        id,
        monthly_amount as monthlyAmount,
        effective_date as effectiveDate,
        description,
        created_at as createdAt
      FROM wages 
      ORDER BY effective_date DESC, created_at DESC
    `)

    return wages || []

  } catch (error) {
    console.error('❌ Error fetching wage history:', error)
    throw new Error('Failed to retrieve wage history')
  }
}

/**
 * Add new expense entry
 */
export async function addExpenseEntry(expense: Omit<ExpenseEntry, 'id' | 'createdAt'>): Promise<ExpenseEntry> {
  try {
    if (!db) await initializeDatabase()

    // Validate input
    if (!expense.amount || expense.amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }
    
    if (!expense.description?.trim()) {
      throw new Error('Description is required')
    }

    if (!expense.category?.trim()) {
      throw new Error('Category is required')
    }

    if (!expense.date) {
      throw new Error('Date is required')
    }

    const result = await db?.run(`
      INSERT INTO expenses (amount, description, category, date)
      VALUES (?, ?, ?, ?)
    `, [expense.amount, expense.description.trim(), expense.category.trim(), expense.date])

    if (!result?.lastID) {
      throw new Error('Failed to insert expense entry')
    }

    // Return the created entry
    const newExpense = await db?.get(`
      SELECT 
        id,
        amount,
        description,
        category,
        date,
        created_at as createdAt
      FROM expenses 
      WHERE id = ?
    `, result.lastID)

    console.log('✅ Expense entry added successfully:', newExpense)
    return newExpense

  } catch (error) {
    console.error('❌ Error adding expense entry:', error)
    throw error
  }
}

/**
 * Get recent expenses (last 30 entries)
 */
export async function getRecentExpenses(limit: number = 30): Promise<ExpenseEntry[]> {
  try {
    if (!db) await initializeDatabase()
    
    const expenses = await db?.all(`
      SELECT 
        id,
        amount,
        description,
        category,
        date,
        created_at as createdAt
      FROM expenses 
      ORDER BY date DESC, created_at DESC
      LIMIT ?
    `, limit)

    return expenses || []

  } catch (error) {
    console.error('❌ Error fetching recent expenses:', error)
    throw new Error('Failed to retrieve expenses')
  }
}

/**
 * Get available categories
 */
export async function getCategories(): Promise<Array<{id: number, name: string, color: string}>> {
  try {
    if (!db) await initializeDatabase()
    
    const categories = await db?.all(`
      SELECT id, name, color
      FROM categories 
      ORDER BY name
    `)

    return categories || []

  } catch (error) {
    console.error('❌ Error fetching categories:', error)
    throw new Error('Failed to retrieve categories')
  }
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  try {
    if (db) {
      await db.close()
      db = null
      console.log('✅ Database connection closed')
    }
  } catch (error) {
    console.error('❌ Error closing database:', error)
  }
}