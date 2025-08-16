/**
 * Simple Authentication System
 * Replaces Supabase Auth with a lightweight solution
 * For admin panel access only - NOT for production user auth
 */

interface User {
  email: string;
  role: 'admin' | 'viewer';
  token?: string;
}

class SimpleAuth {
  private readonly STORAGE_KEY = 'atm_admin_auth';
  private readonly TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
  
  /**
   * Simple login - checks hardcoded admin credentials
   * In production, this should validate against a secure backend
   */
  async login(email: string, password: string): Promise<{ user?: User; error?: string }> {
    // For demo purposes - in production, validate against backend
    const validAdmins = [
      { email: 'admin@atmfranchiseindia.com', password: 'SecurePass123!' },
      { email: 'manager@atmfranchiseindia.com', password: 'Manager456!' }
    ];

    const admin = validAdmins.find(a => a.email === email && a.password === password);
    
    if (!admin) {
      return { error: 'Invalid email or password' };
    }

    // Generate simple token (in production, use JWT from backend)
    const token = this.generateToken();
    const user: User = {
      email: admin.email,
      role: 'admin',
      token
    };

    // Store in localStorage
    this.storeAuth(user);

    return { user };
  }

  /**
   * Logout - clear stored auth
   */
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const auth = this.getStoredAuth();
    if (!auth) return false;

    // Check if token is expired
    const tokenData = this.parseToken(auth.token || '');
    if (!tokenData || Date.now() > tokenData.expiry) {
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    if (!this.isAuthenticated()) return null;
    return this.getStoredAuth();
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  /**
   * Generate simple token
   */
  private generateToken(): string {
    const expiry = Date.now() + this.TOKEN_EXPIRY;
    const random = Math.random().toString(36).substring(2);
    return btoa(JSON.stringify({ expiry, random }));
  }

  /**
   * Parse token
   */
  private parseToken(token: string): { expiry: number; random: string } | null {
    try {
      return JSON.parse(atob(token));
    } catch {
      return null;
    }
  }

  /**
   * Store auth data
   */
  private storeAuth(user: User): void {
    const data = JSON.stringify(user);
    localStorage.setItem(this.STORAGE_KEY, data);
    sessionStorage.setItem(this.STORAGE_KEY, data);
  }

  /**
   * Get stored auth data
   */
  private getStoredAuth(): User | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY) || 
                   sessionStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const simpleAuth = new SimpleAuth();

/**
 * React Hook for simple auth
 */
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface SimpleAuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export const useSimpleAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useSimpleAuth must be used within SimpleAuthProvider');
  }
  return context;
};

export const SimpleAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth on mount
    const currentUser = simpleAuth.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await simpleAuth.login(email, password);
    if (result.user) {
      setUser(result.user);
    }
    return { error: result.error };
  };

  const logout = () => {
    simpleAuth.logout();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAdmin: user?.role === 'admin',
    login,
    logout
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export default simpleAuth;