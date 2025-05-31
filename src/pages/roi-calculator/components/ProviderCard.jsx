import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProviderCard = ({ provider, roi, assumptions }) => {
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
      return value < 400 ? 'text-success' : value < 500 ? 'text-warning' : 'text-error';
    }
    if (type === 'reliability') {
      return value >= 99.9 ? 'text-success' : value >= 99.5 ? 'text-warning' : 'text-error';
    }
    if (type === 'features') {
      return value >= 90 ? 'text-success' : value >= 80 ? 'text-warning' : 'text-error';
    }
    return 'text-text-secondary';
  };

  const getRoiColor = (roiValue) => {
    if (roiValue >= 200) return 'text-success';
    if (roiValue >= 100) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-elevation transition-shadow duration-200">
      {/* Provider Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-700">
            <Image
              src={provider.logo}
              alt={`${provider.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary font-heading">
              {provider.name}
            </h3>
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${provider.color} text-white`}>
              <Icon name="Zap" size={12} className="mr-1" />
              AI Provider
            </div>
          </div>
        </div>
        
        <button className="p-2 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200">
          <Icon name="MoreVertical" size={16} />
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Token Cost</span>
            <Icon name="DollarSign" size={14} className="text-text-tertiary" />
          </div>
          <div className="text-xl font-bold text-text-primary">
            ${provider.metrics.tokenCost.toFixed(3)}
          </div>
          <div className="text-xs text-text-tertiary">per 1K tokens</div>
        </div>

        <div className="bg-surface-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Latency</span>
            <Icon name="Clock" size={14} className="text-text-tertiary" />
          </div>
          <div className={`text-xl font-bold ${getPerformanceColor(provider.metrics.latency, 'latency')}`}>
            {provider.metrics.latency}ms
          </div>
          <div className="text-xs text-text-tertiary">avg response</div>
        </div>

        <div className="bg-surface-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Reliability</span>
            <Icon name="Shield" size={14} className="text-text-tertiary" />
          </div>
          <div className={`text-xl font-bold ${getPerformanceColor(provider.metrics.reliability, 'reliability')}`}>
            {provider.metrics.reliability}%
          </div>
          <div className="text-xs text-text-tertiary">uptime SLA</div>
        </div>

        <div className="bg-surface-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-text-secondary text-sm">Features</span>
            <Icon name="Star" size={14} className="text-text-tertiary" />
          </div>
          <div className={`text-xl font-bold ${getPerformanceColor(provider.metrics.features, 'features')}`}>
            {provider.metrics.features}%
          </div>
          <div className="text-xs text-text-tertiary">coverage</div>
        </div>
      </div>

      {/* Cost Allocation Pie Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center">
          <Icon name="PieChart" size={16} className="mr-2 text-text-tertiary" />
          Cost Allocation
        </h4>
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={provider.costAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={40}
                  dataKey="value"
                >
                  {provider.costAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1 space-y-2">
            {provider.costAllocation.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-text-secondary">{item.name}</span>
                </div>
                <span className="text-text-primary font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 30-Day Price Trend */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center">
          <Icon name="TrendingUp" size={16} className="mr-2 text-text-tertiary" />
          30-Day Price Trend
        </h4>
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={provider.priceHistory}>
              <XAxis dataKey="day" hide />
              <YAxis hide domain={['dataMin - 0.001', 'dataMax + 0.001']} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke={provider.costAllocation[0].color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-xs text-text-tertiary mt-1">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>

      {/* ROI Calculations */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-text-primary mb-3 flex items-center">
          <Icon name="Calculator" size={16} className="mr-2 text-text-tertiary" />
          ROI Analysis
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-text-primary">
              {formatCurrency(roi.monthlyCost)}
            </div>
            <div className="text-xs text-text-secondary">Monthly Cost</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-text-primary">
              {formatCurrency(roi.annualCost)}
            </div>
            <div className="text-xs text-text-secondary">Annual Cost</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold text-success">
              {formatCurrency(roi.savings)}
            </div>
            <div className="text-xs text-text-secondary">Annual Savings</div>
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-bold ${getRoiColor(roi.roi)}`}>
              {roi.roi.toFixed(1)}%
            </div>
            <div className="text-xs text-text-secondary">ROI</div>
          </div>
        </div>

        {roi.paybackMonths > 0 && (
          <div className="mt-3 p-3 bg-surface-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Payback Period</span>
              <span className="text-sm font-medium text-text-primary">
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