import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDashboard } from '../../contexts/DashboardContext';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { transform } from '../../lib/transform';
import Icon from '../../components/AppIcon';
import WorkloadParams from '../../components/WorkloadParams';
import ModelRanking from '../../components/ModelRanking';
import { KPI } from './components/KPI';
import SpendVsTokensChart from './components/SpendVsTokensChart';

const Dashboard = () => {
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

  // Initialize workload params from dashboard data
  useEffect(() => {
    if (dashboardData?.originalStructuredData?.workload_params) {
      setWorkloadParams(dashboardData.originalStructuredData.workload_params);
    }
  }, [dashboardData]);

  // Get ranked models from dashboard data
  const rankedModels = dashboardData?.originalStructuredData?.ranked_models || [];

  const handleWorkloadParamsChange = (newParams) => {
    setWorkloadParams(newParams);
    // Here you could trigger recalculations or API calls with new parameters
  };

  if (dashboardLoading) {
    return (
      <div className={`flex items-center justify-center min-h-96 ${isDarkMode ? 'text-white' : ''}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-muted-indigo rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="BarChart3" size={24} className="text-white animate-pulse" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Loading Dashboard...</h3>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>Processing your AI cost optimization data</p>
        </div>
      </div>
    );
  }

  // Show message if no models available
  if (!rankedModels || rankedModels.length === 0) {
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
            <Icon name="BarChart3" size={24} className="text-muted-indigo" />
          </div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>No Model Rankings Available</h3>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
            Upload your data or run an AI analysis to see model performance rankings
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-6 min-h-screen space-y-6 transition-colors duration-300 ${isDarkMode ? 'bg-black' : 'bg-cloud-white'}`}>
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
              Model rankings generated from your AI optimization analysis
            </span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>
              Last updated: {new Date(dashboardData.lastUpdated).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Header Section - Full Width */}
      <div className={`w-full rounded-xl border p-6 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-black border-gray-800 shadow-2xl' 
          : 'bg-white shadow-mist border-sky-gray'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-muted-indigo/20' : 'bg-muted-indigo/10'
          }`}>
            <Icon name="Trophy" size={20} className="text-muted-indigo" />
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>AI Model Performance Wars</h2>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-slate-gray'}`}>
              AI models ranked by performance, cost, and efficiency metrics
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats - Full Width */}
      <div className={`w-full rounded-xl border p-6 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-black border-gray-800 shadow-2xl' 
          : 'bg-white shadow-mist border-sky-gray'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`rounded-lg p-4 border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-950 border-gray-800' 
              : 'bg-cloud-white border-sky-gray'
          }`}>
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={16} className="text-muted-indigo" />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Models Analyzed</span>
            </div>
            <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>{rankedModels.length}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>Performance ranked</p>
          </div>
          
          <div className={`rounded-lg p-4 border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-950 border-gray-800' 
              : 'bg-cloud-white border-sky-gray'
          }`}>
            <div className="flex items-center space-x-2">
              <Icon name="DollarSign" size={16} className="text-calm-green" />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Best Cost</span>
            </div>
            <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
              ${Math.min(...rankedModels.map(m => m.monthly_cost)).toLocaleString()}
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>Monthly savings possible</p>
          </div>
          
          <div className={`rounded-lg p-4 border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-950 border-gray-800' 
              : 'bg-cloud-white border-sky-gray'
          }`}>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-mist-teal" />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>Best Latency</span>
            </div>
            <p className={`text-xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-soft-navy'}`}>
              {Math.min(...rankedModels.map(m => m.p90_latency_ms))}ms
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>P90 response time</p>
          </div>
        </div>
      </div>

      {/* Model Cards Grid + Sidebar - 2/3 + 1/3 Layout */}
      <div className="flex gap-6">
        {/* Model Cards Grid - 2/3 width */}
        <div className="flex-1">
          <ModelRanking 
            rankedModels={rankedModels}
            workloadParams={workloadParams}
            showHeaderAndStats={false}
            showFooter={false}
          />
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="w-80 h-100 flex-shrink-0">
          <WorkloadParams 
            params={workloadParams}
            onChange={handleWorkloadParamsChange}
            className='h-[100%]'
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
              Model Ranking Methodology
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-gray'}`}>
              Rankings are based on composite scores considering cost efficiency, latency performance, 
              reliability metrics, and feature capabilities. Higher scores indicate better overall value.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;