// Auth store for managing user authentication state and operations
// Uses Zustand for state management with Appwrite client for authentication
// Provides login, logout, register, and session hydration functionality

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { Models } from "appwrite";
import { account } from "@/src/models/client/config";

// Auth response type for login, register, and logout methods
interface IAuthResponse {
  success: boolean;
  message?: string;
}

// Define the auth state interface
interface IAuthStore {
  // State
  user: Models.User<Models.Preferences> | null;
  session: Models.Session | null;
  isLoading: boolean;
  isHydrated: boolean;

  // Actions
  setUser: (user: Models.User<Models.Preferences> | null) => void;
  setSession: (session: Models.Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  login: (email: string, password: string) => Promise<IAuthResponse>;
  register: (email: string, password: string, name: string) => Promise<IAuthResponse>;
  logout: () => Promise<IAuthResponse>;
  hydrateAuth: () => Promise<void>;
  verifySession: () => Promise<boolean>;
}

// Create the auth store
export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      // Initial state
      user: null,
      session: null,
      isLoading: false,
      isHydrated: false,

      // Set user
      setUser: (user) =>
        set((state) => {
          state.user = user;
        }),

      // Set session
      setSession: (session) =>
        set((state) => {
          state.session = session;
        }),

      // Set loading state
      setLoading: (isLoading) =>
        set((state) => {
          state.isLoading = isLoading;
        }),

      // Login action
      login: async (email, password) => {
        set((state) => {
          state.isLoading = true;
        });

        try {
          const session = await account.createEmailPasswordSession(
            email,
            password,
          );
          const user = await account.get();

          set((state) => {
            state.session = session;
            state.user = user;
            state.isLoading = false;
          });

          return {
            success: true,
            message: "Login successful",
          };
        } catch (error: any) {
          set((state) => {
            state.isLoading = false;
          });

          return {
            success: false,
            message: error?.message || "Login failed. Please try again.",
          };
        }
      },

      // Register action
      register: async (email, password, name) => {
        set((state) => {
          state.isLoading = true;
        });

        try {
          await account.create("unique()", email, password, name);
          set((state) => {
            state.isLoading = false;
          });

          return {
            success: true,
            message: "Registration successful. Please login to continue.",
          };
        } catch (error: any) {
          set((state) => {
            state.isLoading = false;
          });

          return {
            success: false,
            message: error?.message || "Registration failed. Please try again.",
          };
        }
      },

      // Logout action
      logout: async () => {
        set((state) => {
          state.isLoading = true;
        });

        try {
          await account.deleteSession("current");
          set((state) => {
            state.user = null;
            state.session = null;
            state.isLoading = false;
          });

          return {
            success: true,
            message: "Logout successful",
          };
        } catch (error: any) {
          set((state) => {
            state.isLoading = false;
          });

          return {
            success: false,
            message: error?.message || "Logout failed. Please try again.",
          };
        }
      },

      // Hydrate auth state from existing session
      hydrateAuth: async () => {
        set((state) => {
          state.isLoading = true;
        });

        try {
          const user = await account.get();
          const session = await account.getSession("current");

          set((state) => {
            state.user = user;
            state.session = session;
            state.isHydrated = true;
            state.isLoading = false;
          });
        } catch (error) {
          // No active session
          set((state) => {
            state.user = null;
            state.session = null;
            state.isHydrated = true;
            state.isLoading = false;
          });
        }
      },

      // Verify if the current session is still valid
      verifySession: async () => {
        try {
          const user = await account.get();
          const session = await account.getSession("current");

          set((state) => {
            state.user = user;
            state.session = session;
          });

          return true;
        } catch (error) {
          // Session is invalid or expired
          set((state) => {
            state.user = null;
            state.session = null;
          });

          return false;
        }
      },
    })),
    {
      name: "auth-storage",
      partialize: (state) => ({
        // Only persist user and session
        user: state.user,
        session: state.session,
      }),
    },
  ),
);

// Export the auth response type for use in components
export type { IAuthResponse };
