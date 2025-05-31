/**
 * Process Service
 * Handles all process analysis related API operations
 */

import api from '../lib/api';

/**
 * Get all processes with optional filters
 */
export const getAllProcesses = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add filters to query parameters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/processes?${queryString}` : '/processes';
  
  return await api.get(endpoint);
};

/**
 * Get process by ID
 */
export const getProcessById = async (processId) => {
  return await api.get(`/processes/${processId}`);
};

/**
 * Create new process
 */
export const createProcess = async (processData) => {
  return await api.post('/processes', processData);
};

/**
 * Update existing process
 */
export const updateProcess = async (processId, processData) => {
  return await api.patch(`/processes/${processId}`, processData);
};

/**
 * Delete process
 */
export const deleteProcess = async (processId) => {
  return await api.delete(`/processes/${processId}`);
};

/**
 * Bulk delete processes
 */
export const bulkDeleteProcesses = async (processIds) => {
  return await api.post('/processes/bulk-delete', { process_ids: processIds });
};

/**
 * Analyze process for automation opportunities
 */
export const analyzeProcess = async (processId, analysisOptions = {}) => {
  return await api.post(`/processes/${processId}/analyze`, analysisOptions);
};

/**
 * Get process analysis results
 */
export const getAnalysisResults = async (processId, analysisId) => {
  return await api.get(`/processes/${processId}/analysis/${analysisId}`);
};

/**
 * Calculate ROI for process
 */
export const calculateROI = async (processId, roiParameters) => {
  return await api.post(`/processes/${processId}/calculate-roi`, roiParameters);
};

/**
 * Get process metrics
 */
export const getProcessMetrics = async (processId, timeRange = '30d') => {
  return await api.get(`/processes/${processId}/metrics?range=${timeRange}`);
};

/**
 * Generate process report
 */
export const generateReport = async (processIds, reportOptions = {}) => {
  return await api.post('/processes/generate-report', {
    process_ids: processIds,
    ...reportOptions,
  });
};

/**
 * Export processes to CSV
 */
export const exportToCSV = async (processIds = [], filters = {}) => {
  const exportData = {
    process_ids: processIds,
    filters,
    format: 'csv',
  };

  return await api.download('/processes/export', 'processes.csv', {
    method: 'POST',
    body: exportData,
  });
};

/**
 * Export processes to Excel
 */
export const exportToExcel = async (processIds = [], filters = {}) => {
  const exportData = {
    process_ids: processIds,
    filters,
    format: 'excel',
  };

  return await api.download('/processes/export', 'processes.xlsx', {
    method: 'POST',
    body: exportData,
  });
};

/**
 * Get process templates
 */
export const getProcessTemplates = async () => {
  return await api.get('/processes/templates');
};

/**
 * Create process from template
 */
export const createFromTemplate = async (templateId, customizations = {}) => {
  return await api.post(`/processes/templates/${templateId}/create`, customizations);
};

/**
 * Search processes
 */
export const searchProcesses = async (query, filters = {}) => {
  const searchData = {
    query,
    ...filters,
  };

  return await api.post('/processes/search', searchData);
};

/**
 * Get process recommendations
 */
export const getRecommendations = async (processId) => {
  return await api.get(`/processes/${processId}/recommendations`);
};

/**
 * Apply recommendation to process
 */
export const applyRecommendation = async (processId, recommendationId) => {
  return await api.post(`/processes/${processId}/recommendations/${recommendationId}/apply`);
};

/**
 * Get process automation score
 */
export const getAutomationScore = async (processId) => {
  return await api.get(`/processes/${processId}/automation-score`);
};

/**
 * Get process complexity analysis
 */
export const getComplexityAnalysis = async (processId) => {
  return await api.get(`/processes/${processId}/complexity`);
};

/**
 * Validate process data
 */
export const validateProcessData = async (processData) => {
  return await api.post('/processes/validate', processData);
};

/**
 * Get process categories
 */
export const getCategories = async () => {
  return await api.get('/processes/categories');
};

/**
 * Get process departments
 */
export const getDepartments = async () => {
  return await api.get('/processes/departments');
}; 