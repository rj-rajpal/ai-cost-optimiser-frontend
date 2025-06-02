/**
 * Central services export
 * This file exports all API services for easy import throughout the application
 */

// Import all services
import chatService from './chatService';
import projectService from './projectService';
import openaiService from './openaiService';

// Export all services
export {
  chatService,
  projectService,
  openaiService,
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

// Export OpenAI service methods for direct import
export const {
  sendMessage,
  continueConversation,
  sendWithSystemPrompt,
  streamChatCompletion,
  getModels,
  getCostOptimizationAdvice,
  estimateCost,
} = openaiService; 