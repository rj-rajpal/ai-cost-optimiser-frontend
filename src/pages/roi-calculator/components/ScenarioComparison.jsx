import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ScenarioComparison = ({ scenarios, providers, onExportResults }) => {
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

  const handleDeleteScenario = (scenarioId) => {
    // Handle scenario deletion logic
    // This would typically involve calling an API and updating state
  };

  const handleDuplicateScenario = (scenario) => {
    // Handle scenario duplication logic
    // Create a copy with a new ID and name
  };

  if (scenarios.length === 0) {
    return (
      <div className="bg-white border border-sky-gray rounded-lg p-8 text-center shadow-mist">
        <Icon name="BarChart3" size={48} className="mx-auto text-slate-gray mb-4" />
        <h3 className="text-lg font-medium text-soft-navy mb-2">
          No Saved Scenarios
        </h3>
        <p className="text-slate-gray mb-4">
          Save your current assumptions as a scenario to compare different configurations
        </p>
        <button className="inline-flex items-center space-x-2 px-4 py-2 bg-muted-indigo text-white rounded-md hover:bg-soft-navy transition-colors duration-200">
          <Icon name="Save" size={16} />
          <span>Save Current Scenario</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-sky-gray rounded-lg shadow-mist">
      {/* Header */}
      <div className="p-6 border-b border-sky-gray">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="GitCompare" size={20} className="text-slate-gray" />
            <div>
              <h3 className="text-lg font-semibold text-soft-navy">
                Scenario Comparison
              </h3>
              <p className="text-sm text-slate-gray">
                Compare saved scenarios and their ROI projections
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-gray hover:text-soft-navy hover:bg-fog-gray rounded-md transition-colors duration-200"
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
                    ? 'border-muted-indigo bg-muted-indigo/10' : 'border-sky-gray hover:border-muted-indigo hover:bg-fog-gray'
                }`}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-muted-indigo rounded-full flex items-center justify-center">
                    <Icon name="Check" size={12} className="text-white" />
                  </div>
                )}

                {/* Scenario Header */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-soft-navy">{scenario.name}</h4>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => handleDuplicateScenario(scenario, e)}
                      className="p-1 rounded text-slate-gray hover:text-soft-navy hover:bg-fog-gray transition-colors duration-200"
                    >
                      <Icon name="Copy" size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteScenario(scenario.id, e)}
                      className="p-1 rounded text-slate-gray hover:text-soft-rose hover:bg-fog-gray transition-colors duration-200"
                    >
                      <Icon name="Trash2" size={12} />
                    </button>
                  </div>
                </div>

                {/* Best Provider */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${bestProvider.color}`} />
                  <span className="text-sm text-slate-gray">
                    Best: {bestProvider.name}
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-gray">Monthly Cost:</span>
                    <span className="text-soft-navy font-medium">
                      {formatCurrency(bestROI.monthlyCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-gray">Annual ROI:</span>
                    <span className="text-mist-teal font-medium">
                      {bestROI.roi.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-gray">Tasks/Month:</span>
                    <span className="text-soft-navy font-medium">
                      {scenario.assumptions.taskFrequency.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Created Date */}
                <div className="mt-3 pt-3 border-t border-sky-gray">
                  <span className="text-xs text-slate-gray">
                    Created {formatDate(scenario.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Export Button */}
        {scenarios.length > 0 && (
          <div className="flex justify-end">
            <button 
              onClick={onExportResults}
              className="flex items-center space-x-2 px-4 py-2 bg-fog-gray text-soft-navy border border-sky-gray rounded-md hover:bg-cloud-white transition-colors duration-200"
            >
              <Icon name="Download" size={16} />
              <span>Export Results</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioComparison;