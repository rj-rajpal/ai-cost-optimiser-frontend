import React, { useState, useEffect, useRef } from 'react'
import Icon from './AppIcon'
import { useDarkMode } from '../contexts/DarkModeContext'
import chatService from '../services/chatService'

const WorkloadParams = ({ 
  params = {
    calls_per_day: 1000,
    avg_input_tokens: 150,
    avg_output_tokens: 100,
    latency_sla_ms: 500
  },
  originalStructuredData = null,
  onChange,
  onApiUpdate,
  className = ""
}) => {
  const { isDarkMode } = useDarkMode()
  const [isExpanded, setIsExpanded] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastApiCall, setLastApiCall] = useState(null)
  const [apiError, setApiError] = useState(null)
  const debounceRef = useRef(null)

  // Define ranges and labels for each parameter
  const paramConfig = {
    calls_per_day: {
      label: "Daily API Calls",
      min: 100,
      max: 100000,
      step: 100,
      unit: "calls/day",
      format: (value) => value.toLocaleString()
    },
    avg_input_tokens: {
      label: "Average Input Size",
      min: 10,
      max: 4000,
      step: 10,
      unit: "tokens",
      format: (value) => value.toLocaleString()
    },
    avg_output_tokens: {
      label: "Average Output Size", 
      min: 10,
      max: 2000,
      step: 10,
      unit: "tokens",
      format: (value) => value.toLocaleString()
    },
    latency_sla_ms: {
      label: "Latency Target",
      min: 100,
      max: 5000,
      step: 50,
      unit: "ms",
      format: (value) => `${value}`
    }
  }

  // Debounced API call function
  const callUpdateAPI = async (newParams) => {
    if (!originalStructuredData) {
      setApiError('Original data not available for API updates')
      return
    }

    setIsUpdating(true)
    setApiError(null)

    try {
      // Create the modified workload with region hardcoded as "US"
      const modifiedWorkload = {
        calls_per_day: newParams.calls_per_day,
        avg_input_tokens: newParams.avg_input_tokens,
        avg_output_tokens: newParams.avg_output_tokens,
        latency_sla_ms: newParams.latency_sla_ms,
        region: "US" // Hardcoded as requested
      }
      
      const updatedData = await chatService.updateWorkloadParamsAPI(
        modifiedWorkload,
        originalStructuredData
      )

      setLastApiCall(new Date().toISOString())
      
      // Call the onApiUpdate callback if provided
      if (onApiUpdate) {
        onApiUpdate(updatedData)
      }

    } catch (error) {
      console.error('Error updating workload parameters:', error)
      setApiError(`API Error: ${error.message}`)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSliderChange = (key, value) => {
    const newParams = { ...params, [key]: parseInt(value) }
    
    // Call the original onChange callback immediately for UI updates
    onChange?.(newParams)

    // Clear any existing debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    // Set up debounced API call (500ms delay)
    debounceRef.current = setTimeout(() => {
      callUpdateAPI(newParams)
    }, 500)
  }

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <div className={`rounded-xl border transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-black border-gray-800 shadow-2xl' 
        : 'bg-white shadow-mist border-sky-gray'
    } ${className}`}>
      {/* Header */}
      <div 
        className={`flex items-center justify-between p-4 cursor-pointer transition-colors duration-200 ${
          isDarkMode 
            ? 'hover:bg-gray-900/50' 
            : 'hover:bg-cloud-white/50'
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-muted-indigo/20' : 'bg-muted-indigo/10'
          }`}>
            <Icon name="Settings" size={16} className="text-muted-indigo" />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-soft-navy'
            }`}>Workload Parameters</h3>
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-slate-gray'
            }`}>
              Adjust parameters to see real-time cost changes
              {originalStructuredData && (
                <span className="text-mist-teal"> • Live API updates enabled</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* API Status Indicator */}
          {originalStructuredData && (
            <div className="flex items-center space-x-1">
              {isUpdating ? (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-muted-indigo rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-indigo">Updating...</span>
                </div>
              ) : lastApiCall ? (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-calm-green rounded-full"></div>
                  <span className="text-xs text-calm-green">Updated</span>
                </div>
              ) : null}
            </div>
          )}
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className={`transition-transform duration-200 ${
              isDarkMode ? 'text-gray-400' : 'text-slate-gray'
            }`}
          />
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-6">
          {/* API Status Messages */}
          {apiError && (
            <div className={`p-3 border rounded-lg ${
              isDarkMode 
                ? 'bg-red-900/20 border-red-800' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-red-500" />
                <span className={`text-sm ${
                  isDarkMode ? 'text-red-400' : 'text-red-700'
                }`}>API Error: {apiError}</span>
              </div>
            </div>
          )}

          {!originalStructuredData && (
            <div className={`p-3 border rounded-lg ${
              isDarkMode 
                ? 'bg-yellow-900/20 border-yellow-800' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center space-x-2">
                <Icon name="Info" size={16} className="text-yellow-600" />
                <span className={`text-sm ${
                  isDarkMode ? 'text-yellow-400' : 'text-yellow-800'
                }`}>
                  Live API updates disabled - original data not available
                </span>
              </div>
            </div>
          )}

          {Object.entries(paramConfig).map(([key, config]) => {
            const value = params[key] || config.min
            
            return (
              <div key={key} className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-soft-navy'
                  }`}>
                    {config.label}
                  </label>
                  <span className={`text-sm font-semibold ${
                    isDarkMode ? 'text-white' : 'text-muted-indigo'
                  }`}>
                    {config.format(value)} {config.unit}
                  </span>
                </div>
                
                <div className="relative">
                  <input
                    type="range"
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    value={value}
                    onChange={(e) => handleSliderChange(key, e.target.value)}
                    disabled={isUpdating}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer workload-slider ${
                      isUpdating ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                    style={{
                      background: isDarkMode 
                        ? `linear-gradient(to right, #667EEA 0%, #667EEA ${((value - config.min) / (config.max - config.min)) * 100}%, #374151 ${((value - config.min) / (config.max - config.min)) * 100}%, #374151 100%)`
                        : `linear-gradient(to right, #667EEA 0%, #667EEA ${((value - config.min) / (config.max - config.min)) * 100}%, #E2E8F0 ${((value - config.min) / (config.max - config.min)) * 100}%, #E2E8F0 100%)`
                    }}
                  />
                  
                  {/* Range labels */}
                  <div className="flex justify-between text-xs mt-1">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-slate-gray'}>
                      {config.format(config.min)}
                    </span>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-slate-gray'}>
                      {config.format(config.max)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
          
          {/* Reset button and API info */}
          <div className={`pt-2 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-sky-gray'
          }`}>
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  const defaultParams = {
                    calls_per_day: 1000,
                    avg_input_tokens: 150,
                    avg_output_tokens: 100,
                    latency_sla_ms: 500
                  }
                  onChange?.(defaultParams)
                  // Also trigger API call for reset
                  if (originalStructuredData) {
                    callUpdateAPI(defaultParams)
                  }
                }}
                disabled={isUpdating}
                className={`text-sm transition-colors duration-200 disabled:opacity-50 ${
                  isDarkMode 
                    ? 'text-muted-indigo hover:text-muted-indigo/80' 
                    : 'text-muted-indigo hover:text-muted-indigo/80'
                }`}
              >
                Reset to defaults
              </button>

              {lastApiCall && (
                <span className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-slate-gray'
                }`}>
                  Last updated: {new Date(lastApiCall).toLocaleTimeString()}
                </span>
              )}
            </div>

            {originalStructuredData && (
              <div className={`mt-2 text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-slate-gray'
              }`}>
                <span>Region: US (fixed) • Auto-updates with 500ms delay</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkloadParams 