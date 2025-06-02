import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDashboard } from '../../contexts/DashboardContext';
import { useDarkMode } from '../../contexts/DarkModeContext';
import Icon from '../../components/AppIcon';
import WorkloadParams from '../../components/WorkloadParams';
import ROICard from '../../components/ROICard';

const ROICalculator = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { dashboardData, isLoading: dashboardLoading, processStructuredData } = useDashboard();
  const { isDarkMode } = useDarkMode();
  
  // Workload parameters state
  const [workloadParams, setWorkloadParams] = useState({
    calls_per_day: 1000,
    avg_input_tokens: 150,
    avg_output_tokens: 100,
    latency_sla_ms: 500
  });

  // Estimated monthly spend state
  const [estimatedMonthlySpend, setEstimatedMonthlySpend] = useState(5000);

  // Initialize workload params from dashboard data
  useEffect(() => {
    if (dashboardData?.originalStructuredData?.workload_params) {
      setWorkloadParams(dashboardData.originalStructuredData.workload_params);
    }
  }, [dashboardData]);

  // Get cost table from dashboard data
  const costTable = dashboardData?.originalStructuredData?.cost_table || [];

  const handleWorkloadParamsChange = (newParams) => {
    setWorkloadParams(newParams);
    // Here you could trigger recalculations or API calls with new parameters
  };

  const handleEstimatedSpendChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setEstimatedMonthlySpend(value);
  };

  if (dashboardLoading) {
    return (
      <div className={`flex items-center justify-center min-h-96 ${isDarkMode ? 'text-white' : ''}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-muted-indigo rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Calculator" size={24} className="text-white animate-pulse" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Loading ROI Calculator...</h3>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>Calculating your potential savings</p>
        </div>
      </div>
    );
  }

  // Show message if no cost table available
  if (!costTable || costTable.length === 0) {
    return (
      <div className={`p-6 min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-cloud-white'}`}>
        <div className={`rounded-xl border p-8 text-center transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-black border-gray-800 shadow-2xl' 
            : 'bg-white shadow-mist border-sky-gray'
        }`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isDarkMode ? 'bg-muted-indigo/20' : 'bg-muted-indigo/10'
          }`}>
            <Icon name="Calculator" size={24} className="text-muted-indigo" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>No Cost Data Available</h3>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
            Upload your data or run an AI analysis to see ROI calculations
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 min-h-screen space-y-6 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-cloud-white'}`}>
      {/* Header Section - Full Width */}
      <div className={`w-full rounded-xl border p-6 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-black border-gray-800 shadow-2xl' 
          : 'bg-white shadow-mist border-sky-gray'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isDarkMode ? 'bg-muted-indigo/20' : 'bg-muted-indigo/10'
            }`}>
              <Icon name="Calculator" size={20} className="text-muted-indigo" />
            </div>
            <div>
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>ROI Calculator</h2>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
                Calculate potential cost savings and return on investment for AI model optimization
              </p>
            </div>
          </div>
          
          {/* Estimated Monthly Spend Input */}
          <div className="flex items-center space-x-3">
            <label htmlFor="estimatedSpend" className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
              Estimated Monthly Spend:
            </label>
            <div className="relative">
              <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>$</span>
              <input
                id="estimatedSpend"
                type="number"
                value={estimatedMonthlySpend}
                onChange={handleEstimatedSpendChange}
                min="0"
                step="100"
                className={`pl-8 pr-4 py-2 w-40 border rounded-lg focus:ring-2 focus:ring-muted-indigo focus:border-transparent font-semibold transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-black border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-white border-sky-gray text-soft-navy placeholder-slate-gray'
                }`}
                placeholder="5000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Source Indicator - Full Width */}
      {dashboardData && (
        <div className={`w-full p-4 border rounded-lg transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-black border-gray-800 text-white' 
            : 'bg-muted-indigo/10 border-muted-indigo/20'
        }`}>
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-muted-indigo" />
            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
              ROI calculations based on your AI optimization analysis
            </span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>
              Last updated: {new Date(dashboardData.lastUpdated).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Summary Stats - Full Width */}
      <div className={`w-full rounded-xl border p-6 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-black border-gray-800 shadow-2xl' 
          : 'bg-white shadow-mist border-sky-gray'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`rounded-lg p-4 border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-950 border-gray-800' 
              : 'bg-cloud-white border-sky-gray'
          }`}>
            <div className="flex items-center space-x-2">
              <Icon name="BarChart3" size={16} className="text-muted-indigo" />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Models Analyzed</span>
            </div>
            <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>{costTable.length}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>Available for comparison</p>
          </div>
          
          <div className={`rounded-lg p-4 border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-950 border-gray-800' 
              : 'bg-cloud-white border-sky-gray'
          }`}>
            <div className="flex items-center space-x-2">
              <Icon name="DollarSign" size={16} className="text-calm-green" />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Max Savings</span>
            </div>
            <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
              ${Math.max(...costTable.map(m => estimatedMonthlySpend - m.monthly_cost)).toLocaleString()}
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>Best case scenario</p>
          </div>
          
          <div className={`rounded-lg p-4 border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-950 border-gray-800' 
              : 'bg-cloud-white border-sky-gray'
          }`}>
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} className="text-mist-teal" />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Best ROI</span>
            </div>
            <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
              {Math.max(...costTable.map(m => estimatedMonthlySpend > 0 ? ((estimatedMonthlySpend - m.monthly_cost) / estimatedMonthlySpend) * 100 : 0)).toFixed(1)}%
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>Maximum return</p>
          </div>

          <div className={`rounded-lg p-4 border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-950 border-gray-800' 
              : 'bg-cloud-white border-sky-gray'
          }`}>
            <div className="flex items-center space-x-2">
              <Icon name="Target" size={16} className="text-orange-500" />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Your Budget</span>
            </div>
            <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
              ${estimatedMonthlySpend.toLocaleString()}
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>Monthly allocation</p>
          </div>
        </div>
      </div>

      {/* ROI Cards Grid + Sidebar - 2/3 + 1/3 Layout */}
      <div className="flex gap-6">
        {/* ROI Cards Grid - 2/3 width */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {costTable.map((model, index) => (
              <ROICard 
                key={model.model_name || index}
                model={model}
                estimatedMonthlySpend={estimatedMonthlySpend}
                className="h-[100%]"
              />
            ))}
          </div>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="w-80 h-100 flex-shrink-0">
          <WorkloadParams 
            params={workloadParams}
            onChange={handleWorkloadParamsChange}
            className="sticky top-6"
            originalStructuredData={dashboardData?.originalStructuredData}
            onApiUpdate={processStructuredData}
          />
        </div>
      </div>

      {/* Footer Note - Full Width */}
      <div className={`w-full rounded-lg p-4 border transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-950 border-gray-800' 
          : 'bg-muted-indigo/5 border-muted-indigo/20'
      }`}>
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-muted-indigo mt-0.5" />
          <div>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
              ROI Calculation Methodology
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>
              Savings = Your Estimated Spend - Model Monthly Cost. ROI% = (Savings / Estimated Spend) × 100. 
              Green values indicate potential savings, red values indicate higher costs than your budget.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;