import { apiService } from "./api-service";

/**
 * Chat Service
 * Handles chat messaging
 */
// Helper function to check if error is PDF-related
const isPDFError = (message) => {
  return message.includes('No document uploaded') || 
         message.includes('No PDF') || 
         message.includes('PDF not found') || 
         message.includes('document not available') ||
         message.includes('Please upload a PDF first');
};

// Helper function to return PDF error response
const getPDFErrorResponse = () => ({
  answer: "No Knowledge Base Connected - Please upload a document to create your knowledge base and start asking questions.",
  sources: []
});

export const chatService = {
  /**
   * Send a chat message
   * @param {string} userInput - User's message
   * @returns {Promise<{response: string}>}
   */
  async sendMessage(userInput) {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${apiService.baseURL}/rag-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
          const err = await response.json();
          message = err.detail || err.message || message;
        } catch {
          message = response.statusText || message;
        }
        
        // Handle PDF-related errors gracefully
        if (isPDFError(message)) {
          return getPDFErrorResponse();
        }
        
        throw new Error(message);
      }

      return await response.json();
    } catch (error) {
      // Handle PDF-related network errors
      if (isPDFError(error.message)) {
        return getPDFErrorResponse();
      }
      
      // For other errors, re-throw to be handled by the chat store
      throw error;
    }
  },

  /**
   * Get list of chat histories
   * @param {number} skip - Number of chats to skip (for pagination)
   * @param {number} limit - Maximum number of chats to return
   */
  async getChatList(skip = 0, limit = 50) {
    return apiService.fetchWithAuth(`/chats?skip=${skip}&limit=${limit}`);
  },

  /**
   * Get complete chat by ID
   * @param {string} chatId - Chat ID
   */
  async getChatById(chatId) {
    return apiService.fetchWithAuth(`/chats/${chatId}`);
  },

  /**
   * Rename a chat
   * @param {string} chatId - Chat ID
   * @param {string} newTitle - New chat title
   */
  async renameChat(chatId, newTitle) {
    return apiService.fetchWithAuth(`/chats/${chatId}`, {
      method: "PATCH",
      body: JSON.stringify({ title: newTitle }),
    });
  },

  /**
   * Delete a chat
   * @param {string} chatId - Chat ID
   * @param {boolean} permanent - If true, permanently delete
   */
  async deleteChat(chatId, permanent = false) {
    const endpoint = permanent
      ? `/chats/${chatId}?permanent=true`
      : `/chats/${chatId}`;
    return apiService.fetchWithAuth(endpoint, { method: "DELETE" });
  },
};
