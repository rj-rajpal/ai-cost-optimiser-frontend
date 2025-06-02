// Data Constants
// Centralized location for all structured data, mock data, and configuration objects

// Static Project Data (for demo/fallback)
export const STATIC_PROJECT_DATA = {
  'rua-almadinah': {
    id: 'rua-almadinah',
    title: 'RUA AL MADINAH',
    phase: 'CMP',
    progress: 75
  },
  'rua-al-haram': {
    id: 'rua-al-haram',
    title: 'RUA AL HARAM',
    phase: 'DEV',
    progress: 45
  },
  'trojena': {
    id: 'trojena',
    title: 'TROJENA',
    phase: 'DES',
    progress: 30
  }
};

// Function to get all projects (static + locally saved)
export const getAllProjects = () => {
  // Import projectService dynamically to avoid circular imports
  let localProjects = {};
  try {
    const projectServiceData = localStorage.getItem('ai_cost_projects');
    localProjects = projectServiceData ? JSON.parse(projectServiceData) : {};
  } catch (error) {
    console.error('Error loading local projects:', error);
  }
  
  return {
    ...STATIC_PROJECT_DATA,
    ...localProjects
  };
};

// Legacy export for backward compatibility
export const PROJECT_DATA = STATIC_PROJECT_DATA;

// Navigation Tabs
export const PROJECT_TABS = [
  { name: 'AI Workflow', path: 'ai-workflow' },
  { name: 'Model Wars', path: 'dashboard' },
  { name: 'ROI Calculator', path: 'roi-calculator' }
];

// Chat History (Mock Data)
export const CHAT_HISTORY = [
  { id: 1, title: "Cost optimization for AWS", date: "Today" },
  { id: 2, title: "Azure spending analysis", date: "Yesterday" },
  { id: 3, title: "Multi-cloud strategy discussion", date: "2 days ago" },
  { id: 4, title: "Database optimization review", date: "1 week ago" },
];

// Dashboard Metrics
export const DASHBOARD_METRICS = [
  {
    title: "Total Monthly Spend",
    value: "$24,567",
    change: "+12.5%",
    trend: "up",
    color: "text-green-600"
  },
  {
    title: "Cost per Query",
    value: "$0.023",
    change: "-8.2%", 
    trend: "down",
    color: "text-red-600"
  },
  {
    title: "Monthly Queries",
    value: "1.2M",
    change: "+15.3%",
    trend: "up", 
    color: "text-green-600"
  },
  {
    title: "Active Models",
    value: "12",
    change: "+2",
    trend: "up",
    color: "text-blue-600"
  }
];

// Chart Data
export const CHART_DATA = [
  { month: 'Jan', spend: 18500, queries: 850000 },
  { month: 'Feb', spend: 19200, queries: 920000 },
  { month: 'Mar', spend: 20100, queries: 1050000 },
  { month: 'Apr', spend: 21800, queries: 1150000 },
  { month: 'May', spend: 23200, queries: 1180000 },
  { month: 'Jun', spend: 24567, queries: 1200000 }
];

// Time Range Options
export const TIME_RANGE_OPTIONS = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: '1 year', value: '1y' }
];

// Top Processes
export const TOP_PROCESSES = [
  {
    id: 1,
    name: "Document Analysis",
    department: "Legal",
    monthlyCost: 8500,
    queries: 45000,
    savings: 2100,
    complexity: "High"
  },
  {
    id: 2, 
    name: "Customer Support Chat",
    department: "Support",
    monthlyCost: 6200,
    queries: 120000,
    savings: 1800,
    complexity: "Medium"
  },
  {
    id: 3,
    name: "Code Review Assistant", 
    department: "Engineering",
    monthlyCost: 4300,
    queries: 28000,
    savings: 1200,
    complexity: "High"
  }
];

