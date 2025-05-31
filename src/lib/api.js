import { supabase } from './supabase';

/**
 * API Configuration
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

/**
 * HTTP Status Codes
 */
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

/**
 * Custom API Error class
 */
class APIError extends Error {
  constructor(message, status, statusText, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Network Error class
 */
class NetworkError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'NetworkError';
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Timeout Error class
 */
class TimeoutError extends Error {
  constructor(message, timeout) {
    super(message);
    this.name = 'TimeoutError';
    this.timeout = timeout;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Get authentication token from Supabase
 */
async function getAuthToken() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  } catch (error) {
    console.warn('Failed to get auth token:', error);
    return null;
  }
}

/**
 * Build request headers
 */
async function buildHeaders(customHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...customHeaders,
  };

  // Add authentication token if available
  const token = await getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Build full URL
 */
function buildURL(endpoint) {
  // Handle absolute URLs
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }

  // Handle relative URLs
  const baseURL = API_CONFIG.baseURL.endsWith('/') 
    ? API_CONFIG.baseURL.slice(0, -1) 
    : API_CONFIG.baseURL;
  
  const cleanEndpoint = endpoint.startsWith('/') 
    ? endpoint 
    : `/${endpoint}`;

  return `${baseURL}${cleanEndpoint}`;
}

/**
 * Create timeout promise
 */
function createTimeoutPromise(timeout) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new TimeoutError(`Request timed out after ${timeout}ms`, timeout));
    }, timeout);
  });
}

/**
 * Sleep utility for retry delay
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Parse response based on content type
 */
async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    return await response.json();
  } else if (contentType.includes('text/')) {
    return await response.text();
  } else if (contentType.includes('application/octet-stream') || contentType.includes('application/pdf')) {
    return await response.blob();
  } else {
    // Try to parse as JSON first, fallback to text
    try {
      return await response.json();
    } catch {
      return await response.text();
    }
  }
}

/**
 * Handle API response
 */
async function handleResponse(response) {
  if (response.ok) {
    // Handle 204 No Content
    if (response.status === HTTP_STATUS.NO_CONTENT) {
      return null;
    }
    return await parseResponse(response);
  }

  // Handle error responses
  let errorData = null;
  try {
    errorData = await parseResponse(response);
  } catch (parseError) {
    console.warn('Failed to parse error response:', parseError);
  }

  const errorMessage = errorData?.message || 
                      errorData?.error || 
                      response.statusText || 
                      `HTTP ${response.status} Error`;

  throw new APIError(errorMessage, response.status, response.statusText, errorData);
}

/**
 * Make HTTP request with retry logic
 */
async function makeRequest(url, options, retryCount = 0) {
  try {
    const controller = new AbortController();
    const timeoutPromise = createTimeoutPromise(API_CONFIG.timeout);
    
    // Combine timeout with abort signal
    const fetchPromise = fetch(url, {
      ...options,
      signal: controller.signal,
    });

    // Race between fetch and timeout
    const response = await Promise.race([
      fetchPromise,
      timeoutPromise.then(() => {
        controller.abort();
        throw new TimeoutError(`Request timed out after ${API_CONFIG.timeout}ms`, API_CONFIG.timeout);
      })
    ]);

    return await handleResponse(response);
  } catch (error) {
    // Handle network errors and retry logic
    if (error instanceof APIError) {
      // Don't retry client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
    }

    // Retry on network errors, timeouts, and server errors (5xx)
    if (retryCount < API_CONFIG.retryAttempts) {
      const shouldRetry = error instanceof NetworkError || 
                         error instanceof TimeoutError ||
                         (error instanceof APIError && error.status >= 500);

      if (shouldRetry) {
        console.warn(`Request failed, retrying... (${retryCount + 1}/${API_CONFIG.retryAttempts})`, error.message);
        await sleep(API_CONFIG.retryDelay * (retryCount + 1)); // Exponential backoff
        return makeRequest(url, options, retryCount + 1);
      }
    }

    // Convert fetch errors to NetworkError
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new NetworkError('Network connection failed', error);
    }

    throw error;
  }
}

/**
 * Core API request function
 */
async function apiRequest(endpoint, options = {}) {
  const {
    method = 'GET',
    body = null,
    headers = {},
    timeout = API_CONFIG.timeout,
    skipAuth = false,
    ...otherOptions
  } = options;

  try {
    const url = buildURL(endpoint);
    const requestHeaders = skipAuth ? { ...headers } : await buildHeaders(headers);

    // Prepare request body
    let requestBody = body;
    if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob)) {
      requestBody = JSON.stringify(body);
    }

    // Handle FormData - remove Content-Type to let browser set it with boundary
    if (body instanceof FormData) {
      delete requestHeaders['Content-Type'];
    }

    const requestOptions = {
      method: method.toUpperCase(),
      headers: requestHeaders,
      body: requestBody,
      ...otherOptions,
    };

    return await makeRequest(url, requestOptions);
  } catch (error) {
    console.error(`API Request failed [${method.toUpperCase()} ${endpoint}]:`, error);
    throw error;
  }
}

