import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricTile = ({ metric }) => {
  const getChangeColor = (changeType) => {
    return changeType === 'positive' ? 'text-success' : 'text-error';
  };

  const getChangeIcon = (changeType) => {
    return changeType === 'positive' ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 hover:shadow-elevation transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
          <Icon name={metric.icon} size={24} className="text-white" />
        </div>
        <div className={`flex items-center space-x-1 ${getChangeColor(metric.changeType)}`}>
          <Icon name={getChangeIcon(metric.changeType)} size={16} />
          <span className="text-sm font-medium">{metric.change}</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-text-primary mb-1">
          {metric.value}
        </h3>
        <p className="text-sm font-medium text-text-secondary mb-2">
          {metric.title}
        </p>
        <p className="text-xs text-text-tertiary">
          {metric.description}
        </p>
      </div>
    </div>
  );
};

export default MetricTile;