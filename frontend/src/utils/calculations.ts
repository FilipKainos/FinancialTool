import { DateRange, getPeriodInfo } from './dateUtils'

/**
 * Core financial calculation utilities for the Financial Tool App
 */

export interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  date: string
  category: string
  description: string
}

export interface MonthlyWage {
  amount: number
  effectiveDate: string
}

export interface BudgetData {
  category: string
  budgetAmount: number
  spentAmount: number
  period: 'month' | 'quarter' | 'year'
}

export interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  netSavings: number
  savingsRate: number
  topCategories: Array<{ category: string; amount: number; percentage: number }>
}

/**
 * Calculate financial summary for a given period
 */
export const calculateFinancialSummary = (
  transactions: Transaction[],
  periodRange: DateRange
): FinancialSummary => {
  const periodTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date)
    return transactionDate >= periodRange.start && transactionDate <= periodRange.end
  })

  const totalIncome = periodTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = periodTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const netSavings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0

  // Calculate spending by category
  const categoryTotals = periodTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
      return acc
    }, {} as Record<string, number>)

  const topCategories = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    savingsRate,
    topCategories
  }
}

/**
 * Calculate budget performance for categories
 */
export const calculateBudgetPerformance = (
  transactions: Transaction[],
  budgets: BudgetData[],
  period: 'month' | 'quarter' | 'year'
): Array<BudgetData & { status: 'under' | 'over' | 'ontrack'; percentUsed: number }> => {
  const periodInfo = getPeriodInfo(period)
  
  return budgets.map(budget => {
    const categoryTransactions = transactions.filter(t => 
      t.category === budget.category &&
      t.type === 'expense' &&
      new Date(t.date) >= periodInfo.current.start &&
      new Date(t.date) <= periodInfo.current.end
    )

    const spentAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0)
    const percentUsed = budget.budgetAmount > 0 ? (spentAmount / budget.budgetAmount) * 100 : 0

    let status: 'under' | 'over' | 'ontrack' = 'under'
    if (percentUsed > 100) status = 'over'
    else if (percentUsed > 80) status = 'ontrack'

    return {
      ...budget,
      spentAmount,
      status,
      percentUsed
    }
  })
}

/**
 * Project monthly expenses based on current spending
 */
export const projectMonthlyExpenses = (transactions: Transaction[]): number => {
  const currentMonth = getPeriodInfo('month')
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date)
    return transactionDate >= currentMonth.current.start && 
           transactionDate <= currentMonth.current.end &&
           t.type === 'expense'
  })

  const currentSpending = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0)
  const daysInMonth = 30 // Simplified
  const daysPassed = Math.min(new Date().getDate(), daysInMonth)
  
  if (daysPassed === 0) return 0
  
  return (currentSpending / daysPassed) * daysInMonth
}

/**
 * Calculate spending trends (percentage change from previous period)
 */
export const calculateSpendingTrends = (
  transactions: Transaction[],
  period: 'month' | 'quarter' | 'year'
): { current: number; previous: number; changePercent: number; trending: 'up' | 'down' | 'stable' } => {
  const periodInfo = getPeriodInfo(period)

  const currentSpending = transactions
    .filter(t => {
      const date = new Date(t.date)
      return t.type === 'expense' && 
             date >= periodInfo.current.start && 
             date <= periodInfo.current.end
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const previousSpending = transactions
    .filter(t => {
      const date = new Date(t.date)
      return t.type === 'expense' && 
             date >= periodInfo.previous.start && 
             date <= periodInfo.previous.end
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const changePercent = previousSpending > 0 
    ? ((currentSpending - previousSpending) / previousSpending) * 100 
    : 0

  let trending: 'up' | 'down' | 'stable' = 'stable'
  if (Math.abs(changePercent) > 5) {
    trending = changePercent > 0 ? 'up' : 'down'
  }

  return {
    current: currentSpending,
    previous: previousSpending,
    changePercent,
    trending
  }
}

/**
 * Generate AI insights based on spending patterns
 */
export const generateSpendingInsights = (
  summary: FinancialSummary,
  budgetPerformance: ReturnType<typeof calculateBudgetPerformance>,
  trends: ReturnType<typeof calculateSpendingTrends>
): string[] => {
  const insights: string[] = []

  // Savings rate insights
  if (summary.savingsRate < 10) {
    insights.push("Your savings rate is below 10%. Consider reducing expenses or increasing income.")
  } else if (summary.savingsRate > 20) {
    insights.push("Excellent savings rate! You're building a strong financial foundation.")
  }

  // Budget performance insights
  const overBudgetCategories = budgetPerformance.filter(b => b.status === 'over')
  if (overBudgetCategories.length > 0) {
    insights.push(`You're over budget in ${overBudgetCategories.length} category(s): ${overBudgetCategories.map(c => c.category).join(', ')}.`)
  }

  // Spending trend insights
  if (trends.trending === 'up' && trends.changePercent > 15) {
    insights.push(`Your spending increased by ${trends.changePercent.toFixed(1)}% compared to last period. Review your expenses.`)
  } else if (trends.trending === 'down' && trends.changePercent < -10) {
    insights.push(`Great job! You reduced spending by ${Math.abs(trends.changePercent).toFixed(1)}% compared to last period.`)
  }

  // Top category insights
  if (summary.topCategories.length > 0) {
    const topCategory = summary.topCategories[0]
    if (topCategory.percentage > 30) {
      insights.push(`${topCategory.category} accounts for ${topCategory.percentage.toFixed(1)}% of your spending. Consider if this aligns with your priorities.`)
    }
  }

  return insights
}