/**
 * HTTP Methods
 */
export const api = {
  /**
   * GET request
   */
  get: (endpoint, options = {}) => {
    return apiRequest(endpoint, { ...options, method: 'GET' });
  },

  /**
   * POST request
   */
  post: (endpoint, body = null, options = {}) => {
    return apiRequest(endpoint, { ...options, method: 'POST', body });
  },

  /**
   * PUT request
   */
  put: (endpoint, body = null, options = {}) => {
    return apiRequest(endpoint, { ...options, method: 'PUT', body });
  },

  /**
   * PATCH request
   */
  patch: (endpoint, body = null, options = {}) => {
    return apiRequest(endpoint, { ...options, method: 'PATCH', body });
  },

  /**
   * DELETE request
   */
  delete: (endpoint, options = {}) => {
    return apiRequest(endpoint, { ...options, method: 'DELETE' });
  },

  /**
   * Upload file(s)
   */
  upload: (endpoint, files, additionalData = {}, options = {}) => {
    const formData = new FormData();
    
    // Handle single file or multiple files
    if (files instanceof FileList || Array.isArray(files)) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    } else if (files instanceof File) {
      formData.append('file', files);
    } else {
      throw new Error('Invalid file parameter. Expected File, FileList, or Array of Files.');
    }

    // Add additional form data
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
    });

    return apiRequest(endpoint, { 
      ...options, 
      method: 'POST', 
      body: formData 
    });
  },

  /**
   * Download file
   */
  download: async (endpoint, filename = null, options = {}) => {
    try {
      const response = await apiRequest(endpoint, { 
        ...options, 
        method: 'GET',
        headers: {
          ...options.headers,
          'Accept': 'application/octet-stream, application/pdf, */*'
        }
      });

      // Handle blob response for file downloads
      if (response instanceof Blob) {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { success: true, filename };
      }

      return response;
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  },
};

/**
 * Request interceptors
 */
export const interceptors = {
  request: {
    use: (callback) => {
      // Store callback for request interception
      interceptors.request._callback = callback;
    },
    _callback: null,
  },
  
  response: {
    use: (successCallback, errorCallback) => {
      interceptors.response._successCallback = successCallback;
      interceptors.response._errorCallback = errorCallback;
    },
    _successCallback: null,
    _errorCallback: null,
  },
};

/**
 * Utility functions
 */
export const apiUtils = {
  /**
   * Check if error is an API error
   */
  isAPIError: (error) => error instanceof APIError,

  /**
   * Check if error is a network error
   */
  isNetworkError: (error) => error instanceof NetworkError,

  /**
   * Check if error is a timeout error
   */
  isTimeoutError: (error) => error instanceof TimeoutError,

  /**
   * Check if error is a client error (4xx)
   */
  isClientError: (error) => error instanceof APIError && error.status >= 400 && error.status < 500,

  /**
   * Check if error is a server error (5xx)
   */
  isServerError: (error) => error instanceof APIError && error.status >= 500,

  /**
   * Check if error is unauthorized
   */
  isUnauthorized: (error) => error instanceof APIError && error.status === HTTP_STATUS.UNAUTHORIZED,

  /**
   * Check if error is forbidden
   */
  isForbidden: (error) => error instanceof APIError && error.status === HTTP_STATUS.FORBIDDEN,

  /**
   * Check if error is not found
   */
  isNotFound: (error) => error instanceof APIError && error.status === HTTP_STATUS.NOT_FOUND,

  /**
   * Get error message from any error type
   */
  getErrorMessage: (error) => {
    if (error instanceof APIError) {
      return error.message;
    }
    if (error instanceof NetworkError) {
      return 'Network connection failed. Please check your internet connection.';
    }
    if (error instanceof TimeoutError) {
      return 'Request timed out. Please try again.';
    }
    return error.message || 'An unexpected error occurred.';
  },

  /**
   * Create abort controller for request cancellation
   */
  createCancelToken: () => {
    const controller = new AbortController();
    return {
      token: controller.signal,
      cancel: (reason = 'Request cancelled') => {
        controller.abort(reason);
      },
    };
  },
};

/**
 * Configuration utilities
 */
export const apiConfig = {
  /**
   * Set base URL
   */
  setBaseURL: (url) => {
    API_CONFIG.baseURL = url;
  },

  /**
   * Set timeout
   */
  setTimeout: (timeout) => {
    API_CONFIG.timeout = timeout;
  },

  /**
   * Set retry configuration
   */
  setRetryConfig: (attempts, delay) => {
    API_CONFIG.retryAttempts = attempts;
    API_CONFIG.retryDelay = delay;
  },

  /**
   * Get current configuration
   */
  getConfig: () => ({ ...API_CONFIG }),
};

/**
 * Export error classes for custom error handling
 */
export { APIError, NetworkError, TimeoutError, HTTP_STATUS };

/**
 * Default export
 */
export default api; 