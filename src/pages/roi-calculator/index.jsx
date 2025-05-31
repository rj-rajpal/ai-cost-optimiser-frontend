import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import ProviderCard from './components/ProviderCard';
import AssumptionPanel from './components/AssumptionPanel';
import ScenarioComparison from './components/ScenarioComparison';

const ROICalculator = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [assumptions, setAssumptions] = useState({
    taskFrequency: 1000,
    modelType: 'gpt-4',
    latencyTarget: 500,
    dataVolume: 50,
    concurrentUsers: 10
  });

  const [scenarios, setScenarios] = useState([]);

  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      logo: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop&crop=center',
      color: 'bg-green-500',
      metrics: {
        tokenCost: 0.03,
        latency: 450,
        reliability: 99.9,
        features: 95
      },
      costAllocation: [
        { name: 'Compute', value: 45, color: '#22C55E' },
        { name: 'Storage', value: 25, color: '#3B82F6' },
        { name: 'Network', value: 20, color: '#F59E0B' },
        { name: 'Support', value: 10, color: '#EF4444' }
      ],
      priceHistory: [
        { day: 1, price: 0.032 },
        { day: 2, price: 0.031 },
        { day: 3, price: 0.030 },
        { day: 4, price: 0.029 },
        { day: 5, price: 0.030 },
        { day: 6, price: 0.031 },
        { day: 7, price: 0.030 },
        { day: 8, price: 0.029 },
        { day: 9, price: 0.030 },
        { day: 10, price: 0.031 },
        { day: 11, price: 0.030 },
        { day: 12, price: 0.029 },
        { day: 13, price: 0.030 },
        { day: 14, price: 0.031 },
        { day: 15, price: 0.030 },
        { day: 16, price: 0.029 },
        { day: 17, price: 0.030 },
        { day: 18, price: 0.031 },
        { day: 19, price: 0.030 },
        { day: 20, price: 0.029 },
        { day: 21, price: 0.030 },
        { day: 22, price: 0.031 },
        { day: 23, price: 0.030 },
        { day: 24, price: 0.029 },
        { day: 25, price: 0.030 },
        { day: 26, price: 0.031 },
        { day: 27, price: 0.030 },
        { day: 28, price: 0.029 },
        { day: 29, price: 0.030 },
        { day: 30, price: 0.030 }
      ]
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      logo: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop&crop=center',
      color: 'bg-purple-500',
      metrics: {
        tokenCost: 0.025,
        latency: 520,
        reliability: 99.8,
        features: 88
      },
      costAllocation: [
        { name: 'Compute', value: 50, color: '#8B5CF6' },
        { name: 'Storage', value: 22, color: '#3B82F6' },
        { name: 'Network', value: 18, color: '#F59E0B' },
        { name: 'Support', value: 10, color: '#EF4444' }
      ],
      priceHistory: [
        { day: 1, price: 0.027 },
        { day: 2, price: 0.026 },
        { day: 3, price: 0.025 },
        { day: 4, price: 0.024 },
        { day: 5, price: 0.025 },
        { day: 6, price: 0.026 },
        { day: 7, price: 0.025 },
        { day: 8, price: 0.024 },
        { day: 9, price: 0.025 },
        { day: 10, price: 0.026 },
        { day: 11, price: 0.025 },
        { day: 12, price: 0.024 },
        { day: 13, price: 0.025 },
        { day: 14, price: 0.026 },
        { day: 15, price: 0.025 },
        { day: 16, price: 0.024 },
        { day: 17, price: 0.025 },
        { day: 18, price: 0.026 },
        { day: 19, price: 0.025 },
        { day: 20, price: 0.024 },
        { day: 21, price: 0.025 },
        { day: 22, price: 0.026 },
        { day: 23, price: 0.025 },
        { day: 24, price: 0.024 },
        { day: 25, price: 0.025 },
        { day: 26, price: 0.026 },
        { day: 27, price: 0.025 },
        { day: 28, price: 0.024 },
        { day: 29, price: 0.025 },
        { day: 30, price: 0.025 }
      ]
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop&crop=center',
      color: 'bg-blue-500',
      metrics: {
        tokenCost: 0.028,
        latency: 380,
        reliability: 99.7,
        features: 92
      },
      costAllocation: [
        { name: 'Compute', value: 48, color: '#3B82F6' },
        { name: 'Storage', value: 28, color: '#10B981' },
        { name: 'Network', value: 16, color: '#F59E0B' },
        { name: 'Support', value: 8, color: '#EF4444' }
      ],
      priceHistory: [
        { day: 1, price: 0.030 },
        { day: 2, price: 0.029 },
        { day: 3, price: 0.028 },
        { day: 4, price: 0.027 },
        { day: 5, price: 0.028 },
        { day: 6, price: 0.029 },
        { day: 7, price: 0.028 },
        { day: 8, price: 0.027 },
        { day: 9, price: 0.028 },
        { day: 10, price: 0.029 },
        { day: 11, price: 0.028 },
        { day: 12, price: 0.027 },
        { day: 13, price: 0.028 },
        { day: 14, price: 0.029 },
        { day: 15, price: 0.028 },
        { day: 16, price: 0.027 },
        { day: 17, price: 0.028 },
        { day: 18, price: 0.029 },
        { day: 19, price: 0.028 },
        { day: 20, price: 0.027 },
        { day: 21, price: 0.028 },
        { day: 22, price: 0.029 },
        { day: 23, price: 0.028 },
        { day: 24, price: 0.027 },
        { day: 25, price: 0.028 },
        { day: 26, price: 0.029 },
        { day: 27, price: 0.028 },
        { day: 28, price: 0.027 },
        { day: 29, price: 0.028 },
        { day: 30, price: 0.028 }
      ]
    },
    {
      id: 'bedrock',
      name: 'AWS Bedrock',
      logo: 'https://images.unsplash.com/photo-1606868306217-dbf5046868d2?w=100&h=100&fit=crop&crop=center',
      color: 'bg-orange-500',
      metrics: {
        tokenCost: 0.032,
        latency: 420,
        reliability: 99.9,
        features: 85
      },
      costAllocation: [
        { name: 'Compute', value: 42, color: '#F97316' },
        { name: 'Storage', value: 30, color: '#3B82F6' },
        { name: 'Network', value: 20, color: '#F59E0B' },
        { name: 'Support', value: 8, color: '#EF4444' }
      ],
      priceHistory: [
        { day: 1, price: 0.034 },
        { day: 2, price: 0.033 },
        { day: 3, price: 0.032 },
        { day: 4, price: 0.031 },
        { day: 5, price: 0.032 },
        { day: 6, price: 0.033 },
        { day: 7, price: 0.032 },
        { day: 8, price: 0.031 },
        { day: 9, price: 0.032 },
        { day: 10, price: 0.033 },
        { day: 11, price: 0.032 },
        { day: 12, price: 0.031 },
        { day: 13, price: 0.032 },
        { day: 14, price: 0.033 },
        { day: 15, price: 0.032 },
        { day: 16, price: 0.031 },
        { day: 17, price: 0.032 },
        { day: 18, price: 0.033 },
        { day: 19, price: 0.032 },
        { day: 20, price: 0.031 },
        { day: 21, price: 0.032 },
        { day: 22, price: 0.033 },
        { day: 23, price: 0.032 },
        { day: 24, price: 0.031 },
        { day: 25, price: 0.032 },
        { day: 26, price: 0.033 },
        { day: 27, price: 0.032 },
        { day: 28, price: 0.031 },
        { day: 29, price: 0.032 },
        { day: 30, price: 0.032 }
      ]
    }
  ];

  const calculateROI = (provider) => {
    const monthlyCost = (assumptions.taskFrequency * provider.metrics.tokenCost * assumptions.dataVolume) / 1000;
    const annualCost = monthlyCost * 12;
    const savings = Math.max(0, 50000 - annualCost); // Assuming $50k baseline
    const roi = savings > 0 ? (savings / annualCost) * 100 : 0;
    
    return {
      monthlyCost,
      annualCost,
      savings,
      roi,
      paybackMonths: savings > 0 ? Math.ceil(annualCost / (savings / 12)) : 0
    };
  };

  const handleAssumptionChange = (key, value) => {
    setAssumptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveScenario = () => {
    const newScenario = {
      id: Date.now(),
      name: `Scenario ${scenarios.length + 1}`,
      assumptions: { ...assumptions },
      providers: providers.map(provider => ({
        ...provider,
        roi: calculateROI(provider)
      })),
      createdAt: new Date().toISOString()
    };
    
    setScenarios(prev => [...prev, newScenario]);
  };

  const handleExportResults = () => {
    const results = providers.map(provider => ({
      provider: provider.name,
      ...calculateROI(provider)
    }));
    
    console.log('Exporting results:', results);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="lg:ml-64 pt-16">
        <div className="p-6">
          {/* Header Section */}
          <div className="mb-8">
            <Breadcrumb />
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-4">
              <div>
                <h1 className="text-3xl font-bold text-text-primary font-heading">
                  ROI Calculator
                </h1>
                <p className="text-text-secondary mt-2">
                  Compare AI providers and calculate return on investment for your use cases
                </p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <button
                  onClick={handleSaveScenario}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
                >
                  <Icon name="Save" size={16} />
                  <span>Save Scenario</span>
                </button>
                
                <button
                  onClick={handleExportResults}
                  className="flex items-center space-x-2 px-4 py-2 bg-surface text-text-primary border border-border rounded-md hover:bg-surface-700 transition-colors duration-200"
                >
                  <Icon name="Download" size={16} />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-6">
            {/* Main Content Area */}
            <div className="flex-1">
              {/* Provider Comparison Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {providers.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    roi={calculateROI(provider)}
                    assumptions={assumptions}
                  />
                ))}
              </div>

              {/* Scenario Comparison */}
              <ScenarioComparison 
                scenarios={scenarios}
                currentAssumptions={assumptions}
                providers={providers}
                onScenarioSelect={(scenario) => setAssumptions(scenario.assumptions)}
              />
            </div>

            {/* Sticky Assumption Panel */}
            <div className="xl:w-80">
              <AssumptionPanel
                assumptions={assumptions}
                onChange={handleAssumptionChange}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ROICalculator;