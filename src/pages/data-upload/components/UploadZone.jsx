import React, { useCallback, useState } from 'react';
import Icon from '../../../components/AppIcon';

const UploadZone = ({ onFileUpload, activeUploads }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'text/csv' || 
      file.type === 'application/json'|| file.name.endsWith('.csv') ||
      file.name.endsWith('.json')
    );
    
    if (files.length > 0) {
      onFileUpload(files);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFileUpload(files);
    }
    e.target.value = '';
  }, [onFileUpload]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploading':
        return 'Upload';
      case 'parsing':
        return 'FileText';
      case 'complete':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      default:
        return 'File';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploading':
        return 'text-primary';
      case 'parsing':
        return 'text-warning';
      case 'complete':
        return 'text-success';
      case 'error':
        return 'text-error';
      default:
        return 'text-text-tertiary';
    }
  };

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary font-heading mb-2">
          Upload Process Data
        </h2>
        <p className="text-text-secondary">
          Drag and drop your CSV or JSON files here, or click to browse and select files.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-primary bg-primary-50 bg-opacity-5' :'border-border hover:border-primary hover:bg-surface-700'
          }
        `}
      >
        <input
          type="file"
          multiple
          accept=".csv,.json"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-surface-700 rounded-full flex items-center justify-center">
            <Icon 
              name={isDragOver ? 'Download' : 'Upload'} 
              size={32} 
              className={isDragOver ? 'text-primary' : 'text-text-tertiary'}
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-2">
              {isDragOver ? 'Drop files here' : 'Upload your data files'}
            </h3>
            <p className="text-text-secondary mb-4">
              Supports CSV and JSON formats up to 50MB per file
            </p>
            
            <button className="btn-primary px-6 py-2 rounded-md font-medium">
              Choose Files
            </button>
          </div>
        </div>

        {/* Format Examples */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-surface-700 rounded-md p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="FileText" size={16} className="text-primary" />
                <span className="text-sm font-medium text-text-primary">CSV Format</span>
              </div>
              <code className="text-xs text-text-secondary font-mono">
                process_name,current_cost,time_spent_hours
              </code>
            </div>
            
            <div className="bg-surface-700 rounded-md p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Braces" size={16} className="text-primary" />
                <span className="text-sm font-medium text-text-primary">JSON Format</span>
              </div>
              <code className="text-xs text-text-secondary font-mono">
                {"{"}"processes": [{"{"}"name": "...", "cost": 0{"}"}]{"}"}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Active Uploads */}
      {activeUploads.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Active Uploads ({activeUploads.length})
          </h3>
          
          <div className="space-y-3">
            {activeUploads.map((upload) => (
              <div key={upload.id} className="bg-surface-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={getStatusIcon(upload.status)} 
                      size={20} 
                      className={getStatusColor(upload.status)}
                    />
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {upload.filename}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {upload.fileSize} • {upload.status}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-text-primary">
                      {Math.round(upload.progress)}%
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-surface rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      upload.status === 'error' ? 'bg-error' : 'bg-primary'
                    }`}
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
                
                {upload.status === 'parsing' && (
                  <p className="text-xs text-text-tertiary mt-2">
                    Processing and validating data...
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadZone;