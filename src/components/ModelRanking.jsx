import React, { useMemo } from 'react'
import ModelCard from './ModelCard'
import Icon from './AppIcon'
import { useDarkMode } from '../contexts/DarkModeContext'
import { calculateModelKPIs, getComparativeMetrics } from '../lib/transform'

const ModelRanking = ({ 
  rankedModels = [], 
  workloadParams,
  className = "",
  title = "Model Performance Ranking",
  showHeaderAndStats = true,
  showFooter = true
}) => {
  const { isDarkMode } = useDarkMode()
  
  // Calculate KPIs for each model
  const modelsWithKPIs = useMemo(() => {
    return calculateModelKPIs(rankedModels, workloadParams)
  }, [rankedModels, workloadParams])

  // Get comparative metrics for visual scaling
  const comparativeMetrics = useMemo(() => {
    return getComparativeMetrics(modelsWithKPIs)
  }, [modelsWithKPIs])

  // Show message if no models available
  if (!rankedModels || rankedModels.length === 0) {
    return (
      <div className={`rounded-xl border p-8 text-center transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-black border-gray-800 shadow-2xl' 
          : 'bg-white shadow-mist border-sky-gray'
      } ${className}`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isDarkMode ? 'bg-muted-indigo/20' : 'bg-muted-indigo/10'
        }`}>
          <Icon name="BarChart3" size={24} className="text-muted-indigo" />
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>No Model Rankings Available</h3>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
          Upload your data or run an AI analysis to see model performance rankings
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header - Conditionally rendered */}
      {showHeaderAndStats && (
        <div className={`rounded-xl border p-6 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-black border-gray-800 shadow-2xl' 
            : 'bg-white shadow-mist border-sky-gray'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDarkMode ? 'bg-muted-indigo/20' : 'bg-muted-indigo/10'
            }`}>
              <Icon name="Trophy" size={20} className="text-muted-indigo" />
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>{title}</h2>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
                AI models ranked by performance, cost, and efficiency metrics
              </p>
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className={`rounded-lg p-4 border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-950 border-gray-800' 
                : 'bg-cloud-white border-sky-gray'
            }`}>
              <div className="flex items-center space-x-2">
                <Icon name="Zap" size={16} className="text-muted-indigo" />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Models Analyzed</span>
              </div>
              <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>{rankedModels.length}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>Performance ranked</p>
            </div>
            
            <div className={`rounded-lg p-4 border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-950 border-gray-800' 
                : 'bg-cloud-white border-sky-gray'
            }`}>
              <div className="flex items-center space-x-2">
                <Icon name="DollarSign" size={16} className="text-calm-green" />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Best Cost</span>
              </div>
              <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
                ${Math.min(...rankedModels.map(m => m.monthly_cost)).toLocaleString()}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>Monthly savings possible</p>
            </div>
            
            <div className={`rounded-lg p-4 border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-950 border-gray-800' 
                : 'bg-cloud-white border-sky-gray'
            }`}>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={16} className="text-mist-teal" />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Best Latency</span>
              </div>
              <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
                {Math.min(...rankedModels.map(m => m.p90_latency_ms))}ms
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>P90 response time</p>
            </div>
          </div>
        </div>
      )}

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {modelsWithKPIs.map((model, index) => (
          <ModelCard 
            key={model.model_name || index}
            model={model}
            index={index}
            totalCount={modelsWithKPIs.length}
            comparativeMetrics={comparativeMetrics}
            className="h-full"
          />
        ))}
      </div>

      {/* Footer Note - Conditionally rendered */}
      {showFooter && (
        <div className={`rounded-lg p-4 border transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-950 border-gray-800' 
            : 'bg-muted-indigo/5 border-muted-indigo/20'
        }`}>
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-muted-indigo mt-0.5" />
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
                Model Ranking Methodology
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>
                Rankings are based on composite scores considering cost efficiency, latency performance, 
                reliability metrics, and feature capabilities. Higher scores indicate better overall value.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ModelRanking 