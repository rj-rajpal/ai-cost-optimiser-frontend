import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TopProcesses = ({ processes, onQuickAction }) => {
  const [sortBy, setSortBy] = useState('roi');
  const [sortOrder, setSortOrder] = useState('desc');

  const sortedProcesses = [...processes].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (sortOrder === 'asc') {
      return aValue - bValue;
    }
    return bValue - aValue;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'high':
        return 'bg-success text-white';
      case 'medium':
        return 'bg-warning text-white';
      case 'low':
        return 'bg-error text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Top ROI Opportunities
          </h2>
          <p className="text-text-secondary text-sm mt-1">
            Highest potential automation savings
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="bg-surface-700 border border-border text-text-primary text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="roi">ROI %</option>
            <option value="savings">Savings</option>
            <option value="paybackMonths">Payback</option>
          </select>
          
          <button
            onClick={() => handleSort(sortBy)}
            className="p-2 bg-surface-700 border border-border rounded-md hover:bg-surface-600 transition-colors duration-200"
          >
            <Icon 
              name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
              size={16} 
              className="text-text-secondary"
            />
          </button>
        </div>
      </div>

      {/* Process List */}
      <div className="space-y-4">
        {sortedProcesses.map((process, index) => (
          <div
            key={process.id}
            className="bg-surface-700 border border-border rounded-lg p-4 hover:bg-surface-600 transition-colors duration-200"
          >
            {/* Process Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium text-text-tertiary">
                    #{index + 1}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(process.status)}`}>
                    {process.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-text-primary mb-1">
                  {process.name}
                </h3>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-success">
                  {formatPercentage(process.roi)}
                </div>
                <div className="text-xs text-text-tertiary">ROI</div>
              </div>
            </div>

            {/* Process Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <div className="text-xs text-text-tertiary mb-1">Annual Savings</div>
                <div className="text-sm font-medium text-text-primary">
                  {formatCurrency(process.savings)}
                </div>
              </div>
              <div>
                <div className="text-xs text-text-tertiary mb-1">Payback Period</div>
                <div className="text-sm font-medium text-text-primary">
                  {process.paybackMonths} months
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-text-tertiary mb-1">
                <span>Current Cost</span>
                <span>AI Cost</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-text-primary">
                <span>{formatCurrency(process.currentCost)}</span>
                <span>{formatCurrency(process.aiCost)}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => onQuickAction('analyze', process.id)}
                className="flex-1 bg-primary text-white px-3 py-2 text-xs rounded-md hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-1"
              >
                <Icon name="GitBranch" size={14} />
                <span>Analyze</span>
              </button>
              
              <button
                onClick={() => onQuickAction('calculate', process.id)}
                className="flex-1 bg-surface border border-border text-text-primary px-3 py-2 text-xs rounded-md hover:bg-surface-600 transition-colors duration-200 flex items-center justify-center space-x-1"
              >
                <Icon name="Calculator" size={14} />
                <span>Calculate</span>
              </button>
              
              <button
                onClick={() => onQuickAction('scenario', process.id)}
                className="p-2 bg-surface border border-border text-text-primary rounded-md hover:bg-surface-600 transition-colors duration-200"
              >
                <Icon name="BookOpen" size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-6 pt-4 border-t border-border">
        <button
          onClick={() => onQuickAction('viewAll')}
          className="w-full text-center text-sm text-primary hover:text-primary-600 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <span>View All Processes</span>
          <Icon name="ArrowRight" size={16} />
        </button>
      </div>
    </div>
  );
};

export default TopProcesses;