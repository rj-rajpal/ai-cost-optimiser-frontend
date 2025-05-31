# API Utility Usage Guide

This guide provides comprehensive examples of how to use the central API utility in your React application.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Environment Configuration](#environment-configuration)
3. [Basic HTTP Methods](#basic-http-methods)
4. [Authentication](#authentication)
5. [File Operations](#file-operations)
6. [Error Handling](#error-handling)
7. [Advanced Features](#advanced-features)
8. [Custom Hooks](#custom-hooks)
9. [Best Practices](#best-practices)

## Basic Setup

First, import the API utility in your components:

```javascript
import api, { apiUtils, apiConfig, APIError, NetworkError } from '../lib/api';
```

## Environment Configuration

Add these environment variables to your `.env.local` file:

```bash
# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com/api
```

Configure the API on app startup (in your main App.jsx or index.js):

```javascript
import { apiConfig } from './lib/api';

// Configure API settings
apiConfig.setBaseURL('https://your-api-domain.com/api');
apiConfig.setTimeout(30000); // 30 seconds
apiConfig.setRetryConfig(3, 1000); // 3 attempts, 1 second delay
```

## Basic HTTP Methods

### GET Requests

```javascript
// Simple GET request
const fetchUsers = async () => {
  try {
    const users = await api.get('/users');
    console.log('Users:', users);
  } catch (error) {
    console.error('Failed to fetch users:', apiUtils.getErrorMessage(error));
  }
};

// GET with query parameters
const fetchUsersPaginated = async (page = 1, limit = 10) => {
  try {
    const users = await api.get(`/users?page=${page}&limit=${limit}`);
    return users;
  } catch (error) {
    throw error;
  }
};

// GET with custom headers
const fetchProtectedData = async () => {
  try {
    const data = await api.get('/protected-data', {
      headers: {
        'X-Custom-Header': 'custom-value'
      }
    });
    return data;
  } catch (error) {
    if (apiUtils.isUnauthorized(error)) {
      // Handle unauthorized access
      console.log('User needs to login');
    }
    throw error;
  }
};
```

### POST Requests

```javascript
// Create new user
const createUser = async (userData) => {
  try {
    const newUser = await api.post('/users', userData);
    console.log('User created:', newUser);
    return newUser;
  } catch (error) {
    if (apiUtils.isAPIError(error) && error.status === 409) {
      throw new Error('User already exists');
    }
    throw error;
  }
};

// POST with custom headers
const submitForm = async (formData) => {
  try {
    const result = await api.post('/submit-form', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return result;
  } catch (error) {
    console.error('Form submission failed:', error);
    throw error;
  }
};
```

### PUT and PATCH Requests

```javascript
// Update entire user (PUT)
const updateUser = async (userId, userData) => {
  try {
    const updatedUser = await api.put(`/users/${userId}`, userData);
    return updatedUser;
  } catch (error) {
    if (apiUtils.isNotFound(error)) {
      throw new Error('User not found');
    }
    throw error;
  }
};

// Partial update (PATCH)
const updateUserPartial = async (userId, partialData) => {
  try {
    const updatedUser = await api.patch(`/users/${userId}`, partialData);
    return updatedUser;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
};
```

### DELETE Requests

```javascript
// Delete user
const deleteUser = async (userId) => {
  try {
    await api.delete(`/users/${userId}`);
    console.log('User deleted successfully');
  } catch (error) {
    if (apiUtils.isNotFound(error)) {
      console.log('User was already deleted');
      return; // Consider this a success
    }
    throw error;
  }
};
```

## Authentication

The API utility automatically handles authentication tokens from Supabase:

```javascript
// Authentication is automatic - no need to manually add tokens
const fetchUserProfile = async () => {
  try {
    // Token is automatically added to Authorization header
    const profile = await api.get('/user/profile');
    return profile;
  } catch (error) {
    if (apiUtils.isUnauthorized(error)) {
      // Token might be expired, redirect to login
      window.location.href = '/login';
    }
    throw error;
  }
};

// Skip authentication for public endpoints
const fetchPublicData = async () => {
  try {
    const data = await api.get('/public/stats', {
      skipAuth: true
    });
    return data;
  } catch (error) {
    console.error('Failed to fetch public data:', error);
    throw error;
  }
};
```

## File Operations

### File Upload

```javascript
// Single file upload
const uploadFile = async (file) => {
  try {
    const result = await api.upload('/upload', file, {
      description: 'Process data file',
      category: 'analytics'
    });
    console.log('File uploaded:', result);
    return result;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};

// Multiple file upload
const uploadMultipleFiles = async (files) => {
  try {
    const result = await api.upload('/upload/batch', files, {
      batchId: Date.now(),
      processAfterUpload: true
    });
    return result;
  } catch (error) {
    console.error('Batch upload failed:', error);
    throw error;
  }
};

// Upload with progress tracking
const uploadWithProgress = async (file, onProgress) => {
  try {
    const result = await api.upload('/upload', file, {}, {
      onUploadProgress: onProgress
    });
    return result;
  } catch (error) {
    console.error('Upload with progress failed:', error);
    throw error;
  }
};
```

### File Download

```javascript
// Download file
const downloadReport = async (reportId) => {
  try {
    await api.download(`/reports/${reportId}/download`, `report_${reportId}.pdf`);
    console.log('Download started');
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

// Download with custom filename
const downloadCustom = async (fileId, customName) => {
  try {
    const result = await api.download(`/files/${fileId}`, customName);
    return result;
  } catch (error) {
    console.error('Custom download failed:', error);
    throw error;
  }
};
```

## Error Handling

### Comprehensive Error Handling

```javascript
const fetchDataWithErrorHandling = async () => {
  try {
    const data = await api.get('/sensitive-data');
    return data;
  } catch (error) {
    // Check specific error types
    if (apiUtils.isNetworkError(error)) {
      console.error('Network issue:', error.message);
      // Show offline message or retry button
      return null;
    }
    
    if (apiUtils.isTimeoutError(error)) {
      console.error('Request timed out:', error.message);
      // Show timeout message and retry option
      return null;
    }
    
    if (apiUtils.isAPIError(error)) {
      switch (error.status) {
        case 401:
          console.error('Unauthorized - redirecting to login');
          // Redirect to login
          break;
        case 403:
          console.error('Forbidden - insufficient permissions');
          // Show permission denied message
          break;
        case 404:
          console.error('Data not found');
          // Show not found message
          break;
        case 422:
          console.error('Validation error:', error.data);
          // Show validation errors to user
          break;
        case 500:
          console.error('Server error:', error.message);
          // Show generic error message
          break;
        default:
          console.error('API error:', error.message);
      }
    }
    
    throw error;
  }
};
```

### Error Boundary Integration

```javascript
// In your error boundary or error handling component
const handleGlobalError = (error) => {
  const errorMessage = apiUtils.getErrorMessage(error);
  
  if (apiUtils.isNetworkError(error)) {
    showNotification('Network Error', errorMessage, 'error');
  } else if (apiUtils.isServerError(error)) {
    showNotification('Server Error', 'Something went wrong on our end. Please try again.', 'error');
  } else if (apiUtils.isClientError(error)) {
    showNotification('Request Error', errorMessage, 'warning');
  } else {
    showNotification('Error', errorMessage, 'error');
  }
};
```

## Advanced Features

### Request Cancellation

```javascript
// Create cancel token
const cancelToken = apiUtils.createCancelToken();

// Make request with cancellation support
const fetchCancellableData = async () => {
  try {
    const data = await api.get('/long-running-request', {
      signal: cancelToken.token
    });
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request was cancelled');
      return null;
    }
    throw error;
  }
};

// Cancel the request
const cancelRequest = () => {
  cancelToken.cancel('User cancelled the request');
};

// Usage in React component
useEffect(() => {
  const cancelToken = apiUtils.createCancelToken();
  
  const fetchData = async () => {
    try {
      const data = await api.get('/data', {
        signal: cancelToken.token
      });
      setData(data);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Fetch failed:', error);
      }
    }
  };
  
  fetchData();
  
  // Cleanup: cancel request if component unmounts
  return () => {
    cancelToken.cancel('Component unmounted');
  };
}, []);
```

### Request Interceptors

```javascript
import { interceptors } from '../lib/api';

// Add request interceptor
interceptors.request.use((config) => {
  console.log('Making request:', config);
  // Modify request config if needed
  return config;
});

// Add response interceptor
interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  (error) => {
    console.log('Response error:', error);
    // Global error handling
    if (apiUtils.isUnauthorized(error)) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Custom Hooks

### useAPI Hook

```javascript
import { useState, useEffect } from 'react';
import api, { apiUtils } from '../lib/api';

const useAPI = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await api.get(endpoint, options);
        setData(result);
      } catch (err) {
        setError(err);
        console.error('API Hook Error:', apiUtils.getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

// Usage
const UserProfile = () => {
  const { data: user, loading, error } = useAPI('/user/profile');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {apiUtils.getErrorMessage(error)}</div>;
  if (!user) return <div>No user data</div>;

  return <div>Welcome, {user.name}!</div>;
};
```

### useMutation Hook

```javascript
const useMutation = (mutationFn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, data };
};

// Usage
const CreateUserForm = () => {
  const { mutate: createUser, loading, error } = useMutation(
    (userData) => api.post('/users', userData)
  );

  const handleSubmit = async (formData) => {
    try {
      await createUser(formData);
      // Handle success
    } catch (err) {
      // Error is already set in the hook
      console.error('Failed to create user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      {error && <div>Error: {apiUtils.getErrorMessage(error)}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};
```

## Best Practices

### 1. Environment-based Configuration

```javascript
// In your main app initialization
const configureAPI = () => {
  const isDevelopment = import.meta.env.MODE === 'development';
  const isProduction = import.meta.env.MODE === 'production';

  if (isDevelopment) {
    apiConfig.setTimeout(60000); // Longer timeout in dev
    apiConfig.setRetryConfig(1, 500); // Less aggressive retries
  } else if (isProduction) {
    apiConfig.setTimeout(30000);
    apiConfig.setRetryConfig(3, 1000);
  }
};
```

### 2. Centralized Error Handling

```javascript
// Create a global error handler
export const createGlobalErrorHandler = (showNotification) => {
  return (error, context = '') => {
    const message = apiUtils.getErrorMessage(error);
    
    if (apiUtils.isNetworkError(error)) {
      showNotification('Connection Error', 'Please check your internet connection', 'error');
    } else if (apiUtils.isUnauthorized(error)) {
      showNotification('Session Expired', 'Please log in again', 'warning');
      // Redirect to login
    } else if (apiUtils.isServerError(error)) {
      showNotification('Server Error', 'Something went wrong. Please try again later.', 'error');
    } else {
      showNotification('Error', message, 'error');
    }
    
    // Log to monitoring service
    console.error(`API Error [${context}]:`, error);
  };
};
```

### 3. Consistent Data Fetching Pattern

```javascript
// Create consistent API service functions
export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.patch('/user/profile', data),
  changePassword: (data) => api.post('/user/change-password', data),
  deleteAccount: () => api.delete('/user/account'),
};

export const processService = {
  getAll: (filters = {}) => api.get('/processes', { params: filters }),
  getById: (id) => api.get(`/processes/${id}`),
  create: (data) => api.post('/processes', data),
  update: (id, data) => api.patch(`/processes/${id}`, data),
  delete: (id) => api.delete(`/processes/${id}`),
  analyze: (id) => api.post(`/processes/${id}/analyze`),
};
```

### 4. Loading States Management

```javascript
// Create a loading context for global loading states
const LoadingContext = createContext();

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within LoadingProvider');
  }
  return context;
};

// Usage in API calls
const fetchWithGlobalLoading = async (endpoint, showGlobalLoading = false) => {
  const { setGlobalLoading } = useGlobalLoading();
  
  if (showGlobalLoading) {
    setGlobalLoading(true);
  }
  
  try {
    const data = await api.get(endpoint);
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  } finally {
    if (showGlobalLoading) {
      setGlobalLoading(false);
    }
  }
};
```

This API utility provides a robust, production-ready solution for handling HTTP requests in your React application with proper error handling, authentication, and best practices built-in. 