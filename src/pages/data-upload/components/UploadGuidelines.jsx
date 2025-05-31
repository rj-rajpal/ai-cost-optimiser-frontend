import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const UploadGuidelines = () => {
  const [activeTab, setActiveTab] = useState('requirements');

  const requirements = [
    {
      title: 'File Formats',
      description: 'CSV and JSON files are supported',
      icon: 'FileText',
      details: [
        'CSV files with comma-separated values',
        'JSON files with valid structure',
        'UTF-8 encoding recommended'
      ]
    },
    {
      title: 'File Size',
      description: 'Maximum 50MB per file',
      icon: 'HardDrive',
      details: [
        'Individual files up to 50MB',
        'Multiple files can be uploaded',
        'Larger files may take longer to process'
      ]
    },
    {
      title: 'Required Columns',
      description: 'Essential data fields for analysis',
      icon: 'Columns',
      details: [
        'process_name (string)',
        'current_cost (number)',
        'time_spent_hours (number)',
        'frequency_monthly (number)'
      ]
    },
    {
      title: 'Data Quality',
      description: 'Clean and consistent data',
      icon: 'CheckCircle',
      details: [
        'No missing values in required fields',
        'Consistent date formats',
        'Valid numeric values',
        'Unique process identifiers'
      ]
    }
  ];

  const csvTemplate = `process_name,current_cost,time_spent_hours,frequency_monthly,complexity_score,automation_potential
Invoice Processing,15000,120,500,7.5,85
Customer Support,22000,180,1200,6.2,72
Data Entry,8500,80,800,4.1,95
Report Generation,12000,100,300,5.8,88`;

  const jsonTemplate = `{
  "processes": [
    {
      "process_name": "Invoice Processing",
      "current_cost": 15000,
      "time_spent_hours": 120,
      "frequency_monthly": 500,
      "complexity_score": 7.5,
      "automation_potential": 85
    },
    {
      "process_name": "Customer Support",
      "current_cost": 22000,
      "time_spent_hours": 180,
      "frequency_monthly": 1200,
      "complexity_score": 6.2,
      "automation_potential": 72
    }
  ]
}`;

  const handleDownloadTemplate = (format) => {
    const content = format === 'csv' ? csvTemplate : jsonTemplate;
    const blob = new Blob([content], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `process_data_template.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary font-heading mb-2">
          Upload Guidelines
        </h2>
        <p className="text-text-secondary">
          Follow these guidelines to ensure successful data processing
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-surface-700 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('requirements')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'requirements' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
          }`}
        >
          Requirements
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'templates' ?'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
          }`}
        >
          Templates
        </button>
      </div>

      {/* Requirements Tab */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          {requirements.map((req, index) => (
            <div key={index} className="bg-surface-700 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-100 bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={req.icon} size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-text-primary mb-1">
                    {req.title}
                  </h3>
                  <p className="text-xs text-text-secondary mb-3">
                    {req.description}
                  </p>
                  <ul className="space-y-1">
                    {req.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-2">
                        <Icon name="Check" size={12} className="text-success flex-shrink-0" />
                        <span className="text-xs text-text-tertiary">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Download Templates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleDownloadTemplate('csv')}
                className="flex items-center justify-between p-3 bg-surface-700 rounded-lg hover:bg-surface transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <Icon name="FileText" size={20} className="text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-text-primary">CSV Template</p>
                    <p className="text-xs text-text-secondary">Comma-separated values</p>
                  </div>
                </div>
                <Icon name="Download" size={16} className="text-text-tertiary" />
              </button>
              
              <button
                onClick={() => handleDownloadTemplate('json')}
                className="flex items-center justify-between p-3 bg-surface-700 rounded-lg hover:bg-surface transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <Icon name="Braces" size={20} className="text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-text-primary">JSON Template</p>
                    <p className="text-xs text-text-secondary">JavaScript Object Notation</p>
                  </div>
                </div>
                <Icon name="Download" size={16} className="text-text-tertiary" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Sample Data Structure
            </h3>
            <div className="bg-surface-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-text-secondary">CSV Example</span>
                <button
                  onClick={() => navigator.clipboard.writeText(csvTemplate)}
                  className="text-xs text-primary hover:text-primary-600 transition-colors duration-200"
                >
                  Copy
                </button>
              </div>
              <pre className="text-xs text-text-tertiary font-mono overflow-x-auto">
                {csvTemplate}
              </pre>
            </div>
          </div>

          <div className="bg-warning-100 bg-opacity-10 border border-warning-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={16} className="text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-1">
                  Important Notes
                </h4>
                <ul className="text-xs text-text-secondary space-y-1">
                  <li>• Ensure column headers match exactly as shown in templates</li>
                  <li>• Use consistent units for cost (USD) and time (hours)</li>
                  <li>• Automation potential should be a percentage (0-100)</li>
                  <li>• Remove any special characters from process names</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadGuidelines;