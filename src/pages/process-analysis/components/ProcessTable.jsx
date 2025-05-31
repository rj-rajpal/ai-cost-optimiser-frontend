import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ProcessTable = ({ 
  processes, 
  selectedProcesses, 
  onProcessSelection, 
  sortConfig, 
  onSort 
}) => {
  const [expandedRows, setExpandedRows] = useState([]);

  const handleSelectAll = () => {
    if (selectedProcesses.length === processes.length) {
      onProcessSelection([]);
    } else {
      onProcessSelection(processes.map(p => p.id));
    }
  };

  const handleSelectProcess = (processId) => {
    if (selectedProcesses.includes(processId)) {
      onProcessSelection(selectedProcesses.filter(id => id !== processId));
    } else {
      onProcessSelection([...selectedProcesses, processId]);
    }
  };

  const toggleRowExpansion = (processId) => {
    if (expandedRows.includes(processId)) {
      setExpandedRows(expandedRows.filter(id => id !== processId));
    } else {
      setExpandedRows([...expandedRows, processId]);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const getSeverityColor = (roiPercentage, paybackMonths) => {
    if (roiPercentage >= 800 && paybackMonths <= 3) return 'text-success bg-success/10 border-success/20';
    if (roiPercentage >= 500 && paybackMonths <= 6) return 'text-accent bg-accent/10 border-accent/20';
    if (roiPercentage >= 300 && paybackMonths <= 12) return 'text-warning bg-warning/10 border-warning/20';
    return 'text-error bg-error/10 border-error/20';
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High': return 'text-error bg-error/10 border-error/20';
      case 'Medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'Low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-text-tertiary bg-surface-700 border-border';
    }
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Low': return 'text-success bg-success/10 border-success/20';
      case 'Medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'High': return 'text-error bg-error/10 border-error/20';
      default: return 'text-text-tertiary bg-surface-700 border-border';
    }
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-tertiary" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const isAllSelected = processes.length > 0 && selectedProcesses.length === processes.length;
  const isIndeterminate = selectedProcesses.length > 0 && selectedProcesses.length < processes.length;

  return (
    <div className="overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-700 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={input => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2"
                  />
                </div>
              </th>
              
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('name')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-colors duration-200"
                >
                  <span>Process Name</span>
                  {getSortIcon('name')}
                </button>
              </th>
              
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('department')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-colors duration-200"
                >
                  <span>Department</span>
                  {getSortIcon('department')}
                </button>
              </th>
              
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => onSort('manualCostPerYear')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-colors duration-200 ml-auto"
                >
                  <span>Manual Cost/Year</span>
                  {getSortIcon('manualCostPerYear')}
                </button>
              </th>
              
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => onSort('estimatedAICost')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-colors duration-200 ml-auto"
                >
                  <span>AI Cost/Year</span>
                  {getSortIcon('estimatedAICost')}
                </button>
              </th>
              
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => onSort('annualSavings')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-colors duration-200 ml-auto"
                >
                  <span>Annual Savings</span>
                  {getSortIcon('annualSavings')}
                </button>
              </th>
              
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => onSort('paybackMonths')}
                  className="flex items-center space-x-2 text-sm font-semibold text-text-primary hover:text-primary transition-colors duration-200 ml-auto"
                >
                  <span>Payback</span>
                  {getSortIcon('paybackMonths')}
                </button>
              </th>
              
              <th className="px-4 py-3 text-center">
                <span className="text-sm font-semibold text-text-primary">ROI Score</span>
              </th>
              
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {processes.map((process) => (
              <React.Fragment key={process.id}>
                <tr className={`hover:bg-surface-700 transition-colors duration-200 ${
                  selectedProcesses.includes(process.id) ? 'bg-primary/5' : ''
                }`}>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={selectedProcesses.includes(process.id)}
                        onChange={() => handleSelectProcess(process.id)}
                        className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2"
                      />
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="text-sm font-medium text-text-primary">
                          {process.name}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(process.urgency)}`}>
                            {process.urgency} Priority
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getComplexityColor(process.complexity)}`}>
                            {process.complexity} Complexity
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <span className="text-sm text-text-secondary">{process.department}</span>
                  </td>
                  
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-medium text-text-primary">
                      {formatCurrency(process.manualCostPerYear)}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-medium text-text-primary">
                      {formatCurrency(process.estimatedAICost)}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-medium text-success">
                      {formatCurrency(process.annualSavings)}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-medium text-text-primary">
                      {process.paybackMonths.toFixed(1)} months
                    </span>
                  </td>
                  
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(process.roiPercentage, process.paybackMonths)}`}>
                      {formatPercentage(process.roiPercentage)}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleRowExpansion(process.id)}
                      className="p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200"
                      aria-label={expandedRows.includes(process.id) ? 'Collapse details' : 'Expand details'}
                    >
                      <Icon 
                        name="ChevronDown" 
                        size={16} 
                        className={`transition-transform duration-200 ${
                          expandedRows.includes(process.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </td>
                </tr>
                
                {/* Expanded Row Details */}
                {expandedRows.includes(process.id) && (
                  <tr className="bg-surface-700">
                    <td colSpan="9" className="px-4 py-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-text-primary mb-3">Process Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-text-secondary">Volume/Month:</span>
                              <span className="text-text-primary font-medium">
                                {process.volumePerMonth.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-secondary">Expected Accuracy:</span>
                              <span className="text-text-primary font-medium">{process.expectedAccuracy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-secondary">Risk Level:</span>
                              <span className={`font-medium ${
                                process.riskLevel === 'High' ? 'text-error' :
                                process.riskLevel === 'Medium' ? 'text-warning' : 'text-success'
                              }`}>
                                {process.riskLevel}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-text-primary mb-3">Implementation</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-text-secondary">Timeline:</span>
                              <span className="text-text-primary font-medium">{process.implementationTimeline}</span>
                            </div>
                            <div>
                              <span className="text-text-secondary">Required Resources:</span>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {process.requiredResources.map((resource, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                                  >
                                    {resource}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-text-primary mb-3">Description</h4>
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {process.description}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-4 p-4">
        {processes.map((process) => (
          <div
            key={process.id}
            className={`bg-surface-700 border border-border rounded-lg p-4 ${
              selectedProcesses.includes(process.id) ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedProcesses.includes(process.id)}
                  onChange={() => handleSelectProcess(process.id)}
                  className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary focus:ring-2"
                />
                <div>
                  <h3 className="text-sm font-medium text-text-primary">{process.name}</h3>
                  <p className="text-xs text-text-secondary mt-1">{process.department}</p>
                </div>
              </div>
              
              <button
                onClick={() => toggleRowExpansion(process.id)}
                className="p-1 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface transition-colors duration-200"
              >
                <Icon 
                  name="ChevronDown" 
                  size={16} 
                  className={`transition-transform duration-200 ${
                    expandedRows.includes(process.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <span className="text-xs text-text-secondary">Annual Savings</span>
                <p className="text-sm font-medium text-success">{formatCurrency(process.annualSavings)}</p>
              </div>
              <div>
                <span className="text-xs text-text-secondary">Payback Period</span>
                <p className="text-sm font-medium text-text-primary">{process.paybackMonths.toFixed(1)} months</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(process.urgency)}`}>
                  {process.urgency}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getComplexityColor(process.complexity)}`}>
                  {process.complexity}
                </span>
              </div>
              
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(process.roiPercentage, process.paybackMonths)}`}>
                {formatPercentage(process.roiPercentage)} ROI
              </span>
            </div>
            
            {expandedRows.includes(process.id) && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-2">Cost Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Manual Cost:</span>
                        <span className="text-text-primary font-medium">{formatCurrency(process.manualCostPerYear)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">AI Cost:</span>
                        <span className="text-text-primary font-medium">{formatCurrency(process.estimatedAICost)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-2">Implementation Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Timeline:</span>
                        <span className="text-text-primary font-medium">{process.implementationTimeline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Accuracy:</span>
                        <span className="text-text-primary font-medium">{process.expectedAccuracy}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary mb-2">Description</h4>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {process.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {processes.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No processes found</h3>
          <p className="text-text-secondary">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};

export default ProcessTable;