import React from 'react'
import Icon from './AppIcon'
import { useDarkMode } from '../contexts/DarkModeContext'

const ModelCard = ({ 
  model, 
  index, 
  totalCount = 5, // Default to 5 if not provided
  comparativeMetrics,
  className = "" 
}) => {
  const { isDarkMode } = useDarkMode()
  
  // Badge colors based on ranking
  const getBadgeStyle = (rank) => {
    switch(rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-black"
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white"
      default:
        return "bg-gradient-to-r from-slate-400 to-slate-600 text-white"
    }
  }

  // Get cost color based on ranking (green for best, red for worst)
  const getCostColor = (currentIndex, total) => {
    const position = currentIndex / (total - 1) // 0 to 1 scale
    
    if (total === 1) return "text-green-600" // Single model case
    
    if (position <= 0.2) return "text-green-600"      // Top 20% - Green
    if (position <= 0.4) return "text-lime-600"       // 20-40% - Lime  
    if (position <= 0.6) return "text-yellow-600"     // 40-60% - Yellow
    if (position <= 0.8) return "text-orange-600"     // 60-80% - Orange
    return "text-red-600"                              // Bottom 20% - Red
  }

  // Calculate percentage for progress bars
  const getProgressPercentage = (value, metric) => {
    if (!comparativeMetrics || !comparativeMetrics[metric]) return 0
    const { min, max } = comparativeMetrics[metric]
    if (max === min) return 100
    
    // For cost and latency, lower is better (invert the scale)
    if (metric === 'monthlySpend') {
      return ((max - value) / (max - min)) * 100
    }

    if(metric === 'costPer1k'){
      return ((20 - value) / 20 ) * 100
    }

    if(metric === 'avgLatency'){
      return ((2000 - value) / 2000 ) * 100
    }
    // For efficiency, higher is better
    return ((value - min) / (max - min)) * 100
  }

  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toLocaleString()}`
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

  const kpis = model.kpis || {}

  return (
    <div className={`rounded-2xl border p-6 hover:shadow-xl transition-all duration-200 ${
      isDarkMode 
        ? 'bg-black border-gray-800 hover:border-gray-600 shadow-2xl' 
        : 'bg-white shadow-mist border-sky-gray hover:border-muted-indigo/30'
    } ${className}`}>
      {/* Ranking Badge */}
      <div className="flex justify-start mb-4">
        <div className={`inline-flex items-center justify-center w-12 h-8 rounded-lg font-bold text-lg ${getBadgeStyle(index + 1)}`}>
          #{index + 1}
        </div>
      </div>

      {/* Model Name */}
      <div className="mb-4">
        <h3 className={`text-2xl font-bold leading-tight ${
          isDarkMode ? 'text-white' : 'text-muted-indigo'
        }`}>
          {formatModelName(model.model_name)}
        </h3>
      </div>

      {/* Monthly Cost */}
      <div className="mb-6">
        <div className={`text-4xl font-bold ${getCostColor(index, totalCount)}`}>
          {formatCurrency(model.monthly_cost)}
        </div>
      </div>

      {/* KPI Visualizations */}
      {kpis && comparativeMetrics && (
        <div className={`mb-6 space-y-4 border-t pt-4 ${
          isDarkMode ? 'border-gray-700' : 'border-sky-gray'
        }`}>
          <h4 className={`text-sm font-semibold mb-3 ${
            isDarkMode ? 'text-white' : 'text-soft-navy'
          }`}>Performance Metrics</h4>
          
          {/* Cost Efficiency */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-xs font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-slate-gray'
              }`}>Cost Efficiency</span>
              <span className={`text-xs ${
                isDarkMode ? 'text-white' : 'text-soft-navy'
              }`}>${kpis.costPer1k?.toFixed(3)}/1K tokens</span>
            </div>
            <div className={`w-full rounded-full h-2 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <div 
                className="bg-gradient-to-r from-green-500 to-lime-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(kpis.costPer1k, 'costPer1k')}%` }}
              ></div>
            </div>
          </div>

          {/* Speed Performance */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-xs font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-slate-gray'
              }`}>Speed Performance</span>
              <span className={`text-xs ${
                isDarkMode ? 'text-white' : 'text-soft-navy'
              }`}>{kpis.avgLatency}ms</span>
            </div>
            <div className={`w-full rounded-full h-2 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage(kpis.avgLatency, 'avgLatency')}%` }}
              ></div>
            </div>
          </div>

          {/* Overall Efficiency */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className={`text-xs font-medium ${
                isDarkMode ? 'text-gray-400' : 'text-slate-gray'
              }`}>Overall Efficiency</span>
              <span className={`text-xs ${
                isDarkMode ? 'text-white' : 'text-soft-navy'
              }`}>{kpis.efficiency}%</span>
            </div>
            <div className={`w-full rounded-full h-2 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${kpis.efficiency}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics */}
      <div className={`space-y-4 border-t pt-4 ${
        isDarkMode ? 'border-gray-700' : 'border-sky-gray'
      }`}>
        <div className="flex justify-between items-center">
          <span className={`font-medium ${
            isDarkMode ? 'text-gray-400' : 'text-slate-gray'
          }`}>P90 Latency</span>
          <span className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-soft-navy'
          }`}>{model.p90_latency_ms} ms</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className={`font-medium ${
            isDarkMode ? 'text-gray-400' : 'text-slate-gray'
          }`}>Context Window</span>
          <span className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-soft-navy'
          }`}>
            {getContextWindow(model.model_name)} tokens
          </span>
        </div>

        {/* Additional KPI metrics */}
        {kpis.tokenUsage && (
          <div className="flex justify-between items-center">
            <span className={`font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-slate-gray'
            }`}>Monthly Tokens</span>
            <span className={`font-semibold ${
              isDarkMode ? 'text-white' : 'text-soft-navy'
            }`}>
              {(kpis.tokenUsage / 1_000_000).toFixed(1)}M
            </span>
          </div>
        )}
      </div>

      {/* Composite Score */}
      <div className={`border-t pt-4 mt-4 ${
        isDarkMode ? 'border-gray-700' : 'border-sky-gray'
      }`}>
        <div className="flex justify-between items-center">
          <span className={`font-medium ${
            isDarkMode ? 'text-gray-400' : 'text-slate-gray'
          }`}>Composite Score</span>
          <span className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-muted-indigo'
          }`}>
            {((1/model.composite_score)*100).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ModelCard 