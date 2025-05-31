import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
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
  const [sortBy, setSortBy] = useState('created');
  const [viewMode, setViewMode] = useState('grid');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Mock scenario data
  const scenarios = [
    {
      id: 1,
      name: "Customer Service Automation",
      description: "Automated customer support with AI chatbots and ticket routing system for improved response times and cost reduction.",
      provider: "OpenAI",
      totalSavings: 245000,
      monthlySavings: 20417,
      createdDate: "2024-01-15",
      lastModified: "2024-01-20",
      status: "active",
      tags: ["customer-service", "automation", "chatbot"],
      thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      processes: 12,
      roi: 340,
      paybackMonths: 8,
      confidence: 85
    },
    {
      id: 2,
      name: "Document Processing Pipeline",
      description: "AI-powered document analysis and data extraction system for invoice processing and contract management workflows.",
      provider: "Anthropic",
      totalSavings: 180000,
      monthlySavings: 15000,
      createdDate: "2024-01-10",
      lastModified: "2024-01-18",
      status: "draft",
      tags: ["document-processing", "ocr", "automation"],
      thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      processes: 8,
      roi: 280,
      paybackMonths: 10,
      confidence: 78
    },
    {
      id: 3,
      name: "Sales Lead Qualification",
      description: "Intelligent lead scoring and qualification system using machine learning to prioritize high-value prospects and optimize sales team efficiency.",
      provider: "Gemini",
      totalSavings: 320000,
      monthlySavings: 26667,
      createdDate: "2024-01-08",
      lastModified: "2024-01-22",
      status: "active",
      tags: ["sales", "lead-scoring", "crm"],
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      processes: 15,
      roi: 420,
      paybackMonths: 6,
      confidence: 92
    },
    {
      id: 4,
      name: "Inventory Optimization",
      description: "Predictive inventory management system using AI to forecast demand, optimize stock levels, and reduce carrying costs across multiple warehouses.",
      provider: "Bedrock",
      totalSavings: 150000,
      monthlySavings: 12500,
      createdDate: "2024-01-05",
      lastModified: "2024-01-15",
      status: "archived",
      tags: ["inventory", "forecasting", "supply-chain"],
      thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop",
      processes: 6,
      roi: 200,
      paybackMonths: 12,
      confidence: 70
    },
    {
      id: 5,
      name: "HR Recruitment Automation",
      description: "AI-driven candidate screening and interview scheduling system to streamline recruitment processes and improve hiring quality.",
      provider: "OpenAI",
      totalSavings: 95000,
      monthlySavings: 7917,
      createdDate: "2024-01-03",
      lastModified: "2024-01-12",
      status: "active",
      tags: ["hr", "recruitment", "screening"],
      thumbnail: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop",
      processes: 4,
      roi: 180,
      paybackMonths: 14,
      confidence: 65
    },
    {
      id: 6,
      name: "Financial Risk Assessment",
      description: "Automated credit risk evaluation and fraud detection system for loan applications and transaction monitoring with real-time alerts.",
      provider: "Anthropic",
      totalSavings: 410000,
      monthlySavings: 34167,
      createdDate: "2023-12-28",
      lastModified: "2024-01-25",
      status: "active",
      tags: ["finance", "risk-assessment", "fraud-detection"],
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      processes: 18,
      roi: 520,
      paybackMonths: 5,
      confidence: 88
    }
  ];

  const templateOptions = [
    {
      id: 'customer-service',
      name: 'Customer Service',
      description: 'AI chatbots and support automation',
      icon: 'MessageCircle',
      processes: ['Ticket routing', 'FAQ responses', 'Escalation management']
    },
    {
      id: 'document-processing',
      name: 'Document Processing',
      description: 'OCR and data extraction workflows',
      icon: 'FileText',
      processes: ['Invoice processing', 'Contract analysis', 'Form digitization']
    },
    {
      id: 'sales-automation',
      name: 'Sales Automation',
      description: 'Lead scoring and CRM optimization',
      icon: 'TrendingUp',
      processes: ['Lead qualification', 'Pipeline management', 'Proposal generation']
    },
    {
      id: 'hr-automation',
      name: 'HR Automation',
      description: 'Recruitment and employee management',
      icon: 'Users',
      processes: ['Resume screening', 'Interview scheduling', 'Onboarding']
    }
  ];

  const getProviderColor = (provider) => {
    const colors = {
      'OpenAI': 'bg-green-500',
      'Anthropic': 'bg-orange-500',
      'Gemini': 'bg-blue-500',
      'Bedrock': 'bg-purple-500'
    };
    return colors[provider] || 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-success text-white',
      'draft': 'bg-warning text-white',
      'archived': 'bg-secondary-400 text-white'
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredScenarios = scenarios.filter(scenario => {
    const matchesSearch = scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesProvider = filterProvider === 'all' || scenario.provider === filterProvider;
    
    const matchesSavings = filterSavings === 'all' || 
                          (filterSavings === 'high' && scenario.totalSavings >= 300000) ||
                          (filterSavings === 'medium' && scenario.totalSavings >= 150000 && scenario.totalSavings < 300000) ||
                          (filterSavings === 'low' && scenario.totalSavings < 150000);
    
    const matchesDate = filterDate === 'all' ||
                       (filterDate === 'recent' && new Date(scenario.createdDate) > new Date('2024-01-01')) ||
                       (filterDate === 'older' && new Date(scenario.createdDate) <= new Date('2024-01-01'));

    return matchesSearch && matchesProvider && matchesSavings && matchesDate;
  });

  const sortedScenarios = [...filteredScenarios].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'savings':
        return b.totalSavings - a.totalSavings;
      case 'created':
        return new Date(b.createdDate) - new Date(a.createdDate);
      case 'modified':
        return new Date(b.lastModified) - new Date(a.lastModified);
      default:
        return 0;
    }
  });

  const handleScenarioSelect = (scenarioId) => {
    setSelectedScenarios(prev => 
      prev.includes(scenarioId) 
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  const handleSelectAll = () => {
    if (selectedScenarios.length === sortedScenarios.length) {
      setSelectedScenarios([]);
    } else {
      setSelectedScenarios(sortedScenarios.map(s => s.id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedScenarios.length === 0) {
      showWarning('No Selection', 'Please select scenarios to perform bulk actions.');
      return;
    }

    switch (action) {
      case 'duplicate': showSuccess('Scenarios Duplicated', `${selectedScenarios.length} scenarios have been duplicated.`);
        break;
      case 'export':
        showSuccess('Export Started', `Exporting ${selectedScenarios.length} scenarios to CSV.`);
        break;
      case 'delete':
        setShowDeleteDialog(true);
        break;
      default:
        break;
    }
  };

  const handleDeleteConfirm = () => {
    showSuccess('Scenarios Deleted', `${selectedScenarios.length} scenarios have been deleted.`);
    setSelectedScenarios([]);
    setShowDeleteDialog(false);
  };

  const handleScenarioAction = (scenarioId, action) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    
    switch (action) {
      case 'edit': navigate('/roi-calculator', { state: { scenarioId } });
        break;
      case 'duplicate': showSuccess('Scenario Duplicated', `"${scenario.name}" has been duplicated.`);
        break;
      case 'share': showSuccess('Share Link Copied', 'Scenario share link copied to clipboard.');
        break;
      case 'archive': showSuccess('Scenario Archived', `"${scenario.name}" has been archived.`);
        break;
      case 'delete':
        showSuccess('Scenario Deleted', `"${scenario.name}" has been deleted.`);
        break;
      default:
        break;
    }
  };

  const handleCreateFromTemplate = (templateId) => {
    const template = templateOptions.find(t => t.id === templateId);
    showSuccess('Template Selected', `Creating new scenario from "${template.name}" template.`);
    setShowCreateDialog(false);
    navigate('/roi-calculator', { state: { templateId } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <Breadcrumb />
            <div className="mt-4 flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary font-heading">
                  Scenario Library
                </h1>
                <p className="mt-2 text-text-secondary">
                  Manage and organize your cost optimization scenarios
                </p>
              </div>
              <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                <button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Icon name="Plus" size={20} />
                  <span>New Scenario</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-surface border border-border rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="text"
                    placeholder="Search scenarios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-surface-700 border border-border rounded-md text-text-primary placeholder-text-tertiary focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
                  />
                </div>
              </div>

              {/* Provider Filter */}
              <div>
                <select
                  value={filterProvider}
                  onChange={(e) => setFilterProvider(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-700 border border-border rounded-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
                >
                  <option value="all">All Providers</option>
                  <option value="OpenAI">OpenAI</option>
                  <option value="Anthropic">Anthropic</option>
                  <option value="Gemini">Gemini</option>
                  <option value="Bedrock">Bedrock</option>
                </select>
              </div>

              {/* Savings Filter */}
              <div>
                <select
                  value={filterSavings}
                  onChange={(e) => setFilterSavings(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-700 border border-border rounded-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
                >
                  <option value="all">All Savings</option>
                  <option value="high">High (&gt;$300K)</option>
                  <option value="medium">Medium ($150K-$300K)</option>
                  <option value="low">Low (&lt;$150K)</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <select
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-700 border border-border rounded-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
                >
                  <option value="all">All Dates</option>
                  <option value="recent">Recent (2024)</option>
                  <option value="older">Older</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-700 border border-border rounded-md text-text-primary focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-200"
                >
                  <option value="created">Created Date</option>
                  <option value="modified">Last Modified</option>
                  <option value="name">Name</option>
                  <option value="savings">Total Savings</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedScenarios.length === sortedScenarios.length && sortedScenarios.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-text-secondary">
                    Select All ({selectedScenarios.length} selected)
                  </span>
                </label>

                {selectedScenarios.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleBulkAction('duplicate')}
                      className="px-3 py-1 text-sm bg-surface-700 text-text-primary border border-border rounded hover:bg-surface-600 transition-colors duration-200"
                    >
                      Duplicate
                    </button>
                    <button
                      onClick={() => handleBulkAction('export')}
                      className="px-3 py-1 text-sm bg-surface-700 text-text-primary border border-border rounded hover:bg-surface-600 transition-colors duration-200"
                    >
                      Export
                    </button>
                    <button
                      onClick={() => handleBulkAction('delete')}
                      className="px-3 py-1 text-sm bg-error text-white rounded hover:bg-error-600 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                <span className="text-sm text-text-secondary">
                  {sortedScenarios.length} scenarios
                </span>
                <div className="flex items-center border border-border rounded">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'} transition-colors duration-200`}
                  >
                    <Icon name="Grid3X3" size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'} transition-colors duration-200`}
                  >
                    <Icon name="List" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scenarios Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-elevation transition-all duration-200 group"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={scenario.thumbnail}
                      alt={scenario.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getProviderColor(scenario.provider)} text-white`}>
                        {scenario.provider}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(scenario.status)}`}>
                        {scenario.status}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <input
                        type="checkbox"
                        checked={selectedScenarios.includes(scenario.id)}
                        onChange={() => handleScenarioSelect(scenario.id)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-success text-white px-2 py-1 rounded text-sm font-medium">
                        {formatCurrency(scenario.totalSavings)}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-1">
                      {scenario.name}
                    </h3>
                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                      {scenario.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-text-tertiary">Processes</p>
                        <p className="text-sm font-medium text-text-primary">{scenario.processes}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary">ROI</p>
                        <p className="text-sm font-medium text-text-primary">{scenario.roi}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary">Payback</p>
                        <p className="text-sm font-medium text-text-primary">{scenario.paybackMonths} months</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary">Confidence</p>
                        <p className="text-sm font-medium text-text-primary">{scenario.confidence}%</p>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {scenario.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-surface-700 text-text-secondary rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {scenario.tags.length > 2 && (
                        <span className="px-2 py-1 text-xs bg-surface-700 text-text-secondary rounded">
                          +{scenario.tags.length - 2}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-text-tertiary">
                        Created {formatDate(scenario.createdDate)}
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleScenarioAction(scenario.id, 'edit')}
                          className="p-1 text-text-tertiary hover:text-text-primary transition-colors duration-200"
                          title="Edit scenario"
                        >
                          <Icon name="Edit" size={16} />
                        </button>
                        <button
                          onClick={() => handleScenarioAction(scenario.id, 'duplicate')}
                          className="p-1 text-text-tertiary hover:text-text-primary transition-colors duration-200"
                          title="Duplicate scenario"
                        >
                          <Icon name="Copy" size={16} />
                        </button>
                        <button
                          onClick={() => handleScenarioAction(scenario.id, 'share')}
                          className="p-1 text-text-tertiary hover:text-text-primary transition-colors duration-200"
                          title="Share scenario"
                        >
                          <Icon name="Share" size={16} />
                        </button>
                        <div className="relative group">
                          <button className="p-1 text-text-tertiary hover:text-text-primary transition-colors duration-200">
                            <Icon name="MoreVertical" size={16} />
                          </button>
                          <div className="absolute right-0 top-8 w-32 bg-surface border border-border rounded-lg shadow-elevation opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            <button
                              onClick={() => handleScenarioAction(scenario.id, 'archive')}
                              className="w-full px-3 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-surface-700 transition-colors duration-200"
                            >
                              Archive
                            </button>
                            <button
                              onClick={() => handleScenarioAction(scenario.id, 'delete')}
                              className="w-full px-3 py-2 text-left text-sm text-error hover:text-error-600 hover:bg-surface-700 transition-colors duration-200"
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
          ) : (
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-700 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedScenarios.length === sortedScenarios.length && sortedScenarios.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Scenario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Provider
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Total Savings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        ROI
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sortedScenarios.map((scenario) => (
                      <tr key={scenario.id} className="hover:bg-surface-700 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedScenarios.includes(scenario.id)}
                            onChange={() => handleScenarioSelect(scenario.id)}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={scenario.thumbnail}
                                alt={scenario.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-text-primary">
                                {scenario.name}
                              </div>
                              <div className="text-sm text-text-secondary line-clamp-1">
                                {scenario.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getProviderColor(scenario.provider)} text-white`}>
                            {scenario.provider}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-text-primary">
                            {formatCurrency(scenario.totalSavings)}
                          </div>
                          <div className="text-sm text-text-secondary">
                            {formatCurrency(scenario.monthlySavings)}/month
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-text-primary">
                            {scenario.roi}%
                          </div>
                          <div className="text-sm text-text-secondary">
                            {scenario.paybackMonths} months
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(scenario.status)}`}>
                            {scenario.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {formatDate(scenario.createdDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleScenarioAction(scenario.id, 'edit')}
                              className="p-1 text-text-tertiary hover:text-text-primary transition-colors duration-200"
                              title="Edit scenario"
                            >
                              <Icon name="Edit" size={16} />
                            </button>
                            <button
                              onClick={() => handleScenarioAction(scenario.id, 'duplicate')}
                              className="p-1 text-text-tertiary hover:text-text-primary transition-colors duration-200"
                              title="Duplicate scenario"
                            >
                              <Icon name="Copy" size={16} />
                            </button>
                            <button
                              onClick={() => handleScenarioAction(scenario.id, 'share')}
                              className="p-1 text-text-tertiary hover:text-text-primary transition-colors duration-200"
                              title="Share scenario"
                            >
                              <Icon name="Share" size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {sortedScenarios.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-surface rounded-full flex items-center justify-center mb-6">
                <Icon name="FolderOpen" size={48} className="text-text-tertiary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No scenarios found
              </h3>
              <p className="text-text-secondary mb-6">
                {searchQuery || filterProvider !== 'all' || filterSavings !== 'all' || filterDate !== 'all' ?'Try adjusting your filters or search terms.' :'Create your first cost optimization scenario to get started.'}
              </p>
              <button
                onClick={() => setShowCreateDialog(true)}
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
              >
                <Icon name="Plus" size={20} />
                <span>Create Scenario</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-modal">
          <div className="bg-surface border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">
                  Delete Scenarios
                </h3>
                <p className="text-sm text-text-secondary">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-text-secondary mb-6">
              Are you sure you want to delete {selectedScenarios.length} selected scenario{selectedScenarios.length > 1 ? 's' : ''}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-error text-white px-4 py-2 rounded-md hover:bg-error-600 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Scenario Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-modal">
          <div className="bg-surface border border-border rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-primary">
                Create New Scenario
              </h3>
              <button
                onClick={() => setShowCreateDialog(false)}
                className="p-2 text-text-tertiary hover:text-text-primary transition-colors duration-200"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowCreateDialog(false);
                  navigate('/roi-calculator');
                }}
                className="w-full p-4 border border-border rounded-lg hover:border-primary hover:bg-surface-700 transition-all duration-200 text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Plus" size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">Start from Scratch</h4>
                    <p className="text-sm text-text-secondary">Create a custom scenario with your own parameters</p>
                  </div>
                </div>
              </button>

              <div className="border-t border-border pt-4">
                <h4 className="font-medium text-text-primary mb-4">Or choose a template:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templateOptions.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleCreateFromTemplate(template.id)}
                      className="p-4 border border-border rounded-lg hover:border-primary hover:bg-surface-700 transition-all duration-200 text-left"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-surface-700 rounded-lg flex items-center justify-center">
                          <Icon name={template.icon} size={20} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-text-primary mb-1">{template.name}</h5>
                          <p className="text-sm text-text-secondary mb-2">{template.description}</p>
                          <div className="text-xs text-text-tertiary">
                            Includes: {template.processes.join(', ')}
                          </div>
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

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setShowCreateDialog(true)}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-primary text-white rounded-full shadow-elevation flex items-center justify-center hover:bg-primary-700 transition-colors duration-200 z-fab"
      >
        <Icon name="Plus" size={24} />
      </button>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};

export default ScenarioLibrary;