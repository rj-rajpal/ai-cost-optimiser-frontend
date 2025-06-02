import React from 'react'
import { useDarkMode } from '../contexts/DarkModeContext'
import Icon from './AppIcon'

const ROICard = ({ 
  model, 
  estimatedMonthlySpend,
  className = "" 
}) => {
  const { isDarkMode } = useDarkMode()
  
  // Calculate savings and ROI
  const monthlyCost = model.monthly_cost || 0
  const savings = estimatedMonthlySpend - monthlyCost
  const roiPercent = estimatedMonthlySpend > 0 ? (savings / estimatedMonthlySpend) * 100 : 0

  // Get color based on positive/negative values
  const getValueColor = (value) => {
    return value >= 0 ? "text-green-600" : "text-red-600"
  }

  // Format currency
  const formatCurrency = (amount) => {
    return `$${Math.abs(amount).toLocaleString()}`
  }

  // Format model name for display
  const formatModelName = (name) => {
    return name.replace(/-/g, '-').toLowerCase()
  }

  // Get context window from model name (based on actual model specifications)
  const getContextWindow = (modelName) => {
    const name = modelName.toLowerCase()
    if (name.includes('gpt-4')) return '8,000'
    if (name.includes('gpt-3.5')) return '16,000'
    if (name.includes('claude-3-haiku')) return '200,000'
    if (name.includes('claude-3-sonnet')) return '200,000'
    if (name.includes('claude-3-opus')) return '200,000'
    if (name.includes('gemini-pro')) return '32,000'
    if (name.includes('gemini')) return '32,000'
    return '8,000'
  }

  return (
    <div className={`rounded-2xl border p-6 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-black border-gray-800 shadow-2xl hover:border-gray-600' 
        : 'bg-white shadow-mist border-sky-gray hover:shadow-xl hover:border-muted-indigo/30'
    } ${className}`}>
      {/* Model Name */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-muted-indigo leading-tight">
          {formatModelName(model.model_name)}
        </h3>
      </div>

      {/* Savings */}
      <div className="mb-6">
        <div className="mb-2">
          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>Monthly Savings</span>
        </div>
        <div className={`text-4xl font-bold ${getValueColor(savings)}`}>
          {savings >= 0 ? '+' : '-'}{formatCurrency(savings)}
        </div>
      </div>

      {/* ROI Percentage */}
      <div className="mb-6">
        <div className="mb-2">
          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>ROI %</span>
        </div>
        <div className={`text-3xl font-bold ${getValueColor(roiPercent)}`}>
          {roiPercent >= 0 ? '+' : ''}{roiPercent.toFixed(1)}%
        </div>
      </div>

      {/* Metrics */}
      <div className={`space-y-4 border-t pt-4 ${isDarkMode ? 'border-gray-800' : 'border-sky-gray'}`}>
        <div className="flex justify-between items-center">
          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>Monthly Cost</span>
          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>${monthlyCost.toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>P90 Latency</span>
          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>{model.p90_latency_ms} ms</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>Context Window</span>
          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
            {getContextWindow(model.model_name)} tokens
          </span>
        </div>
      </div>
    </div>
  )
}

export default ROICard 