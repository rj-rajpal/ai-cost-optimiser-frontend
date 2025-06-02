import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import { useToast, ToastContainer } from '../../components/ui/Toast';

const ScenarioLibrary = () => {
  const navigate = useNavigate();
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast();
  const [selectedScenarios, setSelectedScenarios] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProvider, setFilterProvider] = useState('all');
  const [filterSavings, setFilterSavings] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [sortBy, setSortBy] = useState('created_desc');
  const [viewMode, setViewMode] = useState('grid');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [scenarioToDelete, setScenarioToDelete] = useState(null);

  // Mock data for scenarios
  const scenarios = [
    {
      id: 1,
      name: 'Manufacturing Process Optimization',
      description: 'Automation opportunities in assembly line operations with focus on quality control and efficiency improvements.',
      provider: 'OpenAI',
      processes: 12,
      potentialSavings: 250000,
      roi: 180,
      paybackMonths: 8,
      confidence: 87,
      tags: ['Manufacturing', 'Automation', 'Quality Control'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop&crop=center',
      complexity: 'Medium',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Customer Service Enhancement',
      description: 'AI-powered customer support automation to reduce response times and improve satisfaction scores.',
      provider: 'Anthropic',
      processes: 8,
      potentialSavings: 180000,
      roi: 220,
      paybackMonths: 6,
      confidence: 92,
      tags: ['Customer Service', 'AI', 'Support'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&h=200&fit=crop&crop=center',
      complexity: 'Low',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Financial Data Analysis',
      description: 'Automated financial reporting and anomaly detection for faster decision making and risk management.',
      provider: 'Google',
      processes: 15,
      potentialSavings: 350000,
      roi: 165,
      paybackMonths: 10,
      confidence: 78,
      tags: ['Finance', 'Analytics', 'Risk Management'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-15'),
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop&crop=center',
      complexity: 'High',
      status: 'Draft'
    },
    {
      id: 4,
      name: 'Supply Chain Optimization',
      description: 'End-to-end supply chain automation including inventory management and demand forecasting.',
      provider: 'AWS',
      processes: 20,
      potentialSavings: 420000,
      roi: 195,
      paybackMonths: 9,
      confidence: 85,
      tags: ['Supply Chain', 'Inventory', 'Forecasting'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-12'),
      thumbnail: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&h=200&fit=crop&crop=center',
      complexity: 'High',
      status: 'Active'
    },
    {
      id: 5,
      name: 'HR Process Automation',
      description: 'Streamline recruitment, onboarding, and employee management processes using AI assistance.',
      provider: 'OpenAI',
      processes: 6,
      potentialSavings: 95000,
      roi: 140,
      paybackMonths: 12,
      confidence: 81,
      tags: ['HR', 'Recruitment', 'Onboarding'],
      createdAt: new Date('2023-12-28'),
      updatedAt: new Date('2024-01-08'),
      thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=200&fit=crop&crop=center',
      complexity: 'Medium',
      status: 'Active'
    },
    {
      id: 6,
      name: 'Content Marketing Automation',
      description: 'AI-driven content creation and social media management for improved marketing efficiency.',
      provider: 'Anthropic',
      processes: 10,
      potentialSavings: 125000,
      roi: 175,
      paybackMonths: 7,
      confidence: 89,
      tags: ['Marketing', 'Content', 'Social Media'],
      createdAt: new Date('2023-12-20'),
      updatedAt: new Date('2024-01-05'),
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop&crop=center',
      complexity: 'Low',
      status: 'Active'
    }
  ];

  // Filtered and sorted scenarios
  const filteredAndSortedScenarios = scenarios
    .filter(scenario => {
      const matchesSearch = scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scenario.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesProvider = filterProvider === 'all' || scenario.provider === filterProvider;
      
      const matchesSavings = filterSavings === 'all' || 
        (filterSavings === 'low' && scenario.potentialSavings < 150000) ||
        (filterSavings === 'medium' && scenario.potentialSavings >= 150000 && scenario.potentialSavings < 300000) ||
        (filterSavings === 'high' && scenario.potentialSavings >= 300000);
      
      const matchesDate = filterDate === 'all' ||
        (filterDate === 'week' && scenario.createdAt >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (filterDate === 'month' && scenario.createdAt >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
        (filterDate === 'quarter' && scenario.createdAt >= new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));
      
      return matchesSearch && matchesProvider && matchesSavings && matchesDate;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'savings_asc':
          return a.potentialSavings - b.potentialSavings;
        case 'savings_desc':
          return b.potentialSavings - a.potentialSavings;
        case 'roi_asc':
          return a.roi - b.roi;
        case 'roi_desc':
          return b.roi - a.roi;
        case 'created_asc':
          return a.createdAt - b.createdAt;
        case 'created_desc':
          return b.createdAt - a.createdAt;
        default:
          return 0;
      }
    });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleScenarioSelect = (scenarioId) => {
    setSelectedScenarios(prev => {
      if (prev.includes(scenarioId)) {
        return prev.filter(id => id !== scenarioId);
      } else {
        return [...prev, scenarioId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedScenarios.length === filteredAndSortedScenarios.length) {
      setSelectedScenarios([]);
    } else {
      setSelectedScenarios(filteredAndSortedScenarios.map(s => s.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedScenarios.length === 0) return;
    
    if (selectedScenarios.length === 1) {
      const scenario = scenarios.find(s => s.id === selectedScenarios[0]);
      setScenarioToDelete(scenario);
      setShowDeleteDialog(true);
    } else {
      showWarning(`Delete ${selectedScenarios.length} scenarios?`, 'This action cannot be undone.');
    }
  };

  const confirmDelete = () => {
    showSuccess('Scenarios deleted successfully');
    setSelectedScenarios([]);
    setShowDeleteDialog(false);
    setScenarioToDelete(null);
  };

  const handleDuplicateScenario = (scenario) => {
    showSuccess(`"${scenario.name}" duplicated successfully`);
  };

  const handleExportSelected = () => {
    if (selectedScenarios.length === 0) {
      showWarning('No scenarios selected', 'Please select scenarios to export.');
      return;
    }
    
    showSuccess(`Exported ${selectedScenarios.length} scenario${selectedScenarios.length > 1 ? 's' : ''}`);
  };

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Low':
        return 'bg-mist-teal/10 text-mist-teal border-mist-teal';
      case 'Medium':
        return 'bg-soft-amber/10 text-soft-amber border-soft-amber';
      case 'High':
        return 'bg-soft-rose/10 text-soft-rose border-soft-rose';
      default:
        return 'bg-fog-gray text-slate-gray border-sky-gray';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-mist-teal/10 text-mist-teal border-mist-teal';
      case 'Draft':
        return 'bg-soft-amber/10 text-soft-amber border-soft-amber';
      case 'Archived':
        return 'bg-slate-gray/10 text-slate-gray border-slate-gray';
      default:
        return 'bg-fog-gray text-slate-gray border-sky-gray';
    }
  };

  const getProviderColor = (provider) => {
    switch (provider) {
      case 'OpenAI':
        return 'bg-green-100 text-green-800';
      case 'Anthropic':
        return 'bg-blue-100 text-blue-800';
      case 'Google':
        return 'bg-yellow-100 text-yellow-800';
      case 'AWS':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-fog-gray text-slate-gray';
    }
  };

  return (
    <div className="bg-cloud-white">
      {/* Search and Filters */}
      <div className="bg-white border border-sky-gray rounded-lg p-6 mb-6 shadow-mist">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-gray" />
              <input
                type="text"
                placeholder="Search scenarios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-sky-gray rounded-md focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="px-3 py-2 border border-sky-gray rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo"
            >
              <option value="all">All Providers</option>
              <option value="OpenAI">OpenAI</option>
              <option value="Anthropic">Anthropic</option>
              <option value="Google">Google</option>
              <option value="AWS">AWS</option>
            </select>

            <select
              value={filterSavings}
              onChange={(e) => setFilterSavings(e.target.value)}
              className="px-3 py-2 border border-sky-gray rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo"
            >
              <option value="all">All Savings</option>
              <option value="low">Under $150K</option>
              <option value="medium">$150K - $300K</option>
              <option value="high">Over $300K</option>
            </select>

            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-2 border border-sky-gray rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-sky-gray">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-gray">
              {filteredAndSortedScenarios.length} scenario{filteredAndSortedScenarios.length !== 1 ? 's' : ''}
              {selectedScenarios.length > 0 && ` (${selectedScenarios.length} selected)`}
            </span>

            {selectedScenarios.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportSelected}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-muted-indigo hover:text-soft-navy transition-colors duration-200"
                >
                  <Icon name="Download" size={14} />
                  <span>Export</span>
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-soft-rose hover:text-red-600 transition-colors duration-200"
                >
                  <Icon name="Trash2" size={14} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-sky-gray rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-muted-indigo focus:border-muted-indigo"
            >
              <option value="created_desc">Newest First</option>
              <option value="created_asc">Oldest First</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
              <option value="savings_desc">Highest Savings</option>
              <option value="savings_asc">Lowest Savings</option>
              <option value="roi_desc">Highest ROI</option>
              <option value="roi_asc">Lowest ROI</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-fog-gray rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-white text-soft-navy shadow-sm' : 'text-slate-gray hover:text-soft-navy'
                }`}
              >
                <Icon name="Grid3X3" size={16} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded transition-colors duration-200 ${
                  viewMode === 'table' ? 'bg-white text-soft-navy shadow-sm' : 'text-slate-gray hover:text-soft-navy'
                }`}
              >
                <Icon name="List" size={16} />
              </button>
            </div>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-muted-indigo text-white rounded-md hover:bg-soft-navy transition-colors duration-200"
            >
              <Icon name="Plus" size={16} />
              <span>Create Scenario</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredAndSortedScenarios.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-fog-gray rounded-full flex items-center justify-center mb-6">
            <Icon name="FolderOpen" size={48} className="text-slate-gray" />
          </div>
          <h3 className="text-xl font-semibold text-soft-navy mb-2">
            No scenarios found
          </h3>
          <p className="text-slate-gray mb-6">
            {searchQuery || filterProvider !== 'all' || filterSavings !== 'all' || filterDate !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'Get started by creating your first optimization scenario.'}
          </p>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-muted-indigo text-white rounded-md hover:bg-soft-navy transition-colors duration-200"
          >
            <Icon name="Plus" size={16} />
            <span>Create First Scenario</span>
          </button>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="bg-white border border-sky-gray rounded-lg overflow-hidden hover:shadow-mist transition-all duration-200 group"
                >
                  {/* Thumbnail and Selection */}
                  <div className="relative">
                    <Image
                      src={scenario.thumbnail}
                      alt={scenario.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <input
                        type="checkbox"
                        checked={selectedScenarios.includes(scenario.id)}
                        onChange={() => handleScenarioSelect(scenario.id)}
                        className="rounded border-sky-gray text-muted-indigo focus:ring-muted-indigo"
                      />
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(scenario.status)}`}>
                        {scenario.status}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-soft-navy mb-2 line-clamp-1">
                      {scenario.name}
                    </h3>
                    <p className="text-sm text-slate-gray mb-4 line-clamp-2">
                      {scenario.description}
                    </p>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-gray">Processes</p>
                        <p className="text-sm font-medium text-soft-navy">{scenario.processes}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-gray">ROI</p>
                        <p className="text-sm font-medium text-soft-navy">{scenario.roi}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-gray">Payback</p>
                        <p className="text-sm font-medium text-soft-navy">{scenario.paybackMonths} months</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-gray">Confidence</p>
                        <p className="text-sm font-medium text-soft-navy">{scenario.confidence}%</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {scenario.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-fog-gray text-slate-gray rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {scenario.tags.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-fog-gray text-slate-gray rounded">
                          +{scenario.tags.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-gray">
                        Updated {formatDate(scenario.updatedAt)}
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleDuplicateScenario(scenario)}
                          className="p-1 text-slate-gray hover:text-soft-navy transition-colors duration-200"
                        >
                          <Icon name="Copy" size={14} />
                        </button>
                        <button
                          onClick={() => navigate(`/scenario/${scenario.id}/edit`)}
                          className="p-1 text-slate-gray hover:text-soft-navy transition-colors duration-200"
                        >
                          <Icon name="Edit" size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setScenarioToDelete(scenario);
                            setShowDeleteDialog(true);
                          }}
                          className="p-1 text-slate-gray hover:text-soft-navy transition-colors duration-200"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                        <div className="relative group/menu">
                          <button className="p-1 text-slate-gray hover:text-soft-navy transition-colors duration-200">
                            <Icon name="MoreVertical" size={14} />
                          </button>
                          <div className="absolute right-0 top-8 w-32 bg-white border border-sky-gray rounded-lg shadow-mist opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-200 z-10">
                            <button
                              onClick={() => navigate(`/scenario/${scenario.id}`)}
                              className="w-full px-3 py-2 text-left text-sm text-slate-gray hover:text-soft-navy hover:bg-fog-gray transition-colors duration-200"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => {
                                setScenarioToDelete(scenario);
                                setShowDeleteDialog(true);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-soft-rose hover:text-red-600 hover:bg-fog-gray transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-white border border-sky-gray rounded-lg overflow-hidden shadow-mist">
              {/* Table Header */}
              <thead className="bg-fog-gray border-b border-sky-gray">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedScenarios.length === filteredAndSortedScenarios.length}
                      onChange={handleSelectAll}
                      className="rounded border-sky-gray text-muted-indigo focus:ring-muted-indigo"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">
                    Scenario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">
                    Processes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">
                    Savings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">
                    ROI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-gray uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-gray">
                {filteredAndSortedScenarios.map((scenario) => (
                  <tr key={scenario.id} className="hover:bg-fog-gray transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedScenarios.includes(scenario.id)}
                        onChange={() => handleScenarioSelect(scenario.id)}
                        className="rounded border-sky-gray text-muted-indigo focus:ring-muted-indigo"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Image
                            className="h-10 w-10 rounded-lg object-cover"
                            src={scenario.thumbnail}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-soft-navy">
                            {scenario.name}
                          </div>
                          <div className="text-sm text-slate-gray line-clamp-1">
                            {scenario.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProviderColor(scenario.provider)}`}>
                        {scenario.provider}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-soft-navy">
                        {scenario.processes}
                      </div>
                      <div className="text-sm text-slate-gray">
                        processes
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-soft-navy">
                        {formatCurrency(scenario.potentialSavings)}
                      </div>
                      <div className="text-sm text-slate-gray">
                        potential
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-mist-teal">
                        {scenario.roi}%
                      </div>
                      <div className="text-sm text-slate-gray">
                        {scenario.paybackMonths}m payback
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-gray">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(scenario.status)}`}>
                        {scenario.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/scenario/${scenario.id}`)}
                          className="p-1 text-slate-gray hover:text-soft-navy transition-colors duration-200"
                        >
                          <Icon name="Eye" size={14} />
                        </button>
                        <button
                          onClick={() => navigate(`/scenario/${scenario.id}/edit`)}
                          className="p-1 text-slate-gray hover:text-soft-navy transition-colors duration-200"
                        >
                          <Icon name="Edit" size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setScenarioToDelete(scenario);
                            setShowDeleteDialog(true);
                          }}
                          className="p-1 text-slate-gray hover:text-soft-navy transition-colors duration-200"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-sky-gray rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <Icon name="AlertTriangle" size={24} className="text-soft-rose mr-3" />
              <h3 className="text-lg font-semibold text-soft-navy">
                Delete Scenario
              </h3>
            </div>
            <p className="text-slate-gray mb-6">
              Are you sure you want to delete "{scenarioToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-slate-gray hover:text-soft-navy transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-soft-rose text-white rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Scenario Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-sky-gray rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-soft-navy">
                Create New Scenario
              </h3>
              <button
                onClick={() => setShowCreateDialog(false)}
                className="p-2 text-slate-gray hover:text-soft-navy transition-colors duration-200"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Quick Start Options */}
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowCreateDialog(false);
                  navigate('/scenario/create');
                }}
                className="w-full p-4 border border-sky-gray rounded-lg hover:border-muted-indigo hover:bg-fog-gray transition-all duration-200 text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted-indigo rounded-lg flex items-center justify-center">
                    <Icon name="Plus" size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-soft-navy">Start from Scratch</h4>
                    <p className="text-sm text-slate-gray">Create a custom scenario with your own parameters</p>
                  </div>
                </div>
              </button>

              <div className="border-t border-sky-gray pt-4">
                <h4 className="font-medium text-soft-navy mb-4">Or choose a template:</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Manufacturing Automation', description: 'Optimize production processes', icon: 'Factory' },
                    { name: 'Customer Service AI', description: 'Enhance support efficiency', icon: 'Headphones' },
                    { name: 'Financial Analysis', description: 'Automate reporting tasks', icon: 'Calculator' }
                  ].map((template, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setShowCreateDialog(false);
                        navigate(`/scenario/create?template=${template.name.toLowerCase().replace(' ', '-')}`);
                      }}
                      className="p-4 border border-sky-gray rounded-lg hover:border-muted-indigo hover:bg-fog-gray transition-all duration-200 text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-fog-gray rounded-lg flex items-center justify-center">
                          <Icon name={template.icon} size={20} className="text-slate-gray" />
                        </div>
                        <div>
                          <h5 className="font-medium text-soft-navy mb-1">{template.name}</h5>
                          <p className="text-sm text-slate-gray mb-2">{template.description}</p>
                          <div className="text-xs text-slate-gray"></div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Create Button */}
      <button
        onClick={() => setShowCreateDialog(true)}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-muted-indigo text-white rounded-full shadow-mist flex items-center justify-center hover:bg-soft-navy transition-colors duration-200 z-50"
      >
        <Icon name="Plus" size={24} />
      </button>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};

export default ScenarioLibrary;