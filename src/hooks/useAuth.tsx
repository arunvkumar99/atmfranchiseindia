import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const checkAdminStatus = async (): Promise<boolean> => {
    if (!session?.user) return false;
    
    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
      return data || false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Track admin login when user signs in
  const trackAdminLogin = async () => {
    if (!session?.user) return;
    
    try {
      await supabase.rpc('track_admin_login');
    } catch (error) {
      console.error('Error tracking admin login:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin status when user changes
        if (session?.user) {
          setTimeout(async () => {
            const adminStatus = await checkAdminStatus();
            setIsAdmin(adminStatus);
            
            // Track admin login
            if (adminStatus && event === 'SIGNED_IN') {
              await trackAdminLogin();
            }
          }, 0);
        } else {
          setIsAdmin(false);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(async () => {
          const adminStatus = await checkAdminStatus();
          setIsAdmin(adminStatus);
        }, 0);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Check account lockout status
      const { data: isNotLocked, error: lockoutError } = await supabase.rpc('check_account_lockout', {
        user_email: email
      });

      if (lockoutError) {
        console.error('Error checking account lockout:', lockoutError);
      }

      if (!isNotLocked) {
        toast({
          title: "Account Locked",
          description: "Your account has been temporarily locked due to multiple failed login attempts. Please try again later.",
          variant: "destructive",
        });
        return { error: { message: "Account locked" } };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Record failed login attempt
        await supabase.rpc('record_failed_login', {
          user_email: email
        });

        // Log security event
        await supabase.rpc('log_security_event', {
          event_type: 'failed_login_attempt',
          event_details: { email, error: error.message },
          risk_level: 'medium'
        });

        let message = 'Sign in failed';
        if (error.message.includes('Invalid login credentials')) {
          message = 'Invalid email or password';
        } else if (error.message.includes('Email not confirmed')) {
          message = 'Please check your email and confirm your account';
        }
        
        toast({
          title: "Sign In Failed",
          description: message,
          variant: "destructive"
        });
      } else {
        // Reset account lockout on successful login
        await supabase.rpc('reset_account_lockout', {
          user_email: email
        });
      }
      
      return { error };
    } catch (error: any) {
      const errorMessage = error?.message || "An unexpected error occurred";
      
      // Log security event for unexpected errors
      await supabase.rpc('log_security_event', {
        event_type: 'login_error',
        event_details: { email, error: errorMessage },
        risk_level: 'high'
      });

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
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        // Log failed signup attempt
        await supabase.rpc('log_security_event', {
          event_type: 'failed_signup_attempt',
          event_details: { email, error: error.message },
          risk_level: 'low'
        });

        let message = 'Sign up failed';
        if (error.message.includes('User already registered')) {
          message = 'An account with this email already exists';
        } else if (error.message.includes('Password should be')) {
          message = 'Password must be at least 6 characters long';
        }
        
        toast({
          title: "Sign Up Failed",
          description: message,
          variant: "destructive"
        });
      } else {
        // Log successful signup
        await supabase.rpc('log_security_event', {
          event_type: 'successful_signup',
          event_details: { email },
          risk_level: 'low'
        });

        toast({
          title: "Check Your Email",
          description: "We've sent you a confirmation link to complete your registration.",
        });
      }
      
      return { error };
    } catch (error: any) {
      const errorMessage = error?.message || "An unexpected error occurred";
      
      // Log security event for unexpected signup errors
      await supabase.rpc('log_security_event', {
        event_type: 'signup_error',
        event_details: { email, error: errorMessage },
        risk_level: 'medium'
      });

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
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Sign Out Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
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