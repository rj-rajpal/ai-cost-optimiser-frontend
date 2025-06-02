// Project Service - Handles project creation, data processing, and local storage
import { STORAGE_KEYS } from '../constants/config';
import { transform, getTopROIOpportunities } from '../lib/transform';

class ProjectService {
  constructor() {
    this.storageKey = 'ai_cost_projects';
  }

  /**
   * Process structured data from chat API into project data format
   * @param {Object} structuredData - Raw structured data from API
   * @param {string} projectName - Name/title for the project
   * @param {Array} chatHistory - Chat messages that led to this project
   * @returns {Object} Processed project data
   */
  processStructuredDataToProject(structuredData, projectName, chatHistory = []) {
    const projectId = this.generateProjectId(projectName);
    
    // Use transform utility to process the structured data
    const transformedData = transform({ structured_data: structuredData });
    
    // Extract key metrics from structured data
    const {
      solution_architect,
      workload_params,
      cost_table,
      ranked_models,
      roi_analysis,
      final_recommendation
    } = structuredData;

    // Get top ROI opportunities
    const topROIOpportunities = getTopROIOpportunities([roi_analysis], 'roi_percent');
    
    // Create project data structure
    const projectData = {
      id: projectId,
      title: projectName,
      phase: 'CMP', // Complete - since we have analysis data
      progress: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      
      // Original chat data
      chat_history: chatHistory,
      original_query: chatHistory[chatHistory.length - 1]?.text || '',
      
      // Processed structured data
      structured_data: structuredData,
      final_recommendation,
      
      // Transformed dashboard data (using transform utility)
      dashboard: {
        kpis: transformedData.kpis,
        chartData: transformedData.chartData,
        roiList: transformedData.roiList,
        topROIOpportunities: topROIOpportunities
      },
      
      // ROI Calculator data
      roi_calculator: this.createROICalculatorData(ranked_models, workload_params, roi_analysis),
      
      // Scenarios data
      scenarios: this.createScenariosData(cost_table, ranked_models, workload_params),
      
      // Analysis data
      analysis: {
        solution_architecture: solution_architect,
        workload_parameters: workload_params,
        cost_analysis: cost_table,
        recommendations: ranked_models
      }
    };

    return projectData;
  }

  /**
   * Generate a unique project ID from project name
   * @param {string} projectName - Project name
   * @returns {string} Unique project ID
   */
  generateProjectId(projectName) {
    const cleanName = projectName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);
    
