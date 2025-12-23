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
  Clock,
  User,
  ArrowLeft,
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
    let isMounted = true;

    const loadPDFInfo = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      try {
        const configStatus = pdfService.getConfigStatus();
        if (!configStatus.isConfigured) {
          toast.error(configStatus.error);
          if (isMounted) setCurrentPDF(null);
          return;
        }

        const pdfInfo = await pdfService.getCurrentPDFInfo();
        if (isMounted) setCurrentPDF(pdfInfo);
      } catch (error) {
        if (!isMounted) return;
        if (error.message.includes("No authentication token")) {
          toast.error("Authentication required. Please log in again.");
        } else if (!error.message.includes("404")) {
          // Only show error if it's not a 404 (no PDF exists yet)
          toast.error(
            "Failed to fetch PDF info. Please check your connection and try again."
          );
        }
        setCurrentPDF(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadPDFInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle file selection for preview
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file using service
    const validation = pdfService.validatePDFFile(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      event.target.value = "";
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
        url: URL.createObjectURL(file),
      });
    }

    // Reset file input
    event.target.value = "";
  };

  // Handle direct PDF upload (when no current PDF exists)
  const uploadPDFDirectly = async (file) => {
    setIsReplacing(true);
    try {
      const username = user?.name || user?.username || 'Admin';
      const data = await pdfService.uploadPDF(file, username);

      // Set current PDF with the uploaded one
      setCurrentPDF({
        name: data.filename,
        size: data.formattedSize,
        uploadDate: data.uploadDate,
        url: data.url,
        previewUrl: data.previewUrl,
        chunksCount: data.chunksCount,
      });

      toast.success(`PDF uploaded successfully!`);
    } catch (error) {
      if (error.message.includes("No authentication token")) {
        toast.error("Authentication required. Please log in again.");
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
      const username = user?.name || user?.username || 'Admin';
      const data = await pdfService.uploadPDF(newPDF.file, username);

      // Update current PDF with the new one
      setCurrentPDF({
        name: data.filename,
        size: data.formattedSize,
        uploadDate: data.uploadDate,
        url: data.url,
        previewUrl: data.previewUrl,
        chunksCount: data.chunksCount,
      });

      // Clear the new PDF preview
      if (newPDF?.url) {
        URL.revokeObjectURL(newPDF.url);
      }
      setNewPDF(null);

      toast.success("PDF replaced successfully!");
    } catch (error) {
      if (error.message.includes("No authentication token")) {
        toast.error("Authentication required. Please log in again.");
      } else {
        toast.error(error.message || "Failed to upload PDF");
      }
    } finally {
      setIsReplacing(false);
      setShowReplaceModal(false);
    }
  };

  // Handle new PDF deletion (before replacement)
  const handleDeleteNewPDF = () => {
    if (newPDF?.url) {
      URL.revokeObjectURL(newPDF.url);
    }
    setNewPDF(null);
    setShowDeleteNewModal(false);
  };

  // Handle PDF preview
  const handlePreviewPDF = async () => {
    try {
      await pdfService.openPreview();
    } catch (error) {
      console.error("Preview error:", error);
      if (error.message.includes("No authentication token")) {
        toast.error("Authentication required. Please log in again.");
      } else {
        toast.error("Failed to open PDF preview. Please try again.");
      }
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      await pdfService.downloadPDF(currentPDF?.name || "document.pdf");
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      if (error.message.includes("No authentication token")) {
        toast.error("Authentication required. Please log in again.");
      } else {
        toast.error("Failed to download PDF. Please try again.");
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
            top: "70px",
          }}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#333",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              fontSize: "14px",
              padding: "12px 16px",
              maxWidth: "90vw",
              width: "auto",
            },
            success: {
              style: {
                border: "1px solid #10b981",
              },
            },
            error: {
              style: {
                border: "1px solid #ef4444",
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
          message={`Are you sure you want to replace the current PDF with the New PDF? The change will update your knowledge base .`}
          confirmText="Replace"
          cancelText="Cancel"
          variant="primary"
          isLoading={isReplacing}
        />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {/* Back Button - Above Container */}
          <button
            onClick={() => router.push('/chat')}
            className="mb-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Knowledge Base Management
                  </h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Manage the documents that power your AI's understanding
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
                      backgroundColor: "#332771",
                      boxShadow: "0 2px 8px rgba(51, 39, 113, 0.2)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#d93311";
                      e.currentTarget.style.boxShadow =
                        "0 3px 12px rgba(217, 51, 17, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#332771";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(51, 39, 113, 0.2)";
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Create New
                  </label>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div
                    className="w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center mb-4 sm:mb-6"
                    style={{ backgroundColor: "rgba(51, 39, 113, 0.1)" }}
                  >
                    <FileText className="w-8 h-8 sm:w-12 sm:h-12 animate-pulse text-[#332771]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Loading PDF Information...
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    Please wait while we fetch the current PDF details.
                  </p>
                  <div className="flex justify-center">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: "#ebdad4",
                          animationDelay: "0ms",
                        }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: "#d4c4be",
                          animationDelay: "150ms",
                        }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: "#b8a8a0",
                          animationDelay: "300ms",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : currentPDF ? (
                <div className="space-y-6">
                  {/* Current PDF Info */}
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                      Active Knowledge Source
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border-2 border-[#332771] border-dashed relative">
                      {/* Active Status Chip - Top Right */}
                      <span className="absolute top-3 right-3 sm:top-4 sm:right-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                        Active
                      </span>
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-start space-x-3 sm:space-x-4 pr-16 sm:pr-20">
                          <div
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: "rgba(51, 39, 113, 0.1)",
                            }}
                          >
                            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-[#332771]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3
                              className="text-base sm:text-lg font-semibold text-gray-900 break-words"
                              title={currentPDF.name}
                            >
                              {currentPDF.name}
                            </h3>
                            <div className="text-xs sm:text-sm text-gray-500 mt-2 space-y-1">
                              <p className="flex items-center gap-1">
                                <span className="font-medium text-gray-600">Size:</span> {currentPDF.size}
                              </p>
                              <p className="flex items-center gap-1 flex-wrap">
                                <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                <span className="font-medium text-gray-600 whitespace-nowrap">Uploaded:</span>{" "}
                                <span className="whitespace-nowrap">
                                  {new Date(currentPDF.uploadDate).toLocaleDateString()}{" "}
                                  {new Date(currentPDF.uploadDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </p>
                              <p className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                <span className="font-medium text-gray-600">Uploaded By:</span>{" "}
                                <span className="break-words">
                                  {currentPDF.uploadedBy || user?.name || user?.username || 'Admin'}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto flex-shrink-0">
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
                      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                        New Knowledge Source Preview
                      </h2>
                      <div className="bg-yellow-50 rounded-lg p-4 sm:p-6 border-2 border-dashed border-yellow-300 relative">
                        {/* Inactive Status Chip - Top Right */}
                        <span className="absolute top-3 right-3 sm:top-4 sm:right-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                          Inactive
                        </span>
                        <div className="flex flex-col space-y-4">
                          <div className="flex items-start space-x-3 sm:space-x-4 pr-16 sm:pr-20">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
                            </div>
                            <div className="min-w-0 flex-1 pr-12 sm:pr-0">
                              <h3
                                className="text-base sm:text-lg font-semibold text-gray-900 break-words"
                                title={newPDF.name}
                              >
                                {newPDF.name}
                              </h3>
                              <div className="text-xs sm:text-sm text-gray-500 mt-2">
                                <p className="flex items-center gap-1">
                                  <span className="font-medium text-gray-600">Size:</span> {newPDF.size}
                                </p>
                                <p className="text-yellow-600 font-medium mt-1">
                                  New PDF
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto flex-shrink-0">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setShowReplaceModal(true)}
                              className="sm:ml-2"
                            >
                              Replace Current PDF
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(newPDF.url, "_blank")}
                              icon={Eye}
                            >
                              Preview
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement("a");
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
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : isReplacing ? (
                /* Upload Loading State */
                <div className="text-center py-8 sm:py-12 px-4">
                  <div
                    className="w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center mb-4 sm:mb-6"
                    style={{ backgroundColor: "rgba(51, 39, 113, 0.1)" }}
                  >
                    <Upload className="w-8 h-8 sm:w-12 sm:h-12 animate-pulse text-[#332771]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Uploading PDF...
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
                    Please wait while your document is being processed and
                    uploaded to the knowledge base.
                  </p>
                  <div className="flex justify-center">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: "#ebdad4",
                          animationDelay: "0ms",
                        }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: "#d4c4be",
                          animationDelay: "150ms",
                        }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: "#b8a8a0",
                          animationDelay: "300ms",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                /* No PDF State */
                <div className="text-center py-8 sm:py-12 px-4">
                  <div
                    className="w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center mb-4 sm:mb-6"
                    style={{ backgroundColor: "rgba(51, 39, 113, 0.1)" }}
                  >
                    <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-[#332771]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    Add Knowledge Base
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto">
                    Upload a document to teach the AI
                  </p>
                  <label
                    htmlFor="pdf-upload-empty"
                    className="cursor-pointer inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium text-white transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center max-w-xs mx-auto"
                    style={{ backgroundColor: "#332771" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#d93311")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#332771")
                    }
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Create New
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
                    <h4 className="font-medium text-blue-900 mb-1">
                      Instructions
                    </h4>
                    <ul className="text-blue-800 space-y-1">
                      <li>• Only PDF files are supported</li>
                      <li>• Maximum file size: 10MB</li>
                      <li>
                        • This document is currently used by the AI to answer
                        questions
                      </li>
                      <li>
                        • You can preview, download, or replace the PDF at any
                        time
                      </li>
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
