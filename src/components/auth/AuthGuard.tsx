
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';

interface AuthGuardProps {
  children: ReactNode;
  requiredRoles?: UserRole | UserRole[];
  fallbackUrl?: string;
  showLoader?: boolean;
}

const AuthGuard = ({ 
  children, 
  requiredRoles, 
  fallbackUrl = '/login',
  showLoader = true 
}: AuthGuardProps) => {
  const { isAuthenticated, hasRole, loading } = useAuth();
  const location = useLocation();

  // Показываем лоадер во время загрузки
  if (loading && showLoader) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Проверяем аутентификацию
  if (!isAuthenticated) {
    return <Navigate to={fallbackUrl} state={{ from: location }} replace />;
  }

  // Проверяем роли, если они указаны
  if (requiredRoles && !hasRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
