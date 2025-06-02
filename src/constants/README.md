# Constants Organization

This directory contains all constants used across the AI Cost Optimizer application, organized by type for easy maintenance and consistent usage.

## 📁 File Structure

```
src/constants/
├── index.js         # Main export file with helper functions
├── text.js          # Text strings and labels
├── styles.js        # CSS classes and style constants
├── data.js          # Mock data and structured objects  
├── config.js        # Configuration and environment values
└── README.md        # This documentation
```

## 📋 Usage

### **Importing Constants**

```jsx
// Import everything from main index
import { MESSAGES, BUTTONS, PROJECT_DATA } from '../constants';

// Import specific category 
import { HEADER, SIDEBAR } from '../constants/styles';

// Import from specific file
import { API_CONFIG } from '../constants/config';
```

### **Helper Functions**

```jsx
import { getRoute, formatFileSize, getStatusConfig } from '../constants';

// Dynamic routes
const projectRoute = getRoute('PROJECT_DETAIL', { projectId: 'my-project' });

// File size formatting
const size = formatFileSize(1024); // "1 KB"

// Status configuration
const status = getStatusConfig('completed'); // Returns status object
```

## 📂 File Details

### **text.js** - Text Constants
All user-facing strings, labels, and messages.

```jsx
export const MESSAGES = {
  CHAT_INITIAL: "Describe your project...",
  LOADING_PROJECT: "Loading project...",
  // ...
};

export const NAVIGATION = {
  PROJECTS: "Projects",
  DASHBOARD: "Dashboard",
  // ...
};
```

**Categories:**
- `MESSAGES` - System messages and notifications
- `NAVIGATION` - Menu labels and navigation text
- `FORMS` - Form labels and placeholders
- `BUTTONS` - Button text (renamed as `BUTTON_TEXT` in index)
- `STATUS` - Status labels and states
- `APP_INFO` - Application information
- `ARIA_LABELS` - Accessibility labels
- `TIME_PERIODS` - Time-related text
- `INDUSTRIES` - Industry options
- `AI_PROVIDERS` - AI provider names
- `COMPLEXITY_LEVELS` - Complexity level options

### **styles.js** - Style Constants
CSS class combinations and style-related constants.

```jsx
export const HEADER = {
  MAIN: "bg-white/90 backdrop-blur-sm border-b...",
  CONTENT: "px-4 sm:px-6 lg:px-8",
  // ...
};

export const BUTTONS = {
  PRIMARY: "bg-muted-indigo hover:bg-muted-indigo/90...",
  SECONDARY: "bg-white border border-sky-gray...",
  // ...
};
```

**Categories:**
- `LAYOUT` - Common layout styles
- `HEADER` - Header component styles
- `BUTTONS` - Button style variations
- `UI` - User interface elements
- `FORMS` - Form styling (renamed as `FORM_STYLES` in index)
- `TEXT` - Typography classes
- `CARDS` - Card and container styles
- `CHAT` - Chat interface styles
- `SIDEBAR` - Sidebar component styles
- `NAVIGATION` - Navigation styling (renamed as `NAV_STYLES` in index)
- `LOADING` - Loading state styles
- `UTILS` - Utility classes

### **data.js** - Data Constants
Mock data, structured objects, and configuration arrays.

```jsx
export const PROJECT_DATA = {
  'rua-almadinah': {
    id: 'rua-almadinah',
    title: 'RUA AL MADINAH',
    // ...
  }
};

export const PROJECT_TABS = [
  { name: 'Dashboard', path: 'dashboard' },
  // ...
];
```

**Categories:**
- `PROJECT_DATA` - Project information
- `PROJECT_TABS` - Navigation tabs
- `CHAT_HISTORY` - Mock chat data
- `DASHBOARD_METRICS` - Dashboard data
- `CHART_DATA` - Chart datasets
- `ROI_PROVIDERS` - ROI calculator data
- `FILTER_OPTIONS` - Filter configurations
- `UPLOAD_REQUIREMENTS` - File upload rules
- `NAVIGATION_ITEMS` - Main navigation
- `SELECT_OPTIONS` - Form select options