// ROI Calculator Providers
export const ROI_PROVIDERS = [
  {
    name: "OpenAI",
    models: ["GPT-4", "GPT-3.5-turbo", "GPT-4-turbo"],
    pricing: {
      "GPT-4": { input: 0.03, output: 0.06 },
      "GPT-3.5-turbo": { input: 0.001, output: 0.002 },
      "GPT-4-turbo": { input: 0.01, output: 0.03 }
    }
  },
  {
    name: "Anthropic", 
    models: ["Claude-3-Opus", "Claude-3-Sonnet", "Claude-3-Haiku"],
    pricing: {
      "Claude-3-Opus": { input: 0.015, output: 0.075 },
      "Claude-3-Sonnet": { input: 0.003, output: 0.015 },
      "Claude-3-Haiku": { input: 0.00025, output: 0.00125 }
    }
  },
  {
    name: "Google",
    models: ["Gemini-Pro", "Gemini-Pro-Vision", "PaLM-2"],
    pricing: {
      "Gemini-Pro": { input: 0.0005, output: 0.0015 },
      "Gemini-Pro-Vision": { input: 0.0025, output: 0.01 },
      "PaLM-2": { input: 0.001, output: 0.002 }
    }
  }
];

// Model Options for Assumptions
export const MODEL_OPTIONS = [
  "GPT-4",
  "GPT-3.5-turbo", 
  "Claude-3-Opus",
  "Claude-3-Sonnet",
  "Gemini-Pro",
  "PaLM-2"
];

// Filter Options
export const FILTER_OPTIONS = {
  DEPARTMENTS: [
    "All Departments",
    "Engineering", 
    "Legal",
    "Support",
    "Marketing",
    "Sales",
    "HR",
    "Finance"
  ],
  COST_RANGES: [
    "All Ranges",
    "$0 - $1,000",
    "$1,000 - $5,000", 
    "$5,000 - $10,000",
    "$10,000+"
  ],
  PAYBACK_PERIODS: [
    "All Periods",
    "< 3 months",
    "3-6 months",
    "6-12 months",
    "12+ months"
  ]
};

// Upload Guidelines Requirements
export const UPLOAD_REQUIREMENTS = [
  {
    title: "File Format",
    description: "CSV, Excel (.xlsx), or JSON files only",
    icon: "FileText"
  },
  {
    title: "File Size", 
    description: "Maximum 50MB per file",
    icon: "HardDrive"
  },
  {
    title: "Data Structure",
    description: "Structured data with clear column headers",
    icon: "Database"
  },
  {
    title: "Date Format",
    description: "ISO format (YYYY-MM-DD) or MM/DD/YYYY",
    icon: "Calendar"
  }
];

// Status Configuration for Upload History
export const UPLOAD_STATUS_CONFIG = {
  completed: {
    color: "text-green-600",
    bgColor: "bg-green-50",
    icon: "CheckCircle"
  },
  processing: {
    color: "text-blue-600", 
    bgColor: "bg-blue-50",
    icon: "Clock"
  },
  failed: {
    color: "text-red-600",
    bgColor: "bg-red-50", 
    icon: "XCircle"
  }
};

// Navigation Items for Main Layout
export const NAVIGATION_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "BarChart3"
  },
  {
    name: "Projects", 
    href: "/projects",
    icon: "FolderOpen"
  },
  {
    name: "Analytics",
    href: "/analytics", 
    icon: "TrendingUp"
  },
  {
    name: "Settings",
    href: "/settings",
    icon: "Settings"
  }
];

// Form Select Options
export const SELECT_OPTIONS = {
  INDUSTRIES: [
    { value: "", label: "Select your industry" },
    { value: "technology", label: "Technology" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
    { value: "retail", label: "Retail" },
    { value: "other", label: "Other" }
  ],
  AI_PROVIDERS: [
    { value: "", label: "Select your primary provider" },
    { value: "openai", label: "OpenAI" },
    { value: "anthropic", label: "Anthropic" },
    { value: "google", label: "Google" },
    { value: "other", label: "Other" }
  ],
  TIMELINES: [
    { value: "", label: "Select timeline" },
    { value: "1m", label: "1 Month" },
    { value: "3m", label: "3 Months" },
    { value: "6m", label: "6 Months" },
    { value: "1y", label: "1 Year" }
  ]
};

// API Endpoints (if needed for frontend)
export const API_ENDPOINTS = {
  CHAT: "/v1/chat/interactive",
  UPLOAD: "/v1/upload",
  PROJECTS: "/v1/projects",
  ANALYTICS: "/v1/analytics"
}; 