import { mapArchitecture } from '@/features/architecture/transform'
import ArchitectureFlow from '@/components/ArchitectureFlow'
import Icon from '@/components/AppIcon'
import { useDashboard } from '@/contexts/DashboardContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useParams } from 'react-router-dom'
import { projectService } from '@/services'
import { useEffect, useState, useMemo } from 'react'

export default function AIWorkflow() {
  const { projectId } = useParams()
  const { dashboardData, architectureData, isLoading, hasArchitectureData } = useDashboard()
  const { isDarkMode } = useDarkMode()
  const [projectData, setProjectData] = useState(null)
  const [currentArchitectureData, setCurrentArchitectureData] = useState(architectureData)

  // Load project data and check for architecture data
  useEffect(() => {
    if (projectId) {
      try {
        const project = projectService.getProject(projectId)
        setProjectData(project)
        
        // Check if project has architecture data
        const structuredData = project?.structured_data
        
        if (structuredData?.architecture && Array.isArray(structuredData.architecture)) {
          const projectArchitectureData = {
            steps: structuredData.architecture,
            processName: structuredData.solution_architect?.opt_task || 
                        structuredData.roi_analysis?.process_name || 
                        'AI Workflow',
            workloadParams: structuredData.workload_params,
            hasArchitecture: true
          }
          setCurrentArchitectureData(projectArchitectureData)
        } else {
          // Use dashboard context architecture data but extract process name from structured data
          const processName = structuredData?.solution_architect?.opt_task || 
                             structuredData?.roi_analysis?.process_name ||
                             dashboardData?.originalStructuredData?.solution_architect?.opt_task ||
                             dashboardData?.originalStructuredData?.roi_analysis?.process_name ||
                             'AI Workflow'
          
          const enhancedArchitectureData = {
            ...architectureData,
            processName,
            workloadParams: structuredData?.workload_params || dashboardData?.originalStructuredData?.workload_params
          }
          
          setCurrentArchitectureData(enhancedArchitectureData)
        }
      } catch (error) {
        console.warn('Error loading project data:', error)
        setCurrentArchitectureData(architectureData)
      }
    } else {
      // No project ID, try to extract process name from dashboard data
      const processName = dashboardData?.originalStructuredData?.solution_architect?.opt_task ||
                         dashboardData?.originalStructuredData?.roi_analysis?.process_name ||
                         'AI Workflow'
      
      const enhancedArchitectureData = {
        ...architectureData,
        processName,
        workloadParams: dashboardData?.originalStructuredData?.workload_params
      }
      
      setCurrentArchitectureData(enhancedArchitectureData)
    }
  }, [projectId, architectureData, dashboardData])

  // Memoize the mapArchitecture result to prevent unnecessary recalculations
  const { nodes, edges } = useMemo(() => {
    return mapArchitecture(currentArchitectureData.steps)
  }, [currentArchitectureData.steps])

  // Get workflow statistics from current architecture data
  const getWorkflowStats = () => {
    const workloadParams = currentArchitectureData.workloadParams || 
                          projectData?.structured_data?.workload_params ||
                          dashboardData?.originalStructuredData?.workload_params
    
    const roiAnalysis = projectData?.structured_data?.roi_analysis ||
                       dashboardData?.originalStructuredData?.roi_analysis
    
    const stepsCount = currentArchitectureData.steps.length
    const avgLatency = workloadParams?.latency_sla_ms || 2500
    const efficiency = roiAnalysis?.roi_percent 
      ? Math.min(95, 85 + (roiAnalysis.roi_percent / 10))
      : 94
    
    return {
      stepsCount,
      avgLatency: `~${(avgLatency / 1000).toFixed(1)}s`,
      efficiency: `${Math.round(efficiency)}%`
    }
  }

  const stats = getWorkflowStats()

  // Show loading state if dashboard is loading
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-96 ${isDarkMode ? 'text-white' : ''}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-muted-indigo rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Zap" size={24} className="text-white animate-pulse" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Loading AI Workflow...</h3>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>Preparing your workflow architecture</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-8 p-6 min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-cloud-white'}`}>
      {/* Show data source indicator if we have real data */}
      {(projectData || dashboardData) && (
        <div className={`mb-6 p-4 border rounded-lg transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-black border-gray-800 text-white' 
            : 'bg-muted-indigo/10 border-muted-indigo/20'
        }`}>
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-muted-indigo" />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
              {currentArchitectureData.hasArchitecture 
                ? (projectData ? 'Workflow loaded from project data' : 'Workflow generated from AI analysis')
                : 'Using default workflow template'
              }
            </span>
            {dashboardData?.lastUpdated && (
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>
                Last updated: {new Date(dashboardData.lastUpdated).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className={`rounded-xl border p-6 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-black border-gray-800 shadow-2xl' 
          : 'bg-white shadow-mist border-sky-gray'
      }`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-muted-indigo/20' : 'bg-muted-indigo/10'
          }`}>
            <Icon name="Zap" size={20} className="text-muted-indigo" />
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>AI Workflow Architecture</h2>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
              Visual representation of the AI processing workflow for {currentArchitectureData.processName}
            </p>
          </div>
        </div>

        {/* Workflow Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className={`rounded-lg p-4 border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-950 border-gray-800' 
              : 'bg-cloud-white border-sky-gray'
          }`}>
            <div className="flex items-center space-x-2">
              <Icon name="GitBranch" size={16} className="text-muted-indigo" />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Workflow Steps</span>
            </div>
            <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>{stats.stepsCount}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>Sequential processes</p>
          </div>
          <div className={`rounded-lg p-4 border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-950 border-gray-800' 
              : 'bg-cloud-white border-sky-gray'
          }`}>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-mist-teal" />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Avg Processing</span>
            </div>
            <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>{stats.avgLatency}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>End-to-end latency</p>
          </div>
          <div className={`rounded-lg p-4 border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-950 border-gray-800' 
              : 'bg-cloud-white border-sky-gray'
          }`}>
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} className="text-calm-green" />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Efficiency</span>
            </div>
            <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>{stats.efficiency}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>Success rate</p>
          </div>
        </div>
      </div>

      {/* Architecture Flow */}
      <div className={`rounded-xl border p-6 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-black border-gray-800 shadow-2xl' 
          : 'bg-white shadow-mist border-sky-gray'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Process Flow</h3>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
              Interactive diagram showing the AI workflow progression
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-muted-indigo"></div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>Processing Node</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-1 bg-mist-teal"></div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>Data Flow</span>
            </div>
          </div>
        </div>
        <ArchitectureFlow nodes={nodes} edges={edges} />
      </div>

      {/* Process Details */}
      <div className={`rounded-xl border p-6 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-black border-gray-800 shadow-2xl' 
          : 'bg-white shadow-mist border-sky-gray'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-muted-indigo/20' : 'bg-muted-indigo/10'
          }`}>
            <Icon name="FileText" size={16} className="text-muted-indigo" />
          </div>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Process Details</h3>
        </div>
        
        <div className="space-y-4">
          {currentArchitectureData.steps.map((step, index) => {
            const [stepNumber, stepDescription] = step.split(' - ')
            const icons = ['Mail', 'AlertTriangle', 'MessageSquare', 'Database', 'Settings', 'CheckCircle']
            const IconName = icons[index] || 'Circle'
            
            return (
              <div key={index} className={`border rounded-lg p-4 transition-all duration-200 ${
                isDarkMode 
                  ? 'border-gray-800 hover:border-gray-600 hover:bg-gray-950' 
                  : 'border-sky-gray hover:shadow-md hover:border-muted-indigo/30'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mt-1 ${
                    isDarkMode ? 'bg-muted-indigo/20' : 'bg-muted-indigo/10'
                  }`}>
                    <Icon name={IconName} size={16} className="text-muted-indigo" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
                      {stepDescription || `Step ${stepNumber}`}
                    </h4>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
                      AI-powered processing step in the workflow pipeline
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-slate-gray'}>⏱️ Processing time varies</span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-slate-gray'}>🤖 AI-optimized</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 