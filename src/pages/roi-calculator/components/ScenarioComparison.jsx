import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ScenarioComparison = ({ scenarios, currentAssumptions, providers, onScenarioSelect }) => {
  const [selectedScenarios, setSelectedScenarios] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateScenarioROI = (scenarioAssumptions, provider) => {
    const monthlyCost = (scenarioAssumptions.taskFrequency * provider.metrics.tokenCost * scenarioAssumptions.dataVolume) / 1000;
    const annualCost = monthlyCost * 12;
    const savings = Math.max(0, 50000 - annualCost);
    const roi = savings > 0 ? (savings / annualCost) * 100 : 0;
    
    return {
      monthlyCost,
      annualCost,
      savings,
      roi
    };
  };

  const getBestProvider = (scenarioAssumptions) => {
    let bestProvider = null;
    let bestROI = -1;

    providers.forEach(provider => {
      const roi = calculateScenarioROI(scenarioAssumptions, provider);
      if (roi.roi > bestROI) {
        bestROI = roi.roi;
        bestProvider = provider;
      }
    });

    return bestProvider;
  };

  const handleScenarioToggle = (scenarioId) => {
    setSelectedScenarios(prev => {
      if (prev.includes(scenarioId)) {
        return prev.filter(id => id !== scenarioId);
      } else if (prev.length < 3) {
        return [...prev, scenarioId];
      }
      return prev;
    });
  };

  const handleDeleteScenario = (scenarioId, e) => {
    e.stopPropagation();
    console.log('Delete scenario:', scenarioId);
  };

  const handleDuplicateScenario = (scenario, e) => {
    e.stopPropagation();
    console.log('Duplicate scenario:', scenario);
  };

  if (scenarios.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-8 text-center">
        <Icon name="BarChart3" size={48} className="mx-auto text-text-tertiary mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">
          No Saved Scenarios
        </h3>
        <p className="text-text-secondary mb-4">
          Save your current assumptions as a scenario to compare different configurations
        </p>
        <button className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-colors duration-200">
          <Icon name="Save" size={16} />
          <span>Save Current Scenario</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="GitCompare" size={20} className="text-text-tertiary" />
            <div>
              <h3 className="text-lg font-semibold text-text-primary font-heading">
                Scenario Comparison
              </h3>
              <p className="text-sm text-text-secondary">
                Compare saved scenarios and their ROI projections
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-700 rounded-md transition-colors duration-200"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
          </button>
        </div>
      </div>

      {/* Scenario Grid */}
      <div className={`${isExpanded ? 'block' : 'hidden'} p-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {scenarios.map((scenario) => {
            const bestProvider = getBestProvider(scenario.assumptions);
            const bestROI = calculateScenarioROI(scenario.assumptions, bestProvider);
            const isSelected = selectedScenarios.includes(scenario.id);

            return (
              <div
                key={scenario.id}
                onClick={() => handleScenarioToggle(scenario.id)}
                className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'border-primary bg-primary bg-opacity-10' :'border-border hover:border-border-active hover:bg-surface-700'
                }`}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Check" size={12} className="text-white" />
                  </div>
                )}

                {/* Scenario Header */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-text-primary">{scenario.name}</h4>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => handleDuplicateScenario(scenario, e)}
                      className="p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-surface-600 transition-colors duration-200"
                    >
                      <Icon name="Copy" size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteScenario(scenario.id, e)}
                      className="p-1 rounded text-text-tertiary hover:text-error hover:bg-surface-600 transition-colors duration-200"
                    >
                      <Icon name="Trash2" size={12} />
                    </button>
                  </div>
                </div>

                {/* Best Provider */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${bestProvider.color}`} />
                  <span className="text-sm text-text-secondary">
                    Best: {bestProvider.name}
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Monthly Cost:</span>
                    <span className="text-text-primary font-medium">
                      {formatCurrency(bestROI.monthlyCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Annual ROI:</span>
                    <span className="text-success font-medium">
                      {bestROI.roi.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Tasks/Month:</span>
                    <span className="text-text-primary font-medium">
                      {scenario.assumptions.taskFrequency.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Created Date */}
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-text-tertiary">
                    Created {formatDate(scenario.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        {selectedScenarios.length > 0 && (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-surface-700 px-4 py-3 border-b border-border">
              <h4 className="font-medium text-text-primary">
                Selected Scenarios Comparison ({selectedScenarios.length}/3)
              </h4>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                      Metric
                    </th>
                    {selectedScenarios.map(scenarioId => {
                      const scenario = scenarios.find(s => s.id === scenarioId);
                      return (
                        <th key={scenarioId} className="px-4 py-3 text-left text-sm font-medium text-text-primary">
                          {scenario.name}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary">Task Frequency</td>
                    {selectedScenarios.map(scenarioId => {
                      const scenario = scenarios.find(s => s.id === scenarioId);
                      return (
                        <td key={scenarioId} className="px-4 py-3 text-sm text-text-primary">
                          {scenario.assumptions.taskFrequency.toLocaleString()}/month
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary">Data Volume</td>
                    {selectedScenarios.map(scenarioId => {
                      const scenario = scenarios.find(s => s.id === scenarioId);
                      return (
                        <td key={scenarioId} className="px-4 py-3 text-sm text-text-primary">
                          {scenario.assumptions.dataVolume}KB
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary">Best Provider</td>
                    {selectedScenarios.map(scenarioId => {
                      const scenario = scenarios.find(s => s.id === scenarioId);
                      const bestProvider = getBestProvider(scenario.assumptions);
                      return (
                        <td key={scenarioId} className="px-4 py-3 text-sm text-text-primary">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${bestProvider.color}`} />
                            <span>{bestProvider.name}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm text-text-secondary">Best ROI</td>
                    {selectedScenarios.map(scenarioId => {
                      const scenario = scenarios.find(s => s.id === scenarioId);
                      const bestProvider = getBestProvider(scenario.assumptions);
                      const roi = calculateScenarioROI(scenario.assumptions, bestProvider);
                      return (
                        <td key={scenarioId} className="px-4 py-3 text-sm text-success font-medium">
                          {roi.roi.toFixed(1)}%
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-text-secondary">
            {selectedScenarios.length > 0 
              ? `${selectedScenarios.length} scenario${selectedScenarios.length > 1 ? 's' : ''} selected`
              : 'Select up to 3 scenarios to compare'
            }
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedScenarios.length > 0 && (
              <button
                onClick={() => setSelectedScenarios([])}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                Clear Selection
              </button>
            )}
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-surface-700 text-text-primary border border-border rounded-md hover:bg-surface-600 transition-colors duration-200">
              <Icon name="Download" size={16} />
              <span>Export Comparison</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioComparison;