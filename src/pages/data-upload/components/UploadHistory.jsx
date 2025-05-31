import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const UploadHistory = ({ uploadHistory, onRetryUpload, onDeleteUpload }) => {
  const [sortField, setSortField] = useState('uploadDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedHistory = uploadHistory
    .filter(upload => filterStatus === 'all' || upload.status === filterStatus)
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'uploadDate' || sortField === 'processedAt') {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusBadge = (status) => {
    const statusConfig = {
      complete: {
        label: 'Complete',
        className: 'bg-success-100 text-success-600 border-success-200',
        icon: 'CheckCircle'
      },
      error: {
        label: 'Error',
        className: 'bg-error-100 text-error-600 border-error-200',
        icon: 'XCircle'
      },
      parsing: {
        label: 'Processing',
        className: 'bg-warning-100 text-warning-600 border-warning-200',
        icon: 'Clock'
      },
      uploading: {
        label: 'Uploading',
        className: 'bg-primary-100 text-primary-600 border-primary-200',
        icon: 'Upload'
      }
    };

    const config = statusConfig[status] || statusConfig.error;

    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        <Icon name={config.icon} size={12} />
        <span>{config.label}</span>
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary font-heading mb-2">
            Upload History
          </h2>
          <p className="text-text-secondary">
            Track and manage your previous data uploads
          </p>
        </div>
        
        {/* Filter Controls */}
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-surface-700 border border-border text-text-primary text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="complete">Complete</option>
            <option value="error">Error</option>
            <option value="parsing">Processing</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('filename')}
                  className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  <span className="font-medium">Filename</span>
                  <Icon name={getSortIcon('filename')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('uploadDate')}
                  className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  <span className="font-medium">Upload Date</span>
                  <Icon name={getSortIcon('uploadDate')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <span className="font-medium text-text-secondary">Status</span>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('recordCount')}
                  className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  <span className="font-medium">Records</span>
                  <Icon name={getSortIcon('recordCount')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <span className="font-medium text-text-secondary">Size</span>
              </th>
              <th className="text-right py-3 px-4">
                <span className="font-medium text-text-secondary">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedHistory.map((upload) => (
              <tr key={upload.id} className="border-b border-border hover:bg-surface-700 transition-colors duration-200">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={upload.filename.endsWith('.csv') ? 'FileText' : 'Braces'} 
                      size={16} 
                      className="text-text-tertiary"
                    />
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {upload.filename}
                      </p>
                      {upload.errorMessage && (
                        <p className="text-xs text-error mt-1">
                          {upload.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-text-secondary">
                    {formatDate(upload.uploadDate)}
                  </p>
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(upload.status)}
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-text-primary">
                    {upload.recordCount > 0 ? upload.recordCount.toLocaleString() : '-'}
                  </p>
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-text-secondary">
                    {upload.fileSize}
                  </p>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end space-x-2">
                    {upload.status === 'error' && (
                      <button
                        onClick={() => onRetryUpload(upload.id)}
                        className="p-2 text-text-tertiary hover:text-primary hover:bg-surface rounded-md transition-colors duration-200"
                        title="Retry upload"
                      >
                        <Icon name="RotateCcw" size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteUpload(upload.id)}
                      className="p-2 text-text-tertiary hover:text-error hover:bg-surface rounded-md transition-colors duration-200"
                      title="Delete upload"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredAndSortedHistory.map((upload) => (
          <div key={upload.id} className="bg-surface-700 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Icon 
                  name={upload.filename.endsWith('.csv') ? 'FileText' : 'Braces'} 
                  size={20} 
                  className="text-text-tertiary"
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {upload.filename}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {formatDate(upload.uploadDate)}
                  </p>
                </div>
              </div>
              {getStatusBadge(upload.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-text-tertiary">Records</p>
                <p className="text-sm text-text-primary">
                  {upload.recordCount > 0 ? upload.recordCount.toLocaleString() : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-tertiary">Size</p>
                <p className="text-sm text-text-primary">
                  {upload.fileSize}
                </p>
              </div>
            </div>
            
            {upload.errorMessage && (
              <div className="mb-3 p-2 bg-error-100 bg-opacity-10 border border-error-200 rounded-md">
                <p className="text-xs text-error">
                  {upload.errorMessage}
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-end space-x-2">
              {upload.status === 'error' && (
                <button
                  onClick={() => onRetryUpload(upload.id)}
                  className="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-primary hover:bg-surface rounded-md transition-colors duration-200"
                >
                  <Icon name="RotateCcw" size={14} />
                  <span>Retry</span>
                </button>
              )}
              <button
                onClick={() => onDeleteUpload(upload.id)}
                className="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-error hover:bg-surface rounded-md transition-colors duration-200"
              >
                <Icon name="Trash2" size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedHistory.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileX" size={48} className="text-text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No uploads found
          </h3>
          <p className="text-text-secondary">
            {filterStatus === 'all' ?'Upload your first data file to get started.' 
              : `No uploads with status "${filterStatus}" found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadHistory;