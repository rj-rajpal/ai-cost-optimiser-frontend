// Chat Service - Handles interactive chat API for AI cost optimization
import { API_CONFIG } from '../constants/config';

class ChatService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL || 'http://localhost:3001/api';
    this.endpoints = {
      INTERACTIVE_CHAT: '/v1/chat/interactive',
      UPDATE_PARAMS: '/v1/chat/update-params'
    };
  }

  /**
   * Send a message to the interactive chat API
   * @param {string} message - User message describing their AI optimization needs
   * @param {Array} messageHistory - Previous messages in the conversation (optional)
   * @returns {Promise<Object>} Structured response with cost optimization data
   */
  async sendInteractiveMessage(message, messageHistory = []) {
    try {
      const messages = [
        ...messageHistory,
        {
          role: "user",
          content: message
        }
      ];

      const response = await fetch(`${this.baseURL}${this.endpoints.INTERACTIVE_CHAT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify({ messages })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.processResponse(data);
    } catch (error) {
      console.error('Error sending interactive message:', error);
      throw new Error(`Failed to get AI optimization response: ${error.message}`);
    }
  }

  /**
   * Process and validate the API response
   * @param {Object} data - Raw API response
   * @returns {Object} Processed response data
   */
  processResponse(data) {
    // Handle response with simple_answer (when structured_data is null)
    if (data.structured_data === null && data.simple_answer) {
      return {
        structured_data: null,
        simple_answer: data.simple_answer,
        timestamp: new Date().toISOString(),
        processed: true
      };
    }

    // Handle response with structured_data
    if (!data.structured_data) {
      throw new Error('Invalid response format: missing structured_data and simple_answer');
    }

    const { structured_data } = data;

    // Validate required fields for structured data
    const requiredFields = [
      'solution_architect',
      'workload_params', 
      'cost_table',
      'ranked_models',
      'roi_analysis',
      'final_recommendation'
    ];

    // Optional but recommended fields
    const optionalFields = [
      'architecture'
    ];

    for (const field of requiredFields) {
      if (!structured_data[field]) {
        console.warn(`Missing required field: ${field}`);
      }
    }

    for (const field of optionalFields) {
      if (!structured_data[field]) {
        console.info(`Optional field not provided: ${field}`);
      }
    }

    return {
      structured_data: {
        ...structured_data,
        timestamp: new Date().toISOString(),
        processed: true
      }
    };
  }

  /**
   * Get authentication headers (if needed)
   * @returns {Object} Auth headers
   */
  getAuthHeaders() {
    // Add authentication headers if needed
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  /**
   * Update workload parameters and get new recommendations
   * @param {Object} updatedParams - Updated workload parameters
   * @param {Object} originalData - Original structured data
   * @returns {Promise<Object>} Updated cost optimization data
   */
  async updateWorkloadParams(updatedParams, originalData) {
    try {
      const message = this.createUpdateMessage(updatedParams, originalData);
      return await this.sendInteractiveMessage(message);
    } catch (error) {
      console.error('Error updating workload params:', error);
      throw error;
    }
  }

  /**
   * Update workload parameters via dedicated API endpoint
   * 
   * This method calls the POST /v1/chat/update-params endpoint to get updated
   * cost optimization recommendations based on modified workload parameters.
   * 
   * @example
   * ```javascript
   * // Basic usage
   * const modifiedWorkload = {
   *   calls_per_day: 2000,
   *   avg_input_tokens: 300,
   *   avg_output_tokens: 150,
   *   latency_sla_ms: 1000,
   *   region: "US"
   * };
   * 
   * const updatedData = await chatService.updateWorkloadParamsAPI(
   *   modifiedWorkload, 
   *   originalStructuredData
   * );
   * 
   * // With optional parameters
   * const modifiedWorkloadWithOptions = {
   *   calls_per_day: 1500,
   *   avg_input_tokens: 250,
   *   avg_output_tokens: 120,
   *   latency_sla_ms: 800,
   *   region: "EU",
   *   compliance_constraints: ["GDPR", "SOC2"],
   *   current_model: "gpt-3.5-turbo"
   * };
   * ```
   * 
   * @param {Object} modifiedWorkload - Modified workload parameters
   * @param {number} modifiedWorkload.calls_per_day - Number of API calls per day
   * @param {number} modifiedWorkload.avg_input_tokens - Average input tokens per call
   * @param {number} modifiedWorkload.avg_output_tokens - Average output tokens per call
   * @param {number} modifiedWorkload.latency_sla_ms - Maximum acceptable latency in milliseconds
   * @param {string} modifiedWorkload.region - Geographic region (e.g., "US", "EU", "APAC")
   * @param {Array<string>} [modifiedWorkload.compliance_constraints] - Optional compliance requirements
   * @param {string} [modifiedWorkload.current_model] - Optional current model identifier
   * @param {Object} originalData - Original structured data response from previous API call
   * @returns {Promise<Object>} Updated cost optimization data with new recommendations
   * @throws {Error} If validation fails or API request fails
   */
  async updateWorkloadParamsAPI(modifiedWorkload, originalData) {
    try {
      // Validate required workload parameters
      const requiredFields = [
        'calls_per_day',
        'avg_input_tokens', 
        'avg_output_tokens',
        'latency_sla_ms',
        'region'
      ];

      for (const field of requiredFields) {
        if (!modifiedWorkload.hasOwnProperty(field)) {
          throw new Error(`Missing required workload parameter: ${field}`);
        }
      }

      // Validate original data
      if (!originalData || typeof originalData !== 'object') {
        throw new Error('Original data is required and must be an object');
      }

      const requestPayload = {
        modified_workload: {
          calls_per_day: modifiedWorkload.calls_per_day,
          avg_input_tokens: modifiedWorkload.avg_input_tokens,
          avg_output_tokens: modifiedWorkload.avg_output_tokens,
          latency_sla_ms: modifiedWorkload.latency_sla_ms,
          region: modifiedWorkload.region,
          compliance_constraints: modifiedWorkload.compliance_constraints || [],
          current_model: modifiedWorkload.current_model || ""
        },
        original_data: originalData
      };

      const response = await fetch(`${this.baseURL}${this.endpoints.UPDATE_PARAMS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders()
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      return this.processResponse(data);
    } catch (error) {
      console.error('Error updating workload parameters via API:', error);
      throw new Error(`Failed to update workload parameters: ${error.message}`);
    }
  }

  /**
   * Create a message for updating workload parameters
   * @param {Object} updatedParams - Updated parameters
   * @param {Object} originalData - Original data for context
   * @returns {string} Formatted message
   */
  createUpdateMessage(updatedParams, originalData) {
    const task = originalData.solution_architect?.opt_task || 'AI optimization task';
    const updates = Object.entries(updatedParams)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    
    return `Update the ${task} with these new parameters: ${updates}. Please recalculate costs and recommendations.`;
  }

  /**
   * Get cost comparison between models
   * @param {Array} models - Array of model names to compare
   * @param {Object} workloadParams - Current workload parameters
   * @returns {Promise<Object>} Cost comparison data
   */
  async compareModels(models, workloadParams) {
    try {
      const modelList = models.join(', ');
      const params = Object.entries(workloadParams)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      
      const message = `Compare costs for these AI models: ${modelList}. Use these workload parameters: ${params}`;
      return await this.sendInteractiveMessage(message);
    } catch (error) {
      console.error('Error comparing models:', error);
      throw error;
    }
  }

  /**
   * Get ROI analysis for switching from current to recommended model
   * @param {string} currentModel - Current model being used
   * @param {string} recommendedModel - Recommended model
   * @param {Object} workloadParams - Workload parameters
   * @returns {Promise<Object>} ROI analysis data
   */
  async getROIAnalysis(currentModel, recommendedModel, workloadParams) {
    try {
      const params = Object.entries(workloadParams)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      
      const message = `Calculate ROI for switching from ${currentModel} to ${recommendedModel}. Workload: ${params}`;
      return await this.sendInteractiveMessage(message);
    } catch (error) {
      console.error('Error getting ROI analysis:', error);
      throw error;
    }
  }

  /**
   * Validate structured data response format
   * @param {Object} data - Data to validate
   * @returns {boolean} Whether data is valid
   */
  validateStructuredData(data) {
    if (!data || typeof data !== 'object') return false;

    // Check for required top-level fields
    const hasRequiredFields = [
      'solution_architect',
      'workload_params',
      'cost_table',
      'ranked_models',
      'roi_analysis'
    ].every(field => data.hasOwnProperty(field));

    if (!hasRequiredFields) return false;

    // Validate workload_params structure
    if (data.workload_params) {
      const requiredWorkloadFields = [
        'calls_per_day',
        'avg_input_tokens',
        'avg_output_tokens',
        'latency_sla_ms',
        'region'
      ];
      const hasWorkloadFields = requiredWorkloadFields.every(field => 
        data.workload_params.hasOwnProperty(field)
      );
      if (!hasWorkloadFields) return false;
    }

    // Validate cost_table is array
    if (!Array.isArray(data.cost_table)) return false;

    // Validate ranked_models is array
    if (!Array.isArray(data.ranked_models)) return false;

    // Validate architecture is array if present (optional field)
    if (data.architecture && !Array.isArray(data.architecture)) {
      console.warn('Architecture field should be an array of strings');
      return false;
    }

    return true;
  }

  /**
   * Format cost value for display
   * @param {number} cost - Cost value
   * @param {string} currency - Currency symbol (default: ₹)
   * @returns {string} Formatted cost string
   */
  formatCost(cost, currency = '₹') {
    return `${currency}${cost.toLocaleString()}`;
  }

  /**
   * Calculate potential savings
   * @param {number} currentCost - Current monthly cost
   * @param {number} optimizedCost - Optimized monthly cost
   * @returns {Object} Savings calculation
   */
  calculateSavings(currentCost, optimizedCost) {
    const monthlySavings = currentCost - optimizedCost;
    const annualSavings = monthlySavings * 12;
    const savingsPercentage = currentCost > 0 ? (monthlySavings / currentCost) * 100 : 0;

    return {
      monthly: monthlySavings,
      annual: annualSavings,
      percentage: savingsPercentage,
      formattedMonthly: this.formatCost(monthlySavings),
      formattedAnnual: this.formatCost(annualSavings)
    };
  }

  /**
   * Create a workload parameters object with default values
   * @param {Object} params - Partial workload parameters
   * @returns {Object} Complete workload parameters object
   */
  createWorkloadParams(params = {}) {
    return {
      calls_per_day: params.calls_per_day || 1000,
      avg_input_tokens: params.avg_input_tokens || 150,
      avg_output_tokens: params.avg_output_tokens || 100,
      latency_sla_ms: params.latency_sla_ms || 500,
      region: params.region || 'US',
      compliance_constraints: params.compliance_constraints || [],
      current_model: params.current_model || ''
    };
  }

  /**
   * Validate workload parameters object
   * @param {Object} workloadParams - Workload parameters to validate
   * @returns {Object} Validation result with isValid flag and errors array
   */
  validateWorkloadParams(workloadParams) {
    const errors = [];
    const requiredFields = [
      'calls_per_day',
      'avg_input_tokens',
      'avg_output_tokens', 
      'latency_sla_ms',
      'region'
    ];

    // Check required fields
    for (const field of requiredFields) {
      if (!workloadParams.hasOwnProperty(field)) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate field types and values
    if (workloadParams.calls_per_day !== undefined) {
      if (typeof workloadParams.calls_per_day !== 'number' || workloadParams.calls_per_day < 0) {
        errors.push('calls_per_day must be a non-negative number');
      }
    }

    if (workloadParams.avg_input_tokens !== undefined) {
      if (typeof workloadParams.avg_input_tokens !== 'number' || workloadParams.avg_input_tokens < 0) {
        errors.push('avg_input_tokens must be a non-negative number');
      }
    }

    if (workloadParams.avg_output_tokens !== undefined) {
      if (typeof workloadParams.avg_output_tokens !== 'number' || workloadParams.avg_output_tokens < 0) {
        errors.push('avg_output_tokens must be a non-negative number');
      }
    }

    if (workloadParams.latency_sla_ms !== undefined) {
      if (typeof workloadParams.latency_sla_ms !== 'number' || workloadParams.latency_sla_ms < 0) {
        errors.push('latency_sla_ms must be a non-negative number');
      }
    }

    if (workloadParams.region !== undefined) {
      if (typeof workloadParams.region !== 'string' || workloadParams.region.trim().length === 0) {
        errors.push('region must be a non-empty string');
      }
    }

    if (workloadParams.compliance_constraints !== undefined) {
      if (!Array.isArray(workloadParams.compliance_constraints)) {
        errors.push('compliance_constraints must be an array');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Create and export a singleton instance
const chatService = new ChatService();
export default chatService;

// Export the class for testing or custom instances
export { ChatService }; 