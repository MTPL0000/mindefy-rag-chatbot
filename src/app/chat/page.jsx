"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Bot,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  FileText,
  Search,
  HelpCircle,
  BookOpen,
  Plus,
  Check,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useChatStore } from "@/store/chat-store";
import { Toaster, toast } from "react-hot-toast";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

  // Available AI models  
const models = [
    { value: "gpt-4", label: "GPT-4 Turbo", description: "Most capable model" },
    {
      value: "gpt-3.5",
      label: "GPT-3.5 Turbo",
      description: "Fast and efficient",
    },
    {
      value: "claude-3",
      label: "Claude 3 Sonnet",
      description: "Balanced performance",
    },
    {
      value: "claude-3-haiku",
      label: "Claude 3 Haiku",
      description: "Quick responses",
    },
    {
      value: "gemini-pro",
      label: "Gemini Pro",
      description: "Google's advanced model",
    },
    {
      value: "llama-2",
      label: "Llama 2 70B",
      description: "Open source model",
    },
  ];

    // Sample questions for the welcome screen
const sampleQuestions = [
      {
        icon: FileText,
        title: "Document Summary",
        question: "Can you summarize the main points of the document?",
      },
      {
        icon: Search,
        title: "Find Information",
        question: "What are the key findings mentioned in the document?",
      },
      {
        icon: HelpCircle,
        title: "Ask Questions",
        question: "What policies are outlined in this document?",
      },
      {
        icon: BookOpen,
        title: "Learn More",
        question: "Explain the important concepts from the document.",
      },
    ];

