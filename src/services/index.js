/**
 * Central services export
 * This file exports all API services for easy import throughout the application
 */

// Import all services
import chatService from './chatService';
import projectService from './projectService';

// Export all services
export {
  chatService,
  projectService,
};

// Export chat service methods for direct import
export const {
  sendInteractiveMessage,
  updateWorkloadParams,
  compareModels,
  getROIAnalysis,
  formatCost,
  calculateSavings,
} = chatService; 