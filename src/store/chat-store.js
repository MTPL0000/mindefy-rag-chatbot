"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { chatService } from "../lib/chat-service";

export const useChatStore = create(
  devtools((set, get) => ({
    // --- Chat State ---
    currentChat: [],

    // --- Loading States ---
    isLoadingChat: false,

    // --- Error States ---
    chatError: null,

    // --------------------------
    // --- Actions ---
    // --------------------------

    /**
     * Initialize with welcome message
     */
    initializeWelcomeMessage: () => {
      const { currentChat } = get();
      // Only show welcome if no current messages
      if (currentChat.length === 0) {
        set({
          currentChat: [
            {
              id: Date.now(),
              role: "assistant",
              content:
                "Welcome to Mindefy AI ! How can I assist you today?",
              timestamp: new Date().toISOString(),
            },
          ],
        });
      }
    },

    /**
     * Send a message
     */
    sendMessage: async (userInput) => {
      const { currentChat } = get();

      set({ isLoadingChat: true, chatError: null });

      // Add user message to UI immediately
      const userMessage = {
        id: Date.now(),
        role: "user",
        content: userInput,
        timestamp: new Date().toISOString(),
      };

      const updatedChat = [...currentChat, userMessage];
      set({ currentChat: updatedChat });

      try {
        // Send to backend (no chat ID for new session each time)
        const response = await chatService.sendMessage(userInput);

        // Add bot response - extract answer from new API response format
        const botMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: response.answer || response.response || "I'm sorry, I couldn't process your request.",
          timestamp: new Date().toISOString(),
        };

        const finalChat = [...updatedChat, botMessage];

        set({
          currentChat: finalChat,
          isLoadingChat: false,
        });

        return { success: true, data: response };
      } catch (error) {
        const errorMsg = error.message || "Failed to send message";

        // Add error message to chat
        const errorMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: errorMsg,
          timestamp: new Date().toISOString(),
          isError: true,
        };

        set({
          currentChat: [...updatedChat, errorMessage],
          isLoadingChat: false,
          chatError: errorMsg,
        });

        return { success: false, error: errorMsg };
      }
    },

    /**
     * Start a new chat
     */
    startNewChat: () => {
      set({
        currentChat: [
          {
            id: Date.now(),
            role: "assistant",
            content:
              "Welcome to Mindefy AI ! How can I assist you today?",
            timestamp: new Date().toISOString(),
          },
        ],
        chatError: null,
      });
    },

    /**
     * Clear errors
     */
    clearChatError: () => set({ chatError: null }),
  }))
);
