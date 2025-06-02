import { mapArchitecture } from '@/features/architecture/transform'
import ArchitectureFlow from '@/components/ArchitectureFlow'
import { ArchitectureCards } from '@/components/ArchitectureCards'
import Icon from '@/components/AppIcon'
import { useDashboard } from '@/contexts/DashboardContext'
import { useDarkMode } from '@/contexts/DarkModeContext'
import { useParams } from 'react-router-dom'
import { projectService } from '@/services'
import { useEffect, useState } from 'react'

export default function ProjectArchitecture() {
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
          setCurrentArchitectureData({
            steps: structuredData.architecture,
            processName: structuredData.solution_architect?.opt_task || 
                        structuredData.roi_analysis?.process_name || 
                        'AI Workflow',
            workloadParams: structuredData.workload_params,
            hasArchitecture: true
          })
        } else {
          // Use dashboard context architecture data
          setCurrentArchitectureData(architectureData)
        }
      } catch (error) {
        console.warn('Error loading project data:', error)
        // Use dashboard context architecture data as fallback
        setCurrentArchitectureData(architectureData)
      }
    } else {
      // No project ID, use dashboard context data
      setCurrentArchitectureData(architectureData)
    }
  }, [projectId, architectureData])

  const { nodes, edges, cards } = mapArchitecture(currentArchitectureData.steps)

  // Show loading state if dashboard is loading
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-96 ${isDarkMode ? 'text-white' : ''}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-muted-indigo rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Zap" size={24} className="text-white animate-pulse" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Loading Solution Architecture...</h3>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>Preparing your architecture visualization</p>
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
                ? (projectData ? 'Architecture loaded from project data' : 'Architecture generated from AI analysis')
                : 'Using default architecture template'
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
            <Icon name="Building" size={20} className="text-muted-indigo" />
          </div>
          <div>
            <h1 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Solution Architecture</h1>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
              Comprehensive architecture overview for {currentArchitectureData.processName}
            </p>
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
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Architecture Flow</h2>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
              Interactive diagram showing the solution architecture
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-muted-indigo"></div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>Component</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-1 bg-mist-teal"></div>
              <span className={`${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>Data Flow</span>
            </div>
          </div>
        </div>
        <ArchitectureFlow nodes={nodes} edges={edges} />
      </div>

      {/* Architecture Cards */}
      <div className={`rounded-xl border p-6 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-black border-gray-800 shadow-2xl' 
          : 'bg-white shadow-mist border-sky-gray'
      }`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-muted-indigo/20' : 'bg-muted-indigo/10'
          }`}>
            <Icon name="Layers" size={16} className="text-muted-indigo" />
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Architecture Components</h2>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
              Detailed breakdown of each architecture component
            </p>
          </div>
        </div>
        <ArchitectureCards cards={cards} />
      </div>
    </div>
  )
} 