"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import Header from "@/components/Header";
import Button from "@/components/Button";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Toaster, toast } from "react-hot-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { pdfService } from "@/lib/pdf-service";
import {
  Upload,
  FileText,
  Eye,
  Trash2,
  Download,
  AlertCircle,
} from "lucide-react";

export default function PDFAdminPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  // State for PDF management
  const [currentPDF, setCurrentPDF] = useState(null); // Start with no PDF
  const [newPDF, setNewPDF] = useState(null); // For preview before replacement
  const [isReplacing, setIsReplacing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteNewModal, setShowDeleteNewModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);

  // Fetch current PDF info on component mount
  useEffect(() => {
    fetchCurrentPDFInfo();
  }, []);

  // Fetch current PDF information from backend
  const fetchCurrentPDFInfo = async () => {
    setIsLoading(true);
    try {
      const configStatus = pdfService.getConfigStatus();
      if (!configStatus.isConfigured) {
        toast.error(configStatus.error);
        setCurrentPDF(null);
        return;
      }

      const pdfInfo = await pdfService.getCurrentPDFInfo();
      setCurrentPDF(pdfInfo);
    } catch (error) {
      console.error('Error fetching PDF info:', error);
      if (error.message.includes('No authentication token')) {
        toast.error('Authentication required. Please log in again.');
      } else {
        toast.error('Failed to fetch PDF info. Please check your connection and try again.');
      }
      setCurrentPDF(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection for preview
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file using service
    const validation = pdfService.validatePDFFile(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      event.target.value = '';
      return;
    }
    
    // If no current PDF exists, upload directly
    if (!currentPDF) {
      await uploadPDFDirectly(file);
    } else {
      // Show preview for replacement
      setNewPDF({
        file: file,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url: URL.createObjectURL(file)
      });
      toast.success("PDF uploaded for preview. Review and click replace to confirm.");
    }
    
    // Reset file input
    event.target.value = '';
  };

  // Handle direct PDF upload (when no current PDF exists)
  const uploadPDFDirectly = async (file) => {
    setIsReplacing(true);
    try {
      const data = await pdfService.uploadPDF(file);
      
      // Set current PDF with the uploaded one
      setCurrentPDF({
        name: data.filename,
        size: data.formattedSize,
        uploadDate: data.uploadDate,
        url: data.url,
        previewUrl: data.previewUrl,
        chunksCount: data.chunksCount
      });
      
      toast.success(`PDF uploaded successfully!`);
    } catch (error) {
      console.error('PDF upload error:', error);
      if (error.message.includes('No authentication token')) {
        toast.error('Authentication required. Please log in again.');
      } else {
        toast.error(error.message || "Failed to upload PDF");
      }
    } finally {
      setIsReplacing(false);
    }
  };

  // Handle PDF replacement via API
  const handleReplacePDF = async () => {
    if (!newPDF?.file) return;
    
    setIsReplacing(true);
    try {
      const data = await pdfService.uploadPDF(newPDF.file);
      
      // Update current PDF with the new one
      setCurrentPDF({
        name: data.filename,
        size: data.formattedSize,
        uploadDate: data.uploadDate,
        url: data.url,
        previewUrl: data.previewUrl,
        chunksCount: data.chunksCount
      });
      
      // Clear the new PDF preview
      if (newPDF?.url) {
        URL.revokeObjectURL(newPDF.url);
      }
      setNewPDF(null);
      
      toast.success("PDF replaced successfully!");
      setShowReplaceModal(false);
    } catch (error) {
      console.error('PDF upload error:', error);
      if (error.message.includes('No authentication token')) {
        toast.error('Authentication required. Please log in again.');
      } else {
        toast.error(error.message || "Failed to upload PDF");
      }
    } finally {
      setIsReplacing(false);
    }
  };

  // Handle new PDF deletion (before replacement)
  const handleDeleteNewPDF = () => {
    if (newPDF?.url) {
      URL.revokeObjectURL(newPDF.url);
    }
    setNewPDF(null);
    toast.success("New PDF removed");
    setShowDeleteNewModal(false);
  };

  // Handle PDF preview
  const handlePreviewPDF = async () => {
    try {
      await pdfService.openPreview();
    } catch (error) {
      console.error('Preview error:', error);
      if (error.message.includes('No authentication token')) {
        toast.error('Authentication required. Please log in again.');
      } else {
        toast.error('Failed to open PDF preview. Please try again.');
      }
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      await pdfService.downloadPDF(currentPDF?.name || 'document.pdf');
      toast.success('PDF download started');
    } catch (error) {
      console.error('Download error:', error);
      if (error.message.includes('No authentication token')) {
        toast.error('Authentication required. Please log in again.');
      } else {
        toast.error('Failed to download PDF. Please try again.');
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          containerStyle={{
            top: '80px',
          }}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
            success: {
              style: {
                border: '1px solid #10b981',
              },
            },
            error: {
              style: {
                border: '1px solid #ef4444',
              },
            },
          }}
        />
        <Header />

        {/* Delete New PDF Modal */}
        <ConfirmationModal
          isOpen={showDeleteNewModal}
          onClose={() => setShowDeleteNewModal(false)}
          onConfirm={handleDeleteNewPDF}
          title="Remove New PDF"
          message="Are you sure you want to remove the new PDF? You can upload another one if needed."
          confirmText="Remove"
          cancelText="Cancel"
          variant="danger"
        />

        {/* Replace PDF Modal */}
        <ConfirmationModal
          isOpen={showReplaceModal}
          onClose={() => setShowReplaceModal(false)}
          onConfirm={handleReplacePDF}
          title="Replace PDF"
          message={`Are you sure you want to replace the current PDF with "${newPDF?.name}"? This will call the backend API to update the system.`}
          confirmText="Replace"
          cancelText="Cancel"
          variant="primary"
          isLoading={isReplacing}
        />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold" style={{color: '#332771'}}>
                    PDF Management
                  </h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Manage the PDF document for the AI system
                  </p>
                </div>
                <div className="flex items-center justify-center sm:justify-end space-x-3">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="cursor-pointer inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm border border-white/20 w-full sm:w-auto justify-center"
                    style={{
                      backgroundColor: '#332771',
                      boxShadow: '0 2px 8px rgba(51, 39, 113, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#d93311';
                      e.currentTarget.style.boxShadow = '0 3px 12px rgba(217, 51, 17, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#332771';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(51, 39, 113, 0.2)';
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New PDF
                  </label>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center mb-4 sm:mb-6" style={{backgroundColor: 'rgba(51, 39, 113, 0.1)'}}>
                    <FileText className="w-8 h-8 sm:w-12 sm:h-12 animate-pulse" style={{color: '#332771'}} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Loading PDF Information...
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Please wait while we fetch the current PDF details.
                  </p>
                </div>
              ) : currentPDF ? (
                <div className="space-y-6">
                  {/* Current PDF Info */}
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Current PDF Document</h2>
                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border-2 border-dashed" style={{borderColor: '#332771'}}>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div 
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{backgroundColor: 'rgba(51, 39, 113, 0.1)'}}
                          >
                            <FileText className="w-6 h-6 sm:w-8 sm:h-8" style={{color: '#332771'}} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                              {currentPDF.name}
                            </h3>
                            <div className="text-xs sm:text-sm text-gray-500 space-y-1">
                              <p>Size: {currentPDF.size}</p>
                              <p>Uploaded: {new Date(currentPDF.uploadDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePreviewPDF}
                            icon={Eye}
                          >
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadPDF}
                            icon={Download}
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* New PDF Preview Section */}
                  {newPDF && (
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">New PDF Preview</h2>
                      <div className="bg-yellow-50 rounded-lg p-4 sm:p-6 border-2 border-dashed border-yellow-300">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                                {newPDF.name}
                              </h3>
                              <div className="text-xs sm:text-sm text-gray-500 space-y-1">
                                <p>Size: {newPDF.size}</p>
                                <p className="text-yellow-600 font-medium">Ready for replacement</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(newPDF.url, '_blank')}
                              icon={Eye}
                            >
                              Preview
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = newPDF.url;
                                link.download = newPDF.name;
                                link.click();
                              }}
                              icon={Download}
                            >
                              Download
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setShowDeleteNewModal(true)}
                              icon={Trash2}
                            >
                              Remove
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setShowReplaceModal(true)}
                              className="sm:ml-2"
                            >
                              Replace Current PDF
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* No PDF State */
                <div className="text-center py-8 sm:py-12 px-4">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center mb-4 sm:mb-6" style={{backgroundColor: 'rgba(51, 39, 113, 0.1)'}}>
                    <FileText className="w-8 h-8 sm:w-12 sm:h-12" style={{color: '#332771'}} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    No PDF Uploaded
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
                    Upload a PDF document to make it available for the AI system to reference and use.
                  </p>
                  <label
                    htmlFor="pdf-upload-empty"
                    className="cursor-pointer inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium text-white transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center max-w-xs mx-auto"
                    style={{backgroundColor: '#332771'}}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d93311'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#332771'}
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload PDF Document
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="pdf-upload-empty"
                  />
                </div>
              )}

              {/* Instructions */}
              <div className="mt-6 sm:mt-8 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <h4 className="font-medium text-blue-900 mb-1">Instructions</h4>
                    <ul className="text-blue-800 space-y-1">
                      <li>• Only PDF files are supported</li>
                      <li>• Maximum file size: 10MB</li>
                      <li>• The uploaded PDF will be used by the AI system for reference</li>
                      <li>• You can preview, download, or replace the PDF at any time</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
