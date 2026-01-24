// Auth store for managing user authentication state and operations
// Uses Zustand for state management with Appwrite client for authentication
// Provides login, logout, register, and session hydration functionality
// Creates user profile documents in database during registration

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { Models } from "appwrite";
import { account, database, ID } from "@/src/models/client/config";
import { db, userCollection } from "@/src/models/name";

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

      // Login action - authenticates user and ensures profile exists
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

          // Ensure user profile exists (create if missing - safety fallback)
          try {
            const { documents } = await database.listDocuments(
              db,
              userCollection,
              [`userId=${user.$id}`],
            );

            // If no profile exists, create one
            if (documents.length === 0) {
              await database.createDocument(
                db,
                userCollection,
                ID.unique(),
                {
                  userId: user.$id,
                  reputation: 0,
                  bio: "",
                  avatarId: null,
                  questionsAsked: 0,
                  answersGiven: 0,
                },
              );
              console.log("User profile created on login (fallback)");
            }
          } catch (profileError) {
            console.error("Profile check/creation failed:", profileError);
            // Continue login even if profile check fails
          }

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

      // Register action - creates Auth user, auto-login, and user profile document
      register: async (email, password, name) => {
        set((state) => {
          state.isLoading = true;
        });

        try {
          // Step 1: Create Appwrite Auth user
          const authUser = await account.create(
            ID.unique(),
            email,
            password,
            name,
          );

          // Step 2: Immediately create a session (auto-login)
          const session = await account.createEmailPasswordSession(
            email,
            password,
          );

          // Step 3: Create user profile document in database (now authenticated)
          try {
            await database.createDocument(
              db,
              userCollection,
              ID.unique(),
              {
                userId: authUser.$id, // Link to Auth user
                reputation: 0,
                bio: "",
                avatarId: null,
                questionsAsked: 0,
                answersGiven: 0,
              },
            );

            // Step 4: Update store with user and session
            set((state) => {
              state.user = authUser;
              state.session = session;
              state.isLoading = false;
            });

            return {
              success: true,
              message: "Welcome to Answer Hub! Registration successful.",
            };
          } catch (profileError: any) {
            // Rollback: Delete the session if profile creation fails
            console.error("Profile creation failed:", profileError);

            try {
              await account.deleteSession("current");
            } catch (logoutError) {
              console.error("Failed to delete session during rollback:", logoutError);
            }

            set((state) => {
              state.user = null;
              state.session = null;
              state.isLoading = false;
            });

            return {
              success: false,
              message:
                "Failed to create user profile. Please contact support.",
            };
          }
        } catch (error: any) {
          set((state) => {
            state.isLoading = false;
          });

          // Parse Appwrite error messages for better UX
          let errorMessage = "Registration failed. Please try again.";

          if (error?.code === 409 || error?.message?.includes("already exists")) {
            errorMessage = "An account with this email already exists. Please login instead.";
          } else if (error?.message) {
            errorMessage = error.message;
          }

          return {
            success: false,
            message: errorMessage,
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