### **config.js** - Configuration Constants
Environment variables, API settings, and application configuration.

```jsx
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000,
  // ...
};

export const APP_CONFIG = {
  NAME: "AI Cost Optimizer",
  VERSION: "0.1.0",
  // ...
};
```

**Categories:**
- `API_CONFIG` - API settings
- `HTTP_STATUS` - HTTP status codes
- `APP_CONFIG` - Application settings
- `ROUTES` - Route definitions
- `STORAGE_KEYS` - Local storage keys
- `UI_CONFIG` - UI configuration
- `THEME_CONFIG` - Theme settings
- `VALIDATION` - Validation rules
- `UPLOAD_CONFIG` - File upload settings
- `ANIMATIONS` - Animation settings
- `CHAT_CONFIG` - Chat configuration
- `ERROR_CONFIG` - Error messages
- `FEATURE_FLAGS` - Feature toggles
- `DEFAULTS` - Default values

## 🎯 Benefits

### **Maintainability**
- ✅ Single source of truth for all constants
- ✅ Easy to update text/styles across the entire app
- ✅ Consistent naming conventions
- ✅ Clear organization by category

### **Developer Experience**
- ✅ Autocomplete support for all constants
- ✅ Easy discovery of available options
- ✅ Reduced typos and inconsistencies
- ✅ Better code reusability

### **Performance**
- ✅ Constants are extracted and not recreated on each render
- ✅ Efficient imports with tree shaking
- ✅ Memoization-friendly structure

### **Accessibility**
- ✅ Centralized ARIA labels
- ✅ Consistent accessibility attributes
- ✅ Easy to audit and update a11y features

## 🔄 Migration Benefits

### **Before Centralization:**
- Constants scattered across 20+ components
- Duplicate CSS classes and text strings
- Inconsistent naming and styling
- Hard to maintain and update globally
- No single source of truth

### **After Centralization:**
- ✅ All constants in organized `/constants` directory
- ✅ 4 categorized files for easy navigation
- ✅ Helper functions for common operations
- ✅ Single import for all constants
- ✅ Easy global updates and consistency

## 📝 Best Practices

### **Adding New Constants**

1. **Choose the Right File:**
   - Text strings → `text.js`
   - CSS classes → `styles.js`
   - Data objects → `data.js`
   - Config values → `config.js`

2. **Follow Naming Conventions:**
   - Use `SCREAMING_SNAKE_CASE` for constants
   - Group related constants in objects
   - Use descriptive names

3. **Update Index File:**
   - Export new constants from `index.js`
   - Add helper functions if needed
   - Update documentation

### **Using Constants in Components**

```jsx
// ✅ Good - Import from main index
import { MESSAGES, HEADER, PROJECT_DATA } from '../../constants';

// ✅ Good - Destructure what you need
const { CHAT_INITIAL, LOADING_PROJECT } = MESSAGES;

// ❌ Avoid - Importing from specific files in components
import { MESSAGES } from '../../constants/text';

// ❌ Avoid - Magic strings
const title = "Loading project..."; // Use MESSAGES.LOADING_PROJECT instead
```

### **Updating Constants**

1. **Text Changes:** Update in `text.js` only
2. **Style Changes:** Update in `styles.js` only  
3. **New Features:** Add to appropriate file and export from `index.js`
4. **Breaking Changes:** Update all usages across the codebase

## 🚀 Future Enhancements

1. **Internationalization (i18n):**
   - Convert text constants to i18n keys
   - Support multiple languages
   - Dynamic text loading

2. **Theme Support:**
   - Multiple theme configurations
   - Dynamic style switching
   - User preferences

3. **Type Safety:**
   - TypeScript interfaces for constants
   - Compile-time validation
   - Better IDE support

4. **Environment Configurations:**
   - Development/staging/production configs
   - Feature flag management
   - A/B testing support

The centralized constants system provides a solid foundation for maintaining consistency, improving developer experience, and scaling the application efficiently. 