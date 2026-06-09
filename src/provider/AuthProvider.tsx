import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { UserProfile } from "../types/types";
import { useFetchMyProfile } from "../features/user/user.hooks";

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  refetch: () => Promise<any>;
  logout: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: ThemeProviderProps ) => {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useFetchMyProfile();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUser(data ?? null);
  }, [data]);

  const logout = () => {
    localStorage.clear();
    setUser(null);          // immediately clears user from context
    queryClient.clear();    // clears the cached query so refetch starts fresh
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, refetch, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}