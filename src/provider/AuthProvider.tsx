import { createContext, useContext, type ReactNode } from "react";
import type { UserProfile } from "../types/types";
import { useFetchMyProfile } from "../features/user/user.hooks";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: ThemeProviderProps) => {
  const { data: user, isLoading } = useFetchMyProfile();

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context
}
