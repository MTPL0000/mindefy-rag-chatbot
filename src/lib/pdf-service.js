/**
 * PDF Management Service
 * Handles all PDF-related API operations for admin functionality.
 */

import { apiService } from './api-service';

export const pdfService = {
  /**
   * Get current PDF information
   * @returns {Promise<Object|null>} PDF info or null if no PDF exists
   */
  async getCurrentPDFInfo() {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${apiService.baseURL}/admin/pdf/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        // No PDF uploaded yet
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        name: data.name,
        size: data.size_formatted,
        uploadDate: new Date().toISOString().split('T')[0],
        url: `${apiService.baseURL}/admin/pdf/preview`,
        previewUrl: `${apiService.baseURL}/admin/pdf/preview`,
        rawSize: data.size
      };
    } catch (error) {
      console.error('Error fetching PDF info:', error);
      throw error;
    }
  },

  /**
   * Upload a new PDF file
   * @param {File} file - PDF file to upload
   * @returns {Promise<Object>} Upload response data
   */
  async uploadPDF(file) {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${apiService.baseURL}/admin/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await response.json();
      return {
        filename: data.filename,
        fileSize: data.file_size,
        chunksCount: data.chunks_count,
        isUpdate: data.is_update,
        previousChunks: data.previous_chunks,
        formattedSize: `${(data.file_size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        url: `${apiService.baseURL}/admin/pdf/preview`,
        previewUrl: `${apiService.baseURL}/admin/pdf/preview`
      };
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  },

  /**
   * Open PDF preview in new tab with authentication
   * @returns {Promise<void>}
   */
  async openPreview() {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${apiService.baseURL}/admin/pdf/preview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      // Clean up the blob URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Error opening PDF preview:', error);
      throw error;
    }
  },

  /**
   * Download PDF file with authentication
   * @param {string} filename - Name for the downloaded file
   * @returns {Promise<void>}
   */
  async downloadPDF(filename = 'document.pdf') {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${apiService.baseURL}/admin/pdf/preview`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  },

  /**
   * Validate PDF file before upload
   * @param {File} file - File to validate
   * @returns {Object} Validation result
   */
  validatePDFFile(file) {
    const maxSizeMB = 10;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (!file) {
      return { isValid: false, error: 'No file selected' };
    }

    if (file.type !== 'application/pdf') {
      return { isValid: false, error: 'Please select a valid PDF file' };
    }

    if (file.size > maxSizeBytes) {
      return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
    }

    return { isValid: true };
  },

  /**
   * Check if API URL is configured
   * @returns {boolean} True if API URL is configured
   */
  isConfigured() {
    return !!apiService.baseURL;
  },

  /**
   * Get API configuration status
   * @returns {Object} Configuration status
   */
  getConfigStatus() {
    const isConfigured = this.isConfigured();
    return {
      isConfigured,
      apiUrl: apiService.baseURL,
      error: !isConfigured ? 'API URL is not configured. Please check your environment variables.' : null
    };
  }
};
