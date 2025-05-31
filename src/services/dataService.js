/**
 * Data Service
 * Handles all data upload and file management operations
 */

import api from '../lib/api';

/**
 * Upload single file
 */
export const uploadFile = async (file, metadata = {}) => {
  return await api.upload('/data/upload', file, {
    description: metadata.description || '',
    category: metadata.category || 'general',
    tags: metadata.tags || [],
    auto_process: metadata.autoProcess || true,
  });
};

/**
 * Upload multiple files
 */
export const uploadMultipleFiles = async (files, metadata = {}) => {
  return await api.upload('/data/upload/batch', files, {
    batch_description: metadata.description || '',
    category: metadata.category || 'general',
    tags: metadata.tags || [],
    auto_process: metadata.autoProcess || true,
  });
};

/**
 * Upload file with progress tracking
 */
export const uploadFileWithProgress = async (file, metadata = {}, onProgress) => {
  return await api.upload('/data/upload', file, metadata, {
    onUploadProgress: onProgress,
  });
};

/**
 * Get upload history
 */
export const getUploadHistory = async (page = 1, limit = 20, filters = {}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  });

  return await api.get(`/data/uploads?${queryParams.toString()}`);
};

/**
 * Get upload by ID
 */
export const getUploadById = async (uploadId) => {
  return await api.get(`/data/uploads/${uploadId}`);
};

/**
 * Delete upload
 */
export const deleteUpload = async (uploadId) => {
  return await api.delete(`/data/uploads/${uploadId}`);
};

/**
 * Bulk delete uploads
 */
export const bulkDeleteUploads = async (uploadIds) => {
  return await api.post('/data/uploads/bulk-delete', { upload_ids: uploadIds });
};

/**
 * Retry failed upload
 */
export const retryUpload = async (uploadId) => {
  return await api.post(`/data/uploads/${uploadId}/retry`);
};

/**
 * Download file
 */
export const downloadFile = async (fileId, filename = null) => {
  return await api.download(`/data/files/${fileId}/download`, filename);
};

/**
 * Get file preview/metadata
 */
export const getFilePreview = async (fileId) => {
  return await api.get(`/data/files/${fileId}/preview`);
};

/**
 * Validate file before upload
 */
export const validateFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return await api.post('/data/validate', formData);
};

/**
 * Get supported file formats
 */
export const getSupportedFormats = async () => {
  return await api.get('/data/supported-formats');
};

/**
 * Get upload statistics
 */
export const getUploadStats = async (timeRange = '30d') => {
  return await api.get(`/data/stats?range=${timeRange}`);
};

/**
 * Process uploaded file
 */
export const processFile = async (uploadId, processingOptions = {}) => {
  return await api.post(`/data/uploads/${uploadId}/process`, processingOptions);
};

/**
 * Get processing status
 */
export const getProcessingStatus = async (uploadId) => {
  return await api.get(`/data/uploads/${uploadId}/processing-status`);
};

/**
 * Cancel file processing
 */
export const cancelProcessing = async (uploadId) => {
  return await api.post(`/data/uploads/${uploadId}/cancel-processing`);
};

/**
 * Get data quality report
 */
export const getDataQualityReport = async (uploadId) => {
  return await api.get(`/data/uploads/${uploadId}/quality-report`);
};

/**
 * Get data sample
 */
export const getDataSample = async (uploadId, sampleSize = 10) => {
  return await api.get(`/data/uploads/${uploadId}/sample?size=${sampleSize}`);
};

/**
 * Update upload metadata
 */
export const updateUploadMetadata = async (uploadId, metadata) => {
  return await api.patch(`/data/uploads/${uploadId}/metadata`, metadata);
};

/**
 * Share upload
 */
export const shareUpload = async (uploadId, shareOptions) => {
  return await api.post(`/data/uploads/${uploadId}/share`, shareOptions);
};

/**
 * Get shared uploads
 */
export const getSharedUploads = async () => {
  return await api.get('/data/uploads/shared');
};

/**
 * Revoke upload share
 */
export const revokeUploadShare = async (uploadId, shareId) => {
  return await api.delete(`/data/uploads/${uploadId}/shares/${shareId}`);
};

/**
 * Export data in different formats
 */
export const exportData = async (uploadId, format = 'csv', options = {}) => {
  const exportOptions = {
    format,
    ...options,
  };

  const filename = `export_${uploadId}.${format}`;
  return await api.download(`/data/uploads/${uploadId}/export`, filename, {
    method: 'POST',
    body: exportOptions,
  });
};

/**
 * Get data schema
 */
export const getDataSchema = async (uploadId) => {
  return await api.get(`/data/uploads/${uploadId}/schema`);
};

/**
 * Update data schema
 */
export const updateDataSchema = async (uploadId, schema) => {
  return await api.patch(`/data/uploads/${uploadId}/schema`, schema);
};

/**
 * Get data categories
 */
export const getDataCategories = async () => {
  return await api.get('/data/categories');
};

/**
 * Create data category
 */
export const createDataCategory = async (categoryData) => {
  return await api.post('/data/categories', categoryData);
};

/**
 * Archive upload
 */
export const archiveUpload = async (uploadId) => {
  return await api.post(`/data/uploads/${uploadId}/archive`);
};

/**
 * Restore archived upload
 */
export const restoreUpload = async (uploadId) => {
  return await api.post(`/data/uploads/${uploadId}/restore`);
};

/**
 * Get archived uploads
 */
export const getArchivedUploads = async (page = 1, limit = 20) => {
  return await api.get(`/data/uploads/archived?page=${page}&limit=${limit}`);
}; 