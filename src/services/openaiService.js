/**
 * OpenAI Service - Direct integration with OpenAI's Chat Completions API
 * Provides methods to interact with various OpenAI models for chat-based interactions
 */

import { OPENAI_CONFIG } from '../constants/config';

class OpenAIService {
  constructor() {
    this.baseURL = OPENAI_CONFIG.BASE_URL;
    this.apiKey = OPENAI_CONFIG.API_KEY;
    
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Please set OPENAI_API_KEY in your environment variables.');
    }

    this.defaultModel = OPENAI_CONFIG.DEFAULT_MODEL;
    this.models = OPENAI_CONFIG.MODELS;
    this.pricing = OPENAI_CONFIG.PRICING;
    this.endpoints = {
      CHAT_COMPLETIONS: '/chat/completions',
      MODELS: '/models'
    };

    // Default configuration for chat completions
    this.defaultConfig = OPENAI_CONFIG.DEFAULT_PARAMS;
  }

  /**
   * Send a chat completion request to OpenAI
   * @param {Array} messages - Array of message objects with role and content
   * @param {Object} options - Optional configuration for the request
   * @returns {Promise<Object>} OpenAI API response
   */
  async chatCompletion(messages, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key is not configured');
      }

      if (!Array.isArray(messages) || messages.length === 0) {
        throw new Error('Messages array is required and must not be empty');
      }

      // Validate message format
      this.validateMessages(messages);

      const requestBody = {
        model: options.model || this.defaultModel,
        messages: messages,
        ...this.defaultConfig,
        ...options // Allow overriding defaults
      };

      const response = await fetch(`${this.baseURL}${this.endpoints.CHAT_COMPLETIONS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...this.getCustomHeaders()
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return this.processResponse(data);
    } catch (error) {
      console.error('Error in OpenAI chat completion:', error);
      throw this.createServiceError(error);
    }
  }

  /**
   * Send a simple text message and get a response
   * @param {string} message - The user message
   * @param {Object} options - Optional configuration
   * @returns {Promise<string>} The AI's response text
   */
  async sendMessage(message, options = {}) {
    try {
      const messages = [
        {
          role: 'user',
          content: message
        }
      ];

      const response = await this.chatCompletion(messages, options);
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error sending message to OpenAI:', error);
      throw error;
    }
  }

  /**
   * Continue a conversation with message history
   * @param {Array} messageHistory - Previous messages in the conversation
   * @param {string} newMessage - New message to add
   * @param {Object} options - Optional configuration
   * @returns {Promise<Object>} Complete response with updated message history
   */
  async continueConversation(messageHistory, newMessage, options = {}) {
    try {
      const messages = [
        ...messageHistory,
        {
          role: 'user',
          content: newMessage
        }
      ];

      const response = await this.chatCompletion(messages, options);
      const assistantMessage = response.choices[0]?.message;

      return {
        response: assistantMessage?.content || '',
        updatedHistory: [
          ...messages,
          assistantMessage
        ],
        usage: response.usage,
        model: response.model
      };
    } catch (error) {
      console.error('Error continuing conversation:', error);
      throw error;
    }
  }

  /**
   * Create a system message for better AI behavior
   * @param {string} systemPrompt - System instruction
   * @param {string} userMessage - User message
   * @param {Object} options - Optional configuration
   * @returns {Promise<string>} AI response
   */
  async sendWithSystemPrompt(systemPrompt, userMessage, options = {}) {
    try {
      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userMessage
        }
      ];

      const response = await this.chatCompletion(messages, options);
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error sending message with system prompt:', error);
      throw error;
    }
  }

  /**
   * Stream chat completion (for real-time responses)
   * Note: This is a basic implementation - you might want to use Server-Sent Events for production
   * @param {Array} messages - Array of message objects
   * @param {Function} onChunk - Callback for each chunk of data
   * @param {Object} options - Optional configuration
   * @returns {Promise<string>} Complete response
   */
  async streamChatCompletion(messages, onChunk, options = {}) {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key is not configured');
      }

      const requestBody = {
        model: options.model || this.defaultModel,
        messages: messages,
        stream: true,
        ...this.defaultConfig,
        ...options
      };

      const response = await fetch(`${this.baseURL}${this.endpoints.CHAT_COMPLETIONS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...this.getCustomHeaders()
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';
                if (content) {
                  fullResponse += content;
                  onChunk(content, parsed);
                }
              } catch (e) {
                // Skip malformed JSON
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return fullResponse;
    } catch (error) {
      console.error('Error in streaming chat completion:', error);
      throw this.createServiceError(error);
    }
  }

  /**
   * Get available OpenAI models
   * @returns {Promise<Array>} List of available models
   */
  async getModels() {
    try {
      if (!this.apiKey) {
        throw new Error('OpenAI API key is not configured');
      }

      const response = await fetch(`${this.baseURL}${this.endpoints.MODELS}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          ...this.getCustomHeaders()
        }
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      throw this.createServiceError(error);
    }
  }

  /**
   * Validate message format
   * @param {Array} messages - Messages to validate
   */
  validateMessages(messages) {
    for (const message of messages) {
      if (!message.role || !message.content) {
        throw new Error('Each message must have both "role" and "content" properties');
      }
      
      if (!['system', 'user', 'assistant'].includes(message.role)) {
        throw new Error('Message role must be "system", "user", or "assistant"');
      }
      
      if (typeof message.content !== 'string') {
        throw new Error('Message content must be a string');
      }
    }
  }

  /**
   * Process OpenAI API response
   * @param {Object} data - Raw API response
   * @returns {Object} Processed response
   */
  processResponse(data) {
    return {
      ...data,
      timestamp: new Date().toISOString(),
      processed: true
    };
  }

  /**
   * Handle error responses from OpenAI API
   * @param {Response} response - Fetch response object
   */
  async handleErrorResponse(response) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = `OpenAI API Error: ${errorData.error.message || errorData.error.type}`;
        
        // Handle specific error types
        switch (errorData.error.type) {
          case 'invalid_api_key':
            errorMessage += ' - Please check your API key configuration';
            break;
          case 'insufficient_quota':
            errorMessage += ' - API quota exceeded';
            break;
          case 'rate_limit_exceeded':
            errorMessage += ' - Rate limit exceeded, please try again later';
            break;
        }
      }
    } catch (e) {
      // Use default error message if response body is not JSON
    }
    
    throw new Error(errorMessage);
  }

  /**
   * Create a standardized service error
   * @param {Error} originalError - Original error object
   * @returns {Error} Standardized error
   */
  createServiceError(originalError) {
    if (originalError.name === 'TypeError' && originalError.message.includes('fetch')) {
      return new Error('Network error: Unable to connect to OpenAI API. Please check your internet connection.');
    }
    
    return originalError;
  }

  /**
   * Get custom headers for requests
   * @returns {Object} Headers object
   */
  getCustomHeaders() {
    return {
      'User-Agent': 'AI-Cost-Optimizer/1.0',
    };
  }

  /**
   * Estimate token count (rough approximation)
   * @param {string} text - Text to estimate
   * @returns {number} Estimated token count
   */
  estimateTokens(text) {
    // Rough approximation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }

  /**
   * Calculate estimated cost for a request
   * @param {Array} messages - Messages array
   * @param {string} model - Model name
   * @returns {Object} Cost estimation
   */
  estimateCost(messages, model = this.defaultModel) {
    const inputText = messages.map(m => m.content).join(' ');
    const inputTokens = this.estimateTokens(inputText);
    
    // Pricing as of 2024 (per 1K tokens)
    const pricing = this.pricing[model] || this.pricing['gpt-3.5-turbo'];
    const inputCost = (inputTokens / 1000) * pricing.input;
    
    return {
      inputTokens,
      estimatedInputCost: inputCost,
      model,
      pricing: pricing
    };
  }

  /**
   * Create a helper for cost optimization queries
   * @param {string} query - User's cost optimization query
   * @param {Object} options - Optional configuration
   * @returns {Promise<string>} AI response focused on cost optimization
   */
  async getCostOptimizationAdvice(query, options = {}) {
    const systemPrompt = `You are an AI cost optimization expert. Help users optimize their AI infrastructure costs, model selection, and usage patterns. Provide specific, actionable recommendations with cost estimates when possible.`;
    
    return await this.sendWithSystemPrompt(systemPrompt, query, {
      ...options,
      temperature: 0.3 // Lower temperature for more consistent recommendations
    });
  }
}

// Create and export a singleton instance
const openaiService = new OpenAIService();
export default openaiService;

// Also export the class for advanced usage
export { OpenAIService }; 