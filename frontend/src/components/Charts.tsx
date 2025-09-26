import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface MonthlyData {
  month: string
  income: number
  expenses: number
  savings: number
}

interface CategoryData {
  name: string
  value: number
  color: string
}

interface ChartComponentProps {
  monthlyData: MonthlyData[]
  categoryData: CategoryData[]
  title: string
}

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']

export const MonthlyOverviewChart: React.FC<{ data: MonthlyData[] }> = ({ data }) => {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Financial Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}`, '']} />
          <Legend />
          <Bar dataKey="income" fill="#10B981" name="Income" />
          <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
          <Bar dataKey="savings" fill="#3B82F6" name="Savings" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const SpendingCategoriesChart: React.FC<{ data: CategoryData[] }> = ({ data }) => {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export const QuarterlyTrendsChart: React.FC<{ data: MonthlyData[] }> = ({ data }) => {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Quarterly Financial Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value}`, '']} />
          <Legend />
          <Bar dataKey="income" fill="#10B981" name="Income" />
          <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}