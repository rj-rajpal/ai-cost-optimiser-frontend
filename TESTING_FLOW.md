# Testing Flow Documentation

## Complete User Flow Testing

This document outlines the complete user flow from login to dashboard creation and the testing procedures.

## Flow Overview

1. **User Login** → User authenticates and lands on Projects page
2. **Create New Project** → User clicks "Create new" card → Navigate to OnboardingWizard
3. **Welcome Message** → User sees welcome message: "Describe your project in detail and I'll help you optimize it."
4. **User Input** → User pastes: "We process 500 support emails daily, need AI to tag priority and draft replies"
5. **API Call** → System calls `chatService.sendInteractiveMessage()`
6. **Response Processing** → Two scenarios:

### Scenario A: Success (structured_data has value)
- Show: "Please wait while we generate the Dashboard for you"
- Process data through `transform.js`
- Create new project via `projectService.processStructuredDataToProject()`
- Save project locally via `projectService.saveProject()`
- Show success message with project name
- Navigate to `/project/{projectId}/dashboard`
- Render dashboard with processed data

### Scenario B: Error (structured_data is null)
- Show: "Sorry, we are not able to process your workflow right now. Please try this in some time."
- No project creation
- User stays in chat interface

## Testing Components

### 1. OnboardingWizard (`/src/pages/onboarding-wizard/index.jsx`)
- ✅ Navigation from projects page
- ✅ Welcome message display
- ✅ Chat interface functionality
- ✅ API response handling
- ✅ Error handling for null structured_data
- ✅ Project creation flow
- ✅ Dashboard navigation

### 2. ChatService (`/src/services/chatService.js`)
- ✅ API call handling
- ✅ Response processing
- ✅ null structured_data handling
- ✅ Error handling

### 3. ProjectService (`/src/services/projectService.js`)
- ✅ Data transformation from structured_data
- ✅ Project creation and ID generation
- ✅ Local storage persistence
- ✅ Dashboard data preparation

### 4. Transform Utility (`/src/lib/transform.js`)
- ✅ Data processing for dashboard KPIs
- ✅ Chart data generation
- ✅ ROI calculation

### 5. Dashboard (`/src/pages/dashboard/index.jsx`)
- ✅ Project data loading
- ✅ KPI display with real data
- ✅ Chart rendering with processed data
- ✅ ROI opportunities display

## Development Testing Tools

In development mode, the OnboardingWizard includes test buttons:

### 🧪 Test Dashboard
- Uses mock data to create a complete project
- Tests the full project creation and navigation flow

### ✅ Test Success Flow
- Simulates successful API response with structured_data
- Tests the complete success flow:
  1. User message
  2. "Please wait..." message
  3. Data processing
  4. Project creation
  5. Dashboard navigation

### ❌ Test Error Flow
- Simulates API response with structured_data: null
- Tests error handling:
  1. User message
  2. Error message display
  3. No project creation

## Test Scenarios

### Manual Testing
1. Start development server: `npm run start`
2. Navigate to `/projects`
3. Click "Create new" card
4. Verify navigation to `/onboarding-wizard`
5. Verify welcome message appears
6. Use test buttons to validate flows

### Test Input
Use this exact text for testing:
```
We process 500 support emails daily, need AI to tag priority and draft replies
```

### Expected Behaviors

#### Success Flow:
1. User types message → Loading indicator appears
2. "Please wait while we generate the Dashboard for you" message
3. After 2 seconds → Success message with project name
4. After 2 more seconds → Navigation to project dashboard
5. Dashboard loads with processed data from structured_data

#### Error Flow:
1. User types message → Loading indicator appears
2. "Sorry, we are not able to process your workflow right now..." message
3. User remains in chat interface
4. No project created
5. No navigation occurs

## Data Flow

```
User Input
    ↓
chatService.sendInteractiveMessage()
    ↓
API Response
    ↓
if structured_data exists:
    ↓
transform(structured_data)
    ↓
projectService.processStructuredDataToProject()
    ↓
projectService.saveProject()
    ↓
navigate('/project/{id}/dashboard')
    ↓
Dashboard loads with processed data

if structured_data is null:
    ↓
Show error message
    ↓
Stay in chat interface
```

## Key Files Modified

- `/src/pages/onboarding-wizard/index.jsx` - Main flow logic
- `/src/pages/dashboard/index.jsx` - Dashboard with Cloud Mist theme
- `/src/pages/dashboard/components/KPI.jsx` - Themed KPI component
- `/src/pages/dashboard/components/SpendVsTokensChart.jsx` - Themed chart component
- `/src/services/chatService.js` - API handling
- `/src/services/projectService.js` - Project management

## Success Criteria

- ✅ Smooth navigation from projects to onboarding wizard
- ✅ Clear welcome message display
- ✅ Proper API integration with loading states
- ✅ Correct handling of both success and error scenarios
- ✅ Automatic project creation and persistence
- ✅ Dashboard navigation with real data display
- ✅ Consistent Cloud Mist theme throughout
- ✅ Error messaging for unsupported workflows

The complete flow has been tested and verified to work correctly with both mock data and simulated API responses. 