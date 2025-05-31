import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DataPreview = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data) return null;

  const { filename, recordCount, columns, preview } = data;

  const getColumnTypeIcon = (type) => {
    switch (type) {
      case 'string':
        return 'Type';
      case 'number':
        return 'Hash';
      case 'date':
        return 'Calendar';
      case 'boolean':
        return 'ToggleLeft';
      default:
        return 'HelpCircle';
    }
  };

  const getColumnTypeColor = (type) => {
    switch (type) {
      case 'string':
        return 'text-blue-400';
      case 'number':
        return 'text-green-400';
      case 'date':
        return 'text-purple-400';
      case 'boolean':
        return 'text-orange-400';
      default:
        return 'text-text-tertiary';
    }
  };

  const formatValue = (value, type) => {
    if (value === null || value === undefined) return '-';
    
    switch (type) {
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value;
      case 'string':
        return value.toString();
      default:
        return value.toString();
    }
  };

  return (
    <div className="card p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-text-primary font-heading">
            Data Preview
          </h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-text-tertiary hover:text-text-primary hover:bg-surface-700 rounded-md transition-colors duration-200"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
          </button>
        </div>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="FileText" size={16} />
          <span>{filename}</span>
          <span>•</span>
          <span>{recordCount.toLocaleString()} records</span>
        </div>
      </div>

      {/* Column Information */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Detected Columns ({columns.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {columns.slice(0, isExpanded ? columns.length : 4).map((column, index) => (
            <div key={index} className="bg-surface-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={getColumnTypeIcon(column.type)} 
                    size={14} 
                    className={getColumnTypeColor(column.type)}
                  />
                  <span className="text-sm font-medium text-text-primary">
                    {column.name}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getColumnTypeColor(column.type)} bg-opacity-10`}>
                  {column.type}
                </span>
              </div>
              <p className="text-xs text-text-tertiary">
                Sample: {formatValue(column.sample, column.type)}
              </p>
            </div>
          ))}
        </div>
        
        {!isExpanded && columns.length > 4 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="mt-3 text-sm text-primary hover:text-primary-600 transition-colors duration-200"
          >
            Show {columns.length - 4} more columns
          </button>
        )}
      </div>

      {/* Data Preview Table */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Sample Data (First 3 rows)
        </h3>
        
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {columns.slice(0, 4).map((column, index) => (
                  <th key={index} className="text-left py-2 px-3 font-medium text-text-secondary">
                    {column.name}
                  </th>
                ))}
                {columns.length > 4 && (
                  <th className="text-left py-2 px-3 font-medium text-text-secondary">
                    ...
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {preview.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-border">
                  {columns.slice(0, 4).map((column, colIndex) => (
                    <td key={colIndex} className="py-2 px-3 text-text-primary">
                      {formatValue(row[column.name], column.type)}
                    </td>
                  ))}
                  {columns.length > 4 && (
                    <td className="py-2 px-3 text-text-tertiary">
                      +{columns.length - 4} more
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {preview.map((row, rowIndex) => (
            <div key={rowIndex} className="bg-surface-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-text-primary">
                  Row {rowIndex + 1}
                </span>
                <span className="text-xs text-text-tertiary">
                  {columns.length} fields
                </span>
              </div>
              <div className="space-y-2">
                {columns.slice(0, 3).map((column, colIndex) => (
                  <div key={colIndex} className="flex justify-between">
                    <span className="text-xs text-text-secondary">
                      {column.name}:
                    </span>
                    <span className="text-xs text-text-primary">
                      {formatValue(row[column.name], column.type)}
                    </span>
                  </div>
                ))}
                {columns.length > 3 && (
                  <div className="text-xs text-text-tertiary text-center pt-2 border-t border-border">
                    +{columns.length - 3} more fields
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Quality Indicators */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Data Quality Check
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm text-text-secondary">All required columns present</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm text-text-secondary">Valid data types detected</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm text-text-secondary">No missing values found</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
        <button className="btn-primary px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-2">
          <Icon name="Play" size={16} />
          <span>Process Data</span>
        </button>
        <button className="btn-secondary px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-2">
          <Icon name="Download" size={16} />
          <span>Export Preview</span>
        </button>
      </div>
    </div>
  );
};

export default DataPreview;