import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryPanel = ({ 
  processes, 
  selectedProcesses, 
  onGenerateReport, 
  onScheduleReview 
}) => {
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

  // Calculate aggregate metrics
  const totalManualCost = processes.reduce((sum, p) => sum + p.manualCostPerYear, 0);
  const totalAICost = processes.reduce((sum, p) => sum + p.estimatedAICost, 0);
  const totalSavings = processes.reduce((sum, p) => sum + p.annualSavings, 0);
  const averagePayback = processes.length > 0 
    ? processes.reduce((sum, p) => sum + p.paybackMonths, 0) / processes.length 
    : 0;
  const averageROI = processes.length > 0 
    ? processes.reduce((sum, p) => sum + p.roiPercentage, 0) / processes.length 
    : 0;

  // Calculate metrics for selected processes
  const selectedProcessData = processes.filter(p => selectedProcesses.includes(p.id));
  const selectedTotalSavings = selectedProcessData.reduce((sum, p) => sum + p.annualSavings, 0);
  const selectedTotalManualCost = selectedProcessData.reduce((sum, p) => sum + p.manualCostPerYear, 0);
  const selectedTotalAICost = selectedProcessData.reduce((sum, p) => sum + p.estimatedAICost, 0);

  // Priority distribution
  const highPriority = processes.filter(p => p.urgency === 'High').length;
  const mediumPriority = processes.filter(p => p.urgency === 'Medium').length;
  const lowPriority = processes.filter(p => p.urgency === 'Low').length;

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <div className="bg-surface border border-border rounded-lg shadow-base p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Summary</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-surface-700 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Total Processes</span>
                <span className="text-lg font-semibold text-text-primary">
                  {formatNumber(processes.length)}
                </span>
              </div>
            </div>
            
            <div className="bg-surface-700 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Potential Savings</span>
                <span className="text-lg font-semibold text-success">
                  {formatCurrency(totalSavings)}
                </span>
              </div>
            </div>
            
            <div className="bg-surface-700 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Avg. Payback</span>
                <span className="text-lg font-semibold text-text-primary">
                  {averagePayback.toFixed(1)}m
                </span>
              </div>
            </div>
            
            <div className="bg-surface-700 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Avg. ROI</span>
                <span className="text-lg font-semibold text-primary">
                  {averageROI.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-surface border border-border rounded-lg shadow-base p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Priority Distribution</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded-full"></div>
              <span className="text-sm text-text-secondary">High Priority</span>
            </div>
            <span className="text-sm font-medium text-text-primary">{highPriority}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-sm text-text-secondary">Medium Priority</span>
            </div>
            <span className="text-sm font-medium text-text-primary">{mediumPriority}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-text-secondary">Low Priority</span>
            </div>
            <span className="text-sm font-medium text-text-primary">{lowPriority}</span>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-surface border border-border rounded-lg shadow-base p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Cost Analysis</h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-text-secondary">Current Manual Cost</span>
              <span className="text-sm font-medium text-text-primary">
                {formatCurrency(totalManualCost)}
              </span>
            </div>
            <div className="w-full bg-surface-700 rounded-full h-2">
              <div 
                className="bg-error h-2 rounded-full" 
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-text-secondary">Estimated AI Cost</span>
              <span className="text-sm font-medium text-text-primary">
                {formatCurrency(totalAICost)}
              </span>
            </div>
            <div className="w-full bg-surface-700 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full" 
                style={{ width: `${(totalAICost / totalManualCost) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">Net Savings</span>
              <span className="text-lg font-semibold text-success">
                {formatCurrency(totalSavings)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Processes Summary */}
      {selectedProcesses.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg shadow-base p-4">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Selected Processes ({selectedProcesses.length})
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Total Savings</span>
              <span className="text-lg font-semibold text-success">
                {formatCurrency(selectedTotalSavings)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Manual Cost</span>
              <span className="text-sm font-medium text-text-primary">
                {formatCurrency(selectedTotalManualCost)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">AI Cost</span>
              <span className="text-sm font-medium text-text-primary">
                {formatCurrency(selectedTotalAICost)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-surface border border-border rounded-lg shadow-base p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
        
        <div className="space-y-3">
          <button
            onClick={onGenerateReport}
            disabled={selectedProcesses.length === 0}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 disabled:bg-surface-700 disabled:text-text-tertiary disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Icon name="FileText" size={16} />
            <span>Generate Report</span>
          </button>
          
          <button
            onClick={onScheduleReview}
            disabled={selectedProcesses.length === 0}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-surface-700 text-text-primary border border-border rounded-md hover:bg-surface hover:border-primary disabled:bg-surface-700 disabled:text-text-tertiary disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Icon name="Calendar" size={16} />
            <span>Schedule Review</span>
          </button>
          
          <button
            onClick={() => console.log('Export selected processes')}
            disabled={selectedProcesses.length === 0}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-surface-700 text-text-primary border border-border rounded-md hover:bg-surface hover:border-primary disabled:bg-surface-700 disabled:text-text-tertiary disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Icon name="Download" size={16} />
            <span>Export Selected</span>
          </button>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-surface border border-border rounded-lg shadow-base p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Key Insights</h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-success/10 border border-success/20 rounded-lg">
            <Icon name="TrendingUp" size={16} className="text-success mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-text-primary">High ROI Opportunity</p>
              <p className="text-xs text-text-secondary mt-1">
                {highPriority} processes offer &gt;500% ROI with quick payback
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <Icon name="Clock" size={16} className="text-warning mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-text-primary">Quick Wins Available</p>
              <p className="text-xs text-text-secondary mt-1">
                {processes.filter(p => p.paybackMonths <= 3).length} processes with &lt;3 month payback
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <Icon name="DollarSign" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-text-primary">Cost Reduction</p>
              <p className="text-xs text-text-secondary mt-1">
                {((totalSavings / totalManualCost) * 100).toFixed(0)}% reduction in operational costs
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;