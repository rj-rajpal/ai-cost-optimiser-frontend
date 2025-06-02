# Update Workload Parameters API

This document describes the `updateWorkloadParamsAPI` method in the ChatService, which calls the `POST /v1/chat/update-params` endpoint to get updated cost optimization recommendations based on modified workload parameters.

## Overview

The Update Workload Parameters API allows you to modify workload parameters and receive updated cost optimization recommendations without starting a new conversation. This is useful for scenarios where users want to:

- Adjust their workload scale (calls per day, token usage)
- Change performance requirements (latency SLA)
- Switch regions for compliance/performance reasons
- Add compliance constraints
- Compare costs with different parameters

## API Endpoint

```
POST /v1/chat/update-params
Content-Type: application/json
```

## Request Payload

```javascript
{
  "modified_workload": {
    "calls_per_day": 1000,
    "avg_input_tokens": 300,
    "avg_output_tokens": 150,
    "latency_sla_ms": 120000,
    "region": "US",
    "compliance_constraints": [],
    "current_model": ""
  },
  "original_data": {
    // Previous structured_data response
  }
}
```

### Modified Workload Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `calls_per_day` | number | Yes | Number of API calls per day |
| `avg_input_tokens` | number | Yes | Average input tokens per call |
| `avg_output_tokens` | number | Yes | Average output tokens per call |
| `latency_sla_ms` | number | Yes | Maximum acceptable latency in milliseconds |
| `region` | string | Yes | Geographic region ("US", "EU", "APAC") |
| `compliance_constraints` | Array<string> | No | Compliance requirements (e.g., ["GDPR", "SOC2"]) |
| `current_model` | string | No | Current model identifier |

### Original Data

The `original_data` field should contain the complete structured data response from a previous API call. This provides context for the optimization engine to calculate the impact of parameter changes.

## Usage

### Basic Usage

```javascript
import { chatService } from '../services';

// Define modified workload parameters
const modifiedWorkload = {
  calls_per_day: 2000,
  avg_input_tokens: 300,
  avg_output_tokens: 150,
  latency_sla_ms: 1000,
  region: "US"
};

// Call the API with original structured data
try {
  const updatedData = await chatService.updateWorkloadParamsAPI(
    modifiedWorkload, 
    originalStructuredData
  );
  
  console.log('Updated recommendations:', updatedData);
} catch (error) {
  console.error('Error updating parameters:', error);
}
```

### With Optional Parameters

```javascript
const modifiedWorkloadWithOptions = {
  calls_per_day: 1500,
  avg_input_tokens: 250,
  avg_output_tokens: 120,
  latency_sla_ms: 800,
  region: "EU",
  compliance_constraints: ["GDPR", "SOC2"],
  current_model: "gpt-3.5-turbo"
};

const updatedData = await chatService.updateWorkloadParamsAPI(
  modifiedWorkloadWithOptions, 
  originalStructuredData
);
```

### Parameter Validation

The service includes built-in validation. You can validate parameters before sending:

```javascript
// Validate parameters before making the API call
const validation = chatService.validateWorkloadParams(modifiedWorkload);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
  return;
}

// Parameters are valid, proceed with API call
const result = await chatService.updateWorkloadParamsAPI(
  modifiedWorkload,
  originalData
);
```

### Creating Default Parameters

Use the helper method to create a workload parameters object with defaults:

```javascript
// Create with all defaults
const defaultParams = chatService.createWorkloadParams();

// Create with some custom values
const customParams = chatService.createWorkloadParams({
  calls_per_day: 5000,
  region: "EU"
});
```

## Response Format

The API returns the same structure as the interactive chat API:

```javascript
{
  "structured_data": {
    "solution_architect": { ... },
    "workload_params": { ... },
    "cost_table": [ ... ],
    "ranked_models": [ ... ],
    "roi_analysis": { ... },
    "final_recommendation": { ... },
    "architecture": [ ... ], // Optional
    "timestamp": "2024-01-15T10:30:00.000Z",
    "processed": true
  }
}
```

The response will include updated:
- Cost calculations based on new parameters
- Model rankings optimized for new requirements
- ROI analysis comparing costs
- Architecture recommendations (if applicable)

## Error Handling

The method includes comprehensive error handling:

### Validation Errors
```javascript
// Missing required fields
Error: Missing required workload parameter: calls_per_day

// Invalid field types
Error: calls_per_day must be a non-negative number
```

### API Errors
```javascript
// Network or server errors
Error: Failed to update workload parameters: HTTP error! status: 500

// Invalid original data
Error: Original data is required and must be an object
```

### Example Error Handling
```javascript
try {
  const result = await chatService.updateWorkloadParamsAPI(
    modifiedWorkload,
    originalData
  );
  // Handle success
} catch (error) {
  if (error.message.includes('validation')) {
    // Handle validation errors
    console.error('Please check your parameters:', error);
  } else if (error.message.includes('HTTP error')) {
    // Handle API errors
    console.error('Server error:', error);
  } else {
    // Handle other errors
    console.error('Unexpected error:', error);
  }
}
```

## Integration Examples

### React Component Integration

```javascript
import React, { useState } from 'react';
import { chatService } from '../services';

const WorkloadUpdater = ({ originalData }) => {
  const [params, setParams] = useState(chatService.createWorkloadParams());
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updated = await chatService.updateWorkloadParamsAPI(
        params,
        originalData
      );
      setResult(updated);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Component JSX...
};
```

### Dashboard Integration

```javascript
// In a dashboard context where you have project data
const updateProjectWorkload = async (projectId, newParams) => {
  try {
    // Get current project data
    const project = projectService.getProject(projectId);
    const originalData = project.structured_data;

    // Update parameters
    const updatedData = await chatService.updateWorkloadParamsAPI(
      newParams,
      originalData
    );

    // Save updated data to project
    projectService.updateProject(projectId, {
      ...project,
      structured_data: updatedData.structured_data,
      last_updated: new Date().toISOString()
    });

    return updatedData;
  } catch (error) {
    console.error('Failed to update project workload:', error);
    throw error;
  }
};
```

## Best Practices

1. **Always validate parameters** before making API calls
2. **Handle errors gracefully** with appropriate user feedback
3. **Store original data** properly for subsequent updates
4. **Use default parameters** as starting points for user interfaces
5. **Debounce rapid parameter changes** to avoid excessive API calls
6. **Cache results** when appropriate to improve performance
7. **Provide loading states** for better user experience

## Testing

The service includes validation methods that can be used for testing:

```javascript
// Test parameter validation
const testParams = {
  calls_per_day: -1, // Invalid
  avg_input_tokens: 150,
  // Missing required fields
};

const validation = chatService.validateWorkloadParams(testParams);
console.log(validation.isValid); // false
console.log(validation.errors); // Array of error messages
``` 