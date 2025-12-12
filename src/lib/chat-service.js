import { apiService } from "./api-service";

/**
 * Chat Service
 * Handles chat messaging
 */
export const chatService = {
  /**
   * Send a chat message
   * @param {string} userInput - User's message
   * @returns {Promise<{response: string}>}
   */
  async sendMessage(userInput) {
    return apiService.fetchWithAuth("/chat", {
      method: "POST",
      body: JSON.stringify({ user_input: userInput }),
    });
  },
};
