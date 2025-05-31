import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import ProcessTable from './components/ProcessTable';
import FilterPanel from './components/FilterPanel';
import SummaryPanel from './components/SummaryPanel';
import { useToast } from '../../components/ui/Toast';

const ProcessAnalysis = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [selectedProcesses, setSelectedProcesses] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    costRange: '',
    paybackPeriod: '',
    complexity: '',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'annualSavings',
    direction: 'desc'
  });

  // Mock process data
  const processData = [
    {
      id: 1,
      name: "Customer Support Ticket Classification",
      department: "Customer Service",
      manualCostPerYear: 245000,
      estimatedAICost: 18000,
      annualSavings: 227000,
      paybackMonths: 2.1,
      roiPercentage: 1261,
      complexity: "Low",
      urgency: "High",
      description: `Automated classification and routing of customer support tickets using natural language processing to categorize inquiries by priority, department, and issue type.

Current manual process involves 3 full-time agents spending 6 hours daily on ticket classification with 15% error rate causing delays and customer dissatisfaction.`,
      implementationTimeline: "6-8 weeks",
      riskLevel: "Low",
      requiredResources: ["AI/ML Engineer", "Customer Service Manager", "IT Support"],
      expectedAccuracy: "94%",
      volumePerMonth: 12500
    },
    {
      id: 2,
      name: "Invoice Processing & Data Extraction",
      department: "Finance",
      manualCostPerYear: 180000,
      estimatedAICost: 24000,
      annualSavings: 156000,
      paybackMonths: 3.2,
      roiPercentage: 650,
      complexity: "Medium",
      urgency: "High",
      description: `Automated extraction and validation of data from invoices, purchase orders, and receipts using OCR and machine learning for accounts payable processing.

Manual processing currently requires 2 full-time staff members handling 800+ invoices monthly with average processing time of 45 minutes per invoice.`,
      implementationTimeline: "10-12 weeks",
      riskLevel: "Medium",
      requiredResources: ["Finance Analyst", "AI/ML Engineer", "Compliance Officer"],
      expectedAccuracy: "96%",
      volumePerMonth: 800
    },
    {
      id: 3,
      name: "HR Resume Screening & Candidate Matching",
      department: "Human Resources",
      manualCostPerYear: 120000,
      estimatedAICost: 15000,
      annualSavings: 105000,
      paybackMonths: 4.1,
      roiPercentage: 700,
      complexity: "Medium",
      urgency: "Medium",
      description: `AI-powered resume screening and candidate matching system to automatically evaluate applications against job requirements and rank candidates by fit score.

Current manual screening process involves HR team spending 20 hours per week reviewing resumes with inconsistent evaluation criteria across different recruiters.`,
      implementationTimeline: "8-10 weeks",
      riskLevel: "Medium",
      requiredResources: ["HR Manager", "AI/ML Engineer", "Legal Counsel"],
      expectedAccuracy: "89%",
      volumePerMonth: 450
    },
    {
      id: 4,
      name: "Inventory Demand Forecasting",
      department: "Operations",
      manualCostPerYear: 95000,
      estimatedAICost: 22000,
      annualSavings: 73000,
      paybackMonths: 5.8,
      roiPercentage: 332,
      complexity: "High",
      urgency: "Medium",
      description: `Machine learning-based demand forecasting system to predict inventory needs, optimize stock levels, and reduce carrying costs while preventing stockouts.

Manual forecasting relies on spreadsheet analysis and historical trends without considering external factors like seasonality, market conditions, or promotional impacts.`,
      implementationTimeline: "14-16 weeks",
      riskLevel: "High",
      requiredResources: ["Operations Manager", "Data Scientist", "Supply Chain Analyst"],
      expectedAccuracy: "87%",
      volumePerMonth: 2500
    },
    {
      id: 5,
      name: "Contract Review & Risk Assessment",
      department: "Legal",
      manualCostPerYear: 200000,
      estimatedAICost: 35000,
      annualSavings: 165000,
      paybackMonths: 3.8,
      roiPercentage: 471,
      complexity: "High",
      urgency: "Low",
      description: `AI-powered contract analysis tool to identify key terms, flag potential risks, and ensure compliance with company policies and regulatory requirements.

Legal team currently spends 60% of time on routine contract reviews that could be automated, allowing focus on complex negotiations and strategic legal matters.`,
      implementationTimeline: "12-14 weeks",
      riskLevel: "High",
      requiredResources: ["Legal Counsel", "AI/ML Engineer", "Compliance Officer"],
      expectedAccuracy: "92%",
      volumePerMonth: 150
    },
    {
      id: 6,
      name: "Quality Control Image Analysis",
      department: "Manufacturing",
      manualCostPerYear: 85000,
      estimatedAICost: 19000,
      annualSavings: 66000,
      paybackMonths: 6.2,
      roiPercentage: 347,
      complexity: "Medium",
      urgency: "Low",
      description: `Computer vision system for automated quality control inspection of manufactured products to detect defects, measure dimensions, and ensure compliance with specifications.

Manual inspection process requires 2 quality control specialists working full-time with 8% defect detection miss rate leading to customer complaints and returns.`,
      implementationTimeline: "10-12 weeks",
      riskLevel: "Medium",
      requiredResources: ["Quality Manager", "Computer Vision Engineer", "Manufacturing Engineer"],
      expectedAccuracy: "95%",
      volumePerMonth: 5000
    }
  ];

  // Filter and sort processes
  const filteredAndSortedProcesses = useMemo(() => {
    let filtered = processData.filter(process => {
      const matchesDepartment = !filters.department || process.department === filters.department;
      const matchesComplexity = !filters.complexity || process.complexity === filters.complexity;
      const matchesSearch = !filters.search || 
        process.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        process.department.toLowerCase().includes(filters.search.toLowerCase());

      let matchesCostRange = true;
      if (filters.costRange) {
        const savings = process.annualSavings;
        switch (filters.costRange) {
          case 'under-50k':
            matchesCostRange = savings < 50000;
            break;
          case '50k-100k':
            matchesCostRange = savings >= 50000 && savings < 100000;
            break;
          case '100k-200k':
            matchesCostRange = savings >= 100000 && savings < 200000;
            break;
          case 'over-200k':
            matchesCostRange = savings >= 200000;
            break;
        }
      }

      let matchesPayback = true;
      if (filters.paybackPeriod) {
        const payback = process.paybackMonths;
        switch (filters.paybackPeriod) {
          case 'under-3':
            matchesPayback = payback < 3;
            break;
          case '3-6':
            matchesPayback = payback >= 3 && payback < 6;
            break;
          case '6-12':
            matchesPayback = payback >= 6 && payback < 12;
            break;
          case 'over-12':
            matchesPayback = payback >= 12;
            break;
        }
      }

      return matchesDepartment && matchesComplexity && matchesSearch && matchesCostRange && matchesPayback;
    });

    // Sort filtered results
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [filters, sortConfig]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleProcessSelection = (processIds) => {
    setSelectedProcesses(processIds);
  };

  const handleExportData = () => {
    const dataToExport = selectedProcesses.length > 0 
      ? filteredAndSortedProcesses.filter(p => selectedProcesses.includes(p.id))
      : filteredAndSortedProcesses;

    showSuccess(
      'Export Started',
      `Exporting ${dataToExport.length} processes to CSV format.`
    );
  };

  const handleGenerateReport = () => {
    if (selectedProcesses.length === 0) {
      showError(
        'No Selection',
        'Please select at least one process to generate a report.'
      );
      return;
    }

    showSuccess(
      'Report Generated',
      `Detailed analysis report created for ${selectedProcesses.length} processes.`
    );
  };

  const handleScheduleReview = () => {
    if (selectedProcesses.length === 0) {
      showError(
        'No Selection',
        'Please select processes to schedule a review meeting.'
      );
      return;
    }

    showSuccess(
      'Review Scheduled',
      `Review meeting scheduled for ${selectedProcesses.length} selected processes.`
    );
  };

  const activeFilterCount = Object.values(filters).filter(value => value && value.length > 0).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-6">
            <Breadcrumb />
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-text-primary font-heading">
                  Process Analysis
                </h1>
                <p className="mt-1 text-text-secondary">
                  Evaluate automation opportunities and calculate ROI for business processes
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                <button
                  onClick={handleExportData}
                  className="flex items-center space-x-2 px-4 py-2 bg-surface text-text-primary border border-border rounded-md hover:bg-surface-700 transition-colors duration-200"
                >
                  <Icon name="Download" size={16} />
                  <span>Export</span>
                </button>
                
                <button
                  onClick={() => navigate('/roi-calculator')}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
                >
                  <Icon name="Calculator" size={16} />
                  <span>ROI Calculator</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters and Summary */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
            <div className="xl:col-span-3">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                activeFilterCount={activeFilterCount}
                totalProcesses={processData.length}
                filteredCount={filteredAndSortedProcesses.length}
              />
            </div>
            
            <div className="xl:col-span-1">
              <SummaryPanel
                processes={filteredAndSortedProcesses}
                selectedProcesses={selectedProcesses}
                onGenerateReport={handleGenerateReport}
                onScheduleReview={handleScheduleReview}
              />
            </div>
          </div>

          {/* Process Table */}
          <div className="bg-surface border border-border rounded-lg shadow-base">
            <ProcessTable
              processes={filteredAndSortedProcesses}
              selectedProcesses={selectedProcesses}
              onProcessSelection={handleProcessSelection}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProcessAnalysis;