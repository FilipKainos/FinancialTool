import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfQuarter, 
  endOfQuarter, 
  startOfYear, 
  endOfYear,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  isWithinInterval,
  differenceInDays,
  addMonths,
  subMonths,
  parseISO
} from 'date-fns'

/**
 * Date utility functions for financial period calculations
 */

export interface DateRange {
  start: Date
  end: Date
}

export interface PeriodInfo {
  current: DateRange
  previous: DateRange
  label: string
}

/**
 * Get current month date range
 */
export const getCurrentMonth = (): DateRange => {
  const now = new Date()
  return {
    start: startOfMonth(now),
    end: endOfMonth(now)
  }
}

/**
 * Get current quarter date range
 */
export const getCurrentQuarter = (): DateRange => {
  const now = new Date()
  return {
    start: startOfQuarter(now),
    end: endOfQuarter(now)
  }
}

/**
 * Get current year date range
 */
export const getCurrentYear = (): DateRange => {
  const now = new Date()
  return {
    start: startOfYear(now),
    end: endOfYear(now)
  }
}

/**
 * Get period info with current and previous ranges for comparison
 */
export const getPeriodInfo = (period: 'month' | 'quarter' | 'year'): PeriodInfo => {
  const now = new Date()
  
  switch (period) {
    case 'month': {
      const current = getCurrentMonth()
      const previousMonth = subMonths(now, 1)
      return {
        current,
        previous: {
          start: startOfMonth(previousMonth),
          end: endOfMonth(previousMonth)
        },
        label: format(current.start, 'MMMM yyyy')
      }
    }
    case 'quarter': {
      const current = getCurrentQuarter()
      const previousQuarter = subMonths(now, 3)
      return {
        current,
        previous: {
          start: startOfQuarter(previousQuarter),
          end: endOfQuarter(previousQuarter)
        },
        label: `Q${Math.floor(now.getMonth() / 3) + 1} ${format(current.start, 'yyyy')}`
      }
    }
    case 'year': {
      const current = getCurrentYear()
      const previousYear = new Date(now.getFullYear() - 1, 0, 1)
      return {
        current,
        previous: {
          start: startOfYear(previousYear),
          end: endOfYear(previousYear)
        },
        label: format(current.start, 'yyyy')
      }
    }
  }
}

/**
 * Get array of months for a given year (useful for annual reports)
 */
export const getMonthsInYear = (year: number): Date[] => {
  const yearStart = new Date(year, 0, 1)
  const yearEnd = new Date(year, 11, 31)
  
  return eachMonthOfInterval({
    start: yearStart,
    end: yearEnd
  })
}

/**
 * Get array of quarters for a given year
 */
export const getQuartersInYear = (year: number): Date[] => {
  const yearStart = new Date(year, 0, 1)
  const yearEnd = new Date(year, 11, 31)
  
  return eachQuarterOfInterval({
    start: yearStart,
    end: yearEnd
  })
}

/**
 * Check if a date falls within a specific period
 */
export const isDateInPeriod = (date: Date | string, period: DateRange): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isWithinInterval(dateObj, period)
}

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format date for display in reports
 */
export const formatDateForReport = (date: Date, formatString = 'MMM yyyy'): string => {
  return format(date, formatString)
}

/**
 * Calculate progress through current period (0-1)
 */
export const getPeriodProgress = (period: 'month' | 'quarter' | 'year'): number => {
  const periodInfo = getPeriodInfo(period)
  const now = new Date()
  const totalDays = differenceInDays(periodInfo.current.end, periodInfo.current.start)
  const elapsedDays = differenceInDays(now, periodInfo.current.start)
  
  return Math.min(Math.max(elapsedDays / totalDays, 0), 1)
}