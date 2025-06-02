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
      <div className="bg-white border border-sky-gray rounded-lg overflow-hidden shadow-mist">
        {/* Panel Header */}
        <div className="p-4 border-b border-sky-gray">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Settings" size={20} className="text-slate-gray" />
              <h3 className="text-lg font-semibold text-soft-navy">
                Assumptions
              </h3>
            </div>
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="xl:hidden p-1 rounded-md text-slate-gray hover:text-soft-navy hover:bg-fog-gray transition-colors duration-200"
            >
              <Icon name={isCollapsed ? "ChevronDown" : "ChevronUp"} size={16} />
            </button>
          </div>
          
          <p className="text-sm text-slate-gray mt-1">
            Adjust parameters to see real-time ROI changes
          </p>
        </div>

        {/* Panel Content */}
        <div className={`${isCollapsed ? 'hidden xl:block' : 'block'}`}>
          <div className="p-4 space-y-6">
            {/* Task Frequency */}
            <div>
              <label className="block text-sm font-medium text-soft-navy mb-2">
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
                  className="w-full h-2 bg-fog-gray rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-gray">
                  <span>100</span>
                  <span className="font-medium text-soft-navy">
                    {formatNumber(assumptions.taskFrequency)} tasks/month
                  </span>
                  <span>10,000</span>
                </div>
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-soft-navy mb-2">
                Model Type
              </label>
              <select
                value={assumptions.modelType}
                onChange={(e) => handleSelectChange('modelType', e.target.value)}
                className="w-full bg-cloud-white border border-sky-gray text-soft-navy text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo transition-colors duration-200"
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
              <label className="block text-sm font-medium text-soft-navy mb-2">
                Latency Target (ms)
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={assumptions.latencyTarget}
                  onChange={(e) => handleSliderChange('latencyTarget', e.target.value)}
                  className="w-full h-2 bg-fog-gray rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-gray">
                  <span>100ms</span>
                  <span className="font-medium text-soft-navy">
                    {assumptions.latencyTarget}ms
                  </span>
                  <span>1000ms</span>
                </div>
              </div>
            </div>

            {/* Data Volume */}
            <div>
              <label className="block text-sm font-medium text-soft-navy mb-2">
                Data Volume (KB per task)
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={assumptions.dataVolume}
                  onChange={(e) => handleSliderChange('dataVolume', e.target.value)}
                  className="w-full h-2 bg-fog-gray rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-gray">
                  <span>1KB</span>
                  <span className="font-medium text-soft-navy">
                    {assumptions.dataVolume}KB
                  </span>
                  <span>100KB</span>
                </div>
              </div>
            </div>

            {/* Concurrent Users */}
            <div>
              <label className="block text-sm font-medium text-soft-navy mb-2">
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
                  className="w-full h-2 bg-fog-gray rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-slate-gray">
                  <span>1</span>
                  <span className="font-medium text-soft-navy">
                    {assumptions.concurrentUsers} users
                  </span>
                  <span>100</span>
                </div>
              </div>
            </div>

            {/* Save Preset Button */}
            <div className="pt-4 border-t border-sky-gray">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-muted-indigo text-white rounded-md hover:bg-soft-navy transition-colors duration-200">
                <Icon name="Save" size={16} />
                <span>Save as Preset</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssumptionPanel;