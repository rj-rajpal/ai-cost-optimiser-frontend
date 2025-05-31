/**
 * Analytics Service
 * Handles all dashboard analytics and metrics operations
 */

import api from '../lib/api';

/**
 * Get dashboard metrics
 */
export const getDashboardMetrics = async (timeRange = '30d') => {
  return await api.get(`/analytics/dashboard?range=${timeRange}`);
};

/**
 * Get chart data for spend vs token usage
 */
export const getChartData = async (chartType = 'area', timeRange = '30d') => {
  return await api.get(`/analytics/chart-data?type=${chartType}&range=${timeRange}`);
};

/**
 * Get top processes by ROI
 */
export const getTopProcesses = async (limit = 10, sortBy = 'roi') => {
  return await api.get(`/analytics/top-processes?limit=${limit}&sort=${sortBy}`);
};

/**
 * Get cost analytics
 */
export const getCostAnalytics = async (timeRange = '30d', groupBy = 'provider') => {
  return await api.get(`/analytics/costs?range=${timeRange}&group_by=${groupBy}`);
};

/**
 * Get token usage analytics
 */
export const getTokenUsageAnalytics = async (timeRange = '30d', groupBy = 'model') => {
  return await api.get(`/analytics/token-usage?range=${timeRange}&group_by=${groupBy}`);
};

/**
 * Get performance metrics
 */
export const getPerformanceMetrics = async (timeRange = '30d') => {
  return await api.get(`/analytics/performance?range=${timeRange}`);
};

/**
 * Get savings forecast
 */
export const getSavingsForecast = async (months = 12) => {
  return await api.get(`/analytics/savings-forecast?months=${months}`);
};

/**
 * Get ROI trends
 */
export const getROITrends = async (timeRange = '30d') => {
  return await api.get(`/analytics/roi-trends?range=${timeRange}`);
};

/**
 * Get department analytics
 */
export const getDepartmentAnalytics = async (departmentId = null, timeRange = '30d') => {
  const endpoint = departmentId 
    ? `/analytics/departments/${departmentId}?range=${timeRange}`
    : `/analytics/departments?range=${timeRange}`;
  
  return await api.get(endpoint);
};

/**
 * Get provider comparison
 */
export const getProviderComparison = async (providers = [], timeRange = '30d') => {
  const providerParams = providers.length > 0 ? `&providers=${providers.join(',')}` : '';
  return await api.get(`/analytics/provider-comparison?range=${timeRange}${providerParams}`);
};

/**
 * Generate analytics report
 */
export const generateReport = async (reportType, parameters = {}) => {
  return await api.post('/analytics/generate-report', {
    type: reportType,
    parameters,
  });
};

/**
 * Export analytics data
 */
export const exportAnalytics = async (dataType, format = 'csv', filters = {}) => {
  const exportData = {
    data_type: dataType,
    format,
    filters,
  };

  const filename = `analytics_${dataType}_${Date.now()}.${format}`;
  return await api.download('/analytics/export', filename, {
    method: 'POST',
    body: exportData,
  });
};

/**
 * Get real-time metrics
 */
export const getRealTimeMetrics = async () => {
  return await api.get('/analytics/real-time');
};

/**
 * Get usage patterns
 */
export const getUsagePatterns = async (timeRange = '30d') => {
  return await api.get(`/analytics/usage-patterns?range=${timeRange}`);
};

/**
 * Get cost breakdown
 */
export const getCostBreakdown = async (timeRange = '30d', level = 'provider') => {
  return await api.get(`/analytics/cost-breakdown?range=${timeRange}&level=${level}`);
};

/**
 * Get efficiency metrics
 */
export const getEfficiencyMetrics = async (timeRange = '30d') => {
  return await api.get(`/analytics/efficiency?range=${timeRange}`);
};

/**
 * Get alert thresholds
 */
export const getAlertThresholds = async () => {
  return await api.get('/analytics/alert-thresholds');
};

/**
 * Update alert thresholds
 */
export const updateAlertThresholds = async (thresholds) => {
  return await api.patch('/analytics/alert-thresholds', thresholds);
};

/**
 * Get alerts
 */
export const getAlerts = async (status = 'active', page = 1, limit = 20) => {
  return await api.get(`/analytics/alerts?status=${status}&page=${page}&limit=${limit}`);
};

/**
 * Acknowledge alert
 */
export const acknowledgeAlert = async (alertId) => {
  return await api.patch(`/analytics/alerts/${alertId}/acknowledge`);
};

/**
 * Get custom metrics
 */
export const getCustomMetrics = async () => {
  return await api.get('/analytics/custom-metrics');
};

/**
 * Create custom metric
 */
export const createCustomMetric = async (metricData) => {
  return await api.post('/analytics/custom-metrics', metricData);
};

/**
 * Update custom metric
 */
export const updateCustomMetric = async (metricId, metricData) => {
  return await api.patch(`/analytics/custom-metrics/${metricId}`, metricData);
};

/**
 * Delete custom metric
 */
export const deleteCustomMetric = async (metricId) => {
  return await api.delete(`/analytics/custom-metrics/${metricId}`);
};

/**
 * Get dashboard widgets configuration
 */
export const getDashboardConfig = async () => {
  return await api.get('/analytics/dashboard/config');
};

/**
 * Update dashboard widgets configuration
 */
export const updateDashboardConfig = async (config) => {
  return await api.patch('/analytics/dashboard/config', config);
};

/**
 * Get historical data
 */
export const getHistoricalData = async (metric, timeRange = '1y', granularity = 'daily') => {
  return await api.get(`/analytics/historical?metric=${metric}&range=${timeRange}&granularity=${granularity}`);
};

/**
 * Get benchmark data
 */
export const getBenchmarkData = async (industry = null) => {
  const industryParam = industry ? `?industry=${industry}` : '';
  return await api.get(`/analytics/benchmarks${industryParam}`);
}; 