export default function ChatPage() {
  const { user } = useAuthStore();
  const {
    currentChat,
    isLoadingChat,
    chatError,
    initializeWelcomeMessage,
    sendMessage,
    startNewChat,
    clearChatError,
  } = useChatStore();

  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [feedbackState, setFeedbackState] = useState({}); // Track feedback for each message
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  // Initialize data
  useEffect(() => {
    initializeWelcomeMessage();
  }, []);

  // Initialize textarea height on mount
  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get selected model label
  const getSelectedModelLabel = () => {
    const model = models.find((m) => m.value === selectedModel);
    return model ? model.label : "Select Model";
  };

  // Handle model selection
  const handleModelSelect = (modelValue) => {
    setSelectedModel(modelValue);
    setIsDropdownOpen(false);
  };

  // Show error toasts
  useEffect(() => {
    if (chatError) {
      toast.error(chatError);
      clearChatError();
    }
  }, [chatError, clearChatError]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat]);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to get accurate scrollHeight
      textarea.style.height = "auto";

      // Calculate responsive line height and max lines
      const isMobile = window.innerWidth < 640; // sm breakpoint
      const lineHeight = isMobile ? 20 : 24; // Smaller line height on mobile
      const maxLines = 4;
      const minHeight = isMobile ? 40 : 46; // Match min-h from CSS
      const maxHeight = lineHeight * maxLines;

      // Calculate new height, ensuring it's at least minHeight
      const contentHeight = Math.max(textarea.scrollHeight, minHeight);
      const newHeight = Math.min(contentHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;

      // Handle scrolling behavior with proper padding consideration
      if (textarea.scrollHeight > maxHeight) {
        textarea.style.overflowY = "scroll";
        textarea.style.paddingRight = isMobile ? "40px" : "48px"; // Ensure space for button
        // Scroll to bottom to show the latest text (like ChatGPT)
        setTimeout(() => {
          textarea.scrollTop = textarea.scrollHeight;
        }, 0);
      } else {
        textarea.style.overflowY = "hidden";
        textarea.style.paddingRight = isMobile ? "40px" : "48px"; // Consistent padding
      }
    }
  };

  // Handle input change with auto-resize
  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Delay the height adjustment to ensure the DOM is updated
    setTimeout(adjustTextareaHeight, 0);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoadingChat) return;

    const messageText = input.trim();
    setInput("");

    // Reset textarea height after sending
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        adjustTextareaHeight();
      }
    }, 0);

    try {
      await sendMessage(messageText);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleStartNewChat = () => {
    startNewChat();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyResponse = (content) => {
    navigator.clipboard.writeText(content);
  };

  const handleFeedback = (messageId, feedback) => {
    setFeedbackState((prev) => ({
      ...prev,
      [messageId]: prev[messageId] === feedback ? null : feedback, // Toggle off if same, otherwise set
    }));
  };

  const handleSampleQuestion = (question) => {
    setInput(question);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Check if this is the welcome screen (only has the initial welcome message)
  const isWelcomeScreen =
    currentChat.length <= 1 && currentChat[0]?.role === "assistant";

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-gray-50">
        <Header /> 

        {/* Main content area - full width */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Top bar with Model Dropdown and New Chat */}
          <div
            className={`flex items-center justify-between w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 bg-gray-50 ${
              isWelcomeScreen ? "py-4 mt-4" : "py-2 mt-3"
            }`}
          >
            {/* Left: Model Dropdown */}
            <div ref={dropdownRef} className="flex-shrink-0">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 cursor-pointer border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none hover:border-gray-400 hover:shadow-sm transition-all duration-200 flex items-center gap-2 shadow-sm"
                >
                  <span className="truncate text-xs sm:text-sm font-medium">
                    {getSelectedModelLabel()}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 min-w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
                    {models.map((model) => (
                      <button
                        key={model.value}
                        onClick={() => handleModelSelect(model.value)}
                        className={`w-full cursor-pointer text-left px-3 py-2 text-xs sm:text-sm hover:bg-gray-50 transition-colors duration-150 flex items-center justify-between whitespace-nowrap ${
                          selectedModel === model.value
                            ? "bg-gray-50 font-medium text-gray-900"
                            : "text-gray-600 font-normal"
                        }`}
                      >
                        <span>{model.label}</span>
                        {selectedModel === model.value && (
                          <Check className="w-3.5 h-3.5 text-gray-700 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: New Chat Button */}
            <button
              onClick={handleStartNewChat}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 border border-gray-300 bg-white text-gray-700 hover:bg-[#332771] hover:text-white hover:border-gray-400 hover:shadow-sm shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">New Chat</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {isWelcomeScreen ? (
              /* Welcome Screen */
              <div className="flex flex-col items-center justify-center min-h-full px-4 py-4 sm:py-6 md:py-8">
                {/* Sparkle Icon */}
                <div className="bg-[#332771] w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                {/* Welcome Text */}
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-2 sm:mb-3">
                  Hello, how can I help you today?
                </h1>
                <p className="text-gray-600 text-center max-w-md sm:max-w-lg md:max-w-xl mb-6 sm:mb-8 md:mb-10 text-xs sm:text-sm md:text-base px-2">
                  I can answer questions based on your uploaded documents. Ask
                  me anything about your knowledge base.
                </p>

                {/* Sample Question Cards - responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-sm sm:max-w-lg md:max-w-2xl px-2 sm:px-4">
                  {sampleQuestions.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSampleQuestion(item.question)}
                      className="flex flex-col items-start p-3 sm:p-4 md:p-5 bg-white cursor-pointer rounded-xl sm:rounded-2xl border border-gray-100 shadow-md hover:border-gray-200 hover:shadow-xl transition-all duration-200 text-left group"
                    >
                      <div
                        className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 md:mb-4"
                        style={{ backgroundColor: "rgba(51, 39, 113, 0.08)" }}
                      >
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#332771]" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 sm:mb-1.5 text-sm sm:text-base">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                        {item.question}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Chat Messages */
              <div className="max-w-4xl mx-auto px-2 md:px-4 py-4 space-y-6">
                {currentChat.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[85%] ${
                        message.role === "user"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-center text-sm flex-shrink-0"
                        style={{
                          background:
                            message.role === "user"
                              ? "#332771"
                              : "linear-gradient(to right, #FFFFFF, #FFFFFF, #ebdad4)",
                          color:
                            message.role === "user" ? "#FFFFFF" : "#374151",
                          border: "1px solid #e5e7eb",
                          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                        }}
                      >
                        {message.role === "user" ? (
                          <span className="text-sm font-medium">
                            {getInitials(user?.username)}
                          </span>
                        ) : (
                          <Bot className="w-4 h-4 text-gray-600" />
                        )}
                      </div>

                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div
                          className="rounded-2xl px-2 md:px-4 py-2"
                          style={{
                            ...(message.role === "user"
                              ? {
                                  backgroundColor: "#f3f4f6",
                                  color: "#111827",
                                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
                                  border: "1px solid #e5e7eb",
                                }
                              : message.isError
                              ? {
                                  backgroundColor: "#fef2f2",
                                  color: "#dc2626",
                                }
                              : {
                                  backgroundColor: "transparent",
                                  color: "#111827",
                                  paddingTop: "0px"
                                }),
                          }}
                        >
                          <p className="whitespace-pre-wrap text-sm leading-relaxed break-words">
                            {message.content}
                          </p>
                        </div>

                        {/* Action buttons for bot responses */}
                        {message.role === "assistant" && !message.isError && (
                          <div className="flex items-center space-x-1 mt-2 ml-1">
                            <button
                              onClick={() =>
                                handleCopyResponse(message.content)
                              }
                              className="p-1.5 cursor-pointer rounded hover:bg-gray-200/50 transition-colors"
                              title="Copy response"
                            >
                              <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleFeedback(message.id, "good")}
                              className="p-1.5 cursor-pointer rounded hover:bg-gray-200/50 transition-colors"
                              title="Good response"
                            >
                              <ThumbsUp
                                className="w-4 h-4 transition-colors"
                                style={{
                                  color:
                                    feedbackState[message.id] === "good"
                                      ? "#10b981"
                                      : "#9ca3af",
                                  fill:
                                    feedbackState[message.id] === "good"
                                      ? "#10b981"
                                      : "none",
                                }}
                              />
                            </button>
                            <button
                              onClick={() => handleFeedback(message.id, "bad")}
                              className="p-1.5 cursor-pointer rounded hover:bg-gray-200/50 transition-colors"
                              title="Bad response"
                            >
                              <ThumbsDown
                                className="w-4 h-4 transition-colors"
                                style={{
                                  color:
                                    feedbackState[message.id] === "bad"
                                      ? "#ef4444"
                                      : "#9ca3af",
                                  fill:
                                    feedbackState[message.id] === "bad"
                                      ? "#ef4444"
                                      : "none",
                                }}
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isLoadingChat && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{
                          background:
                            "linear-gradient(to right, #FFFFFF, #FFFFFF, #ebdad4)",
                          border: "1px solid #e5e7eb",
                        }}
                      >
                        <Bot className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="rounded-lg px-4 py-3">
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 rounded-full animate-bounce"
                            style={{
                              animationDelay: "0ms",
                              backgroundColor: "#ebdad4",
                            }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full animate-bounce"
                            style={{
                              animationDelay: "150ms",
                              backgroundColor: "#d4c4be",
                            }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full animate-bounce"
                            style={{
                              animationDelay: "300ms",
                              backgroundColor: "#332771",
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input area - fixed at bottom */}
          <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 pt-0 bg-gray-50">
            <div className="flex items-end space-x-2 sm:space-x-3">
              <div className="relative w-full max-w-3xl mx-auto">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question from your knowledge base…"
                  className="w-full text-black px-4 py-3 border-1 border-gray-300/70 rounded-3xl outline-none focus:ring-1 resize-none min-h-[46px] sm:min-h-[50px] bg-white/90 backdrop-blur-sm shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base transition-all duration-200 [&::-webkit-scrollbar]:hidden flex items-center"
                  style={{
                    "--tw-ring-color": "#332771",
                    borderColor: "rgba(209, 213, 219, 0.7)",
                    lineHeight: "1.5",
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#332771")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(209, 213, 219, 0.7)")
                  }
                  rows="1"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoadingChat}
                  className="absolute cursor-pointer right-2 sm:right-2 top-1/2 -translate-y-1/2 p-2 sm:p-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm border border-white/20"
                  style={{
                    backgroundColor:
                      input.trim() && !isLoadingChat ? "#332771" : "#f3f4f6",
                    color: input.trim() && !isLoadingChat ? "white" : "#9ca3af",
                    cursor:
                      input.trim() && !isLoadingChat
                        ? "pointer"
                        : "not-allowed",
                    boxShadow:
                      input.trim() && !isLoadingChat
                        ? "0 2px 8px rgba(51, 39, 113, 0.2)"
                        : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (input.trim() && !isLoadingChat) {
                      e.currentTarget.style.backgroundColor = "#d93311";
                      e.currentTarget.style.boxShadow =
                        "0 3px 12px rgba(217, 51, 17, 0.25)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (input.trim() && !isLoadingChat) {
                      e.currentTarget.style.backgroundColor = "#332771";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(51, 39, 113, 0.2)";
                    }
                  }}
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center mt-1 sm:mt-2 px-2">
              Answers are generated only from your uploaded knowledge base
            </div>
          </div>
        </div>
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        containerStyle={{
          top: "80px",
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#333",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
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
    </ProtectedRoute>
  );
}
