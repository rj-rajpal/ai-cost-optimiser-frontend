import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { useToast, ToastContainer } from '../../components/ui/Toast';
import UploadZone from './components/UploadZone';
import UploadHistory from './components/UploadHistory';
import UploadGuidelines from './components/UploadGuidelines';
import DataPreview from './components/DataPreview';

const DataUpload = () => {
  const [uploadHistory, setUploadHistory] = useState([
    {
      id: 1,
      filename: 'process_data_2024_q1.csv',
      uploadDate: new Date('2024-01-15T10:30:00'),
      status: 'complete',
      recordCount: 1247,
      fileSize: '2.3 MB',
      processedAt: new Date('2024-01-15T10:32:15'),
      errorMessage: null
    },
    {
      id: 2,
      filename: 'automation_opportunities.json',
      uploadDate: new Date('2024-01-10T14:22:00'),
      status: 'complete',
      recordCount: 89,
      fileSize: '456 KB',
      processedAt: new Date('2024-01-10T14:23:45'),
      errorMessage: null
    },
    {
      id: 3,
      filename: 'cost_analysis_data.csv',
      uploadDate: new Date('2024-01-08T09:15:00'),
      status: 'error',
      recordCount: 0,
      fileSize: '1.8 MB',
      processedAt: null,
      errorMessage: 'Invalid data format: Missing required columns (process_name, current_cost)'
    },
    {
      id: 4,
      filename: 'monthly_metrics_dec.json',
      uploadDate: new Date('2024-01-05T16:45:00'),
      status: 'parsing',
      recordCount: 0,
      fileSize: '3.1 MB',
      processedAt: null,
      errorMessage: null
    }
  ]);
  const [activeUploads, setActiveUploads] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast();

  const handleFileUpload = (files) => {
    const newUploads = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      filename: file.name,
      fileSize: formatFileSize(file.size),
      status: 'uploading',
      progress: 0,
      uploadDate: new Date(),
      recordCount: 0,
      errorMessage: null
    }));

    setActiveUploads(prev => [...prev, ...newUploads]);

    // Simulate upload process for each file
    newUploads.forEach(upload => {
      simulateUpload(upload);
    });
  };

  const simulateUpload = (upload) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Simulate processing
        setTimeout(() => {
          const isSuccess = Math.random() > 0.3; // 70% success rate
          
          if (isSuccess) {
            const recordCount = Math.floor(Math.random() * 2000) + 100;
            const completedUpload = {
              ...upload,
              id: Date.now() + Math.random(),
              status: 'complete',
              progress: 100,
              recordCount,
              processedAt: new Date(),
              errorMessage: null
            };
            
            setUploadHistory(prev => [completedUpload, ...prev]);
            setActiveUploads(prev => prev.filter(u => u.id !== upload.id));
            
            // Generate preview data for successful uploads
            if (upload.filename.endsWith('.csv') || upload.filename.endsWith('.json')) {
              generatePreviewData(completedUpload);
            }
            
            showSuccess(
              'Upload Complete',
              `${upload.filename} has been successfully processed with ${recordCount} records.`
            );
          } else {
            const errorMessages = [
              'Invalid data format: Missing required columns',
              'File size exceeds maximum limit',
              'Unsupported file format',
              'Data validation failed: Invalid date formats',
              'Processing timeout: File too large'
            ];
            
            const errorMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            const failedUpload = {
              ...upload,
              status: 'error',
              progress: 100,
              recordCount: 0,
              processedAt: null,
              errorMessage
            };
            
            setUploadHistory(prev => [failedUpload, ...prev]);
            setActiveUploads(prev => prev.filter(u => u.id !== upload.id));
            
            showError(
              'Upload Failed',
              `${upload.filename}: ${errorMessage}`
            );
          }
        }, 1000);
      } else {
        setActiveUploads(prev => 
          prev.map(u => 
            u.id === upload.id 
              ? { ...u, progress, status: progress > 50 ? 'parsing' : 'uploading' }
              : u
          )
        );
      }
    }, 200);
  };

  const generatePreviewData = (upload) => {
    const sampleData = {
      filename: upload.filename,
      recordCount: upload.recordCount,
      columns: [
        { name: 'process_name', type: 'string', sample: 'Invoice Processing' },
        { name: 'current_cost', type: 'number', sample: '15000' },
        { name: 'time_spent_hours', type: 'number', sample: '120' },
        { name: 'frequency_monthly', type: 'number', sample: '500' },
        { name: 'complexity_score', type: 'number', sample: '7.5' },
        { name: 'automation_potential', type: 'number', sample: '85' }
      ],
      preview: [
        {
          process_name: 'Invoice Processing',
          current_cost: 15000,
          time_spent_hours: 120,
          frequency_monthly: 500,
          complexity_score: 7.5,
          automation_potential: 85
        },
        {
          process_name: 'Customer Support Tickets',
          current_cost: 22000,
          time_spent_hours: 180,
          frequency_monthly: 1200,
          complexity_score: 6.2,
          automation_potential: 72
        },
        {
          process_name: 'Data Entry Tasks',
          current_cost: 8500,
          time_spent_hours: 80,
          frequency_monthly: 800,
          complexity_score: 4.1,
          automation_potential: 95
        }
      ]
    };
    
    setPreviewData(sampleData);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRetryUpload = (uploadId) => {
    const upload = uploadHistory.find(u => u.id === uploadId);
    if (upload) {
      const retryUpload = {
        ...upload,
        id: Date.now() + Math.random(),
        status: 'uploading',
        progress: 0,
        uploadDate: new Date(),
        recordCount: 0,
        errorMessage: null,
        processedAt: null
      };
      
      setActiveUploads(prev => [...prev, retryUpload]);
      simulateUpload(retryUpload);
      
      showWarning(
        'Retrying Upload',
        `Retrying upload for ${upload.filename}`
      );
    }
  };

  const handleDeleteUpload = (uploadId) => {
    setUploadHistory(prev => prev.filter(u => u.id !== uploadId));
    showSuccess(
      'Upload Deleted',
      'Upload record has been removed from history.'
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <Breadcrumb />
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-text-primary font-heading">
                Data Upload
              </h1>
              <p className="text-text-secondary mt-2">
                Import process data through CSV or JSON files to analyze automation opportunities and cost optimization potential.
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Section - Upload Area and History */}
            <div className="xl:col-span-8 space-y-6">
              {/* Upload Zone */}
              <UploadZone 
                onFileUpload={handleFileUpload}
                activeUploads={activeUploads}
              />

              {/* Upload History */}
              <UploadHistory 
                uploadHistory={uploadHistory}
                onRetryUpload={handleRetryUpload}
                onDeleteUpload={handleDeleteUpload}
              />
            </div>

            {/* Right Section - Guidelines and Preview */}
            <div className="xl:col-span-4 space-y-6">
              {/* Upload Guidelines */}
              <UploadGuidelines />

              {/* Data Preview */}
              {previewData && (
                <DataPreview data={previewData} />
              )}
            </div>
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};

export default DataUpload;