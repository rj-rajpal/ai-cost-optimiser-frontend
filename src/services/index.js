/**
 * Central services export
 * This file exports all API services for easy import throughout the application
 */

// Import all services
import * as userService from './userService';
import * as processService from './processService';
import * as dataService from './dataService';
import * as analyticsService from './analyticsService';
import * as scenarioService from './scenarioService';

// Export all services
export {
  userService,
  processService,
  dataService,
  analyticsService,
  scenarioService,
};

// Export individual service functions for direct import
export const {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
} = userService;

export const {
  getAllProcesses,
  getProcessById,
  createProcess,
  updateProcess,
  deleteProcess,
  analyzeProcess,
} = processService;

export const {
  uploadFile,
  uploadMultipleFiles,
  getUploadHistory,
  deleteUpload,
  downloadFile,
} = dataService;

export const {
  getDashboardMetrics,
  getChartData,
  getTopProcesses,
  exportReport,
} = analyticsService;

export const {
  getAllScenarios,
  getScenarioById,
  createScenario,
  updateScenario,
  deleteScenario,
  duplicateScenario,
} = scenarioService; 