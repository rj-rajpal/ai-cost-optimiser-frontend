import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import MetricTile from './components/MetricTile';
import SpendChart from './components/SpendChart';
import TopProcesses from './components/TopProcesses';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chartType, setChartType] = useState('area');
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data for metrics
  const metrics = [
    {
      id: 'monthly-spend',
      title: 'Monthly Spend',
      value: '$24,567',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'DollarSign',
      description: 'Total AI service costs this month'
    },
    {
      id: 'token-usage',
      title: 'Token Usage',
      value: '2.4M',
      change: '+8.3%',
      changeType: 'positive',
      icon: 'Zap',
      description: 'Tokens consumed across all providers'
    },
    {
      id: 'avg-latency',
      title: 'Avg Latency',
      value: '245ms',
      change: '-5.2%',
      changeType: 'positive',
      icon: 'Clock',
      description: 'Average response time across services'
    },
    {
      id: 'cost-per-token',
      title: 'Cost per 1K Tokens',
      value: '$0.0032',
      change: '-2.1%',
      changeType: 'positive',
      icon: 'TrendingDown',
      description: 'Average cost efficiency metric'
    }
  ];

  // Mock data for chart
  const chartData = [
    { date: '2024-01-01', spend: 18500, tokens: 1800000 },
    { date: '2024-01-02', spend: 19200, tokens: 1920000 },
    { date: '2024-01-03', spend: 17800, tokens: 1780000 },
    { date: '2024-01-04', spend: 21300, tokens: 2130000 },
    { date: '2024-01-05', spend: 22100, tokens: 2210000 },
    { date: '2024-01-06', spend: 20500, tokens: 2050000 },
    { date: '2024-01-07', spend: 23400, tokens: 2340000 },
    { date: '2024-01-08', spend: 24200, tokens: 2420000 },
    { date: '2024-01-09', spend: 22800, tokens: 2280000 },
    { date: '2024-01-10', spend: 25100, tokens: 2510000 },
    { date: '2024-01-11', spend: 26300, tokens: 2630000 },
    { date: '2024-01-12', spend: 24900, tokens: 2490000 },
    { date: '2024-01-13', spend: 27200, tokens: 2720000 },
    { date: '2024-01-14', spend: 28100, tokens: 2810000 },
    { date: '2024-01-15', spend: 26800, tokens: 2680000 }
  ];

  // Mock data for top processes
  const topProcesses = [
    {
      id: 1,
      name: 'Customer Support Automation',
      currentCost: 45000,
      aiCost: 12000,
      savings: 33000,
      roi: 275,
      paybackMonths: 4.3,
      status: 'high'
    },
    {
      id: 2,
      name: 'Document Processing',
      currentCost: 32000,
      aiCost: 8500,
      savings: 23500,
      roi: 276,
      paybackMonths: 3.8,
      status: 'high'
    },
    {
      id: 3,
      name: 'Data Entry Automation',
      currentCost: 28000,
      aiCost: 9200,
      savings: 18800,
      roi: 204,
      paybackMonths: 5.1,
      status: 'medium'
    },
    {
      id: 4,
      name: 'Email Classification',
      currentCost: 18500,
      aiCost: 4200,
      savings: 14300,
      roi: 340,
      paybackMonths: 2.9,
      status: 'high'
    },
    {
      id: 5,
      name: 'Invoice Processing',
      currentCost: 22000,
      aiCost: 7800,
      savings: 14200,
      roi: 182,
      paybackMonths: 6.2,
      status: 'medium'
    }
  ];

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleQuickAction = (action, processId) => {
    switch (action) {
      case 'analyze': navigate('/process-analysis', { state: { processId } });
        break;
      case 'calculate': navigate('/roi-calculator', { state: { processId } });
        break;
      case 'scenario': navigate('/scenario-library', { state: { processId } });
        break;
      default:
        console.log('Quick action:', action, processId);
    }
  };

  const timeRangeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onSidebarToggle={handleSidebarToggle} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
      
      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <Breadcrumb />
                <h1 className="text-3xl font-bold text-text-primary mt-2">
                  AI Cost Analytics Dashboard
                </h1>
                <p className="text-text-secondary mt-1">
                  Monitor spending, track performance, and identify optimization opportunities
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/data-upload')}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Icon name="Upload" size={16} />
                  <span>Upload Data</span>
                </button>
                
                <button
                  onClick={() => navigate('/roi-calculator')}
                  className="bg-surface text-text-primary border border-border px-4 py-2 rounded-md hover:bg-surface-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Icon name="Calculator" size={16} />
                  <span>Calculate ROI</span>
                </button>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric) => (
              <MetricTile key={metric.id} metric={metric} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Charts Section */}
            <div className="xl:col-span-2">
              <div className="bg-surface border border-border rounded-lg p-6">
                {/* Chart Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-text-primary">
                      Spend vs Token Usage
                    </h2>
                    <p className="text-text-secondary text-sm mt-1">
                      Track spending patterns and token consumption over time
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Chart Type Toggle */}
                    <div className="flex bg-surface-700 rounded-md p-1">
                      <button
                        onClick={() => setChartType('area')}
                        className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                          chartType === 'area' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        Area
                      </button>
                      <button
                        onClick={() => setChartType('bar')}
                        className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                          chartType === 'bar' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        Bar
                      </button>
                    </div>
                    
                    {/* Time Range Selector */}
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="bg-surface-700 border border-border text-text-primary text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {timeRangeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Chart Component */}
                <SpendChart 
                  data={chartData} 
                  type={chartType} 
                  timeRange={timeRange}
                />
              </div>
            </div>

            {/* Top Processes Section */}
            <div className="xl:col-span-1">
              <TopProcesses 
                processes={topProcesses}
                onQuickAction={handleQuickAction}
              />
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="mt-8">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate('/onboarding-wizard')}
                  className="flex items-center space-x-3 p-4 bg-surface-700 hover:bg-surface-600 rounded-lg transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-700 transition-colors duration-200">
                    <Icon name="Zap" size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-medium text-text-primary">Setup Wizard</h3>
                    <p className="text-xs text-text-secondary">Configure your analysis</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/process-analysis')}
                  className="flex items-center space-x-3 p-4 bg-surface-700 hover:bg-surface-600 rounded-lg transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-success-600 rounded-lg flex items-center justify-center group-hover:bg-success-700 transition-colors duration-200">
                    <Icon name="GitBranch" size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-medium text-text-primary">Analyze Process</h3>
                    <p className="text-xs text-text-secondary">Evaluate automation potential</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/scenario-library')}
                  className="flex items-center space-x-3 p-4 bg-surface-700 hover:bg-surface-600 rounded-lg transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-warning-600 rounded-lg flex items-center justify-center group-hover:bg-warning-700 transition-colors duration-200">
                    <Icon name="BookOpen" size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-medium text-text-primary">View Scenarios</h3>
                    <p className="text-xs text-text-secondary">Browse saved models</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/data-upload')}
                  className="flex items-center space-x-3 p-4 bg-surface-700 hover:bg-surface-600 rounded-lg transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 bg-error-600 rounded-lg flex items-center justify-center group-hover:bg-error-700 transition-colors duration-200">
                    <Icon name="Database" size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-medium text-text-primary">Manage Data</h3>
                    <p className="text-xs text-text-secondary">Upload and organize files</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;