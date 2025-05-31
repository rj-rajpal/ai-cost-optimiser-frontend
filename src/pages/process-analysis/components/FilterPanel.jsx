import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  activeFilterCount, 
  totalProcesses, 
  filteredCount 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const departments = [
    'Customer Service',
    'Finance', 
    'Human Resources',
    'Operations',
    'Legal',
    'Manufacturing'
  ];

  const costRanges = [
    { value: 'under-50k', label: 'Under $50K' },
    { value: '50k-100k', label: '$50K - $100K' },
    { value: '100k-200k', label: '$100K - $200K' },
    { value: 'over-200k', label: 'Over $200K' }
  ];

  const paybackPeriods = [
    { value: 'under-3', label: 'Under 3 months' },
    { value: '3-6', label: '3-6 months' },
    { value: '6-12', label: '6-12 months' },
    { value: 'over-12', label: 'Over 12 months' }
  ];

  const complexityLevels = ['Low', 'Medium', 'High'];

  const handleFilterUpdate = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFilterChange({
      department: '',
      costRange: '',
      paybackPeriod: '',
      complexity: '',
      search: ''
    });
  };

  const removeFilter = (key) => {
    handleFilterUpdate(key, '');
  };

  const getFilterLabel = (key, value) => {
    switch (key) {
      case 'department':
        return value;
      case 'costRange':
        return costRanges.find(range => range.value === value)?.label || value;
      case 'paybackPeriod':
        return paybackPeriods.find(period => period.value === value)?.label || value;
      case 'complexity':
        return `${value} Complexity`;
      case 'search':
        return `"${value}"`;
      default:
        return value;
    }
  };

  const activeFilters = Object.entries(filters).filter(([key, value]) => value && value.length > 0);

  return (
    <div className="bg-surface border border-border rounded-lg shadow-base">
      {/* Filter Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white">
                {activeFilterCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">
              {filteredCount} of {totalProcesses} processes
            </span>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200"
              aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
            >
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Search Processes
            </label>
            <div className="relative">
              <Icon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary"
              />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterUpdate('search', e.target.value)}
                placeholder="Search by name or department..."
                className="w-full pl-10 pr-4 py-2 bg-surface-700 border border-border text-text-primary placeholder-text-tertiary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
              />
            </div>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterUpdate('department', e.target.value)}
                className="w-full px-3 py-2 bg-surface-700 border border-border text-text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Cost Range Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Annual Savings
              </label>
              <select
                value={filters.costRange}
                onChange={(e) => handleFilterUpdate('costRange', e.target.value)}
                className="w-full px-3 py-2 bg-surface-700 border border-border text-text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
              >
                <option value="">All Ranges</option>
                {costRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Payback Period Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Payback Period
              </label>
              <select
                value={filters.paybackPeriod}
                onChange={(e) => handleFilterUpdate('paybackPeriod', e.target.value)}
                className="w-full px-3 py-2 bg-surface-700 border border-border text-text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
              >
                <option value="">All Periods</option>
                {paybackPeriods.map(period => (
                  <option key={period.value} value={period.value}>{period.label}</option>
                ))}
              </select>
            </div>

            {/* Complexity Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Complexity
              </label>
              <select
                value={filters.complexity}
                onChange={(e) => handleFilterUpdate('complexity', e.target.value)}
                className="w-full px-3 py-2 bg-surface-700 border border-border text-text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
              >
                <option value="">All Levels</option>
                {complexityLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-text-primary">Active Filters:</span>
              <button
                onClick={clearAllFilters}
                className="text-sm text-primary hover:text-primary-600 transition-colors duration-200"
              >
                Clear All
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm"
                >
                  <span>{getFilterLabel(key, value)}</span>
                  <button
                    onClick={() => removeFilter(key)}
                    className="hover:text-primary-600 transition-colors duration-200"
                    aria-label={`Remove ${key} filter`}
                  >
                    <Icon name="X" size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;