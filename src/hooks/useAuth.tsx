
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthUser, UserProfile, UserRole } from '@/types/auth';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Получаем текущего пользователя
    const getInitialUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        await fetchUserProfile(authUser);
      }
      
      setLoading(false);
    };

    getInitialUser();

    // Слушаем изменения аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      // Получаем профиль пользователя из таблицы users
      const { data: profileData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return;
      }

      const userProfile: UserProfile | null = profileData ? {
        id: profileData.id,
        email: profileData.email || authUser.email!,
        role: profileData.role || 'user',
        created_at: profileData.created_at,
        updated_at: profileData.updated_at
      } : null;

      setUser({
        id: authUser.id,
        email: authUser.email!,
        profile: userProfile
      });
      
      setProfile(userProfile);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const hasRole = (requiredRoles: UserRole | UserRole[]): boolean => {
    if (!profile) return false;
    
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(profile.role);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    hasRole,
    isAuthenticated: !!user,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
