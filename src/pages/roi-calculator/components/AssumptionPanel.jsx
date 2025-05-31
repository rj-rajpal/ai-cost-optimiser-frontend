import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AssumptionPanel = ({ assumptions, onChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const modelOptions = [
    { value: 'gpt-4', label: 'GPT-4', provider: 'OpenAI' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', provider: 'OpenAI' },
    { value: 'claude-3', label: 'Claude 3', provider: 'Anthropic' },
    { value: 'claude-2', label: 'Claude 2', provider: 'Anthropic' },
    { value: 'gemini-pro', label: 'Gemini Pro', provider: 'Google' },
    { value: 'gemini-ultra', label: 'Gemini Ultra', provider: 'Google' },
    { value: 'titan-text', label: 'Titan Text', provider: 'AWS' },
    { value: 'jurassic-2', label: 'Jurassic-2', provider: 'AWS' }
  ];

  const handleSliderChange = (key, value) => {
    onChange(key, parseInt(value));
  };

  const handleSelectChange = (key, value) => {
    onChange(key, value);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="sticky top-20">
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {/* Panel Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Settings" size={20} className="text-text-tertiary" />
              <h3 className="text-lg font-semibold text-text-primary font-heading">
                Assumptions
              </h3>
            </div>
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="xl:hidden p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200"
            >
              <Icon name={isCollapsed ? "ChevronDown" : "ChevronUp"} size={16} />
            </button>
          </div>
          
          <p className="text-sm text-text-secondary mt-1">
            Adjust parameters to see real-time ROI changes
          </p>
        </div>

        {/* Panel Content */}
        <div className={`${isCollapsed ? 'hidden xl:block' : 'block'}`}>
          <div className="p-4 space-y-6">
            {/* Task Frequency */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Task Frequency
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={assumptions.taskFrequency}
                  onChange={(e) => handleSliderChange('taskFrequency', e.target.value)}
                  className="w-full h-2 bg-surface-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-text-tertiary">
                  <span>100</span>
                  <span className="font-medium text-text-primary">
                    {formatNumber(assumptions.taskFrequency)} tasks/month
                  </span>
                  <span>10,000</span>
                </div>
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Model Type
              </label>
              <select
                value={assumptions.modelType}
                onChange={(e) => handleSelectChange('modelType', e.target.value)}
                className="w-full bg-surface-700 border border-border text-text-primary text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
              >
                {modelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.provider})
                  </option>
                ))}
              </select>
            </div>

            {/* Latency Target */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Latency Target
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={assumptions.latencyTarget}
                  onChange={(e) => handleSliderChange('latencyTarget', e.target.value)}
                  className="w-full h-2 bg-surface-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-text-tertiary">
                  <span>100ms</span>
                  <span className="font-medium text-text-primary">
                    {assumptions.latencyTarget}ms
                  </span>
                  <span>1000ms</span>
                </div>
              </div>
            </div>

            {/* Data Volume */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Data Volume per Task
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={assumptions.dataVolume}
                  onChange={(e) => handleSliderChange('dataVolume', e.target.value)}
                  className="w-full h-2 bg-surface-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-text-tertiary">
                  <span>10KB</span>
                  <span className="font-medium text-text-primary">
                    {assumptions.dataVolume}KB
                  </span>
                  <span>500KB</span>
                </div>
              </div>
            </div>

            {/* Concurrent Users */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Concurrent Users
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={assumptions.concurrentUsers}
                  onChange={(e) => handleSliderChange('concurrentUsers', e.target.value)}
                  className="w-full h-2 bg-surface-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-text-tertiary">
                  <span>1</span>
                  <span className="font-medium text-text-primary">
                    {assumptions.concurrentUsers} users
                  </span>
                  <span>100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="p-4 border-t border-border">
            <h4 className="text-sm font-medium text-text-primary mb-3">
              Quick Presets
            </h4>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  onChange('taskFrequency', 500);
                  onChange('dataVolume', 25);
                  onChange('concurrentUsers', 5);
                }}
                className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-700 rounded-md transition-colors duration-200"
              >
                <div className="font-medium">Small Scale</div>
                <div className="text-xs text-text-tertiary">500 tasks, 25KB, 5 users</div>
              </button>
              
              <button
                onClick={() => {
                  onChange('taskFrequency', 2500);
                  onChange('dataVolume', 100);
                  onChange('concurrentUsers', 25);
                }}
                className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-700 rounded-md transition-colors duration-200"
              >
                <div className="font-medium">Medium Scale</div>
                <div className="text-xs text-text-tertiary">2.5K tasks, 100KB, 25 users</div>
              </button>
              
              <button
                onClick={() => {
                  onChange('taskFrequency', 7500);
                  onChange('dataVolume', 250);
                  onChange('concurrentUsers', 75);
                }}
                className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-700 rounded-md transition-colors duration-200"
              >
                <div className="font-medium">Enterprise Scale</div>
                <div className="text-xs text-text-tertiary">7.5K tasks, 250KB, 75 users</div>
              </button>
            </div>
          </div>

          {/* Reset Button */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => {
                onChange('taskFrequency', 1000);
                onChange('modelType', 'gpt-4');
                onChange('latencyTarget', 500);
                onChange('dataVolume', 50);
                onChange('concurrentUsers', 10);
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-surface-700 text-text-primary border border-border rounded-md hover:bg-surface-600 transition-colors duration-200"
            >
              <Icon name="RotateCcw" size={16} />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssumptionPanel;