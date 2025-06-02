import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { transform, getTopROIOpportunities } from '../lib/transform';
import { projectService } from '../services';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const { projectId } = useParams(); // Get current project ID from URL
  const [projectDataStore, setProjectDataStore] = useState({}); // Store data per project
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get current project's dashboard data
  const dashboardData = useMemo(() => {
    return currentProjectId ? projectDataStore[currentProjectId] : null;
  }, [projectDataStore, currentProjectId]);

  // Extract architecture data from current project's dashboard data
  const architectureData = useMemo(() => {
    const structuredData = dashboardData?.originalStructuredData;
    if (structuredData?.solution_architect?.architecture && Array.isArray(structuredData?.solution_architect?.architecture)) {
      return {
        steps: structuredData?.solution_architect?.architecture,
        processName: structuredData.solution_architect?.opt_task || 
                    structuredData.roi_analysis?.process_name || 
                    'AI Workflow',
        workloadParams: structuredData.workload_params,
        hasArchitecture: true
      };
    }
    
    return {
      steps: [
        '1 - Data ingestion',
        '2 - Processing & analysis', 
        '3 - Output generation'
      ],
      processName: 'AI Workflow',
      workloadParams: null,
      hasArchitecture: false
    };
  }, [dashboardData]);

  // Store data per project in localStorage
  const persistProjectData = useCallback((projectId, data) => {
    try {
      const storageKey = `costwise_project_data_${projectId}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
      
      // Also update the global project store
      setProjectDataStore(prev => ({
        ...prev,
        [projectId]: data
      }));
    } catch (err) {
      console.error('Error persisting project data:', err);
    }
  }, []);

  // Load data for a specific project
  const loadProjectData = useCallback((targetProjectId) => {
    try {
      setIsLoading(true);
      setError(null);

      // First try to get from projectService (saved projects)
      const project = projectService.getProject(targetProjectId);
      
      if (project && project.structured_data) {
        // Process structured data from project
        const transformedData = transform({ structured_data: project.structured_data });
        const topROIOpportunities = getTopROIOpportunities([project.structured_data.roi_analysis], 'roi_percent');
        
        const processedData = {
          ...transformedData,
          topROIOpportunities,
          originalStructuredData: project.structured_data,
          lastUpdated: project.updated_at || new Date().toISOString(),
          projectId: targetProjectId
        };

        persistProjectData(targetProjectId, processedData);
        return processedData;
      }
      
      // Fallback to localStorage if project not found in projectService
      const storageKey = `costwise_project_data_${targetProjectId}`;
      const persistedData = localStorage.getItem(storageKey);
      
      if (persistedData) {
        const parsedData = JSON.parse(persistedData);
        setProjectDataStore(prev => ({
          ...prev,
          [targetProjectId]: parsedData
        }));
        return parsedData;
      }

      // If no data found anywhere
      console.warn(`No data found for project: ${targetProjectId}`);
      setError('No data available for this project');
      return null;
      
    } catch (err) {
      console.error('Error loading project data:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [persistProjectData]);

  // Process structured data for current project
  const processStructuredData = useCallback((structuredData, targetProjectId = null) => {
    try {
      setIsLoading(true);
      setError(null);

      const useProjectId = targetProjectId || currentProjectId;
      if (!useProjectId) {
        throw new Error('No project ID available');
      }

      // Use transform utility to process the data
      const transformedData = transform({ structured_data: structuredData });
      
      // Get top ROI opportunities
      const topROIOpportunities = getTopROIOpportunities([structuredData.roi_analysis], 'roi_percent');
      
      const processedData = {
        ...transformedData,
        topROIOpportunities,
        originalStructuredData: structuredData,
        lastUpdated: new Date().toISOString(),
        projectId: useProjectId
      };

      persistProjectData(useProjectId, processedData);
      
      return processedData;
    } catch (err) {
      console.error('Error processing structured data:', err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentProjectId, persistProjectData]);

  // Legacy method for backward compatibility
  const loadProjectDashboard = useCallback((targetProjectId) => {
    return loadProjectData(targetProjectId);
  }, [loadProjectData]);

  // Clear data for current project
  const clearDashboardData = useCallback(() => {
    if (currentProjectId) {
      const storageKey = `costwise_project_data_${currentProjectId}`;
      localStorage.removeItem(storageKey);
      
      setProjectDataStore(prev => {
        const newStore = { ...prev };
        delete newStore[currentProjectId];
        return newStore;
      });
    }
    setError(null);
  }, [currentProjectId]);

  // Clear all project data
  const clearAllProjectData = useCallback(() => {
    // Clear all project data from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('costwise_project_data_')) {
        localStorage.removeItem(key);
      }
    });
    
    setProjectDataStore({});
    setError(null);
  }, []);

  // Load project data when projectId changes
  useEffect(() => {
    if (projectId && projectId !== currentProjectId) {
      setCurrentProjectId(projectId);
      loadProjectData(projectId);
    }
  }, [projectId, currentProjectId, loadProjectData]);

  // Load persisted project data on mount
  useEffect(() => {
    const loadAllPersistedProjects = () => {
      const persistedStore = {};
      
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('costwise_project_data_')) {
          try {
            const projectId = key.replace('costwise_project_data_', '');
            const data = JSON.parse(localStorage.getItem(key));
            persistedStore[projectId] = data;
          } catch (err) {
            console.error(`Error parsing persisted data for ${key}:`, err);
            localStorage.removeItem(key);
          }
        }
      });
      
      if (Object.keys(persistedStore).length > 0) {
        setProjectDataStore(persistedStore);
      }
    };

    loadAllPersistedProjects();
  }, []);

  const value = {
    // Current project data
    dashboardData,
    architectureData,
    currentProjectId,
    
    // State
    isLoading,
    error,
    
    // Methods
    processStructuredData,
    loadProjectData,
    loadProjectDashboard, // Legacy compatibility
    clearDashboardData,
    clearAllProjectData,
    
    // Utility flags
    hasDashboardData: !!dashboardData,
    hasArchitectureData: architectureData.hasArchitecture,
    
    // Store access (for debugging)
    projectDataStore
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContext; 