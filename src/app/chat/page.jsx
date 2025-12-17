"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Plus,
  Bot,
  Check,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useChatStore } from "@/store/chat-store";
import { Toaster, toast } from "react-hot-toast";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ChatPage() {
  const { user, fetchUserProfile } = useAuthStore();
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
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const dropdownRef = useRef(null);

  // Available AI models
  const models = [
    { value: "gpt-4", label: "GPT-4 Turbo", description: "Most capable model" },
    { value: "gpt-3.5", label: "GPT-3.5 Turbo", description: "Fast and efficient" },
    { value: "claude-3", label: "Claude 3 Sonnet", description: "Balanced performance" },
    { value: "claude-3-haiku", label: "Claude 3 Haiku", description: "Quick responses" },
    { value: "gemini-pro", label: "Gemini Pro", description: "Google's advanced model" },
    { value: "llama-2", label: "Llama 2 70B", description: "Open source model" },
  ];

  // Initialize data
  useEffect(() => {
    fetchUserProfile();
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get selected model label
  const getSelectedModelLabel = () => {
    const model = models.find(m => m.value === selectedModel);
    return model ? model.label : 'Select Model';
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
      textarea.style.height = 'auto';
      
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
        textarea.style.overflowY = 'scroll';
        textarea.style.paddingRight = isMobile ? '40px' : '48px'; // Ensure space for button
        // Scroll to bottom to show the latest text (like ChatGPT)
        setTimeout(() => {
          textarea.scrollTop = textarea.scrollHeight;
        }, 0);
      } else {
        textarea.style.overflowY = 'hidden';
        textarea.style.paddingRight = isMobile ? '40px' : '48px'; // Consistent padding
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
        textareaRef.current.style.height = 'auto';
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

  return (
    <ProtectedRoute>
      <div className="h-screen bg-gray-50 flex flex-col">
        <Header />

        <div className="flex flex-1 overflow-hidden p-2 sm:p-4 md:p-6">
          {/* Main chat area - centered and full width */}
          <div className="w-full max-w-4xl mx-auto flex flex-col bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl border border-white/20" style={{boxShadow: '0 25px 50px -12px rgba(51, 39, 113, 0.15), 0 0 0 1px rgba(51, 39, 113, 0.05)'}}>
            {/* Chat header */}
            <div className="border-b border-gray-200/50 p-3 sm:p-4 bg-white/80 backdrop-blur-md rounded-t-lg" style={{ position: 'relative', zIndex: 10 }}>
              <div className="flex items-center justify-between w-full gap-2">
                {/* Left: Model Dropdown */}
                <div ref={dropdownRef} className="flex-shrink-0">
                  <div className="relative">
                    {/* Custom Dropdown Button */}
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="text-xs sm:text-sm px-2 py-1.5 sm:px-4 sm:py-2.5 border border-gray-200/60 rounded-lg bg-white/90 backdrop-blur-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500 pr-5 sm:pr-8 hover:bg-gray-50/50 transition-all duration-200 flex items-center"
                      style={{ 
                        '--tw-ring-color': '#332771',
                        borderColor: 'rgba(173, 182, 199, 0.6)',
                        width: 'auto',
                        maxWidth: '160px',
                        minWidth: '100px'
                      }}
                    >
                      <span className="truncate text-xs sm:text-sm">{getSelectedModelLabel()}</span>
                    </button>
                    
                    {/* Dropdown Arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 sm:pr-2 pointer-events-none">
                      <svg 
                        className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {/* Custom Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-36 sm:w-40 bg-white border border-gray-200/60 rounded-lg shadow-lg overflow-hidden" style={{ zIndex: 9999 }}>
                        {models.map((model) => (
                          <button
                            key={model.value}
                            onClick={() => handleModelSelect(model.value)}
                            className={`w-full text-left px-2.5 py-1.5 text-xs hover:bg-purple-50 transition-colors duration-150 flex items-center justify-between ${
                              selectedModel === model.value 
                                ? 'bg-purple-50 font-medium text-purple-700' 
                                : 'text-gray-700 font-normal'
                            }`}
                          >
                            <span className="truncate text-xs">{model.label}</span>
                            {selectedModel === model.value && (
                              <Check className="w-2.5 h-2.5 text-purple-600 flex-shrink-0 ml-1" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Center: Title */}
                <div className="flex-1 flex justify-center min-w-0 px-2">
                  <h1 className="text-sm sm:text-lg md:text-xl font-semibold text-gray-800 truncate">Mindefy Knowledge Assistant</h1>
                </div>

                {/* Right: New Chat Button */}
                <div className="flex-shrink-0">
                  <button
                    onClick={handleStartNewChat}
                    className="cursor-pointer flex items-center space-x-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover:shadow-md transform hover:scale-105 backdrop-blur-sm border"
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderColor: '#332771',
                      color: '#332771'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#d93311';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = '#d93311';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.color = '#332771';
                      e.currentTarget.style.borderColor = '#332771';
                    }}
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">New Chat</span>
                    <span className="sm:hidden">New</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scroll-smooth p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50 rounded-b-lg">
              {currentChat.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[85%] sm:max-w-[80%] md:max-w-[70%] ${
                      message.role === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0 shadow-lg"
                      style={{
                        backgroundColor: message.role === "user" ? '#332771' : '#332771',
                        background: message.role === "user" 
                          ? 'linear-gradient(135deg, #332771 0%, #4c1d95 100%)' 
                          : 'linear-gradient(135deg, #332771 0%, #d93311 100%)'
                      }}
                    >
                      {message.role === "user" ? (
                        <span>{getInitials(user?.username)}</span>
                      ) : (
                        <Bot className="w-5 h-5" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div
                      className="rounded-2xl px-4 py-2 shadow-sm backdrop-blur-sm border flex-1 min-w-0"
                      style={{
                        ...(message.role === "user" ? {
                          background: 'linear-gradient(135deg, #332771 0%, #4c1d95 100%)',
                          color: 'white',
                          borderColor: 'rgba(51, 39, 113, 0.2)',
                          boxShadow: '0 4px 6px -1px rgba(51, 39, 113, 0.1)'
                        } : message.isError ? {
                          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                          color: '#dc2626',
                          borderColor: 'rgba(239, 68, 68, 0.2)'
                        } : {
                          background: 'linear-gradient(135deg, rgba(51, 39, 113, 0.08) 0%, rgba(217, 51, 17, 0.12) 100%), linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
                          color: '#111827',
                          borderColor: 'rgba(51, 39, 113, 0.15)'
                        })
                      }}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed break-words overflow-wrap-anywhere">
                        {message.content}
                      </p>
                      <div className="text-xs opacity-70 mt-1 flex items-center justify-between">
                        <span>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                        {message.role === "assistant" && !message.isError && (
                          <span className="text-xs px-2 py-1 rounded-full shadow-sm" style={{backgroundColor: 'rgba(51, 39, 113, 0.1)', color: '#332771'}}>
                            Mindefy AI
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoadingChat && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 w-full md:max-w-[70%]">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm" style={{background: 'linear-gradient(135deg, #332771 0%, #d93311 100%)'}}>
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-gray-100/80 backdrop-blur-sm rounded-2xl px-4 py-2 border border-gray-200/30">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: '#332771', animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: '#d93311', animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{ backgroundColor: '#332771', animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>


            {/* Input area */}
            <div className="border-t border-gray-200/50 p-3 sm:p-4 md:p-6 bg-white/80 backdrop-blur-md">
              <div className="flex items-end space-x-2 sm:space-x-3">
                <div className="relative w-full max-w-3xl mx-auto">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question from your knowledge base…"
                    className="w-full text-black px-3 sm:px-4 py-2 pr-10 sm:pr-12 border-1 border-gray-300/70 rounded-3xl outline-none focus:ring-1 resize-none min-h-[40px] sm:min-h-[46px] bg-white/90 backdrop-blur-sm shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed text-sm sm:text-base transition-all duration-200 [&::-webkit-scrollbar]:hidden"
                    style={{
                      '--tw-ring-color': '#332771',
                      borderColor: 'rgba(209, 213, 219, 0.7)',
                      lineHeight: "1.5",
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#332771'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(209, 213, 219, 0.7)'}
                    rows="1"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={
                      !input.trim() ||
                      isLoadingChat
                    }
                    className="absolute cursor-pointer right-1.5 sm:right-2 bottom-2.5 sm:bottom-3 p-1.5 sm:p-2 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 backdrop-blur-sm border border-white/20"
                    style={{
                      backgroundColor: input.trim() && !isLoadingChat 
                        ? '#332771' 
                        : '#f3f4f6',
                      color: input.trim() && !isLoadingChat 
                        ? 'white' 
                        : '#9ca3af',
                      cursor: input.trim() && !isLoadingChat 
                        ? 'pointer' 
                        : 'not-allowed',
                      boxShadow: input.trim() && !isLoadingChat 
                        ? '0 2px 8px rgba(51, 39, 113, 0.2)' 
                        : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (input.trim() && !isLoadingChat) {
                        e.currentTarget.style.backgroundColor = '#d93311';
                        e.currentTarget.style.boxShadow = '0 3px 12px rgba(217, 51, 17, 0.25)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (input.trim() && !isLoadingChat) {
                        e.currentTarget.style.backgroundColor = '#332771';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(51, 39, 113, 0.2)';
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
      </div>
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
    </ProtectedRoute>
  );
}
