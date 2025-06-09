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

  // Generate tooltip text based on constraint violations
  const getConstraintTooltipText = (constraintViolations) => {
    if (!constraintViolations || constraintViolations.length === 0) {
      return "Model meets all requirements"
    }
    
    const violationMessages = {
      'context_window_too_small': 'Context window is too small for your requirements',
      'latency_too_high': 'Latency exceeds your SLA requirements',
      'compliance_violation': 'Model does not meet compliance constraints',
      'region_not_supported': 'Model not available in your specified region'
    }
    
    return constraintViolations
      .map(violation => violationMessages[violation] || `Constraint violation: ${violation}`)
      .join('. ')
  }

  return (
    <div className={`rounded-2xl border p-6 transition-all duration-300 ${
      isDarkMode 
        ? 'bg-black border-gray-800 shadow-2xl hover:border-gray-600' 
        : 'bg-white shadow-mist border-sky-gray hover:shadow-xl hover:border-muted-indigo/30'
    } ${className}`}>
            {/* Header with Model Name and Suitability Indicator */}
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold text-muted-indigo leading-tight flex-shrink">
          {formatModelName(model.model_name)}
        </h3>
        
        {/* Suitability Indicator */}
        {model.suitable === false && (
          <div className="flex flex-col items-end space-y-1 group relative ml-4 flex-shrink-0">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
              <span className="text-sm font-medium text-red-500">
                Not Recommended
              </span>
            </div>
            <div className="relative flex-shrink-0">
              <Icon name="Info" size={14} className="text-red-500 cursor-help" />
              
              {/* Tooltip */}
              <div className={`absolute right-0 top-6 w-64 p-3 rounded-lg border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 ${
                isDarkMode 
                  ? 'bg-gray-900 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className={`text-xs leading-relaxed ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>
                  {getConstraintTooltipText(model.constraint_violations)}
                </div>
                {/* Tooltip arrow */}
                <div className={`absolute -top-1 right-4 w-2 h-2 rotate-45 border-l border-t ${
                  isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                }`}></div>
              </div>
            </div>
          </div>
        )}
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