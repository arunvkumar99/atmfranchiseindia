import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SimpleUser {
  id: string;
  email: string;
}

interface SimpleSession {
  user: SimpleUser;
  access_token: string;
}

interface AuthContextType {
  user: SimpleUser | null;
  session: SimpleSession | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  checkAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [session, setSession] = useState<SimpleSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const checkAdminStatus = async (): Promise<boolean> => {
    // Simple admin check - for demo purposes, any user with "admin" in email is admin
    if (!session?.user) return false;
    return session.user.email.toLowerCase().includes('admin');
  };

  useEffect(() => {
    // Check for existing session in localStorage
    const existingSession = localStorage.getItem('auth_session');
    if (existingSession) {
      try {
        const parsedSession = JSON.parse(existingSession);
        setSession(parsedSession);
        setUser(parsedSession.user);
        
        // Check admin status
        setTimeout(async () => {
          const adminStatus = await checkAdminStatus();
          setIsAdmin(adminStatus);
        }, 0);
      } catch (error) {
        console.error('Error parsing stored session:', error);
        localStorage.removeItem('auth_session');
      }
    }
    
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Simple authentication - for demo purposes
      // In a real app, you'd validate against a proper backend
      if (!email || !password) {
        toast({
          title: "Sign In Failed",
          description: "Please enter both email and password",
          variant: "destructive"
        });
        return { error: { message: "Missing credentials" } };
      }

      if (password.length < 6) {
        toast({
          title: "Sign In Failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
        return { error: { message: "Invalid credentials" } };
      }

      // Create a simple session
      const newUser: SimpleUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: email
      };

      const newSession: SimpleSession = {
        user: newUser,
        access_token: Math.random().toString(36).substr(2, 32)
      };

      // Store session
      localStorage.setItem('auth_session', JSON.stringify(newSession));
      setSession(newSession);
      setUser(newUser);

      // Check admin status
      const adminStatus = await checkAdminStatus();
      setIsAdmin(adminStatus);

      toast({
        title: "Sign In Successful",
        description: `Welcome back, ${email}!`,
      });

      return { error: null };
    } catch (error: any) {
      const errorMessage = error?.message || "An unexpected error occurred";
      
      console.error('Sign in error:', error);
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { error: { message: errorMessage } };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Simple signup validation
      if (!email || !password) {
        toast({
          title: "Sign Up Failed",
          description: "Please enter both email and password",
          variant: "destructive"
        });
        return { error: { message: "Missing credentials" } };
      }

      if (password.length < 6) {
        toast({
          title: "Sign Up Failed",
          description: "Password must be at least 6 characters long",
          variant: "destructive"
        });
        return { error: { message: "Password too short" } };
      }

      // Check if user already exists (in localStorage for demo)
      const existingUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      if (existingUsers.includes(email)) {
        toast({
          title: "Sign Up Failed",
          description: "An account with this email already exists",
          variant: "destructive"
        });
        return { error: { message: "User already exists" } };
      }

      // Register user
      existingUsers.push(email);
      localStorage.setItem('registered_users', JSON.stringify(existingUsers));

      toast({
        title: "Sign Up Successful",
        description: "Your account has been created. You can now sign in.",
      });
      
      return { error: null };
    } catch (error: any) {
      const errorMessage = error?.message || "An unexpected error occurred";
      
      console.error('Sign up error:', error);
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { error: { message: errorMessage } };
    }
  };

  const signOut = async () => {
    try {
      // Clear local session
      localStorage.removeItem('auth_session');
      setSession(null);
      setUser(null);
      setIsAdmin(false);

      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Failed",
        description: "An error occurred while signing out",
        variant: "destructive"
      });
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    checkAdminStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};