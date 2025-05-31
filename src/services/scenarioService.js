/**
 * Scenario Service
 * Handles all scenario library operations
 */

import api from '../lib/api';

/**
 * Get all scenarios with optional filters
 */
export const getAllScenarios = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add filters to query parameters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/scenarios?${queryString}` : '/scenarios';
  
  return await api.get(endpoint);
};

/**
 * Get scenario by ID
 */
export const getScenarioById = async (scenarioId) => {
  return await api.get(`/scenarios/${scenarioId}`);
};

/**
 * Create new scenario
 */
export const createScenario = async (scenarioData) => {
  return await api.post('/scenarios', scenarioData);
};

/**
 * Update existing scenario
 */
export const updateScenario = async (scenarioId, scenarioData) => {
  return await api.patch(`/scenarios/${scenarioId}`, scenarioData);
};

/**
 * Delete scenario
 */
export const deleteScenario = async (scenarioId) => {
  return await api.delete(`/scenarios/${scenarioId}`);
};

/**
 * Bulk delete scenarios
 */
export const bulkDeleteScenarios = async (scenarioIds) => {
  return await api.post('/scenarios/bulk-delete', { scenario_ids: scenarioIds });
};

/**
 * Duplicate scenario
 */
export const duplicateScenario = async (scenarioId, customName = null) => {
  return await api.post(`/scenarios/${scenarioId}/duplicate`, {
    name: customName,
  });
};

/**
 * Bulk duplicate scenarios
 */
export const bulkDuplicateScenarios = async (scenarioIds) => {
  return await api.post('/scenarios/bulk-duplicate', { scenario_ids: scenarioIds });
};

/**
 * Share scenario
 */
export const shareScenario = async (scenarioId, shareOptions) => {
  return await api.post(`/scenarios/${scenarioId}/share`, shareOptions);
};

/**
 * Get shared scenarios
 */
export const getSharedScenarios = async () => {
  return await api.get('/scenarios/shared');
};

/**
 * Revoke scenario share
 */
export const revokeScenarioShare = async (scenarioId, shareId) => {
  return await api.delete(`/scenarios/${scenarioId}/shares/${shareId}`);
};

/**
 * Archive scenario
 */
export const archiveScenario = async (scenarioId) => {
  return await api.post(`/scenarios/${scenarioId}/archive`);
};

/**
 * Restore archived scenario
 */
export const restoreScenario = async (scenarioId) => {
  return await api.post(`/scenarios/${scenarioId}/restore`);
};

/**
 * Get archived scenarios
 */
export const getArchivedScenarios = async (page = 1, limit = 20) => {
  return await api.get(`/scenarios/archived?page=${page}&limit=${limit}`);
};

/**
 * Search scenarios
 */
export const searchScenarios = async (query, filters = {}) => {
  const searchData = {
    query,
    ...filters,
  };

  return await api.post('/scenarios/search', searchData);
};

/**
 * Get scenario templates
 */
export const getScenarioTemplates = async () => {
  return await api.get('/scenarios/templates');
};

/**
 * Create scenario from template
 */
export const createFromTemplate = async (templateId, customizations = {}) => {
  return await api.post(`/scenarios/templates/${templateId}/create`, customizations);
};

/**
 * Export scenarios
 */
export const exportScenarios = async (scenarioIds = [], format = 'csv') => {
  const exportData = {
    scenario_ids: scenarioIds,
    format,
  };

  const filename = `scenarios_export_${Date.now()}.${format}`;
  return await api.download('/scenarios/export', filename, {
    method: 'POST',
    body: exportData,
  });
};

/**
 * Import scenarios
 */
export const importScenarios = async (file, importOptions = {}) => {
  return await api.upload('/scenarios/import', file, importOptions);
};

/**
 * Get scenario statistics
 */
export const getScenarioStats = async () => {
  return await api.get('/scenarios/stats');
};

/**
 * Get scenario ROI comparison
 */
export const getROIComparison = async (scenarioIds) => {
  return await api.post('/scenarios/roi-comparison', { scenario_ids: scenarioIds });
};

/**
 * Run scenario simulation
 */
export const runSimulation = async (scenarioId, simulationParams = {}) => {
  return await api.post(`/scenarios/${scenarioId}/simulate`, simulationParams);
};

/**
 * Get simulation results
 */
export const getSimulationResults = async (scenarioId, simulationId) => {
  return await api.get(`/scenarios/${scenarioId}/simulations/${simulationId}`);
};

/**
 * Get scenario recommendations
 */
export const getRecommendations = async (scenarioId) => {
  return await api.get(`/scenarios/${scenarioId}/recommendations`);
};

/**
 * Apply recommendation to scenario
 */
export const applyRecommendation = async (scenarioId, recommendationId) => {
  return await api.post(`/scenarios/${scenarioId}/recommendations/${recommendationId}/apply`);
};

/**
 * Get scenario categories
 */
export const getCategories = async () => {
  return await api.get('/scenarios/categories');
};

/**
 * Create scenario category
 */
export const createCategory = async (categoryData) => {
  return await api.post('/scenarios/categories', categoryData);
};

/**
 * Get scenario tags
 */
export const getTags = async () => {
  return await api.get('/scenarios/tags');
};

/**
 * Create scenario tag
 */
export const createTag = async (tagData) => {
  return await api.post('/scenarios/tags', tagData);
};

/**
 * Add tags to scenario
 */
export const addTagsToScenario = async (scenarioId, tagIds) => {
  return await api.post(`/scenarios/${scenarioId}/tags`, { tag_ids: tagIds });
};

/**
 * Remove tags from scenario
 */
export const removeTagsFromScenario = async (scenarioId, tagIds) => {
  return await api.delete(`/scenarios/${scenarioId}/tags`, { 
    body: { tag_ids: tagIds } 
  });
};

/**
 * Validate scenario data
 */
export const validateScenarioData = async (scenarioData) => {
  return await api.post('/scenarios/validate', scenarioData);
};

/**
 * Get scenario version history
 */
export const getVersionHistory = async (scenarioId) => {
  return await api.get(`/scenarios/${scenarioId}/versions`);
};

/**
 * Restore scenario version
 */
export const restoreVersion = async (scenarioId, versionId) => {
  return await api.post(`/scenarios/${scenarioId}/versions/${versionId}/restore`);
};

/**
 * Compare scenario versions
 */
export const compareVersions = async (scenarioId, versionId1, versionId2) => {
  return await api.get(`/scenarios/${scenarioId}/versions/compare?v1=${versionId1}&v2=${versionId2}`);
};

/**
 * Get scenario favorites
 */
export const getFavoriteScenarios = async () => {
  return await api.get('/scenarios/favorites');
};

/**
 * Add scenario to favorites
 */
export const addToFavorites = async (scenarioId) => {
  return await api.post(`/scenarios/${scenarioId}/favorite`);
};

/**
 * Remove scenario from favorites
 */
export const removeFromFavorites = async (scenarioId) => {
  return await api.delete(`/scenarios/${scenarioId}/favorite`);
}; 