    const timestamp = Date.now().toString(36);
    return `${cleanName}-${timestamp}`;
  }

  /**
   * Create dashboard metrics from structured data
   * @param {Array} costTable - Cost analysis data
   * @param {Object} workloadParams - Workload parameters
   * @param {Object} roiAnalysis - ROI analysis data
   * @returns {Array} Dashboard metrics
   */
  createDashboardMetrics(costTable, workloadParams, roiAnalysis) {
    const bestModel = costTable?.[0] || {};
    const monthlyCost = bestModel.monthly_cost || 0;
    const dailyCalls = workloadParams?.calls_per_day || 0;
    const costPerCall = dailyCalls > 0 ? monthlyCost / (dailyCalls * 30) : 0;
    
    return [
      {
        title: "Recommended Monthly Cost",
        value: `₹${monthlyCost.toLocaleString()}`,
        change: roiAnalysis?.savings_per_month > 0 ? `-${roiAnalysis.roi_percent.toFixed(1)}%` : "New Project",
        trend: roiAnalysis?.savings_per_month > 0 ? "down" : "neutral",
        color: roiAnalysis?.savings_per_month > 0 ? "text-green-600" : "text-blue-600"
      },
      {
        title: "Cost per API Call",
        value: `₹${costPerCall.toFixed(4)}`,
        change: roiAnalysis?.best_model ? `${roiAnalysis.best_model}` : "Optimized",
        trend: "neutral",
        color: "text-blue-600"
      },
      {
        title: "Daily API Calls",
        value: dailyCalls.toLocaleString(),
        change: `${workloadParams?.region || 'Global'}`,
        trend: "neutral",
        color: "text-green-600"
      },
      {
        title: "Recommended Model",
        value: bestModel.model_name || "TBD",
        change: `${bestModel.p90_latency_ms || 0}ms latency`,
        trend: "up",
        color: "text-purple-600"
      }
    ];
  }

  /**
   * Create ROI calculator data
   * @param {Array} rankedModels - Ranked models data
   * @param {Object} workloadParams - Workload parameters
   * @param {Object} roiAnalysis - ROI analysis data
   * @returns {Object} ROI calculator data
   */
  createROICalculatorData(rankedModels, workloadParams, roiAnalysis) {
    return {
      current_model: roiAnalysis?.current_model || '',
      recommended_model: roiAnalysis?.best_model || rankedModels?.[0]?.model_name || '',
      workload_parameters: {
        daily_calls: workloadParams?.calls_per_day || 0,
        avg_input_tokens: workloadParams?.avg_input_tokens || 0,
        avg_output_tokens: workloadParams?.avg_output_tokens || 0,
        region: workloadParams?.region || 'US',
        latency_requirement: workloadParams?.latency_sla_ms || 0
      },
      cost_comparison: rankedModels?.map(model => ({
        model_name: model.model_name,
        monthly_cost: model.monthly_cost,
        latency: model.p90_latency_ms,
        score: model.composite_score || 1.0
      })) || [],
      savings_analysis: {
        monthly_savings: roiAnalysis?.savings_per_month || 0,
        annual_savings: (roiAnalysis?.savings_per_month || 0) * 12,
        roi_percentage: roiAnalysis?.roi_percent || 0,
        payback_weeks: roiAnalysis?.payback_weeks || 0
      }
    };
  }

  /**
   * Create scenarios data
   * @param {Array} costTable - Cost analysis data
   * @param {Array} rankedModels - Ranked models data
   * @param {Object} workloadParams - Workload parameters
   * @returns {Object} Scenarios data
   */
  createScenariosData(costTable, rankedModels, workloadParams) {
    const baseWorkload = workloadParams?.calls_per_day || 500;
    
    // Create scenarios with different workload volumes
    const scenarios = [
      {
        id: 1,
        name: "Current Volume",
        description: "Current expected workload",
        workload_multiplier: 1.0,
        calls_per_day: baseWorkload,
        models: costTable || []
      },
      {
        id: 2,
        name: "Growth Scenario (2x)",
        description: "Double the current workload",
        workload_multiplier: 2.0,
        calls_per_day: baseWorkload * 2,
        models: costTable?.map(model => ({
          ...model,
          monthly_cost: model.monthly_cost * 2
        })) || []
      },
      {
        id: 3,
        name: "High Volume (5x)",
        description: "Five times current workload",
        workload_multiplier: 5.0,
        calls_per_day: baseWorkload * 5,
        models: costTable?.map(model => ({
          ...model,
          monthly_cost: model.monthly_cost * 5
        })) || []
      }
    ];

    return {
      base_parameters: workloadParams,
      scenarios: scenarios,
      selected_scenario: scenarios[0]
    };
  }

  /**
   * Create chart data for dashboard
   * @param {Array} costTable - Cost analysis data
   * @param {Object} workloadParams - Workload parameters
   * @returns {Array} Chart data
   */
  createChartData(costTable, workloadParams) {
    const bestModel = costTable?.[0] || {};
    const monthlyCost = bestModel.monthly_cost || 0;
    const dailyCalls = workloadParams?.calls_per_day || 0;
    
    // Generate 6 months of projected data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      spend: Math.round(monthlyCost * (1 + (index * 0.05))), // 5% growth per month
      queries: Math.round(dailyCalls * 30 * (1 + (index * 0.05)))
    }));
  }

  /**
   * Create top processes data
   * @param {Object} solutionArchitect - Solution architect data
   * @param {Object} workloadParams - Workload parameters
   * @param {Array} costTable - Cost analysis data
   * @returns {Array} Top processes data
   */
  createTopProcesses(solutionArchitect, workloadParams, costTable) {
    const taskName = solutionArchitect?.opt_task || "AI Optimization Task";
    const monthlyCost = costTable?.[0]?.monthly_cost || 0;
    const dailyCalls = workloadParams?.calls_per_day || 0;
    
    return [
      {
        id: 1,
        name: taskName,
        department: "Operations",
        monthlyCost: monthlyCost,
        queries: dailyCalls * 30,
        savings: monthlyCost * 0.15, // Assume 15% potential savings
        complexity: dailyCalls > 1000 ? "High" : dailyCalls > 500 ? "Medium" : "Low"
      }
    ];
  }

  /**
   * Save project to local storage
   * @param {Object} projectData - Project data to save
   * @returns {boolean} Success status
   */
  saveProject(projectData) {
    try {
      const existingProjects = this.getAllProjects();
      const updatedProjects = {
        ...existingProjects,
        [projectData.id]: projectData
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(updatedProjects));
      return true;
    } catch (error) {
      console.error('Error saving project:', error);
      return false;
    }
  }

  /**
   * Get all projects from local storage
   * @returns {Object} All projects
   */
  getAllProjects() {
    try {
      const projects = localStorage.getItem(this.storageKey);
      return projects ? JSON.parse(projects) : {};
    } catch (error) {
      console.error('Error getting projects:', error);
      return {};
    }
  }

  /**
   * Get a specific project by ID
   * @param {string} projectId - Project ID
   * @returns {Object|null} Project data or null if not found
   */
  getProject(projectId) {
    const projects = this.getAllProjects();
    return projects[projectId] || null;
  }

  /**
   * Delete a project
   * @param {string} projectId - Project ID to delete
   * @returns {boolean} Success status
   */
  deleteProject(projectId) {
    try {
      const projects = this.getAllProjects();
      delete projects[projectId];
      localStorage.setItem(this.storageKey, JSON.stringify(projects));
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  /**
   * Update existing project
   * @param {string} projectId - Project ID
   * @param {Object} updates - Updates to apply
   * @returns {boolean} Success status
   */
  updateProject(projectId, updates) {
    try {
      const projects = this.getAllProjects();
      if (projects[projectId]) {
        projects[projectId] = {
          ...projects[projectId],
          ...updates,
          updated_at: new Date().toISOString()
        };
        localStorage.setItem(this.storageKey, JSON.stringify(projects));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating project:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
const projectService = new ProjectService();
export default projectService;

// Export the class for testing or custom instances
export { ProjectService }; 