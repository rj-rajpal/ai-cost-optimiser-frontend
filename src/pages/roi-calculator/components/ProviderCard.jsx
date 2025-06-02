import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProviderCard = ({ provider, assumptions, onCalculate, onSaveScenario }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getPerformanceColor = (value, type) => {
    if (type === 'latency') {
      return value < 400 ? 'text-mist-teal' : value < 500 ? 'text-soft-amber' : 'text-soft-rose';
    }
    if (type === 'reliability') {
      return value >= 99.9 ? 'text-mist-teal' : value >= 99.5 ? 'text-soft-amber' : 'text-soft-rose';
    }
    if (type === 'features') {
      return value >= 90 ? 'text-mist-teal' : value >= 80 ? 'text-soft-amber' : 'text-soft-rose';
    }
    return 'text-slate-gray';
  };

  const getRoiColor = (roiValue) => {
    if (roiValue >= 200) return 'text-mist-teal';
    if (roiValue >= 100) return 'text-soft-amber';
    return 'text-soft-rose';
  };

  // Calculate ROI
  const roi = onCalculate(provider);

  return (
    <div className="bg-white border border-sky-gray rounded-lg p-6 hover:shadow-mist transition-shadow duration-200">
      {/* Provider Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Image
            src={provider.logo}
            alt={`${provider.name} logo`}
            className="w-10 h-10 rounded-lg"
          />
          <div>
            <h3 className="text-lg font-semibold text-soft-navy">{provider.name}</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${provider.color}`} />
              <span className="text-sm text-slate-gray">AI Provider</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onSaveScenario}
          className="p-2 text-slate-gray hover:text-soft-navy hover:bg-fog-gray rounded-md transition-colors duration-200"
        >
          <Icon name="Bookmark" size={16} />
        </button>
      </div>

      {/* Cost Allocation Chart */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-soft-navy mb-3 flex items-center">
          <Icon name="PieChart" size={16} className="mr-2 text-slate-gray" />
          Cost Breakdown
        </h4>
        
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={provider.costAllocation}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {provider.costAllocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          {provider.costAllocation.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-gray">{item.name}</span>
              <span className="text-soft-navy font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="border-t border-sky-gray pt-4 mb-4">
        <h4 className="text-sm font-medium text-soft-navy mb-3 flex items-center">
          <Icon name="Activity" size={16} className="mr-2 text-slate-gray" />
          Performance
        </h4>
        
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className={`text-lg font-bold ${getPerformanceColor(provider.metrics.latency, 'latency')}`}>
              {provider.metrics.latency}ms
            </div>
            <div className="text-xs text-slate-gray">Latency</div>
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-bold ${getPerformanceColor(provider.metrics.reliability, 'reliability')}`}>
              {provider.metrics.reliability}%
            </div>
            <div className="text-xs text-slate-gray">Uptime</div>
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-bold ${getPerformanceColor(provider.metrics.features, 'features')}`}>
              {provider.metrics.features}%
            </div>
            <div className="text-xs text-slate-gray">Features</div>
          </div>
        </div>
      </div>

      {/* ROI Analysis */}
      <div className="border-t border-sky-gray pt-4">
        <h4 className="text-sm font-medium text-soft-navy mb-3 flex items-center">
          <Icon name="Calculator" size={16} className="mr-2 text-slate-gray" />
          ROI Analysis
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-soft-navy">
              {formatCurrency(roi.monthlyCost)}
            </div>
            <div className="text-xs text-slate-gray">Monthly Cost</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-soft-navy">
              {formatCurrency(roi.annualCost)}
            </div>
            <div className="text-xs text-slate-gray">Annual Cost</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-mist-teal">
              {formatCurrency(roi.savings)}
            </div>
            <div className="text-xs text-slate-gray">Annual Savings</div>
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-bold ${getRoiColor(roi.roi)}`}>
              {roi.roi.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-gray">ROI</div>
          </div>
        </div>

        {roi.paybackMonths > 0 && (
          <div className="mt-3 p-3 bg-fog-gray rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-gray">Payback Period</span>
              <span className="text-sm font-medium text-soft-navy">
                {roi.paybackMonths} months
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderCard;