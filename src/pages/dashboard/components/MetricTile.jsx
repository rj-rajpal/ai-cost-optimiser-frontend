import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricTile = ({ metric }) => {
  const getChangeColor = (changeType) => {
    return changeType === 'positive' ? 'text-mist-teal' : 'text-soft-rose';
  };

  const getChangeIcon = (changeType) => {
    return changeType === 'positive' ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className="bg-white border border-sky-gray rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 shadow-mist">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-muted-indigo rounded-lg flex items-center justify-center">
          <Icon name={metric.icon} size={24} className="text-white" />
        </div>
        <div className={`flex items-center space-x-1 ${getChangeColor(metric.changeType)}`}>
          <Icon name={getChangeIcon(metric.changeType)} size={16} />
          <span className="text-sm font-medium">{metric.change}</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-soft-navy mb-1">
          {metric.value}
        </h3>
        <p className="text-sm font-medium text-charcoal-black mb-2">
          {metric.title}
        </p>
        <p className="text-xs text-slate-gray">
          {metric.description}
        </p>
      </div>
    </div>
  );
};

export default MetricTile;