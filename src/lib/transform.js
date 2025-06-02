/**
 * Transform raw API response data into dashboard-ready format
 * @param {Object} raw - Raw response from chat service API
 * @returns {Object} Transformed data with KPIs, chart data, and ROI opportunities
 */
export function transform(raw) {
  const p = raw.structured_data.workload_params;
  const calls = p.calls_per_day;
  const tIn = p.avg_input_tokens;
  const tOut = p.avg_output_tokens;
  const tokensPerDay = calls * (tIn + tOut);
  const tokensMonth = tokensPerDay * 30;

  const modelName = raw.structured_data.roi_analysis.best_model || p.current_model;
  const modelInfo = raw.structured_data.cost_table.find(m => m.model_name === modelName);

  const monthlySpend = modelInfo.monthly_cost;
  const costPer1kTokens = (monthlySpend / tokensMonth) * 1000;

  // Build chart series (last 30 days)
  const chartData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86_400_000).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    spend: +(monthlySpend / 30).toFixed(2),
    tokens: Math.round(tokensPerDay)
  }));

  return {
    kpis: {
      monthlySpend,
      tokenUsage: tokensMonth,
      avgLatency: modelInfo.p90_latency_ms,
      costPer1k: costPer1kTokens
    },
    chartData,
    roiList: [raw.structured_data.roi_analysis] // extend when you have more
  };
}

/**
 * Calculate KPIs for each ranked model
 * @param {Array} rankedModels - Array of ranked model objects
 * @param {Object} workloadParams - Workload parameters from API
 * @returns {Array} Array of models with calculated KPIs
 */
export function calculateModelKPIs(rankedModels, workloadParams) {
  if (!rankedModels || !workloadParams) return rankedModels;

  const calls = workloadParams.calls_per_day;
  const tIn = workloadParams.avg_input_tokens;
  const tOut = workloadParams.avg_output_tokens;
  const tokensPerDay = calls * (tIn + tOut);
  const tokensMonth = tokensPerDay * 30;

  return rankedModels.map(model => {
    const monthlySpend = model.monthly_cost;
    const costPer1kTokens = (monthlySpend / tokensMonth) * 1000;
    
    // Calculate efficiency score (0-100) based on composite score
    const efficiency = Math.round(1/model.composite_score * 100);
    
    // Estimate daily queries based on model capacity and latency
    const estimatedDailyQueries = Math.round(
      (calls * 1000) / (model.p90_latency_ms || 500)
    );

    return {
      ...model,
      kpis: {
        monthlySpend,
        tokenUsage: tokensMonth,
        avgLatency: model.p90_latency_ms,
        costPer1k: costPer1kTokens,
        efficiency,
        dailyQueries: estimatedDailyQueries
      }
    };
  });
}

/**
 * Get comparative metrics for all models (for visual comparison)
 * @param {Array} modelsWithKPIs - Array of models with calculated KPIs
 * @returns {Object} Min/max values for each metric for normalization
 */
export function getComparativeMetrics(modelsWithKPIs) {
  if (!modelsWithKPIs || modelsWithKPIs.length === 0) {
    return {
      monthlySpend: { min: 0, max: 0 },
      avgLatency: { min: 0, max: 0 },
      costPer1k: { min: 0, max: 0 },
      efficiency: { min: 0, max: 100 }
    };
  }

  const monthlySpends = modelsWithKPIs.map(m => m.kpis.monthlySpend);
  const latencies = modelsWithKPIs.map(m => m.kpis.avgLatency);
  const costPer1ks = modelsWithKPIs.map(m => m.kpis.costPer1k);
  const efficiencies = modelsWithKPIs.map(m => m.kpis.efficiency);

  return {
    monthlySpend: { 
      min: Math.min(...monthlySpends), 
      max: Math.max(...monthlySpends) 
    },
    avgLatency: { 
      min: Math.min(...latencies), 
      max: Math.max(...latencies) 
    },
    costPer1k: { 
      min: Math.min(...costPer1ks), 
      max: Math.max(...costPer1ks) 
    },
    efficiency: { 
      min: Math.min(...efficiencies), 
      max: Math.max(...efficiencies) 
    }
  };
}

/**
 * Get top ROI opportunities sorted by ROI percentage or monthly savings
 * @param {Array} roiAnalysisArray - Array of ROI analysis objects
 * @param {string} sortBy - 'roi_percent' or 'savings_per_month'
 * @returns {Array} Sorted ROI opportunities
 */
export function getTopROIOpportunities(roiAnalysisArray, sortBy = 'roi_percent') {
  if (!Array.isArray(roiAnalysisArray)) {
    return [];
  }

  return roiAnalysisArray
    .filter(item => item && item[sortBy] !== undefined)
    .sort((a, b) => {
      const aValue = parseFloat(a[sortBy]) || 0;
      const bValue = parseFloat(b[sortBy]) || 0;
      return bValue - aValue; // Descending order (highest ROI first)
    });
}

/**
 * Format currency values for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format large numbers (tokens, etc.) for display
 * @param {number} num - Number to format
 * @returns {string} Formatted number with appropriate suffix
 */
export function formatLargeNumber(num) {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} Percentage change
 */
export function calculatePercentageChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
} 