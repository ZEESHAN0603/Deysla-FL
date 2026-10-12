import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AdminUser {
  username: string;
  role: string;
}

export interface AdminAuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  authHeaders: () => Record<string, string>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const TOKEN_KEY = 'deysla_admin_jwt';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const authHeaders = useCallback((): Record<string, string> => {
    const currentToken = token || localStorage.getItem(TOKEN_KEY);
    return currentToken ? { Authorization: `Bearer ${currentToken}` } : {};
  }, [token]);

  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/auth/me', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setToken(storedToken);
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login request failed.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST', headers: authHeaders() });
    } catch {
      // Continue client cleanup
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        token,
        isLoading,
        login,
        logout,
        authHeaders,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextType {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
