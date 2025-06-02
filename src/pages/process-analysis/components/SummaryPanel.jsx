import React from 'react';
import Icon from '../../../components/AppIcon';

const SummaryPanel = ({ 
  totalProcesses,
  totalSavings,
  avgPayback,
  avgROI
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

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <div className="bg-white border border-sky-gray rounded-lg shadow-mist p-4">
        <h3 className="text-lg font-semibold text-soft-navy mb-4">Summary</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-fog-gray rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-gray">Total Processes</span>
                <span className="text-lg font-semibold text-soft-navy">
                  {formatNumber(totalProcesses)}
                </span>
              </div>
            </div>
            
            <div className="bg-fog-gray rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-gray">Potential Savings</span>
                <span className="text-lg font-semibold text-mist-teal">
                  {formatCurrency(totalSavings)}
                </span>
              </div>
            </div>
            
            <div className="bg-fog-gray rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-gray">Avg. Payback</span>
                <span className="text-lg font-semibold text-soft-navy">
                  {avgPayback.toFixed(1)}m
                </span>
              </div>
            </div>
            
            <div className="bg-fog-gray rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-gray">Avg. ROI</span>
                <span className="text-lg font-semibold text-muted-indigo">
                  {avgROI.toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;